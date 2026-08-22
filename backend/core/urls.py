"""
NutriGrad-MatriCare - Core URL Configuration
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "name": "NutriGrad-MatriCare - Maternal Nutrition Risk Intelligence API",
        "version": "2.0.0",
        "endpoints": {
            "auth": "/api/auth/",
            "patients": "/api/patients/",
            "assessments": "/api/assessments/",
            "analytics": "/api/analytics/",
            "admin": "/admin/"
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/', include('patients.urls')),
]
