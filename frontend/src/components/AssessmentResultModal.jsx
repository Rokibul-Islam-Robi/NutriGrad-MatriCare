import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  Sparkles, 
  Apple, 
  Stethoscope, 
  X, 
  Printer, 
  ArrowRight 
} from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function AssessmentResultModal({ result, onClose, onNewAssessment }) {
  if (!result) return null;

  const isHigh = result.prediction?.toLowerCase().includes('high');
  const isMid = result.prediction?.toLowerCase().includes('mid') || result.prediction?.toLowerCase().includes('medium');

  const getHeaderStyle = () => {
    if (isHigh) return 'from-red-600 to-rose-700 text-white';
    if (isMid) return 'from-amber-500 to-orange-600 text-white';
    return 'from-emerald-600 to-teal-700 text-white';
  };

  const getIcon = () => {
    if (isHigh) return <AlertOctagon className="h-8 w-8 text-white" />;
    if (isMid) return <AlertTriangle className="h-8 w-8 text-white" />;
    return <CheckCircle2 className="h-8 w-8 text-white" />;
  };

  const distribution = result.distribution || {};
  const lowPct = distribution.low ?? 0;
  const midPct = distribution.mid ?? 0;
  const highPct = distribution.high ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-100">
        {/* Header banner */}
        <div className={`flex items-center justify-between p-6 bg-gradient-to-r ${getHeaderStyle()} rounded-t-3xl`}>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              {getIcon()}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">ML Inference Classification</p>
              <h2 className="text-2xl font-black tracking-tight text-white">{result.prediction}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Context & Confidence Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Patient Identifier</span>
              <p className="mt-1 text-base font-bold text-slate-800">{result.patient?.full_name || 'Patient'} ({result.patient?.patient_id})</p>
              <p className="text-xs text-slate-500 mt-0.5">Age: {result.patient?.age} yrs • Record #{result.assessment_id}</p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Model Confidence</span>
                <span className="text-sm font-bold text-slate-800">{result.confidence_score}%</span>
              </div>
              <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isHigh ? 'bg-red-500' : isMid ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, Math.max(0, result.confidence_score))}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 text-right">Random Forest Ensemble</p>
            </div>
          </div>

          {/* Probability Distribution */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Risk Probability Distribution</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-center">
                <span className="text-xs font-semibold text-emerald-700">Low Risk</span>
                <p className="text-lg font-black text-emerald-900 mt-0.5">{lowPct}%</p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3 text-center">
                <span className="text-xs font-semibold text-amber-700">Mid Risk</span>
                <p className="text-lg font-black text-amber-900 mt-0.5">{midPct}%</p>
              </div>
              <div className="rounded-xl border border-red-100 bg-red-50/50 p-3 text-center">
                <span className="text-xs font-semibold text-red-700">High Risk</span>
                <p className="text-lg font-black text-red-900 mt-0.5">{highPct}%</p>
              </div>
            </div>
          </div>

          {/* Triggered Clinical Alerts */}
          {result.clinical_flags && result.clinical_flags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Triggered Clinical Alert Flags</h3>
              </div>
              <ul className="space-y-1.5">
                {result.clinical_flags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50/60 px-3.5 py-2 text-xs font-medium text-red-800">
                    <span className="mt-0.5 text-red-500">⚠️</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence-Based Nutritional Guidance */}
          {result.dietary_recommendations && result.dietary_recommendations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Apple className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Personalized Nutritional & Clinical Action Plan</h3>
              </div>
              <ul className="space-y-2">
                {result.dietary_recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-xs text-slate-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-[10px] font-bold text-emerald-800">
                      {idx + 1}
                    </span>
                    <span className="mt-0.5 leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print Clinical Summary</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={onNewAssessment}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors"
              >
                <span>Evaluate Another Patient</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
