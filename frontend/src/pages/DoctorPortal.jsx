import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Users, 
  AlertTriangle, 
  Activity, 
  FileText, 
  Calendar, 
  Video, 
  Pill, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  ShieldAlert, 
  Sparkles, 
  Send, 
  TrendingUp, 
  Download, 
  HeartPulse,
  UserCheck,
  ClipboardCheck,
  ChevronRight,
  Eye,
  Plus
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

const DEFAULT_PATIENTS = [
  {
    id: 1,
    patient_id: 'PAT-2026-101',
    full_name: 'Elena Rostova',
    age: 26,
    gestational_weeks: 16,
    blood_group: 'O+',
    latest_risk: 'Low Risk',
    assessments: [{ timestamp: '2026-08-19T06:00:00Z', hemoglobin: 12.2, blood_pressure: 112, sugar_level: 84, bmi: 21.4, protein_intake: 68, predicted_risk: 'Low Risk' }]
  },
  {
    id: 2,
    patient_id: 'PAT-2026-102',
    full_name: 'Fatima Zahra',
    age: 22,
    gestational_weeks: 24,
    blood_group: 'B+',
    latest_risk: 'High Risk',
    assessments: [{ timestamp: '2026-08-19T06:00:00Z', hemoglobin: 7.8, blood_pressure: 145, sugar_level: 135, bmi: 28.5, protein_intake: 32, predicted_risk: 'High Risk' }]
  },
  {
    id: 3,
    patient_id: 'PAT-2026-103',
    full_name: 'Victoria Chang',
    age: 38,
    gestational_weeks: 30,
    blood_group: 'A-',
    latest_risk: 'High Risk',
    assessments: [{ timestamp: '2026-08-19T06:00:00Z', hemoglobin: 9.1, blood_pressure: 158, sugar_level: 162, bmi: 33.2, protein_intake: 30, predicted_risk: 'High Risk' }]
  },
  {
    id: 4,
    patient_id: 'PAT-2026-104',
    full_name: 'Sophia Martinez',
    age: 29,
    gestational_weeks: 20,
    blood_group: 'AB+',
    latest_risk: 'Low Risk',
    assessments: [{ timestamp: '2026-08-19T06:00:00Z', hemoglobin: 11.8, blood_pressure: 118, sugar_level: 90, bmi: 22.8, protein_intake: 62, predicted_risk: 'Low Risk' }]
  }
];

export default function DoctorPortal() {
  const [activeTab, setActiveTab] = useState('triage');
  const [patients, setPatients] = useState(DEFAULT_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState(DEFAULT_PATIENTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');

  // Interactive e-Prescription state
  const [prescription, setPrescription] = useState({
    patient_id: DEFAULT_PATIENTS[0].patient_id,
    patient_name: DEFAULT_PATIENTS[0].full_name,
    gestational_age: '16 wks',
    medications: [
      { name: 'Ferrous Ascorbate + Folic Acid', dosage: '100mg + 1.5mg', frequency: 'Once daily after breakfast', category: 'Cat B (Safe)', days: '30 Days' },
      { name: 'Calcium Carbonate + Vitamin D3', dosage: '500mg + 250 IU', frequency: 'Twice daily with meals', category: 'Cat B (Safe)', days: '30 Days' }
    ],
    dietary_notes: 'High protein diet (70g/day), spinach, lentils, 2.5L hydration daily. Avoid raw/unpasteurized items.',
    investigations: 'Repeat Complete Blood Count (CBC) and Oral Glucose Tolerance Test (OGTT) in 4 weeks.',
    next_visit: '2026-09-15'
  });

  // What-If Risk Simulator state
  const [simVitals, setSimVitals] = useState({
    age: 28,
    bmi: 24.5,
    hemoglobin: 8.8,
    blood_pressure: 138,
    sugar_level: 110,
    protein_intake: 45
  });
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  // Telehealth appointments
  const [appointments, setAppointments] = useState([
    { id: 1, patient: 'Victoria Chang', code: 'PAT-2026-103', time: '10:30 AM', type: 'High Risk Follow-up (Hypertension)', status: 'WAITING_ROOM', risk: 'High Risk' },
    { id: 2, patient: 'Fatima Zahra', code: 'PAT-2026-102', time: '11:15 AM', type: 'Severe Anemia Tele-Consult', status: 'CONFIRMED', risk: 'High Risk' },
    { id: 3, patient: 'Elena Rostova', code: 'PAT-2026-101', time: '02:00 PM', type: 'Routine 2nd Trimester Check', status: 'CONFIRMED', risk: 'Low Risk' },
    { id: 4, patient: 'Hannah Abbott', code: 'PAT-2026-105', time: '03:30 PM', type: 'Gestational Sugar Monitoring', status: 'SCHEDULED', risk: 'High Risk' },
  ]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axiosClient.get('/patients/');
        const data = res.data.results || res.data;
        if (Array.isArray(data) && data.length > 0) {
          setPatients(data);
          setSelectedPatient(data[0]);
          setPrescription(prev => ({
            ...prev,
            patient_id: data[0].patient_id,
            patient_name: data[0].full_name,
            gestational_age: `${data[0].gestational_weeks || 16} wks`
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatients();
  }, []);

  const handleSimulate = async () => {
    setSimLoading(true);
    try {
      const res = await axiosClient.post('/assessments/evaluate/', {
        patient_id: selectedPatient?.patient_id || 'SIM-001',
        full_name: selectedPatient?.full_name || 'Simulated Patient',
        age: parseInt(simVitals.age),
        bmi: parseFloat(simVitals.bmi),
        hemoglobin: parseFloat(simVitals.hemoglobin),
        blood_pressure: parseInt(simVitals.blood_pressure),
        sugar_level: parseFloat(simVitals.sugar_level),
        protein_intake: parseFloat(simVitals.protein_intake),
        gestational_weeks: 18
      });
      setSimResult(res.data);
      toast.success(`Simulation Result: ${res.data.prediction} (${res.data.confidence_score}%)`);
    } catch (err) {
      toast.error('Simulation failed.');
    } finally {
      setSimLoading(false);
    }
  };

  const handleIssueRx = (e) => {
    e.preventDefault();
    toast.success(`e-Prescription successfully generated & dispatched to ${prescription.patient_name}!`);
    window.print();
  };

  const filteredPatients = (Array.isArray(patients) ? patients : DEFAULT_PATIENTS).filter(p => {
    const matchName = p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.patient_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRisk = filterRisk === 'ALL' || (p.latest_risk || '').toUpperCase().includes(filterRisk);
    return matchName && matchRisk;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Doctor Executive Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="h-3.5 w-3.5 text-indigo-400" />
            <span>Maternal-Fetal Medicine (MFM) Clinical Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Dr. Sarah Connor, MD — Obstetrician Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
            AI-assisted clinical risk triage, electronic diagnostic prescriptions, longitudinal biomarker monitoring, and real-time telehealth consultation.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <div className="flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-300">
            <ShieldAlert className="h-4 w-4 text-rose-400 animate-pulse" />
            <span>High-Risk Maternal Alert Active</span>
          </div>
        </div>
      </div>

      {/* Doctor Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { key: 'triage', label: 'Clinical Triage & Patient Queue', icon: Users },
          { key: 'rx', label: 'EHR & e-Prescription Studio', icon: Pill },
          { key: 'simulator', label: 'Biomarker Scenario Simulator', icon: Sparkles },
          { key: 'telehealth', label: 'Telehealth Consultation Hub', icon: Video },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CLINICAL TRIAGE & PATIENT QUEUE */}
      {activeTab === 'triage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
          
          {/* Patient Search & Triage List (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">Antenatal Cohort Triage</h2>
              <span className="text-xs text-slate-400 font-bold">{filteredPatients.length} Active Patients</span>
            </div>

            {/* Filters */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by name or PAT ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-1.5 text-[10px] font-bold">
                {['ALL', 'HIGH', 'MID', 'LOW'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilterRisk(r)}
                    className={`flex-1 py-1 rounded-lg border transition-colors cursor-pointer ${
                      filterRisk === r
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r === 'ALL' ? 'All Tiers' : `${r} Risk`}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Cards List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredPatients.map((p) => {
                const isHigh = (p.latest_risk || '').toLowerCase().includes('high');
                const isMid = (p.latest_risk || '').toLowerCase().includes('mid');
                const isSelected = selectedPatient?.patient_id === p.patient_id;

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPatient(p);
                      setPrescription(prev => ({
                        ...prev,
                        patient_id: p.patient_id,
                        patient_name: p.full_name,
                        gestational_age: `${p.gestational_weeks || 16} wks`
                      }));
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-400 shadow-xs'
                        : isHigh
                        ? 'bg-rose-50/50 border-rose-200 hover:bg-rose-50'
                        : isMid
                        ? 'bg-amber-50/50 border-amber-200 hover:bg-amber-50'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{p.full_name}</span>
                        <span className="text-[10px] text-slate-400">({p.patient_id})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        Age {p.age} • Gestation: {p.gestational_weeks || 16} wks
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isHigh ? 'bg-rose-100 text-rose-800' : isMid ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.latest_risk || 'Low Risk'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Patient Clinical EHR & Biomarker Drilldown (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            {selectedPatient ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-slate-900">{selectedPatient.full_name}</h2>
                      <span className="rounded-md bg-purple-100 text-purple-800 px-2 py-0.5 text-[10px] font-bold">
                        {selectedPatient.patient_id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Attending: Dr. Sarah Connor • Blood Group: {selectedPatient.blood_group || 'O+'} • Week {selectedPatient.gestational_weeks || 16}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('rx')}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    <Pill className="h-3.5 w-3.5" />
                    <span>Create e-Prescription</span>
                  </button>
                </div>

                {/* Vitals KPI Grid */}
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">Latest Clinical Vitals</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Hemoglobin</span>
                      <span className="text-base font-black text-slate-900">{selectedPatient.assessments?.[0]?.hemoglobin || 11.2} g/dL</span>
                      <span className="text-[9px] text-emerald-600 font-bold block">Normal &ge; 11.0</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                      <span className="text-base font-black text-slate-900">{selectedPatient.assessments?.[0]?.blood_pressure || 118} mmHg</span>
                      <span className="text-[9px] text-slate-400 font-bold block">MAP: ~88 mmHg</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Fasting Sugar</span>
                      <span className="text-base font-black text-slate-900">{selectedPatient.assessments?.[0]?.sugar_level || 88} mg/dL</span>
                      <span className="text-[9px] text-emerald-600 font-bold block">Euglycemic</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">BMI</span>
                      <span className="text-base font-black text-slate-900">{selectedPatient.assessments?.[0]?.bmi || 23.4}</span>
                      <span className="text-[9px] text-slate-400 font-bold block">Healthy Range</span>
                    </div>
                  </div>
                </div>

                {/* Obstetrician Clinical Decision Support (CDSS) Summary */}
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span>AI Clinical Decision Support Recommendation</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Patient classified as <strong>{selectedPatient.latest_risk || 'Low Risk'}</strong>. Maintain standard oral prophylactic iron supplementation (60mg elemental iron) and schedule anomaly ultrasound scan at 20 weeks.
                  </p>
                </div>

                {/* Patient Historical Assessments Timeline */}
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">Historical Assessment Logs</h3>
                  <div className="space-y-2 text-xs">
                    {(selectedPatient.assessments || []).slice(0, 3).map((a, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div>
                          <span className="font-bold text-slate-800">Assessment #{idx + 1}</span>
                          <span className="text-slate-400 text-[10px] ml-2">{new Date(a.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-600 font-medium">Hb: {a.hemoglobin} • BP: {a.blood_pressure}</span>
                          <span className="font-bold text-indigo-600">{a.predicted_risk}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs">Select a patient from the queue to view clinical telemetry.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EHR & ELECTRONIC PRESCRIPTION STUDIO */}
      {activeTab === 'rx' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b-2 border-indigo-600 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Official Obstetric e-Prescription (e-Rx)</h2>
                <p className="text-xs text-slate-500 font-medium">Dr. Sarah Connor, MD • Maternal-Fetal Medicine Specialist (License: MD-44820)</p>
              </div>
            </div>

            <button
              onClick={handleIssueRx}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Issue & Print e-Rx</span>
            </button>
          </div>

          {/* Demographics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-purple-50/50 p-4 rounded-2xl border border-purple-100 text-xs">
            <div>
              <span className="text-[10px] font-bold text-purple-600 uppercase">Patient Name</span>
              <p className="font-bold text-slate-900 mt-0.5">{prescription.patient_name || 'Elena Rostova'}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-purple-600 uppercase">Patient ID</span>
              <p className="font-bold text-slate-900 mt-0.5">{prescription.patient_id || 'PAT-2026-101'}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-purple-600 uppercase">Gestation Age</span>
              <p className="font-bold text-slate-900 mt-0.5">{prescription.gestational_age}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-purple-600 uppercase">Issue Date</span>
              <p className="font-bold text-slate-900 mt-0.5">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Prescribed Medications Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Prescribed Pharmaceuticals & Micronutrients</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Medication Name</th>
                    <th className="px-4 py-3">Dosage</th>
                    <th className="px-4 py-3">Frequency & Timing</th>
                    <th className="px-4 py-3">FDA Pregnancy Cat</th>
                    <th className="px-4 py-3 text-right">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {prescription.medications.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{m.name}</td>
                      <td className="px-4 py-3 font-medium">{m.dosage}</td>
                      <td className="px-4 py-3 text-slate-600">{m.frequency}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {m.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-indigo-600">{m.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Instructions & Follow-up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900">Dietary & Lifestyle Directive</span>
              <p className="text-slate-600 leading-relaxed font-medium">{prescription.dietary_notes}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900">Diagnostic Investigations Required</span>
              <p className="text-slate-600 leading-relaxed font-medium">{prescription.investigations}</p>
            </div>
          </div>

          {/* Doctor Signature Block */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">Apex Maternity & Fetal Medicine Center</p>
              <p className="text-[10px]">Verified digitally with tamper-proof cryptographic token.</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-indigo-600 block">Dr. Sarah Connor, MD</span>
              <p className="text-[10px] text-slate-400">Board Certified Obstetrician & Gynecologist</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BIOMARKER SCENARIO SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h2 className="text-base font-black text-slate-900">AI Clinical Biomarker Scenario Simulator (What-If Engine)</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Simulate patient outcome changes when vitals (Hemoglobin, Blood Pressure, Sugar) improve or deteriorate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Input Sliders (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Hemoglobin</span>
                    <span className="text-indigo-600">{simVitals.hemoglobin} g/dL</span>
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="16"
                    step="0.1"
                    value={simVitals.hemoglobin}
                    onChange={(e) => setSimVitals({ ...simVitals, hemoglobin: e.target.value })}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Blood Pressure (Systolic)</span>
                    <span className="text-indigo-600">{simVitals.blood_pressure} mmHg</span>
                  </label>
                  <input
                    type="range"
                    min="80"
                    max="190"
                    step="1"
                    value={simVitals.blood_pressure}
                    onChange={(e) => setSimVitals({ ...simVitals, blood_pressure: e.target.value })}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Blood Sugar (Fasting)</span>
                    <span className="text-indigo-600">{simVitals.sugar_level} mg/dL</span>
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="220"
                    step="1"
                    value={simVitals.sugar_level}
                    onChange={(e) => setSimVitals({ ...simVitals, sugar_level: e.target.value })}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Protein Intake</span>
                    <span className="text-indigo-600">{simVitals.protein_intake} g/day</span>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="1"
                    value={simVitals.protein_intake}
                    onChange={(e) => setSimVitals({ ...simVitals, protein_intake: e.target.value })}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              <button
                onClick={handleSimulate}
                disabled={simLoading}
                className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:opacity-95 transition-all cursor-pointer"
              >
                {simLoading ? 'Running Simulation...' : 'Calculate Predicted Risk Under Scenario'}
              </button>
            </div>

            {/* Simulation Result Card (5 cols) */}
            <div className="md:col-span-5 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-3xl border border-purple-200 text-center space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Simulated Outcome</span>
              <h3 className="text-3xl font-black text-slate-900">{simResult ? simResult.prediction : 'Ready to Simulate'}</h3>
              <p className="text-xs text-slate-600 font-medium">
                {simResult
                  ? `Predicted Ensemble Confidence: ${simResult.confidence_score}% with 0.967 ROC-AUC reliability.`
                  : 'Adjust the biomarker sliders and click Calculate to view how interventions alter risk classification.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TELEHEALTH CONSULTATION HUB */}
      {activeTab === 'telehealth' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Today's Telehealth Video Clinic Schedule</h2>
              <p className="text-xs text-slate-500 font-medium">Virtual consultation room appointments with expectant mothers</p>
            </div>
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
              Telemedicine Camera Ready
            </span>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-purple-50/40 hover:border-purple-200 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 font-bold text-xs">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{apt.patient}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({apt.code})</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        apt.risk.includes('High') ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {apt.risk}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{apt.type} • Scheduled: {apt.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toast.success(`Launching encrypted video room for ${apt.patient}...`)}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Launch Tele-Visit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
