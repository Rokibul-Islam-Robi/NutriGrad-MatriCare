import React from 'react';
import { X, Calendar, User, Phone, Mail, FileText, Heart, Activity } from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function PatientDetailModal({ patient, onClose }) {
  if (!patient) return null;

  const assessments = patient.assessments || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-100 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-lg">
              {patient.full_name?.charAt(0) || 'P'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{patient.full_name}</h2>
              <p className="text-xs text-slate-500">ID: {patient.patient_id} • Blood Group: {patient.blood_group || 'O+'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Demographics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Age</span>
            <p className="text-sm font-bold text-slate-800">{patient.age} yrs</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Gestational Age</span>
            <p className="text-sm font-bold text-slate-800">{patient.gestational_weeks} wks</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Gravida / Para</span>
            <p className="text-sm font-bold text-slate-800">G{patient.gravida} P{patient.para}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Current Status</span>
            <div className="mt-0.5"><RiskBadge risk={patient.latest_risk} size="sm" /></div>
          </div>
        </div>

        {/* Clinical History */}
        {patient.medical_history && (
          <div className="rounded-2xl border border-slate-200/60 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Clinical Background & Medical History</h4>
            <p className="text-xs text-slate-700 leading-relaxed">{patient.medical_history}</p>
          </div>
        )}

        {/* Assessment Timeline */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Historical Risk Evaluations ({assessments.length})</h4>
          {assessments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
              No historical clinical assessments logged for this patient yet.
            </div>
          ) : (
            <div className="space-y-3">
              {assessments.map((a, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200/80 p-4 hover:border-indigo-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RiskBadge risk={a.predicted_risk} size="sm" />
                      <span className="text-xs font-semibold text-slate-700">Confidence: {a.confidence_score}%</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(a.timestamp).toLocaleDateString()} {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Vitals summary badges */}
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2 text-[11px]">
                    <div className="bg-slate-50 p-2 rounded-lg text-center">
                      <span className="text-slate-400 block text-[10px]">BMI</span>
                      <span className="font-semibold">{a.bmi}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg text-center">
                      <span className="text-slate-400 block text-[10px]">Hemoglobin</span>
                      <span className="font-semibold">{a.hemoglobin} g/dL</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg text-center">
                      <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                      <span className="font-semibold">{a.blood_pressure}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg text-center">
                      <span className="text-slate-400 block text-[10px]">Sugar Level</span>
                      <span className="font-semibold">{a.sugar_level} mg/dL</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg text-center">
                      <span className="text-slate-400 block text-[10px]">Protein</span>
                      <span className="font-semibold">{a.protein_intake} g</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg text-center">
                      <span className="text-slate-400 block text-[10px]">Assessor</span>
                      <span className="font-semibold truncate block">{a.assessed_by_name || 'Staff'}</span>
                    </div>
                  </div>

                  {/* Triggered flags */}
                  {a.clinical_flags && a.clinical_flags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {a.clinical_flags.map((flag, fIdx) => (
                        <span key={fIdx} className="rounded-md bg-red-50 text-[10px] font-medium text-red-700 px-2 py-0.5 border border-red-100">
                          {flag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
