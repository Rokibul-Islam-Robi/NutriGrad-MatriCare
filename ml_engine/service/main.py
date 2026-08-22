"""
NutriGrad-MatriCare - FastAPI ML Inference & Analytics Microservice
Provides real-time maternal risk prediction, probability distribution,
explainability biomarkers, and clinical alert flags.
"""

import os
import sys
import json
from typing import Dict, Any, List
from datetime import datetime
import numpy as np
import pandas as pd
import joblib
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

# Ensure module path imports
current_dir = os.path.dirname(os.path.abspath(__file__))
ml_engine_dir = os.path.dirname(current_dir)
if ml_engine_dir not in sys.path:
    sys.path.insert(0, ml_engine_dir)

from service.schemas import PatientVitalsInput, PredictionResponse, RiskDistribution, HealthStatus
from train_pipeline import engineer_clinical_features, train_and_export_pipeline

app = FastAPI(
    title="NutriGrad-MatriCare - Clinical Machine Learning Engine",
    description="Enterprise REST Microservice for Maternal & Pregnancy Nutrition Risk Scoring",
    version="2.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = os.path.join(ml_engine_dir, "model")
PIPELINE_PATH = os.path.join(MODEL_DIR, "risk_pipeline.joblib")
FEATURES_PATH = os.path.join(MODEL_DIR, "feature_names.joblib")
METRICS_PATH = os.path.join(MODEL_DIR, "metrics.json")

pipeline = None
feature_names = None
metrics_info = {}


def load_artifacts():
    global pipeline, feature_names, metrics_info
    if not os.path.exists(PIPELINE_PATH) or not os.path.exists(FEATURES_PATH):
        print("[!] Model artifacts missing. Initializing automated training pipeline...")
        try:
            pipeline, feature_names, metrics_info = train_and_export_pipeline(output_dir=MODEL_DIR)
            return
        except Exception as e:
            print(f"[!] Auto-training failed: {e}")

    try:
        pipeline = joblib.load(PIPELINE_PATH)
        feature_names = joblib.load(FEATURES_PATH)
        if os.path.exists(METRICS_PATH):
            with open(METRICS_PATH, "r") as f:
                metrics_info = json.load(f)
        print(f"[OK] Model pipeline loaded successfully with {len(feature_names)} features.")
    except Exception as e:
        print(f"[!] Error loading artifacts: {e}")


@app.on_event("startup")
def on_startup():
    load_artifacts()


def generate_clinical_flags(data: PatientVitalsInput) -> List[str]:
    """Generates evidence-backed clinical alert flags based on vital thresholds."""
    flags = []
    
    # Blood Pressure Flags
    bp = data.blood_pressure
    if bp >= 140 or (data.systolic_bp and data.systolic_bp >= 140) or (data.diastolic_bp and data.diastolic_bp >= 90):
        flags.append("Stage 2 Hypertension Alert (BP >= 140 mmHg) - Pre-eclampsia risk")
    elif bp >= 130 or (data.systolic_bp and data.systolic_bp >= 130) or (data.diastolic_bp and data.diastolic_bp >= 80):
        flags.append("Stage 1 Hypertension Warning (BP 130-139 mmHg)")
    elif bp < 90:
        flags.append("Hypotension Detected (BP < 90 mmHg) - Maternal fatigue risk")

    # Hemoglobin & Anemia Flags
    if data.hemoglobin < 9.0:
        flags.append(f"Severe Maternal Anemia (Hb {data.hemoglobin:.1f} g/dL < 9.0 g/dL)")
    elif data.hemoglobin < 11.0:
        flags.append(f"Mild-to-Moderate Anemia (Hb {data.hemoglobin:.1f} g/dL < 11.0 g/dL)")

    # Blood Sugar / Glycemic Flags
    if data.sugar_level >= 126.0:
        flags.append(f"Gestational Hyperglycemia Warning (Sugar {data.sugar_level:.1f} mg/dL >= 126)")
    elif data.sugar_level >= 100.0:
        flags.append(f"Impaired Fasting Glucose (Sugar {data.sugar_level:.1f} mg/dL)")

    # Nutritional & BMI Flags
    if data.protein_intake < 40.0:
        flags.append(f"Severe Protein Deficiency ({data.protein_intake:.0f}g/day vs 65g target)")
    elif data.protein_intake < 55.0:
        flags.append(f"Suboptimal Protein Intake ({data.protein_intake:.0f}g/day)")

    if data.bmi < 18.5:
        flags.append(f"Maternal Underweight (BMI {data.bmi:.1f} < 18.5) - Fetal growth risk")
    elif data.bmi >= 30.0:
        flags.append(f"Maternal Obesity Category (BMI {data.bmi:.1f} >= 30.0)")

    # Age Risk Flags
    if data.age < 18:
        flags.append("Adolescent Pregnancy Risk Factor (Age < 18)")
    elif data.age >= 35:
        flags.append("Advanced Maternal Age Risk Factor (Age >= 35)")

    # Optional Vitals Flags
    if data.heart_rate and data.heart_rate >= 100:
        flags.append(f"Maternal Tachycardia Detected ({data.heart_rate} bpm)")
    if data.body_temp and data.body_temp >= 100.4:
        flags.append(f"Maternal Pyrexia/Fever Detected ({data.body_temp}°F)")

    return flags


def generate_nutritional_recommendations(data: PatientVitalsInput, risk_pred: str) -> List[str]:
    """Generates personalized nutritional prescriptions and lifestyle recommendations."""
    recs = []
    
    # Anemia recommendations
    if data.hemoglobin < 11.0:
        recs.append("Increase dietary iron intake: dark leafy greens (spinach, kale), lentils, fortified cereals, and lean meats.")
        recs.append("Pair iron sources with Vitamin C (citrus, bell peppers, tomatoes) to enhance bioavailability; avoid tea/coffee near meals.")

    # Glycemic control recommendations
    if data.sugar_level >= 100.0:
        recs.append("Adopt low-glycemic complex carbohydrates (oats, quinoa, brown rice) and distribute meal portions evenly across the day.")
        recs.append("Eliminate refined sugars and sweetened beverages; monitor 2-hour postprandial glucose levels.")

    # Blood pressure recommendations
    if data.blood_pressure >= 130:
        recs.append("Restrict dietary sodium (<2,000 mg/day) and increase potassium-rich foods (bananas, sweet potatoes, avocados).")
        recs.append("Ensure optimal hydration (2.5-3L water daily) and schedule regular ambulatory blood pressure checks.")

    # Protein intake guidance
    if data.protein_intake < 55.0:
        recs.append(f"Boost daily protein to at least 70-80g with eggs, dairy/Greek yogurt, legumes, pulses, tofu, or lean poultry.")

    # General risk level protocol
    if risk_pred == "High Risk":
        recs.append("URGENT: Schedule immediate obstetrician review and specialized prenatal nutrition consultation within 48 hours.")
    elif risk_pred == "Mid Risk":
        recs.append("Schedule follow-up clinical biomarker reassessment within 2 weeks to evaluate nutritional intervention progress.")
    else:
        recs.append("Maintain standard balanced maternal diet, prenatal multivitamin + 400mcg folic acid supplementation, and routine checkups.")

    return recs


@app.get("/", tags=["General"])
def root():
    return {
        "system": "NutriGrad-MatriCare Machine Learning Inference Service",
        "version": "2.0.0",
        "status": "Operational",
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthStatus, tags=["Monitoring"])
def health_check():
    global pipeline, feature_names
    return HealthStatus(
        status="healthy" if pipeline is not None else "degraded",
        model_loaded=pipeline is not None,
        features_count=len(feature_names) if feature_names else 0
    )


@app.get("/model-info", tags=["Explainability"])
def model_info():
    global metrics_info, feature_names
    if not metrics_info:
        if os.path.exists(METRICS_PATH):
            with open(METRICS_PATH, "r") as f:
                metrics_info = json.load(f)
    return {
        "metrics": metrics_info,
        "features": feature_names
    }


@app.post("/predict-and-analyze", response_model=PredictionResponse, tags=["Inference"])
def predict_and_analyze(data: PatientVitalsInput):
    global pipeline, feature_names
    if pipeline is None or feature_names is None:
        load_artifacts()
        if pipeline is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="ML Model Pipeline is currently unavailable. Please check training artifacts."
            )

    try:
        # Build base dictionary
        raw_dict = {
            'Age': [data.age],
            'BMI': [data.bmi],
            'Hemoglobin': [data.hemoglobin],
            'BloodPressure': [data.blood_pressure],
            'SugarLevel': [data.sugar_level],
            'ProteinIntake': [data.protein_intake]
        }
        
        if data.systolic_bp is not None:
            raw_dict['SystolicBP'] = [data.systolic_bp]
        if data.diastolic_bp is not None:
            raw_dict['DiastolicBP'] = [data.diastolic_bp]

        df_raw = pd.DataFrame(raw_dict)
        
        # Apply clinical feature engineering
        df_engineered = engineer_clinical_features(df_raw)

        # Ensure all required features exist
        for f in feature_names:
            if f not in df_engineered.columns:
                df_engineered[f] = 0.0

        X_input = df_engineered[feature_names]

        # Execute Model Inference
        pred_class_idx = int(pipeline.predict(X_input)[0])
        probabilities = pipeline.predict_proba(X_input)[0].tolist()

        # Class mappings
        risk_labels = {0: "Low Risk", 1: "Mid Risk", 2: "High Risk"}
        predicted_label = risk_labels.get(pred_class_idx, "Unknown")
        confidence = round(float(probabilities[pred_class_idx]) * 100.0, 2)

        # Build probabilities structure
        prob_dist = RiskDistribution(
            low=round(float(probabilities[0]) * 100.0, 2),
            mid=round(float(probabilities[1]) * 100.0, 2) if len(probabilities) > 1 else 0.0,
            high=round(float(probabilities[2]) * 100.0, 2) if len(probabilities) > 2 else 0.0,
        )

        clinical_flags = generate_clinical_flags(data)
        recommendations = generate_nutritional_recommendations(data, predicted_label)

        assessed_features_summary = {
            "age": data.age,
            "bmi": data.bmi,
            "hemoglobin": data.hemoglobin,
            "blood_pressure": data.blood_pressure,
            "sugar_level": data.sugar_level,
            "protein_intake": data.protein_intake,
            "bmi_category": int(df_engineered['BMI_Category'].iloc[0]) if 'BMI_Category' in df_engineered else None,
            "anemia_severity": int(df_engineered['Anemia_Severity'].iloc[0]) if 'Anemia_Severity' in df_engineered else None,
            "bp_stage": int(df_engineered['BP_Stage'].iloc[0]) if 'BP_Stage' in df_engineered else None,
            "glycemic_category": int(df_engineered['Glycemic_Category'].iloc[0]) if 'Glycemic_Category' in df_engineered else None,
        }

        return PredictionResponse(
            prediction=predicted_label,
            risk_level_code=pred_class_idx,
            confidence_score=confidence,
            distribution=prob_dist,
            clinical_flags=clinical_flags,
            dietary_recommendations=recommendations,
            assessed_features=assessed_features_summary,
            timestamp=datetime.utcnow().isoformat()
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference execution failure: {str(e)}"
        )


@app.post("/predict", tags=["Inference"])
def predict(data: PatientVitalsInput):
    """Compatibility endpoint matching standard prediction contracts."""
    res = predict_and_analyze(data)
    return {
        "prediction": res.prediction,
        "confidence": res.confidence_score,
        "distribution": res.distribution.model_dump(),
        "clinical_flags": res.clinical_flags
    }
