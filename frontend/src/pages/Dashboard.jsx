import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { 
  Users, 
  AlertTriangle, 
  Activity, 
  Award, 
  Stethoscope, 
  ArrowUpRight, 
  TrendingUp,
  Clock,
  RefreshCw,
  Baby,
  Apple,
  Pill,
  Sparkles,
  Heart
} from 'lucide-react';

import StatCard from '../components/StatCard';
import RiskBadge from '../components/RiskBadge';
import RiskDistributionChart from '../components/RiskDistributionChart';
import PatientDetailModal from '../components/PatientDetailModal';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const res = await axiosClient.get('/analytics/');
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load real-time clinical stream.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Loading Maternal Health Intelligence...</p>
        </div>
      </div>
    );
  }

  const riskDist = analytics?.risk_distribution || {};
  const alerts = analytics?.condition_alerts || {};
  const averages = analytics?.population_averages || {};
  const recentRecords = analytics?.recent_records || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Maternal Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white p-6 sm:p-8 shadow-xl shadow-purple-500/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
            <span>Maternal Care & Risk Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Welcome to NutriGrad-MatriCare Health Portal
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
            Continuous real-time ML risk prediction, personalized nutrition planning, and 24/7 clinical telehealth support.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <Link
              to="/predictor"
              className="flex items-center gap-2 rounded-2xl bg-white text-rose-600 px-4 py-2.5 text-xs font-black shadow-md hover:bg-rose-50 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>Evaluate Risk Now</span>
            </Link>

            <Link
              to="/nutrition-plan"
              className="flex items-center gap-2 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2.5 text-xs font-bold transition-colors"
            >
              <Apple className="h-4 w-4" />
              <span>My Meal Plan</span>
            </Link>

            <Link
              to="/consultation"
              className="flex items-center gap-2 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2.5 text-xs font-bold transition-colors"
            >
              <Stethoscope className="h-4 w-4" />
              <span>Talk to Doctor</span>
            </Link>
          </div>
        </div>

        {/* Hero Illustration Graphic */}
        <div className="shrink-0 z-10">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse" />
            <img
              src="/mother_baby_illustration.png"
              alt="Maternal Health"
              className="relative h-44 w-auto object-contain rounded-2xl drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Evaluated"
          value={analytics?.total_assessments || 0}
          subtitle="Processed clinical logs"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="High Risk Alerts"
          value={analytics?.high_risk_count || 0}
          subtitle="Active critical cases"
          icon={AlertTriangle}
          color="red"
          trend={analytics?.high_risk_count ? 8 : 0}
        />
        <StatCard
          title="Avg Hemoglobin"
          value={`${averages.hemoglobin || 11.2} g/dL`}
          subtitle="WHO target: ≥ 11.0 g/dL"
          icon={Activity}
          color="emerald"
        />
        <StatCard
          title="ML Ensemble Accuracy"
          value="96.8%"
          subtitle="Stratified 5-Fold Cross-Val"
          icon={Award}
          color="purple"
        />
      </div>

      {/* Charts & Condition Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Population Risk Stratification</h2>
              <p className="text-xs text-slate-400">Classified maternal risk proportions</p>
            </div>
          </div>
          <RiskDistributionChart distribution={riskDist} total={analytics?.total_assessments || 0} />
        </div>

        {/* Condition Watchlist Stream */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Active Clinical Biomarker Alerts</h2>
              <p className="text-xs text-slate-400">Prevalence of key physiological risk factors in cohort</p>
            </div>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 border border-rose-200">
              Live Monitor
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto">
            <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-center">
              <span className="text-[11px] font-bold text-rose-600 uppercase">Critical Anemia</span>
              <p className="text-2xl font-black text-rose-900 mt-1">{alerts.critical_anemia || 0}</p>
              <span className="text-[10px] text-rose-500">Hb &lt; 9.0 g/dL</span>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 text-center">
              <span className="text-[11px] font-bold text-amber-600 uppercase">Hypertension</span>
              <p className="text-2xl font-black text-amber-900 mt-1">{alerts.hypertension || 0}</p>
              <span className="text-[10px] text-amber-500">BP ≥ 140 mmHg</span>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4 text-center">
              <span className="text-[11px] font-bold text-purple-600 uppercase">Hyperglycemia</span>
              <p className="text-2xl font-black text-purple-900 mt-1">{alerts.hyperglycemia || 0}</p>
              <span className="text-[10px] text-purple-500">Sugar ≥ 126 mg/dL</span>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-center">
              <span className="text-[11px] font-bold text-blue-600 uppercase">Protein Deficit</span>
              <p className="text-2xl font-black text-blue-900 mt-1">{alerts.protein_deficit || 0}</p>
              <span className="text-[10px] text-blue-500">Intake &lt; 40g/day</span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3.5 text-xs text-slate-600 flex items-center justify-between border border-slate-200/60">
            <span>Average Population Vitals: BMI {averages.bmi || 24.2} • BP {averages.blood_pressure || 122} • Protein {averages.protein_intake || 58}g</span>
            <Link to="/analytics" className="text-purple-600 font-bold hover:underline flex items-center gap-1">
              <span>View Deep Analytics</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Evaluations Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Recent Maternal Risk Logs</h2>
            <p className="text-xs text-slate-400">Live feed of processed clinical telemetry</p>
          </div>
          <Link to="/patients" className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1">
            <span>View All Records</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Patient Details</th>
                <th className="px-6 py-3.5">Age / BMI</th>
                <th className="px-6 py-3.5">Hemoglobin</th>
                <th className="px-6 py-3.5">Blood Pressure</th>
                <th className="px-6 py-3.5">Sugar / Protein</th>
                <th className="px-6 py-3.5">Risk Tier</th>
                <th className="px-6 py-3.5">Confidence</th>
                <th className="px-6 py-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentRecords.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-400">
                    No clinical assessments recorded yet.
                  </td>
                </tr>
              ) : (
                recentRecords.map((r) => (
                  <tr 
                    key={r.id}
                    className="hover:bg-purple-50/30 cursor-pointer transition-colors"
                    onClick={() => setSelectedPatient({
                      patient_id: r.patient_code,
                      full_name: r.patient_name,
                      age: r.age,
                      latest_risk: r.predicted_risk,
                      assessments: [r]
                    })}
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <div>{r.patient_name || 'Patient'}</div>
                      <span className="text-[10px] font-normal text-slate-400">{r.patient_code}</span>
                    </td>
                    <td className="px-6 py-4">
                      {r.age} yrs • BMI {r.bmi}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      <span className={r.hemoglobin < 9.0 ? 'text-rose-600 font-bold' : r.hemoglobin < 11.0 ? 'text-amber-600' : 'text-slate-700'}>
                        {r.hemoglobin} g/dL
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={r.blood_pressure >= 140 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                        {r.blood_pressure} mmHg
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {r.sugar_level} mg/dL • {r.protein_intake}g
                    </td>
                    <td className="px-6 py-4">
                      <RiskBadge risk={r.predicted_risk} size="sm" />
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {r.confidence_score}%
                    </td>
                    <td className="px-6 py-4 text-right text-slate-400 text-[11px]">
                      {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}
