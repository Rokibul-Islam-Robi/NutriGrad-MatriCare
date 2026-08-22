"""
NutriGrad-MatriCare - FastAPI Pydantic Schemas
Strict Clinical Input Validation and Standardized ML Output Schemas.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator
from datetime import datetime


class PatientVitalsInput(BaseModel):
    age: int = Field(..., ge=12, le=65, description="Maternal Age (years)", example=28)
    bmi: float = Field(..., ge=12.0, le=60.0, description="Body Mass Index (kg/m²)", example=24.5)
    hemoglobin: float = Field(..., ge=4.0, le=20.0, description="Hemoglobin concentration (g/dL)", example=11.5)
    blood_pressure: int = Field(..., ge=50, le=240, description="Systolic / Mean Blood Pressure (mmHg)", example=120)
    sugar_level: float = Field(..., ge=40.0, le=400.0, description="Blood Sugar Level (mg/dL)", example=95.0)
    protein_intake: float = Field(..., ge=0.0, le=200.0, description="Daily Protein Intake (grams/day)", example=65.0)
    
    # Extended vitals (optional for advanced monitoring)
    systolic_bp: Optional[int] = Field(None, ge=60, le=240, description="Systolic Blood Pressure (mmHg)")
    diastolic_bp: Optional[int] = Field(None, ge=40, le=150, description="Diastolic Blood Pressure (mmHg)")
    body_temp: Optional[float] = Field(None, ge=94.0, le=106.0, description="Body Temperature (°F)")
    heart_rate: Optional[int] = Field(None, ge=40, le=200, description="Heart Rate (bpm)")

    @field_validator('blood_pressure', mode='before')
    @classmethod
    def resolve_blood_pressure(cls, v, values):
        if v is None and 'systolic_bp' in values.data and values.data['systolic_bp']:
            return values.data['systolic_bp']
        return v


class RiskDistribution(BaseModel):
    low: float = Field(..., description="Low Risk Probability (%)", example=78.5)
    mid: float = Field(..., description="Mid Risk Probability (%)", example=16.2)
    high: float = Field(..., description="High Risk Probability (%)", example=5.3)


class PredictionResponse(BaseModel):
    prediction: str = Field(..., description="Risk Classification: Low Risk, Mid Risk, or High Risk", example="Low Risk")
    risk_level_code: int = Field(..., description="Integer code: 0 (Low), 1 (Mid), 2 (High)", example=0)
    confidence_score: float = Field(..., description="Top class confidence percentage", example=88.45)
    distribution: RiskDistribution
    clinical_flags: List[str] = Field(default_factory=list, description="Automated evidence-based clinical alerts")
    dietary_recommendations: List[str] = Field(default_factory=list, description="Targeted nutritional intervention advice")
    assessed_features: Dict[str, Any] = Field(default_factory=dict, description="Engineered features and vitals evaluated")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class HealthStatus(BaseModel):
    status: str = "healthy"
    service: str = "NutriGrad-MatriCare ML Inference Microservice"
    version: str = "2.0.0"
    model_loaded: bool
    features_count: int
