from rest_framework import serializers
from orders.serializers import OrderItemSerializer
from products.serializers import ProductSerializer
from accounts.serializers import UserSerializer
from .models import ReturnExchangeRequest, RequestType, RequestStatus

class ReturnExchangeRequestSerializer(serializers.ModelSerializer):
    order_item = OrderItemSerializer(read_only=True)
    order_number = serializers.CharField(source='order_item.order.order_number', read_only=True)
    order_id = serializers.UUIDField(source='order_item.order.id', read_only=True)
    order_item_id = serializers.PrimaryKeyRelatedField(
        queryset=ReturnExchangeRequest._meta.get_field('order_item').remote_field.model.objects.all(),
        source='order_item',
        write_only=True
    )
    replacement_product = ProductSerializer(read_only=True)
    replacement_product_id = serializers.PrimaryKeyRelatedField(
        queryset=ReturnExchangeRequest._meta.get_field('replacement_product').remote_field.model.objects.all(),
        source='replacement_product',
        write_only=True,
        required=False,
        allow_null=True
    )
    processed_by = UserSerializer(read_only=True)

    class Meta:
        model = ReturnExchangeRequest
        fields = (
            'id', 'order_number', 'order_id', 'order_item', 'order_item_id', 'request_type', 'reason',
            'replacement_product', 'replacement_product_id', 'rejection_reason', 'status',
            'requested_at', 'processed_at', 'processed_by'
        )
        read_only_fields = ('id', 'order_number', 'order_id', 'status', 'requested_at', 'processed_at', 'processed_by')

    def validate(self, attrs):
        req_type = attrs.get('request_type', RequestType.RETURN)
        replacement = attrs.get('replacement_product')
        if req_type == RequestType.EXCHANGE and not replacement:
            raise serializers.ValidationError({"replacement_product_id": "Replacement product is required for exchange requests."})
        return attrs

class ProcessReturnSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=RequestStatus.choices, required=True)
    replacement_product_id = serializers.UUIDField(required=False, allow_null=True)
    rejection_reason = serializers.CharField(required=False, allow_blank=True, allow_null=True)
