from django.urls import path
from .views import CheckoutView, OrderListView, OrderDetailView, OrderCancelView, OrderStatusUpdateView, OrderRefundView

urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name='order_checkout'),
    path('', OrderListView.as_view(), name='order_list'),
    path('<uuid:pk>/', OrderDetailView.as_view(), name='order_detail'),
    path('<uuid:pk>/cancel/', OrderCancelView.as_view(), name='order_cancel'),
    path('<uuid:pk>/status/', OrderStatusUpdateView.as_view(), name='order_status_update'),
    path('<uuid:pk>/refund/', OrderRefundView.as_view(), name='order_refund'),
]

