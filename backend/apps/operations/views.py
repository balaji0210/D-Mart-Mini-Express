from rest_framework import status, permissions, generics
from rest_framework.response import Response
from accounts.permissions import IsAdmin
from .models import PickupSlot
from .serializers import PickupSlotSerializer

class PickupSlotListCreateView(generics.ListCreateAPIView):
    serializer_class = PickupSlotSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdmin()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        include_past = self.request.query_params.get('include_past', 'false').lower() == 'true'
        is_admin = self.request.user and self.request.user.is_authenticated and getattr(self.request.user, 'role', None) == 'ADMIN'

        if is_admin or include_past:
            queryset = PickupSlot.objects.all()
        else:
            queryset = PickupSlot.objects.filter(is_active=True)

        date_param = self.request.query_params.get('date')
        if date_param:
            queryset = queryset.filter(date=date_param)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Pickup slots retrieved successfully",
            "data": serializer.data
        })

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                "success": True,
                "message": "Pickup slot created successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "Pickup slot creation failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class PickupSlotDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PickupSlot.objects.all()
    serializer_class = PickupSlotSerializer
    permission_classes = (IsAdmin,)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response({
                "success": True,
                "message": "Pickup slot updated successfully",
                "data": serializer.data
            })
        return Response({
            "success": False,
            "message": "Pickup slot update failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({
            "success": True,
            "message": "Pickup slot deactivated successfully"
        }, status=status.HTTP_200_OK)
