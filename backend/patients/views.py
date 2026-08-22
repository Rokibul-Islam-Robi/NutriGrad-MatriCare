"""
NutriGrad-MatriCare - Patient Management and Real-Time Assessment API Views.
"""

from rest_framework import viewsets, generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Avg, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import PatientProfile, AssessmentRecord
from .serializers import (
    PatientProfileSerializer,
    AssessmentRecordSerializer,
    AssessmentInputSerializer
)
from .filters import PatientFilter, AssessmentFilter
from .ml_client import ml_client
from authentication.permissions import IsClinicianOrAbove, IsDoctorOrAdmin, IsAdminRole


class PatientProfileViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for managing maternal patient profiles.
    Clinicians can create/read/update. Deletion requires Doctor or Admin role.
    """
    queryset = PatientProfile.objects.all().prefetch_related('assessments')
    serializer_class = PatientProfileSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = PatientFilter
    search_fields = ['patient_id', 'full_name', 'contact_phone', 'blood_group']
    ordering_fields = ['created_at', 'full_name', 'age', 'gestational_weeks']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action == 'destroy':
            return [IsDoctorOrAdmin()]
        return [IsClinicianOrAbove()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)


class AssessmentEvaluationView(APIView):
    """
    Evaluates patient vitals via FastAPI ML Microservice,
    generates evidence-based clinical alerts & recommendations,
    and logs the audit record in PostgreSQL/SQLite.
    """
    permission_classes = [IsClinicianOrAbove]

    def post(self, request):
        serializer = AssessmentInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        patient_id = data['patient_id']
        full_name = data.get('full_name') or f"Patient {patient_id}"

        # Fetch or auto-register Patient Profile
        patient, _ = PatientProfile.objects.get_or_create(
            patient_id=patient_id,
            defaults={
                'full_name': full_name,
                'age': data['age'],
                'gestational_weeks': data.get('gestational_weeks', 12),
                'created_by': request.user if request.user.is_authenticated else None
            }
        )

        # Build payload for ML Engine
        ml_payload = {
            'age': data['age'],
            'bmi': data['bmi'],
            'hemoglobin': data['hemoglobin'],
            'blood_pressure': data['blood_pressure'],
            'sugar_level': data['sugar_level'],
            'protein_intake': data['protein_intake'],
            'systolic_bp': data.get('systolic_bp'),
            'diastolic_bp': data.get('diastolic_bp'),
            'body_temp': data.get('body_temp'),
            'heart_rate': data.get('heart_rate'),
        }

        # Inference via ML Microservice
        ml_result = ml_client.predict_and_analyze(ml_payload)

        # Persist Assessment Record
        record = AssessmentRecord.objects.create(
            patient=patient,
            assessed_by=request.user if request.user.is_authenticated else None,
            age=data['age'],
            bmi=data['bmi'],
            hemoglobin=data['hemoglobin'],
            blood_pressure=data['blood_pressure'],
            systolic_bp=data.get('systolic_bp'),
            diastolic_bp=data.get('diastolic_bp'),
            sugar_level=data['sugar_level'],
            protein_intake=data['protein_intake'],
            body_temp=data.get('body_temp'),
            heart_rate=data.get('heart_rate'),
            predicted_risk=ml_result.get('prediction', 'Unknown'),
            risk_level_code=ml_result.get('risk_level_code', 0),
            confidence_score=ml_result.get('confidence_score', 0.0),
            risk_distribution=ml_result.get('distribution', {}),
            clinical_flags=ml_result.get('clinical_flags', []),
            dietary_recommendations=ml_result.get('dietary_recommendations', []),
            assessed_features=ml_result.get('assessed_features', {}),
            doctor_notes=data.get('doctor_notes', '')
        )

        return Response({
            "message": "Clinical evaluation successfully computed and persisted.",
            "assessment_id": record.id,
            "patient": {
                "id": patient.id,
                "patient_id": patient.patient_id,
                "full_name": patient.full_name,
                "age": patient.age
            },
            "prediction": record.predicted_risk,
            "risk_level_code": record.risk_level_code,
            "confidence_score": record.confidence_score,
            "distribution": record.risk_distribution,
            "clinical_flags": record.clinical_flags,
            "dietary_recommendations": record.dietary_recommendations,
            "timestamp": record.timestamp.isoformat()
        }, status=status.HTTP_201_CREATED)


class AssessmentRecordListView(generics.ListAPIView):
    """Lists historical assessment evaluations with advanced filtering."""
    queryset = AssessmentRecord.objects.all().select_related('patient', 'assessed_by')
    serializer_class = AssessmentRecordSerializer
    permission_classes = [IsClinicianOrAbove]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = AssessmentFilter
    search_fields = ['patient__patient_id', 'patient__full_name', 'predicted_risk']
    ordering_fields = ['timestamp', 'confidence_score', 'age', 'predicted_risk']
    ordering = ['-timestamp']


class AssessmentRecordDetailView(generics.RetrieveDestroyAPIView):
    """Retrieves or removes an assessment record (Delete restricted to Doctors/Admins)."""
    queryset = AssessmentRecord.objects.all().select_related('patient', 'assessed_by')
    serializer_class = AssessmentRecordSerializer

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsDoctorOrAdmin()]
        return [IsClinicianOrAbove()]


class RealtimeAnalyticsView(APIView):
    """
    Aggregates population-level maternal risk distributions,
    anemia prevalence, hypertension flags, and recent assessment streams.
    """
    permission_classes = [IsClinicianOrAbove]

    def get(self, request):
        total_assessments = AssessmentRecord.objects.count()
        total_patients = PatientProfile.objects.count()

        # Risk distribution counts
        risk_counts = AssessmentRecord.objects.values('predicted_risk').annotate(count=Count('id'))
        dist_map = {'Low Risk': 0, 'Mid Risk': 0, 'High Risk': 0}
        for item in risk_counts:
            label = item['predicted_risk']
            if label in dist_map:
                dist_map[label] = item['count']

        # Clinical Condition Counts
        critical_anemia = AssessmentRecord.objects.filter(hemoglobin__lt=9.0).count()
        hypertension_cases = AssessmentRecord.objects.filter(blood_pressure__gte=140).count()
        hyperglycemia_cases = AssessmentRecord.objects.filter(sugar_level__gte=126.0).count()
        protein_deficit_cases = AssessmentRecord.objects.filter(protein_intake__lt=40.0).count()

        # Recent 10 Assessments
        recent_assessments = AssessmentRecord.objects.order_by('-timestamp')[:10]
        recent_serialized = AssessmentRecordSerializer(recent_assessments, many=True).data

        # Averages
        averages = AssessmentRecord.objects.aggregate(
            avg_age=Avg('age'),
            avg_bmi=Avg('bmi'),
            avg_hb=Avg('hemoglobin'),
            avg_bp=Avg('blood_pressure'),
            avg_sugar=Avg('sugar_level'),
            avg_protein=Avg('protein_intake')
        )

        return Response({
            "total_assessments": total_assessments,
            "total_patients": total_patients,
            "risk_distribution": dist_map,
            "high_risk_count": dist_map.get('High Risk', 0),
            "mid_risk_count": dist_map.get('Mid Risk', 0),
            "low_risk_count": dist_map.get('Low Risk', 0),
            "condition_alerts": {
                "critical_anemia": critical_anemia,
                "hypertension": hypertension_cases,
                "hyperglycemia": hyperglycemia_cases,
                "protein_deficit": protein_deficit_cases
            },
            "population_averages": {
                "age": round(averages['avg_age'] or 0, 1),
                "bmi": round(averages['avg_bmi'] or 0, 1),
                "hemoglobin": round(averages['avg_hb'] or 0, 2),
                "blood_pressure": round(averages['avg_bp'] or 0, 1),
                "sugar_level": round(averages['avg_sugar'] or 0, 1),
                "protein_intake": round(averages['avg_protein'] or 0, 1)
            },
            "recent_records": recent_serialized
        })
