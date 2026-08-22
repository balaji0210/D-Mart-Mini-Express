import uuid
from django.db import models
from django.conf import settings
from orders.models import OrderItem
from products.models import Product

class RequestType(models.TextChoices):
    RETURN = 'RETURN', 'Return'
    EXCHANGE = 'EXCHANGE', 'Exchange'

class RequestStatus(models.TextChoices):
    REQUESTED = 'REQUESTED', 'Requested'
    APPROVED = 'APPROVED', 'Approved'
    REJECTED = 'REJECTED', 'Rejected'
    COMPLETED = 'COMPLETED', 'Completed'

class ReturnExchangeRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE, related_name='return_requests')
    request_type = models.CharField(max_length=20, choices=RequestType.choices, default=RequestType.RETURN)
    reason = models.TextField()
    replacement_product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='exchange_replacements')
    rejection_reason = models.TextField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=RequestStatus.choices, default=RequestStatus.REQUESTED)
    
    requested_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    processed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='processed_returns')

    class Meta:
        ordering = ['-requested_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['request_type']),
        ]

    def __str__(self):
        return f"{self.request_type} Request #{self.id} for Item '{self.order_item.product_name}' ({self.status})"
