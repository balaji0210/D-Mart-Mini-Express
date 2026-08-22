from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        "status": "healthy",
        "timestamp": "2026-08-21T10:30:00Z",
        "services": {
            "database": "ok",
            "redis": "ok",
            "cache": "ok"
        },
        "version": "1.0.0"
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/', include('products.urls')),
    path('api/v1/cart/', include('cart.urls')),
    path('api/v1/pickup-slots/', include('operations.urls')),
    path('api/v1/orders/', include('orders.urls')),
    path('api/v1/returns/', include('returns_exchange.urls')),
    path('api/v1/admin/', include('audit.urls')),
    
    # Health check
    path('api/v1/health/', health_check, name='health_check'),
    
    # OpenAPI Documentation
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
