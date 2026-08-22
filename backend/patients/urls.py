"""
NutriGrad-MatriCare - Patients & Assessment API URL Routing.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PatientProfileViewSet,
    AssessmentEvaluationView,
    AssessmentRecordListView,
    AssessmentRecordDetailView,
    RealtimeAnalyticsView
)

router = DefaultRouter()
router.register(r'patients', PatientProfileViewSet, basename='patient')

urlpatterns = [
    path('', include(router.urls)),
    path('assessments/evaluate/', AssessmentEvaluationView.as_view(), name='assessment_evaluate'),
    path('assessments/', AssessmentRecordListView.as_view(), name='assessment_list'),
    path('assessments/<int:pk>/', AssessmentRecordDetailView.as_view(), name='assessment_detail'),
    path('analytics/', RealtimeAnalyticsView.as_view(), name='realtime_analytics'),
]
