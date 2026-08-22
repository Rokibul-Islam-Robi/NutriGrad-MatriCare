import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LogOut, Baby, Stethoscope, ShieldCheck, UserCheck } from 'lucide-react';
import NutriGradMatriCareLogo from './NutriGradMatriCareLogo';

export default function Navbar() {
  const { user, logout, role } = useAuth();

  const getRoleIcon = () => {
    switch (role) {
      case 'ADMIN':
        return <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />;
      case 'DOCTOR':
        return <Stethoscope className="h-3.5 w-3.5 text-indigo-600" />;
      default:
        return <Baby className="h-3.5 w-3.5 text-pink-600" />;
    }
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'DOCTOR':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-pink-50 text-pink-700 border-pink-200';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      <Link to="/predictor" className="flex items-center gap-3">
        <NutriGradMatriCareLogo size="md" />
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-extrabold tracking-tight text-[#0e384c]">NutriGrad</span>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#8b5cf6] bg-clip-text text-transparent">MatriCare</span>
            <span className="rounded-md bg-purple-100 px-1.5 py-0.2 text-[9px] font-bold text-purple-700 ml-1">v2.0 AI</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Maternal Health & Clinical Risk Platform</p>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="text-xs font-bold text-slate-800">{user.full_name || user.username}</p>
              <p className="text-[10px] text-slate-400 font-medium">Gestational Care Portal</p>
            </div>
            
            <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${getRoleBadge()}`}>
              {getRoleIcon()}
              <span>{role === 'CLINICIAN' ? 'Patient / Mother' : role}</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-xs cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
