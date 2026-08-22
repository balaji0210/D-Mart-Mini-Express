from rest_framework import generics, permissions
from rest_framework.response import Response
from accounts.permissions import IsAdmin
from .models import AuditLog
from .serializers import AuditLogSerializer

class AuditLogListView(generics.ListAPIView):
    queryset = AuditLog.objects.all().select_related('user')
    serializer_class = AuditLogSerializer
    permission_classes = (IsAdmin,)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return Response({
                "success": True,
                "message": "Audit logs retrieved successfully",
                "data": {
                    "logs": serializer.data,
                    "pagination": {
                        "page": self.paginator.page.number,
                        "page_size": self.paginator.page.paginator.per_page,
                        "total_pages": self.paginator.page.paginator.num_pages,
                        "total_items": self.paginator.page.paginator.count
                    }
                }
            })

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Audit logs retrieved successfully",
            "data": serializer.data
        })
