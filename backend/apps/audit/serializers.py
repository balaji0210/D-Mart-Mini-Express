from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    summary = serializers.CharField(read_only=True)

    class Meta:
        model = AuditLog
        fields = ('id', 'user', 'action', 'entity_type', 'entity_id', 'metadata', 'summary', 'created_at')
        read_only_fields = ('id', 'created_at', 'summary')
