from django.urls import path
from .views import CartDetailView, CartItemAddView, CartItemDetailView, CartClearView

urlpatterns = [
    path('', CartDetailView.as_view(), name='cart_detail'),
    path('items/', CartItemAddView.as_view(), name='cart_item_add'),
    path('items/<uuid:pk>/', CartItemDetailView.as_view(), name='cart_item_detail'),
    path('clear/', CartClearView.as_view(), name='cart_clear'),
]
