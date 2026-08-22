import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { 
  Stethoscope, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  HeartPulse, 
  Activity, 
  Droplet, 
  Scale, 
  Calendar,
  Layers
} from 'lucide-react';
import AssessmentResultModal from '../components/AssessmentResultModal';

export default function Assessment() {
  const [formData, setFormData] = useState({
    patient_id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
    full_name: '',
    age: '26',
    bmi: '23.5',
    hemoglobin: '11.8',
    blood_pressure: '120',
    systolic_bp: '120',
    diastolic_bp: '80',
    sugar_level: '95',
    protein_intake: '65',
    gestational_weeks: '16',
    body_temp: '98.6',
    heart_rate: '76',
    doctor_notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePresetSelect = (preset) => {
    if (preset === 'healthy') {
      setFormData({
        patient_id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
        full_name: 'Emily Davis',
        age: '26',
        bmi: '22.4',
        hemoglobin: '12.5',
        blood_pressure: '116',
        systolic_bp: '116',
        diastolic_bp: '76',
        sugar_level: '90',
        protein_intake: '70',
        gestational_weeks: '18',
        body_temp: '98.4',
        heart_rate: '74',
        doctor_notes: 'Standard antenatal second trimester follow-up.'
      });
    } else if (preset === 'anemia') {
      setFormData({
        patient_id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
        full_name: 'Amina Khatun',
        age: '24',
        bmi: '19.2',
        hemoglobin: '8.4',
        blood_pressure: '112',
        systolic_bp: '112',
        diastolic_bp: '74',
        sugar_level: '98',
        protein_intake: '38',
        gestational_weeks: '22',
        body_temp: '98.6',
        heart_rate: '88',
        doctor_notes: 'Patient reports severe lethargy and pallor.'
      });
    } else if (preset === 'highrisk') {
      setFormData({
        patient_id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
        full_name: 'Rachel Sterling',
        age: '38',
        bmi: '32.1',
        hemoglobin: '9.2',
        blood_pressure: '154',
        systolic_bp: '154',
        diastolic_bp: '96',
        sugar_level: '148',
        protein_intake: '34',
        gestational_weeks: '28',
        body_temp: '99.1',
        heart_rate: '104',
        doctor_notes: 'Advanced maternal age, elevated BP, peripheral edema.'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      patient_id: formData.patient_id,
      full_name: formData.full_name || `Patient ${formData.patient_id}`,
      age: parseInt(formData.age),
      bmi: parseFloat(formData.bmi),
      hemoglobin: parseFloat(formData.hemoglobin),
      blood_pressure: parseInt(formData.blood_pressure || formData.systolic_bp),
      systolic_bp: formData.systolic_bp ? parseInt(formData.systolic_bp) : null,
      diastolic_bp: formData.diastolic_bp ? parseInt(formData.diastolic_bp) : null,
      sugar_level: parseFloat(formData.sugar_level),
      protein_intake: parseFloat(formData.protein_intake),
      gestational_weeks: parseInt(formData.gestational_weeks || 12),
      body_temp: formData.body_temp ? parseFloat(formData.body_temp) : null,
      heart_rate: formData.heart_rate ? parseInt(formData.heart_rate) : null,
      doctor_notes: formData.doctor_notes
    };

    try {
      const res = await axiosClient.post('/assessments/evaluate/', payload);
      setResult(res.data);
      toast.success(`Risk Evaluation Computed: ${res.data.prediction}`);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Evaluation failed. Check input parameters.';
      toast.error(`Evaluation error: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setFormData({
      patient_id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      full_name: '',
      age: '26',
      bmi: '23.5',
      hemoglobin: '11.8',
      blood_pressure: '120',
      systolic_bp: '120',
      diastolic_bp: '80',
      sugar_level: '95',
      protein_intake: '65',
      gestational_weeks: '16',
      body_temp: '98.6',
      heart_rate: '76',
      doctor_notes: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">New Maternal Risk Assessment</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Enter clinical and nutritional telemetry to perform real-time machine learning inference.
          </p>
        </div>

        {/* Preset Clinical Templates */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Presets:</span>
          <button
            type="button"
            onClick={() => handlePresetSelect('healthy')}
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            Normal
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect('anemia')}
            className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
          >
            Anemia
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect('highrisk')}
            className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
          >
            High Risk
          </button>
        </div>
      </div>

      {/* Main Assessment Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Section 1: Patient Identity */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Patient Demographics</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Patient Identifier</label>
              <input
                type="text"
                required
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. Sarah Jenkins"
                className="mt-1 block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Gestational Age (weeks)</label>
              <input
                type="number"
                min="1"
                max="45"
                name="gestational_weeks"
                value={formData.gestational_weeks}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Core Maternal Vitals & Biomarkers */}
        <div className="border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <HeartPulse className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Clinical & Nutritional Biomarkers</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Age */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <span>Maternal Age (years)</span>
                <span className="text-[10px] text-slate-400">12 - 65 yrs</span>
              </div>
              <input
                type="number"
                required
                min="12"
                max="65"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* BMI */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <span>Body Mass Index (BMI)</span>
                <span className="text-[10px] text-slate-400">18.5 - 24.9</span>
              </div>
              <input
                type="number"
                step="0.1"
                required
                min="12.0"
                max="60.0"
                name="bmi"
                value={formData.bmi}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Hemoglobin */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <span>Hemoglobin (Hb g/dL)</span>
                <span className="text-[10px] text-slate-400">Target ≥ 11.0</span>
              </div>
              <input
                type="number"
                step="0.1"
                required
                min="4.0"
                max="20.0"
                name="hemoglobin"
                value={formData.hemoglobin}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-xl border px-3.5 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-1 ${
                  parseFloat(formData.hemoglobin) < 9.0 ? 'border-red-400 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
            </div>

            {/* Blood Pressure (Systolic) */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <span>Blood Pressure (Systolic mmHg)</span>
                <span className="text-[10px] text-slate-400">&lt; 120 mmHg</span>
              </div>
              <input
                type="number"
                required
                min="50"
                max="240"
                name="blood_pressure"
                value={formData.blood_pressure}
                onChange={(e) => {
                  handleChange(e);
                  setFormData(p => ({ ...p, systolic_bp: e.target.value }));
                }}
                className={`mt-1 block w-full rounded-xl border px-3.5 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-1 ${
                  parseInt(formData.blood_pressure) >= 140 ? 'border-red-400 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
            </div>

            {/* Blood Sugar */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <span>Blood Sugar (mg/dL)</span>
                <span className="text-[10px] text-slate-400">70 - 100 mg/dL</span>
              </div>
              <input
                type="number"
                step="0.1"
                required
                min="40.0"
                max="400.0"
                name="sugar_level"
                value={formData.sugar_level}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-xl border px-3.5 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-1 ${
                  parseFloat(formData.sugar_level) >= 126.0 ? 'border-red-400 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
            </div>

            {/* Protein Intake */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <span>Daily Protein Intake (g/day)</span>
                <span className="text-[10px] text-slate-400">Target 60-70g</span>
              </div>
              <input
                type="number"
                step="1"
                required
                min="0"
                max="200"
                name="protein_intake"
                value={formData.protein_intake}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-xl border px-3.5 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-1 ${
                  parseFloat(formData.protein_intake) < 40 ? 'border-amber-400 bg-amber-50/30 text-amber-900 focus:border-amber-500 focus:ring-amber-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Extended Vitals & Clinical Notes */}
        <div className="border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Extended Hemodynamic Monitoring & Notes</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Diastolic BP (mmHg)</label>
              <input
                type="number"
                min="40"
                max="150"
                name="diastolic_bp"
                value={formData.diastolic_bp}
                onChange={handleChange}
                placeholder="e.g. 80"
                className="mt-1 block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Heart Rate (bpm)</label>
              <input
                type="number"
                min="40"
                max="200"
                name="heart_rate"
                value={formData.heart_rate}
                onChange={handleChange}
                placeholder="e.g. 76"
                className="mt-1 block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Body Temperature (°F)</label>
              <input
                type="number"
                step="0.1"
                min="94.0"
                max="106.0"
                name="body_temp"
                value={formData.body_temp}
                onChange={handleChange}
                placeholder="e.g. 98.6"
                className="mt-1 block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700">Doctor / Clinician Clinical Notes</label>
            <textarea
              rows="2"
              name="doctor_notes"
              value={formData.doctor_notes}
              onChange={handleChange}
              placeholder="Add observation remarks, patient symptoms, or antenatal plan..."
              className="mt-1 block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Submit action */}
        <div className="border-t border-slate-100 pt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Clear Form
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Running ML Inference...</span>
              </span>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Run Machine Learning Risk Evaluation</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Result Modal */}
      {result && (
        <AssessmentResultModal
          result={result}
          onClose={() => setResult(null)}
          onNewAssessment={resetForm}
        />
      )}
    </div>
  );
}
