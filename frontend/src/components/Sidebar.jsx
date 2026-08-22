import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Sparkles, 
  Apple, 
  Pill, 
  Baby, 
  Stethoscope, 
  Users, 
  BarChart3, 
  ShieldCheck,
  ShieldAlert,
  Cpu,
  FileText,
  Settings,
  Activity,
  Video
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, isAdmin, isDoctor } = useAuth();
  const currentRole = user?.role;

  // 1. ADMIN EXCLUSIVE NAVIGATION
  if (isAdmin) {
    const adminNavItems = [
      { to: '/admin-portal', label: 'Admin Console & Ops', icon: ShieldCheck, badge: 'Root' },
      { to: '/analytics', label: 'Population Health Analytics', icon: BarChart3 },
      { to: '/patients', label: 'Hospital Patient Registry', icon: Users },
    ];

    return (
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
        <div className="space-y-6">
          <div>
            <div className="px-3 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600">Admin Control Suite</span>
              <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
            </div>
            <nav className="mt-2 space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'text-slate-600 hover:bg-purple-50/70 hover:text-purple-900'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-full bg-purple-100 text-purple-800 px-2 py-0.5 text-[9px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Cluster Status</span>
            <div className="flex justify-between text-slate-600">
              <span>ML Engine:</span>
              <span className="font-bold text-emerald-600">Port 8001 [OK]</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>API Gateway:</span>
              <span className="font-bold text-emerald-600">Port 8000 [OK]</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-purple-50 p-4 border border-purple-200/80 text-purple-900 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-xs">
            <ShieldCheck className="h-4 w-4 text-purple-600" />
            <span>Root Administrator</span>
          </div>
          <p className="mt-1 text-[10px] text-purple-700 leading-snug">
            Authorized to manage hospital RBAC and deploy ML pipelines.
          </p>
        </div>
      </aside>
    );
  }

  // 2. DOCTOR NAVIGATION
  if (currentRole === 'DOCTOR') {
    const doctorNavItems = [
      { to: '/doctor-portal', label: 'Doctor Clinical Console', icon: Stethoscope, badge: 'MFM' },
      { to: '/predictor', label: 'Clinical Risk Evaluator', icon: Sparkles, badge: 'Live AI' },
      { to: '/patients', label: 'Patient Registry & Records', icon: Users },
      { to: '/analytics', label: 'Cohort Risk Analytics', icon: BarChart3 },
      { to: '/nutrition-plan', label: 'Diet Prescriptions', icon: Apple },
      { to: '/consultation', label: 'Telehealth Consultations', icon: Video },
    ];

    return (
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
        <div className="space-y-6">
          <div>
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">Obstetrician Clinical Suite</p>
            <nav className="mt-2 space-y-1">
              {doctorNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200'
                          : 'text-slate-600 hover:bg-indigo-50/70 hover:text-indigo-900'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="rounded-2xl bg-indigo-50 p-4 border border-indigo-200/80 text-indigo-900 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-xs">
            <Stethoscope className="h-4 w-4 text-indigo-600" />
            <span>Doctor Privilege</span>
          </div>
          <p className="mt-1 text-[10px] text-indigo-700 leading-snug">
            Authorized to issue diagnostic reports and evaluate maternal telemetry.
          </p>
        </div>
      </aside>
    );
  }

  // 3. PATIENT / MOTHER NAVIGATION
  const patientNavItems = [
    { to: '/predictor', label: 'ML Risk Predictor', icon: Sparkles, badge: 'Live AI' },
    { to: '/nutrition-plan', label: 'Meal & Nutrition Plan', icon: Apple },
    { to: '/medications', label: 'Medications & Supplements', icon: Pill },
    { to: '/tracker', label: 'Fetal Growth Tracker', icon: Baby },
    { to: '/consultation', label: 'Doctor & Telehealth', icon: Stethoscope, badge: '24/7' },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-rose-500">Maternal Patient Care</p>
          <nav className="mt-2 space-y-1">
            {patientNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#9333ea] text-white shadow-md shadow-rose-200'
                        : 'text-slate-600 hover:bg-rose-50/70 hover:text-rose-700'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-100/60 p-4 border border-rose-200/80 text-rose-900 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-xs">
          <ShieldAlert className="h-4 w-4 text-rose-600" />
          <span>Emergency Helpline</span>
        </div>
        <p className="mt-1 text-[11px] text-rose-800 leading-snug">
          24/7 Maternal SOS Hotline is available in the Doctor Support tab.
        </p>
      </div>
    </aside>
  );
}
