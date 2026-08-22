"""
NutriGrad-MatriCare - Machine Learning Training Pipeline
Advanced Clinical Feature Engineering, Imbalance Handling (SMOTE), Stratified Cross-Validation,
and Production Model Serialization.
"""

import os
import json
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import StratifiedKFold, train_test_split, cross_validate
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import classification_report, accuracy_score, f1_score, precision_score, recall_score, confusion_matrix
from sklearn.pipeline import Pipeline

try:
    from imblearn.over_sampling import SMOTE
    HAS_SMOTE = True
except ImportError:
    HAS_SMOTE = False


def engineer_clinical_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes evidence-based maternal clinical indicators and risk biomarkers.
    """
    data = df.copy()
    
    # 1. BMI Categorization (WHO Maternal Standards)
    # <18.5: Underweight (0), 18.5-24.9: Normal (1), 25.0-29.9: Overweight (2), >=30.0: Obese (3)
    if 'BMI' in data.columns:
        data['BMI_Category'] = pd.cut(
            data['BMI'],
            bins=[-np.inf, 18.49, 24.99, 29.99, np.inf],
            labels=[0, 1, 2, 3]
        ).astype(int)
    
    # 2. Hemoglobin Anemia Severity Index (WHO Pregnancy Guidelines: <11.0 g/dL is anemia)
    if 'Hemoglobin' in data.columns:
        data['Anemia_Severity'] = pd.cut(
            data['Hemoglobin'],
            bins=[-np.inf, 8.99, 10.99, 11.99, np.inf],
            labels=[3, 2, 1, 0]  # 3: Severe, 2: Moderate, 1: Mild, 0: Normal
        ).astype(int)
    
    # 3. Blood Pressure / Hemodynamic Profiling
    if 'BloodPressure' in data.columns:
        data['BP_Stage'] = pd.cut(
            data['BloodPressure'],
            bins=[-np.inf, 119.99, 129.99, 139.99, np.inf],
            labels=[0, 1, 2, 3]  # Normal, Elevated, Stage 1 HTN, Stage 2 HTN
        ).astype(int)
        # Derived estimated MAP and pulse pressure
        data['Est_MAP'] = data['BloodPressure'] * 0.78
        data['Est_PulsePressure'] = data['BloodPressure'] * 0.35

    # 4. Glycemic Risk Level (Gestational Diabetes Screening)
    if 'SugarLevel' in data.columns:
        data['Glycemic_Category'] = pd.cut(
            data['SugarLevel'],
            bins=[-np.inf, 99.99, 125.99, np.inf],
            labels=[0, 1, 2]  # Normal, Impaired, Gestational Hyperglycemia
        ).astype(int)
    elif 'BS' in data.columns:
        data['Glycemic_Category'] = pd.cut(
            data['BS'],
            bins=[-np.inf, 7.79, 10.99, np.inf],
            labels=[0, 1, 2]
        ).astype(int)

    # 5. Protein Intake Adequacy (Maternal Daily Nutrition Target: ~60-70g/day)
    if 'ProteinIntake' in data.columns:
        data['Protein_Deficit_Score'] = pd.cut(
            data['ProteinIntake'],
            bins=[-np.inf, 39.99, 54.99, np.inf],
            labels=[2, 1, 0]  # 2: Severe Deficit, 1: Suboptimal, 0: Adequate
        ).astype(int)

    # 6. Maternal Age Risk Factor (<19 or >35 is higher maternal risk)
    if 'Age' in data.columns:
        data['Maternal_Age_Risk'] = np.where(
            (data['Age'] < 19) | (data['Age'] >= 35), 1, 0
        )

    return data


def train_and_export_pipeline(csv_path: str = None, output_dir: str = None):
    """
    Loads dataset, performs clinical feature engineering, applies SMOTE,
    runs cross-validation, fits the production pipeline, and saves serialized artifacts.
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    if csv_path is None:
        # Check standard locations
        potential_paths = [
            os.path.join(base_dir, "..", "dataset", "data.csv"),
            os.path.join(base_dir, "..", "Pregnancy-Nutrition-Risk-Prediction-System-using-Machine-Learning-main", "dataset", "data.csv"),
            os.path.join(base_dir, "dataset", "data.csv"),
        ]
        for p in potential_paths:
            if os.path.exists(p):
                csv_path = p
                break
        if csv_path is None or not os.path.exists(csv_path):
            raise FileNotFoundError("Could not find dataset 'data.csv' in expected locations.")

    if output_dir is None:
        output_dir = os.path.join(base_dir, "model")
    os.makedirs(output_dir, exist_ok=True)

    print(f"[*] Loading dataset from: {csv_path}")
    df = pd.read_csv(csv_path)
    print(f"[*] Raw Dataset shape: {df.shape}")
    print(f"[*] Columns found: {list(df.columns)}")

    # Standardize target column name
    target_col = None
    for candidate in ['Risk', 'RiskLevel', 'risk', 'risk_level']:
        if candidate in df.columns:
            target_col = candidate
            break

    if not target_col:
        raise ValueError("Could not find target column ('Risk' or 'RiskLevel') in dataset.")

    # Target Mapping
    # Standard: Low -> 0, Medium/Mid -> 1, High -> 2
    raw_targets = df[target_col].astype(str).str.strip().str.lower()
    target_mapping = {
        'low': 0, 'low risk': 0, '0': 0, 0: 0,
        'medium': 1, 'mid': 1, 'mid risk': 1, '1': 1, 1: 1,
        'high': 2, 'high risk': 2, '2': 2, 2: 2
    }
    
    y = raw_targets.map(target_mapping)
    if y.isnull().any():
        print(f"[!] Warning: Found unrecognized target values: {df[target_col][y.isnull()].unique()}")
        df = df[~y.isnull()].copy()
        y = y.dropna().astype(int)
    else:
        y = y.astype(int)

    X_raw = df.drop(columns=[target_col])

    # Feature Engineering
    X_engineered = engineer_clinical_features(X_raw)
    feature_names = list(X_engineered.columns)
    print(f"[*] Engineered Features ({len(feature_names)}): {feature_names}")

    # Stratified Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X_engineered, y, test_size=0.2, random_state=42, stratify=y
    )

    # Class balancing with SMOTE if available
    if HAS_SMOTE:
        print("[*] Applying SMOTE for clinical risk class rebalancing...")
        try:
            smote = SMOTE(random_state=42)
            X_train_res, y_train_res = smote.fit_resample(X_train, y_train)
        except Exception as e:
            print(f"[!] SMOTE failed ({e}), continuing with standard balanced weighting.")
            X_train_res, y_train_res = X_train, y_train
    else:
        X_train_res, y_train_res = X_train, y_train

    # Construct Enterprise Pipeline
    classifier = RandomForestClassifier(
        n_estimators=300,
        max_depth=12,
        min_samples_split=3,
        min_samples_leaf=1,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    )

    pipeline = Pipeline([
        ('scaler', RobustScaler()),
        ('classifier', classifier)
    ])

    # 5-Fold Stratified Cross-Validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_validate(
        pipeline, X_train_res, y_train_res,
        cv=cv,
        scoring=['accuracy', 'f1_macro', 'precision_macro', 'recall_macro']
    )

    print("\n--- 5-Fold Cross Validation Results ---")
    print(f"Mean Accuracy: {cv_scores['test_accuracy'].mean():.4f} (+/- {cv_scores['test_accuracy'].std():.4f})")
    print(f"Mean Macro F1: {cv_scores['test_f1_macro'].mean():.4f} (+/- {cv_scores['test_f1_macro'].std():.4f})")

    # Fit Full Production Pipeline
    pipeline.fit(X_train_res, y_train_res)

    # Test Evaluation
    y_pred = pipeline.predict(X_test)
    test_acc = accuracy_score(y_test, y_pred)
    test_f1 = f1_score(y_test, y_pred, average='macro')
    test_prec = precision_score(y_test, y_pred, average='macro')
    test_rec = recall_score(y_test, y_pred, average='macro')
    conf_matrix = confusion_matrix(y_test, y_pred).tolist()

    print("\n--- Holdout Test Set Performance ---")
    print(classification_report(y_test, y_pred, target_names=['Low Risk', 'Mid Risk', 'High Risk']))

    # Extract Feature Importances
    importances = pipeline.named_steps['classifier'].feature_importances_
    feature_importance_dict = {
        name: round(float(imp), 4)
        for name, imp in sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)
    }

    # Serialization
    pipeline_path = os.path.join(output_dir, "risk_pipeline.joblib")
    features_path = os.path.join(output_dir, "feature_names.joblib")
    metrics_path = os.path.join(output_dir, "metrics.json")

    joblib.dump(pipeline, pipeline_path)
    joblib.dump(feature_names, features_path)

    metrics_payload = {
        "model_type": "RandomForestClassifier with RobustScaler",
        "n_features": len(feature_names),
        "features": feature_names,
        "feature_importances": feature_importance_dict,
        "cv_accuracy_mean": round(float(cv_scores['test_accuracy'].mean()), 4),
        "cv_f1_mean": round(float(cv_scores['test_f1_macro'].mean()), 4),
        "test_accuracy": round(float(test_acc), 4),
        "test_f1_macro": round(float(test_f1), 4),
        "test_precision_macro": round(float(test_prec), 4),
        "test_recall_macro": round(float(test_rec), 4),
        "confusion_matrix": conf_matrix,
        "classes": ["Low Risk", "Mid Risk", "High Risk"]
    }

    with open(metrics_path, "w") as f:
        json.dump(metrics_payload, f, indent=2)

    print(f"\n[OK] Production ML Pipeline successfully exported to: {pipeline_path}")
    print(f"[OK] Feature specifications saved to: {features_path}")
    print(f"[OK] Metrics and explainability saved to: {metrics_path}")

    return pipeline, feature_names, metrics_payload


if __name__ == "__main__":
    train_and_export_pipeline()
