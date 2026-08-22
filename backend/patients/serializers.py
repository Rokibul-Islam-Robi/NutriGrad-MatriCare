"""
NutriGrad-MatriCare - Patients and Assessment Record Serializers.
"""

from rest_framework import serializers
from .models import PatientProfile, AssessmentRecord
from authentication.serializers import UserProfileSerializer


class AssessmentRecordSerializer(serializers.ModelSerializer):
    assessed_by_name = serializers.SerializerMethodField()
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    patient_code = serializers.CharField(source='patient.patient_id', read_only=True)

    class Meta:
        model = AssessmentRecord
        fields = '__all__'
        read_only_fields = ('id', 'timestamp', 'assessed_by')

    def get_assessed_by_name(self, obj):
        if obj.assessed_by:
            return f"{obj.assessed_by.first_name} {obj.assessed_by.last_name}".strip() or obj.assessed_by.username
        return "System AI Evaluator"


class PatientProfileSerializer(serializers.ModelSerializer):
    assessments_count = serializers.SerializerMethodField()
    latest_risk = serializers.SerializerMethodField()
    latest_assessment_date = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = PatientProfile
        fields = (
            'id', 'patient_id', 'full_name', 'age', 'gestational_weeks',
            'contact_phone', 'email', 'blood_group', 'gravida', 'para',
            'medical_history', 'assessments_count', 'latest_risk',
            'latest_assessment_date', 'created_by', 'created_by_name',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'created_by')

    def get_assessments_count(self, obj):
        return obj.assessments.count()

    def get_latest_risk(self, obj):
        latest = obj.assessments.first()
        return latest.predicted_risk if latest else "Not Assessed"

    def get_latest_assessment_date(self, obj):
        latest = obj.assessments.first()
        return latest.timestamp if latest else None

    def get_created_by_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}".strip() or obj.created_by.username
        return "System"


class AssessmentInputSerializer(serializers.Serializer):
    patient_id = serializers.CharField(max_length=60, required=True)
    full_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    age = serializers.IntegerField(min_value=12, max_value=65, required=True)
    bmi = serializers.FloatField(min_value=12.0, max_value=60.0, required=True)
    hemoglobin = serializers.FloatField(min_value=4.0, max_value=20.0, required=True)
    blood_pressure = serializers.IntegerField(min_value=50, max_value=240, required=True)
    sugar_level = serializers.FloatField(min_value=40.0, max_value=400.0, required=True)
    protein_intake = serializers.FloatField(min_value=0.0, max_value=200.0, required=True)
    
    systolic_bp = serializers.IntegerField(min_value=60, max_value=240, required=False, allow_null=True)
    diastolic_bp = serializers.IntegerField(min_value=40, max_value=150, required=False, allow_null=True)
    body_temp = serializers.FloatField(min_value=94.0, max_value=106.0, required=False, allow_null=True)
    heart_rate = serializers.IntegerField(min_value=40, max_value=200, required=False, allow_null=True)
    
    gestational_weeks = serializers.IntegerField(min_value=1, max_value=45, required=False, default=12)
    doctor_notes = serializers.CharField(required=False, allow_blank=True, default='')
