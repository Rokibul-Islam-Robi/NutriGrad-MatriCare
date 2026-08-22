import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Predictor from './pages/Predictor';
import NutritionPlan from './pages/NutritionPlan';
import MedicationTracker from './pages/MedicationTracker';
import PregnancyTracker from './pages/PregnancyTracker';
import DoctorConsultation from './pages/DoctorConsultation';
import PatientsList from './pages/PatientsList';
import Analytics from './pages/Analytics';
import AdminPortal from './pages/AdminPortal';
import DoctorPortal from './pages/DoctorPortal';

const ProtectedLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
          <p className="text-sm font-semibold text-slate-600">Initializing NutriGrad-MatriCare Portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'text-xs font-semibold text-slate-800 rounded-2xl shadow-lg border border-slate-100 p-3',
          duration: 3500,
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Navigate to="/predictor" replace />} />
            <Route path="/doctor-portal" element={<DoctorPortal />} />
            <Route path="/admin-portal" element={<AdminPortal />} />
            <Route path="/predictor" element={<Predictor />} />
            <Route path="/nutrition-plan" element={<NutritionPlan />} />
            <Route path="/medications" element={<MedicationTracker />} />
            <Route path="/tracker" element={<PregnancyTracker />} />
            <Route path="/consultation" element={<DoctorConsultation />} />
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
          <Route path="*" element={<Navigate to="/predictor" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
