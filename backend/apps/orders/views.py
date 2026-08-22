from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from accounts.permissions import IsCustomer, IsStaff, IsAdmin

from audit.models import AuditLog
from .models import Order, OrderStatus
from .serializers import OrderSerializer, CheckoutRequestSerializer, OrderStatusUpdateSerializer
from .services import (
    process_checkout, cancel_order, validate_status_transition,
    InsufficientStockException, PickupSlotFullException
)

class CheckoutView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsCustomer)

    def post(self, request):
        serializer = CheckoutRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Checkout validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        fulfillment_type = serializer.validated_data['fulfillment_type']
        pickup_slot_id = serializer.validated_data.get('pickup_slot_id')
        payment_method = serializer.validated_data.get('payment_method', 'CASH')
        delivery_address = serializer.validated_data.get('delivery_address')

        try:
            order = process_checkout(
                user=request.user,
                fulfillment_type=fulfillment_type,
                pickup_slot_id=pickup_slot_id,
                delivery_address=delivery_address,
                payment_method=payment_method
            )

            return Response({
                "success": True,
                "message": "Order placed successfully",
                "data": {
                    "order": OrderSerializer(order).data
                }
            }, status=status.HTTP_201_CREATED)
        except InsufficientStockException as e:
            return Response({
                "success": False,
                "message": str(e),
                "errors": e.errors
            }, status=status.HTTP_409_CONFLICT)
        except PickupSlotFullException as e:
            return Response({
                "success": False,
                "message": str(e),
                "errors": {"pickup_slot": [str(e)]}
            }, status=status.HTTP_409_CONFLICT)
        except ValidationError as e:
            return Response({
                "success": False,
                "message": str(e.message if hasattr(e, 'message') else e),
                "errors": e.message_dict if hasattr(e, 'message_dict') else {}
            }, status=status.HTTP_400_BAD_REQUEST)

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        queryset = Order.objects.all().select_related('pickup_slot').prefetch_related('items')
        
        # IDOR protection: Customers can only view their own orders
        if user.role == 'CUSTOMER':
            queryset = queryset.filter(user=user)

        # Filters
        status_param = self.request.query_params.get('status')
        fulfillment_param = self.request.query_params.get('fulfillment_type')
        if status_param:
            queryset = queryset.filter(status=status_param)
        if fulfillment_param:
            queryset = queryset.filter(fulfillment_type=fulfillment_param)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return Response({
                "success": True,
                "message": "Orders retrieved successfully",
                "data": {
                    "orders": serializer.data,
                    "pagination": {
                        "page": self.paginator.page.number,
                        "page_size": self.paginator.page.paginator.per_page,
                        "total_pages": self.paginator.page.paginator.num_pages,
                        "total_items": self.paginator.page.paginator.count
                    }
                }
            })

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Orders retrieved successfully",
            "data": {
                "orders": serializer.data
            }
        })

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'CUSTOMER':
            return Order.objects.filter(user=user)
        return Order.objects.all()

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response({
                "success": True,
                "message": "Order retrieved successfully",
                "data": serializer.data
            })
        except Exception:
            return Response({
                "success": False,
                "message": "Order not found or unauthorized access"
            }, status=status.HTTP_404_NOT_FOUND)

class OrderCancelView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        try:
            if request.user.role in ['STAFF', 'ADMIN']:
                order = Order.objects.get(id=pk)
            else:
                order = Order.objects.get(id=pk, user=request.user)
        except Order.DoesNotExist:
            return Response({
                "success": False,
                "message": "Order not found"
            }, status=status.HTTP_404_NOT_FOUND)

        try:
            cancelled = cancel_order(order, request.user)
            return Response({
                "success": True,
                "message": "Order cancelled successfully",
                "data": {
                    "order": OrderSerializer(cancelled).data
                }
            }, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({
                "success": False,
                "message": str(e.message if hasattr(e, 'message') else e)
            }, status=status.HTTP_400_BAD_REQUEST)

class OrderStatusUpdateView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsStaff)

    def post(self, request, pk):
        return self.patch(request, pk)

    def patch(self, request, pk):
        try:
            order = Order.objects.get(id=pk)
        except Order.DoesNotExist:
            return Response({
                "success": False,
                "message": "Order not found"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderStatusUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Invalid status data",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        new_status = serializer.validated_data.get('status')
        new_payment_status = serializer.validated_data.get('payment_status')
        old_status = order.status
        old_payment_status = order.payment_status

        if new_payment_status:
            order.payment_status = new_payment_status
            order.save(update_fields=['payment_status', 'updated_at'])

        if new_status and new_status != old_status:
            try:
                if new_status == OrderStatus.CANCELLED:
                    cancel_order(order, request.user)
                else:
                    validate_status_transition(old_status, new_status)
                    order.status = new_status
                    order.save(update_fields=['status', 'updated_at'])
            except ValidationError as e:
                return Response({
                    "success": False,
                    "message": str(e.message if hasattr(e, 'message') else e),
                    "errors": {
                        "status": [f"Cannot transition from {old_status} to {new_status}"]
                    }
                }, status=status.HTTP_400_BAD_REQUEST)



        # Audit log
        AuditLog.objects.create(
            user=request.user,
            action='ORDER_STATUS_CHANGED',
            entity_type='Order',
            entity_id=order.id,
            metadata={
                'order_number': order.order_number,
                'old_status': old_status,
                'new_status': new_status
            }
        )

        return Response({
            "success": True,
            "message": f"Order status updated from {old_status} to {new_status}",
            "data": OrderSerializer(order).data
        }, status=status.HTTP_200_OK)

class OrderRefundView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsAdmin)

    def post(self, request, pk):
        try:
            order = Order.objects.get(id=pk)
        except Order.DoesNotExist:
            return Response({
                "success": False,
                "message": "Order not found"
            }, status=status.HTTP_404_NOT_FOUND)

        amount = request.data.get('amount', order.total_amount)
        reason = request.data.get('reason', 'Admin issued refund')

        order.payment_status = PaymentStatus.REFUNDED
        order.status = OrderStatus.REFUNDED
        order.save(update_fields=['payment_status', 'status', 'updated_at'])

        # Audit log
        AuditLog.objects.create(
            user=request.user,
            action='ORDER_REFUNDED',
            entity_type='Order',
            entity_id=order.id,
            metadata={
                'order_number': order.order_number,
                'refund_amount': str(amount),
                'reason': reason
            }
        )

        return Response({
            "success": True,
            "message": f"Refund of ₹{amount} processed successfully for order #{order.order_number}",
            "data": OrderSerializer(order).data
        }, status=status.HTTP_200_OK)


