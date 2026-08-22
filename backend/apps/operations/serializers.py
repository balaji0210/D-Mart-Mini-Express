from rest_framework import serializers
from .models import PickupSlot

class PickupSlotSerializer(serializers.ModelSerializer):
    booked = serializers.IntegerField(source='booked_count', read_only=True)
    available = serializers.IntegerField(source='available_capacity', read_only=True)
    is_past = serializers.BooleanField(read_only=True)
    is_available = serializers.BooleanField(read_only=True)

    class Meta:
        model = PickupSlot
        fields = (
            'id', 'date', 'start_time', 'end_time', 'capacity',
            'booked', 'available', 'is_active', 'is_past', 'is_available', 'created_at'
        )
        read_only_fields = ('id', 'created_at', 'booked', 'available', 'is_past', 'is_available')

    def validate_capacity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Capacity must be greater than zero.")
        return value

    def validate(self, attrs):
        start_time = attrs.get('start_time', getattr(self.instance, 'start_time', None))
        end_time = attrs.get('end_time', getattr(self.instance, 'end_time', None))
        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError({"end_time": "End time must be later than start time."})
        return attrs
