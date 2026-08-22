import React from 'react';
import { X, Printer, Download, HeartPulse, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import RiskBadge from './RiskBadge';
import NutriGradMatriCareLogo from './NutriGradMatriCareLogo';

export default function MedicalReportModal({ reportData, onClose }) {
  if (!reportData) return null;

  const { patient, prediction, confidence_score, distribution, clinical_flags, dietary_recommendations, vitals } = reportData;
  const isHigh = prediction?.toLowerCase().includes('high');
  const isMid = prediction?.toLowerCase().includes('mid') || prediction?.toLowerCase().includes('medium');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 print:m-0 print:p-4 print:shadow-none print:border-none">
        
        {/* Header with clinic branding */}
        <div className="flex items-center justify-between border-b-2 border-indigo-600 pb-4">
          <div className="flex items-center gap-3">
            <NutriGradMatriCareLogo size="md" />
            <div>
              <div className="flex items-center">
                <span className="text-xl font-black text-slate-900">NutriGrad</span>
                <span className="text-xl font-black bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent ml-1">MatriCare</span>
                <span className="text-xl font-black text-slate-900 ml-1.5">Medical Report</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Maternal Nutrition Risk & AI Diagnostic Summary</p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Patient Demographics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-purple-50/60 p-4 rounded-2xl border border-purple-100 text-xs">
          <div>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Patient Name</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{patient?.full_name || 'Expectant Mother'}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Patient ID</span>
            <p className="font-bold text-slate-800 text-sm mt-0.5">{patient?.patient_id || 'PAT-001'}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Age / Gestation</span>
            <p className="font-bold text-slate-800 text-sm mt-0.5">{vitals?.age || patient?.age} yrs • {patient?.gestational_weeks || 16} wks</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Evaluation Date</span>
            <p className="font-bold text-slate-800 text-sm mt-0.5">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Prediction Summary Callout */}
        <div className={`p-5 rounded-2xl border ${isHigh ? 'bg-rose-50 border-rose-200' : isMid ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'} flex items-center justify-between`}>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">ML Risk Classification</span>
            <h2 className={`text-2xl font-black ${isHigh ? 'text-rose-800' : isMid ? 'text-amber-800' : 'text-emerald-800'} mt-0.5`}>
              {prediction}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              AI Ensemble Confidence: <strong>{confidence_score}%</strong> (5-Fold Stratified Cross-Validated Random Forest)
            </p>
          </div>
          <div className="text-right">
            <RiskBadge risk={prediction} size="lg" />
          </div>
        </div>

        {/* Clinical Parameters Grid */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Evaluated Clinical Vitals</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
              <span className="text-slate-400 block text-[10px]">Age</span>
              <span className="font-bold text-slate-800">{vitals?.age} yrs</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
              <span className="text-slate-400 block text-[10px]">BMI</span>
              <span className="font-bold text-slate-800">{vitals?.bmi}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
              <span className="text-slate-400 block text-[10px]">Hemoglobin</span>
              <span className="font-bold text-slate-800">{vitals?.hemoglobin} g/dL</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
              <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
              <span className="font-bold text-slate-800">{vitals?.blood_pressure} mmHg</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
              <span className="text-slate-400 block text-[10px]">Sugar Level</span>
              <span className="font-bold text-slate-800">{vitals?.sugar_level} mg/dL</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
              <span className="text-slate-400 block text-[10px]">Protein Intake</span>
              <span className="font-bold text-slate-800">{vitals?.protein_intake} g/day</span>
            </div>
          </div>
        </div>

        {/* Probability Breakdown */}
        {distribution && (
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <h4 className="text-[11px] font-bold text-slate-600 uppercase mb-2">Class Probability Distribution</h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-emerald-100/60 p-2 rounded-lg font-semibold text-emerald-800">
                Low: {distribution.low}%
              </div>
              <div className="bg-amber-100/60 p-2 rounded-lg font-semibold text-amber-800">
                Medium: {distribution.mid}%
              </div>
              <div className="bg-rose-100/60 p-2 rounded-lg font-semibold text-rose-800">
                High: {distribution.high}%
              </div>
            </div>
          </div>
        )}

        {/* Clinical Warning Flags */}
        {clinical_flags && clinical_flags.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Triggered Clinical Alert Flags</h3>
            <ul className="space-y-1.5 text-xs">
              {clinical_flags.map((flag, idx) => (
                <li key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 border border-rose-100 text-rose-800 font-medium">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Targeted Nutritional Prescription */}
        {dietary_recommendations && dietary_recommendations.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Personalized Maternal Dietary Plan</h3>
            <ul className="space-y-1.5 text-xs">
              {dietary_recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-slate-800">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Medical Sign-off Footer */}
        <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-700">NutriGrad-MatriCare Clinical Healthcare AI</p>
            <p className="text-[10px]">Validated against maternal health clinical guidelines.</p>
          </div>
          <div className="text-right">
            <div className="h-7 border-b border-slate-400 w-32 inline-block"></div>
            <p className="text-[10px] text-slate-400 mt-0.5">Attending Clinician / Obstetrician Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
