from django.urls import path
from .views import (
    RegisterView, LoginView, CustomTokenRefreshView, UserProfileView,
    UserManagementListView, UserCreateStaffView, UserToggleActiveView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='auth_token_refresh'),
    path('profile/', UserProfileView.as_view(), name='auth_profile'),
    path('users/', UserManagementListView.as_view(), name='admin_users_list'),
    path('users/staff/create/', UserCreateStaffView.as_view(), name='admin_create_staff'),
    path('users/<uuid:pk>/toggle-active/', UserToggleActiveView.as_view(), name='admin_toggle_user'),
]
