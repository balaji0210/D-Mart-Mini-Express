from django.urls import path
from .views import ReturnRequestListCreateView, ReturnRequestDetailView, ProcessReturnView

urlpatterns = [
    path('', ReturnRequestListCreateView.as_view(), name='return_list_create'),
    path('<uuid:pk>/', ReturnRequestDetailView.as_view(), name='return_detail'),
    path('<uuid:pk>/process/', ProcessReturnView.as_view(), name='return_process'),
]
