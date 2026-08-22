from datetime import timedelta
from django.utils import timezone
from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.permissions import IsCustomer, IsStaff
from audit.models import AuditLog
from orders.models import OrderItem, OrderStatus
from products.models import Product
from .models import ReturnExchangeRequest, RequestType, RequestStatus
from .serializers import ReturnExchangeRequestSerializer, ProcessReturnSerializer

def validate_return_eligibility(order_item, user):
    """
    Validates eligibility rules for return/exchange requests.
    """
    # 1. Check order status
    if order_item.order.status not in [OrderStatus.DELIVERED, OrderStatus.COMPLETED]:
        raise ValueError("Return/exchange request is only allowed for delivered or completed orders.")

    # 2. Check 7-day window
    seven_days_ago = timezone.now() - timedelta(days=7)
    if order_item.order.created_at < seven_days_ago:
        raise ValueError("Return/exchange requests must be submitted within 7 days of order placement/delivery.")

    # 3. Check existing requests
    existing_request = ReturnExchangeRequest.objects.filter(
        order_item=order_item,
        status__in=[RequestStatus.REQUESTED, RequestStatus.APPROVED, RequestStatus.COMPLETED]
    ).exists()
    if existing_request:
        raise ValueError("This order item already has an active or completed return/exchange request.")

    # 4. Check ownership
    if order_item.order.user != user:
        raise ValueError("You can only request returns for items in your own orders.")

    return True

class ReturnRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = ReturnExchangeRequestSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'CUSTOMER':
            return ReturnExchangeRequest.objects.filter(order_item__order__user=user)
        return ReturnExchangeRequest.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Return requests retrieved successfully",
            "data": serializer.data
        })

    def create(self, request, *args, **kwargs):
        if request.user.role != 'CUSTOMER':
            return Response({
                "success": False,
                "message": "Only customers can initiate return/exchange requests"
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Return request validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        order_item = serializer.validated_data['order_item']

        try:
            validate_return_eligibility(order_item, request.user)
        except ValueError as e:
            return Response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

        return_request = serializer.save()

        # Audit log
        AuditLog.objects.create(
            user=request.user,
            action='RETURN_REQUESTED',
            entity_type='ReturnExchangeRequest',
            entity_id=return_request.id,
            metadata={
                'request_type': return_request.request_type,
                'order_number': order_item.order.order_number,
                'product_name': order_item.product_name
            }
        )

        return Response({
            "success": True,
            "message": "Return request created successfully",
            "data": ReturnExchangeRequestSerializer(return_request).data
        }, status=status.HTTP_201_CREATED)

class ReturnRequestDetailView(generics.RetrieveAPIView):
    serializer_class = ReturnExchangeRequestSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'CUSTOMER':
            return ReturnExchangeRequest.objects.filter(order_item__order__user=user)
        return ReturnExchangeRequest.objects.all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "success": True,
            "message": "Return request retrieved successfully",
            "data": serializer.data
        })

class ProcessReturnView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsStaff)

    def post(self, request, pk):
        return self.patch(request, pk)

    def patch(self, request, pk):
        try:
            return_req = ReturnExchangeRequest.objects.get(id=pk)
        except ReturnExchangeRequest.DoesNotExist:
            return Response({
                "success": False,
                "message": "Return request not found"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ProcessReturnSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Invalid processing data",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        new_status = serializer.validated_data['status']
        replacement_id = serializer.validated_data.get('replacement_product_id')
        rejection_reason = (serializer.validated_data.get('rejection_reason') or '').strip()

        if new_status == RequestStatus.REJECTED:
            if not rejection_reason:
                return Response({
                    "success": False,
                    "message": "A brief summary / reason is required before rejecting a return request."
                }, status=status.HTTP_400_BAD_REQUEST)
            return_req.rejection_reason = rejection_reason

        if replacement_id:
            try:
                replacement_prod = Product.objects.get(id=replacement_id, is_active=True)
                return_req.replacement_product = replacement_prod
            except Product.DoesNotExist:
                return Response({
                    "success": False,
                    "message": "Replacement product not found or inactive"
                }, status=status.HTTP_400_BAD_REQUEST)

        # Restore inventory on completed return if applicable
        if new_status in [RequestStatus.APPROVED, RequestStatus.COMPLETED] and return_req.request_type == RequestType.RETURN:
            if return_req.order_item.product:
                return_req.order_item.product.stock_quantity += return_req.order_item.quantity
                return_req.order_item.product.save(update_fields=['stock_quantity', 'updated_at'])

        old_status = return_req.status
        return_req.status = new_status
        return_req.processed_at = timezone.now()
        return_req.processed_by = request.user
        return_req.save()

        # Audit Log
        AuditLog.objects.create(
            user=request.user,
            action=f'RETURN_{new_status}',
            entity_type='ReturnExchangeRequest',
            entity_id=return_req.id,
            metadata={
                'request_type': return_req.request_type,
                'old_status': old_status,
                'new_status': new_status,
                'order_number': return_req.order_item.order.order_number,
                'rejection_reason': return_req.rejection_reason if new_status == RequestStatus.REJECTED else None
            }
        )

        return Response({
            "success": True,
            "message": f"Return request processed: {new_status}",
            "data": ReturnExchangeRequestSerializer(return_req).data
        }, status=status.HTTP_200_OK)
