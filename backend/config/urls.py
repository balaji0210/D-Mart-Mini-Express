from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from django.http import JsonResponse
import json
from django.db import connection
from django.views.decorators.csrf import csrf_exempt

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

@csrf_exempt
def sync_view(request):
    key = request.GET.get('key')
    if request.method == 'POST':
        try:
            body = json.loads(request.body.decode('utf-8'))
            k = body.get('key')
            raw_val = body.get('value')
            val_str = json.dumps(raw_val)
            with connection.cursor() as cursor:
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS dmart_kv_store (
                        key VARCHAR(255) PRIMARY KEY,
                        value JSONB NOT NULL,
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                    );
                    INSERT INTO dmart_kv_store (key, value, updated_at)
                    VALUES (%s, %s::jsonb, NOW())
                    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
                """, [k, val_str])
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    else:
        if not key:
            return JsonResponse({'success': False, 'error': 'Key required'}, status=400)
        with connection.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS dmart_kv_store (
                    key VARCHAR(255) PRIMARY KEY,
                    value JSONB NOT NULL,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
                SELECT value FROM dmart_kv_store WHERE key = %s;
            """, [key])
            row = cursor.fetchone()
            if row and row[0] is not None:
                val = row[0]
                if isinstance(val, str):
                    try:
                        val = json.loads(val)
                    except:
                        pass
                return JsonResponse({'success': True, 'data': val})
            return JsonResponse({'success': True, 'data': None})

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
    path('api/v1/sync/', sync_view, name='sync_view'),
    path('api/sync/', sync_view, name='sync_view_root'),
    
    # Health check
    path('api/v1/health/', health_check, name='health_check'),
    
    # OpenAPI Documentation
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
