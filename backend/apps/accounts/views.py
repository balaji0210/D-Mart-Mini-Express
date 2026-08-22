from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from django_ratelimit.exceptions import Ratelimited

from .models import User
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    UserProfileUpdateSerializer
)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }

class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response({
                "success": True,
                "message": "Registration successful",
                "data": {
                    "user": UserSerializer(user).data,
                    "tokens": tokens
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            "success": False,
            "message": "Registration validation failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    @method_decorator(ratelimit(key='ip', rate='100/1m', block=True))
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)
            return Response({
                "success": True,
                "message": "Login successful",
                "data": {
                    "user": UserSerializer(user).data,
                    "tokens": tokens
                }
            }, status=status.HTTP_200_OK)
        
        return Response({
            "success": False,
            "message": "Invalid email or password",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            return Response({
                "success": True,
                "message": "Token refreshed successfully",
                "data": {
                    "access": response.data.get('access')
                }
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": "Token refresh failed",
            "errors": response.data
        }, status=response.status_code)

class UserProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({
            "success": True,
            "message": "Profile retrieved successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = UserProfileUpdateSerializer(request.user, data=request.data, context={'request': request}, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "success": True,
                "message": "Profile updated successfully",
                "data": UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        
        return Response({
            "success": False,
            "message": "Profile update failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

from accounts.permissions import IsAdmin

class UserManagementListView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsAdmin)

    def get(self, request):
        role_filter = request.query_params.get('role')
        queryset = User.objects.all().order_by('-created_at')
        if role_filter:
            queryset = queryset.filter(role=role_filter)
        serializer = UserSerializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Users retrieved successfully",
            "data": serializer.data
        })

class UserCreateStaffView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsAdmin)

    def post(self, request):
        email = request.data.get('email')
        full_name = request.data.get('full_name')
        password = request.data.get('password')
        role = request.data.get('role', 'STAFF')

        if not email or not full_name or not password:
            return Response({
                "success": False,
                "message": "Email, full name, and password are required."
            }, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({
                "success": False,
                "message": "User with this email already exists."
            }, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            email=email,
            full_name=full_name,
            password=password,
            role=role,
            is_staff=(role in ['STAFF', 'ADMIN'])
        )

        return Response({
            "success": True,
            "message": f"Account for {full_name} ({role}) created successfully",
            "data": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class UserToggleActiveView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsAdmin)

    def patch(self, request, pk):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({"success": False, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if user == request.user:
            return Response({"success": False, "message": "You cannot deactivate your own account."}, status=status.HTTP_400_BAD_REQUEST)

        user.is_active = not user.is_active
        user.save(update_fields=['is_active', 'updated_at'])
        return Response({
            "success": True,
            "message": f"User account {'activated' if user.is_active else 'deactivated'} successfully",
            "data": UserSerializer(user).data
        })
