"""
NutriGrad-MatriCare - Advanced Django Filters for Patients and Assessment Records.
"""

import django_filters
from .models import PatientProfile, AssessmentRecord


class PatientFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name='full_name', lookup_expr='icontains')
    patient_id = django_filters.CharFilter(field_name='patient_id', lookup_expr='icontains')
    min_age = django_filters.NumberFilter(field_name='age', lookup_expr='gte')
    max_age = django_filters.NumberFilter(field_name='age', lookup_expr='lte')
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = PatientProfile
        fields = ['patient_id', 'full_name', 'blood_group']


class AssessmentFilter(django_filters.FilterSet):
    risk = django_filters.CharFilter(field_name='predicted_risk', lookup_expr='iexact')
    patient_id = django_filters.CharFilter(field_name='patient__patient_id', lookup_expr='icontains')
    patient_name = django_filters.CharFilter(field_name='patient__full_name', lookup_expr='icontains')
    min_age = django_filters.NumberFilter(field_name='age', lookup_expr='gte')
    max_age = django_filters.NumberFilter(field_name='age', lookup_expr='lte')
    min_confidence = django_filters.NumberFilter(field_name='confidence_score', lookup_expr='gte')
    start_date = django_filters.DateTimeFilter(field_name='timestamp', lookup_expr='gte')
    end_date = django_filters.DateTimeFilter(field_name='timestamp', lookup_expr='lte')

    class Meta:
        model = AssessmentRecord
        fields = ['predicted_risk', 'risk_level_code']
