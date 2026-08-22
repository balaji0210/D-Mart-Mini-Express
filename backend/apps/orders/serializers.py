from rest_framework import serializers
from operations.serializers import PickupSlotSerializer
from .models import Order, OrderItem, FulfillmentType, OrderStatus

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'unit_price', 'quantity', 'subtotal')
        read_only_fields = ('id', 'product_name', 'unit_price', 'subtotal')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    pickup_slot = PickupSlotSerializer(read_only=True)
    items_count = serializers.IntegerField(read_only=True)
    customer_name = serializers.CharField(source='user.full_name', read_only=True)
    customer_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'order_number', 'fulfillment_type', 'status', 'payment_status', 'payment_method',
            'customer_name', 'customer_email',
            'subtotal', 'total_amount', 'delivery_address', 'pickup_slot',
            'items_count', 'items', 'created_at', 'updated_at'
        )
        read_only_fields = (
            'id', 'order_number', 'subtotal', 'total_amount',
            'items_count', 'created_at', 'updated_at'
        )

class CheckoutRequestSerializer(serializers.Serializer):
    fulfillment_type = serializers.ChoiceField(choices=FulfillmentType.choices, required=True)
    pickup_slot_id = serializers.UUIDField(required=False, allow_null=True)
    payment_method = serializers.CharField(required=False, default='CASH')
    delivery_address = serializers.JSONField(required=False, allow_null=True)

    def validate(self, attrs):
        fulfillment = attrs.get('fulfillment_type')
        if fulfillment == FulfillmentType.PICKUP and not attrs.get('pickup_slot_id'):
            raise serializers.ValidationError({"pickup_slot_id": "Pickup slot ID is required for store pickup."})
        if fulfillment == FulfillmentType.DELIVERY and not attrs.get('delivery_address'):
            raise serializers.ValidationError({"delivery_address": "Delivery address is required for home delivery."})
        return attrs

class OrderStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=OrderStatus.choices, required=False)
    payment_status = serializers.CharField(required=False)

