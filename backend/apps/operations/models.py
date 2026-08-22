import uuid
from datetime import datetime
from django.db import models
from django.utils import timezone

class PickupSlot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    capacity = models.IntegerField(default=10)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date', 'start_time']
        indexes = [
            models.Index(fields=['date']),
        ]

    def __str__(self):
        return f"{self.date} [{self.start_time} - {self.end_time}] Capacity: {self.capacity}"

    @property
    def is_past(self):
        # Timezone-aware comparison with current server time
        now = timezone.localtime()
        slot_start_dt = datetime.combine(self.date, self.start_time)
        if timezone.is_aware(now):
            current_tz = timezone.get_current_timezone()
            slot_start_dt = timezone.make_aware(slot_start_dt, current_tz)
        return slot_start_dt < now

    @property
    def booked_count(self):
        # Count active orders tied to this pickup slot
        return self.orders.filter(
            status__in=['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP']
        ).count()

    @property
    def available_capacity(self):
        if self.is_past:
            return 0
        return max(0, self.capacity - self.booked_count)

    @property
    def is_available(self):
        return self.is_active and not self.is_past and self.available_capacity > 0
