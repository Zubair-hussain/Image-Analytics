# ── core/urls.py ──
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Auth
    path('auth/login/',   TokenObtainPairView.as_view(), name='token_obtain'),
    path('auth/refresh/', TokenRefreshView.as_view(),    name='token_refresh'),

    # Root
    path('', lambda request: JsonResponse({'name': 'XIS Analytics API', 'status': 'running'})),

    # APIs
    path('images/', include('images.urls')),

    # Health check
    path('health/', lambda request: JsonResponse({'status': 'ok'})),
]

# Serve media in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
