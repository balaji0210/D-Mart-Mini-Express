import uuid
from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    action = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=100)
    entity_id = models.UUIDField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['entity_type', 'entity_id']),
        ]

    def __str__(self):
        user_str = self.user.email if self.user else "System"
        return f"[{self.created_at.strftime('%Y-%m-%d %H:%M')}] {user_str} -> {self.action} ({self.entity_type})"

    @property
    def summary(self):
        meta = self.metadata or {}
        action = self.action

        if action == 'ORDER_CREATED':
            order_num = meta.get('order_number', 'N/A')
            fulfillment = str(meta.get('fulfillment_type', '')).replace('_', ' ').title()
            total = meta.get('total_amount', '0.00')
            items_count = meta.get('items_count', 0)
            return f"Placed order {order_num} ({fulfillment}) with {items_count} item(s) totaling ${total}"

        elif action in ['ORDER_CANCELLED', 'ORDER_STATUS_UPDATED']:
            order_num = meta.get('order_number', 'N/A')
            old_s = meta.get('old_status', '')
            new_s = meta.get('new_status', '')
            if old_s and new_s:
                return f"Order {order_num} status updated: {old_s} → {new_s}"
            return f"Order {order_num} updated"

        elif action == 'RETURN_REQUESTED':
            req_type = meta.get('request_type', 'Return')
            order_num = meta.get('order_number', 'N/A')
            product = meta.get('product_name', 'Item')
            return f"Requested {req_type} for '{product}' under order {order_num}"

        elif action.startswith('RETURN_'):
            status_name = action.replace('RETURN_', '')
            req_type = meta.get('request_type', 'Return')
            order_num = meta.get('order_number', 'N/A')
            reason = meta.get('rejection_reason')
            if reason:
                return f"{req_type} request for order {order_num} set to {status_name}. Summary: \"{reason}\""
            return f"{req_type} request for order {order_num} set to {status_name}"

        # Generic clear report fallback
        if meta:
            details = ", ".join(f"{k.replace('_', ' ').title()}: {v}" for k, v in meta.items() if v is not None)
            return f"{self.entity_type} action: {details}"

        return f"Executed {self.action} on {self.entity_type}"
