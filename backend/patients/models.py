"""
NutriGrad-MatriCare - Clinical Models for Patient Profiles and Risk Assessment Logs.
"""

from django.db import models
from django.conf import settings


class PatientProfile(models.Model):
    """Represents an expectant mother under clinical care."""
    patient_id = models.CharField(max_length=60, unique=True, db_index=True)
    full_name = models.CharField(max_length=150)
    age = models.IntegerField(default=25)
    gestational_weeks = models.IntegerField(default=12, help_text="Current gestational age in weeks")
    contact_phone = models.CharField(max_length=30, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    blood_group = models.CharField(max_length=10, blank=True, default='O+')
    gravida = models.IntegerField(default=1, help_text="Total number of pregnancies")
    para = models.IntegerField(default=0, help_text="Number of viable births")
    medical_history = models.TextField(blank=True, default='')
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='registered_patients'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} ({self.patient_id})"


class AssessmentRecord(models.Model):
    """Clinical assessment record storing vitals, ML predictions, probabilities, and alerts."""
    RISK_CHOICES = (
        ('Low Risk', 'Low Risk'),
        ('Mid Risk', 'Mid Risk'),
        ('High Risk', 'High Risk'),
    )

    patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name='assessments'
    )
    assessed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='performed_assessments'
    )
    
    # Clinical Vitals Inputs
    age = models.IntegerField()
    bmi = models.FloatField()
    hemoglobin = models.FloatField()
    blood_pressure = models.IntegerField()
    systolic_bp = models.IntegerField(null=True, blank=True)
    diastolic_bp = models.IntegerField(null=True, blank=True)
    sugar_level = models.FloatField()
    protein_intake = models.FloatField()
    body_temp = models.FloatField(null=True, blank=True)
    heart_rate = models.IntegerField(null=True, blank=True)

    # ML Inference Output
    predicted_risk = models.CharField(max_length=30, choices=RISK_CHOICES)
    risk_level_code = models.IntegerField(default=0)
    confidence_score = models.FloatField(help_text="Percentage confidence")
    risk_distribution = models.JSONField(default=dict, help_text="Class probabilities dictionary")
    clinical_flags = models.JSONField(default=list, help_text="Triggered clinical warning flags")
    dietary_recommendations = models.JSONField(default=list, help_text="Generated dietary recommendations")
    assessed_features = models.JSONField(default=dict, blank=True)
    
    doctor_notes = models.TextField(blank=True, default='')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Assessment #{self.id} - {self.patient.patient_id} [{self.predicted_risk}]"
