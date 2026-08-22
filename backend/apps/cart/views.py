from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.permissions import IsCustomer
from products.models import Product
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer

class CartDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsCustomer)

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response({
            "success": True,
            "message": "Cart retrieved successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

class CartItemAddView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsCustomer)

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartItemSerializer(data=request.data)
        
        if serializer.is_valid():
            product = serializer.validated_data['product']
            requested_qty = serializer.validated_data['quantity']
            
            existing_item = CartItem.objects.filter(cart=cart, product=product).first()
            total_requested = requested_qty + (existing_item.quantity if existing_item else 0)

            if total_requested > product.stock_quantity:
                return Response({
                    "success": False,
                    "message": "Insufficient stock available",
                    "errors": {
                        "quantity": [f"Only {product.stock_quantity} items available in stock."]
                    }
                }, status=status.HTTP_409_CONFLICT)

            if existing_item:
                existing_item.quantity = total_requested
                existing_item.save()
                item_serializer = CartItemSerializer(existing_item)
            else:
                cart_item = serializer.save(cart=cart)
                item_serializer = CartItemSerializer(cart_item)

            return Response({
                "success": True,
                "message": "Item added to cart successfully",
                "data": item_serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "message": "Failed to add item to cart",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class CartItemDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsCustomer)

    def patch(self, request, pk):
        try:
            item = CartItem.objects.get(id=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({
                "success": False,
                "message": "Cart item not found"
            }, status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get('quantity')
        if quantity is None or int(quantity) <= 0:
            return Response({
                "success": False,
                "message": "Invalid quantity provided",
                "errors": {"quantity": ["Quantity must be greater than zero."]}
            }, status=status.HTTP_400_BAD_REQUEST)

        quantity = int(quantity)
        if quantity > item.product.stock_quantity:
            return Response({
                "success": False,
                "message": "Insufficient stock available",
                "errors": {
                    "quantity": [f"Only {item.product.stock_quantity} items available in stock."]
                }
            }, status=status.HTTP_409_CONFLICT)

        item.quantity = quantity
        item.save()

        return Response({
            "success": True,
            "message": "Cart item updated successfully",
            "data": CartItemSerializer(item).data
        }, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            item = CartItem.objects.get(id=pk, cart__user=request.user)
            item.delete()
            return Response({
                "success": True,
                "message": "Item removed from cart"
            }, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({
                "success": False,
                "message": "Cart item not found"
            }, status=status.HTTP_404_NOT_FOUND)

class CartClearView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsCustomer)

    def delete(self, request):
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart.items.all().delete()
        return Response({
            "success": True,
            "message": "Cart cleared successfully"
        }, status=status.HTTP_200_OK)
