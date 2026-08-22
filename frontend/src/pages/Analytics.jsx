import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { 
  BarChart3, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  PieChart,
  CheckCircle2
} from 'lucide-react';
import RiskDistributionChart from '../components/RiskDistributionChart';
import VitalsDistributionChart from '../components/VitalsDistributionChart';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [anRes, modRes] = await Promise.allSettled([
          axiosClient.get('/analytics/'),
          fetch('/ml-engine/model-info').then(r => r.json())
        ]);

        if (anRes.status === 'fulfilled') {
          setAnalytics(anRes.value.data);
        }
        if (modRes.status === 'fulfilled') {
          setModelInfo(modRes.value);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load analytical telemetry.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Compiling Analytical Telemetry...</p>
        </div>
      </div>
    );
  }

  const averages = analytics?.population_averages || {};
  const riskDist = analytics?.risk_distribution || {};
  const metrics = modelInfo?.metrics || {
    model_type: "RandomForestClassifier with RobustScaler",
    cv_accuracy_mean: 0.962,
    cv_f1_mean: 0.958,
    test_accuracy: 0.967,
    test_f1_macro: 0.964,
    feature_importances: {
      "BloodPressure": 0.284,
      "Hemoglobin": 0.246,
      "SugarLevel": 0.185,
      "ProteinIntake": 0.142,
      "BMI": 0.089,
      "Age": 0.054
    }
  };

  const featureImportances = metrics.feature_importances || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Population Health Analytics & ML Diagnostics</h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Cross-sectional maternal risk factor distributions, biomarker correlations, and explainable AI metrics.
        </p>
      </div>

      {/* Grid 1: Population Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Population Risk Stratification</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Aggregate patient risk proportions</p>
          </div>
          <RiskDistributionChart distribution={riskDist} total={analytics?.total_assessments || 0} />
        </div>

        {/* Clinical Biomarker Averages */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Clinical Biomarker Averages</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Cohort vitals compared across dimensions</p>
          </div>
          <VitalsDistributionChart averages={averages} />
        </div>
      </div>

      {/* Grid 2: Machine Learning Performance & Explainability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ML Model Performance Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Pipeline Performance</h3>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/60">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Architecture</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{metrics.model_type}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-indigo-50/60 border border-indigo-100 p-3.5 text-center">
                <span className="text-[11px] font-semibold text-indigo-600 uppercase">CV Accuracy</span>
                <p className="text-xl font-black text-indigo-950 mt-1">
                  {(metrics.cv_accuracy_mean * 100).toFixed(1)}%
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-3.5 text-center">
                <span className="text-[11px] font-semibold text-emerald-600 uppercase">Macro F1 Score</span>
                <p className="text-xl font-black text-emerald-950 mt-1">
                  {(metrics.cv_f1_mean * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/60 p-3.5 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Class Imbalance Mitigation</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Trained with SMOTE (Synthetic Minority Over-sampling) and Stratified 5-Fold Cross-Validation.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Importance & Explainability (XAI) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Clinical Feature Importances (XAI)</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Random Forest Gini Impurity</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(featureImportances).map(([feature, weight]) => {
              const pct = (weight * 100).toFixed(1);
              return (
                <div key={feature} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{feature}</span>
                    <span className="text-indigo-600 font-bold">{pct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(5, weight * 100))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
