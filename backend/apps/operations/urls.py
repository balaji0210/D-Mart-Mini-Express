from django.urls import path
from .views import PickupSlotListCreateView, PickupSlotDetailView

urlpatterns = [
    path('', PickupSlotListCreateView.as_view(), name='pickup_slot_list_create'),
    path('<uuid:pk>/', PickupSlotDetailView.as_view(), name='pickup_slot_detail'),
]
