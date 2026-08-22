import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  Lock, 
  User, 
  Baby, 
  Stethoscope, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Heart,
  CheckCircle2,
  Apple,
  ShieldAlert
} from 'lucide-react';
import NutriGradMatriCareLogo from '../components/NutriGradMatriCareLogo';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('patient_sarah');
  const [password, setPassword] = useState('MotherPass123!');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('CLINICIAN');
  const [department, setDepartment] = useState('Antenatal Care');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isRegister) {
      const res = await register({
        username,
        email,
        password,
        password_confirm: passwordConfirm,
        first_name: firstName,
        last_name: lastName,
        role,
        department
      });
      setLoading(false);
      if (res.success) {
        setIsRegister(false);
      }
    } else {
      const res = await login(username, password);
      setLoading(false);
      if (res.success) {
        if (username === 'admin_sys') {
          navigate('/admin-portal');
        } else if (username === 'dr_sarah') {
          navigate('/doctor-portal');
        } else {
          navigate('/predictor');
        }
      }
    }
  };

  const handleDemoFill = (demoRole) => {
    if (demoRole === 'PATIENT') {
      setUsername('patient_sarah');
      setPassword('MotherPass123!');
      setFirstName('Sarah');
      setLastName('Rahman');
      setRole('CLINICIAN');
    } else if (demoRole === 'DOCTOR') {
      setUsername('dr_sarah');
      setPassword('DoctorPass123!');
      setFirstName('Sarah');
      setLastName('Connor');
      setRole('DOCTOR');
    } else if (demoRole === 'ADMIN') {
      setUsername('admin_sys');
      setPassword('AdminPass123!');
      setFirstName('Chief');
      setLastName('Medical Officer');
      setRole('ADMIN');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navigation Header (Matching Uploaded Image) */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <NutriGradMatriCareLogo showText={true} size="md" />

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#overview" className="hover:text-rose-600 transition-colors">Overview</a>
          <a href="#features" className="hover:text-rose-600 transition-colors">Nutrition AI</a>
          <a href="#tracker" className="hover:text-rose-600 transition-colors">Fetal Tracker</a>
          <a href="#support" className="hover:text-rose-600 transition-colors">Telehealth & Support</a>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRegister(false)}
            className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-colors ${
              !isRegister ? 'text-slate-900 bg-slate-100' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Log in
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className="rounded-xl bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#9333ea] px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-200 hover:opacity-95 transition-opacity"
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Main Hero & Auth Section (2-Column Layout matching screenshot) */}
      <main className="flex-1 flex items-center max-w-7xl mx-auto px-6 py-6 lg:py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full">
          
          {/* Left Column: Headline, Description & Modern Clean Auth Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5 text-rose-500" />
                <span>AI Clinical Nutrition & Risk Intelligence</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                Empowering <span className="bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#8b5cf6] bg-clip-text text-transparent">Every Mother</span> On Her Pregnancy Journey
              </h1>

              <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed max-w-xl">
                Advanced machine learning evaluates vital physiological parameters, predicts nutritional risks, and delivers personalized dietary guidance for you and your baby.
              </p>
            </div>

            {/* Auth Card (Clean White with Soft Violet Glow) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl shadow-purple-500/5 space-y-5">
              <div className="flex border-b border-slate-100 pb-3">
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className={`flex-1 text-center pb-2 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                    !isRegister ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Sign In to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className={`flex-1 text-center pb-2 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                    isRegister ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Create New Account
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {isRegister && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700">First Name</label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="mt-1 block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700">Last Name</label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="mt-1 block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Username / Mother ID</label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full rounded-2xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      placeholder="e.g. patient_sarah or dr_sarah"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-2xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {isRegister && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      className="mt-1 block w-full rounded-2xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      placeholder="••••••••"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#9333ea] py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-200 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>{isRegister ? 'Register Account' : 'Access Maternal Dashboard'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Demo Credentials */}
              {!isRegister && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2.5">
                    1-Click Demo Login Selector
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleDemoFill('PATIENT')}
                      className={`flex flex-col items-center p-2 rounded-2xl border transition-all ${
                        username === 'patient_sarah'
                          ? 'bg-rose-50/90 border-rose-400 text-rose-900 shadow-xs'
                          : 'border-slate-200 hover:bg-rose-50/40 text-slate-700'
                      }`}
                    >
                      <Baby className="h-4 w-4 text-rose-500 mb-0.5" />
                      <span className="text-[11px] font-bold">Mother</span>
                      <span className="text-[9px] text-slate-400">Sarah Rahman</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDemoFill('DOCTOR')}
                      className={`flex flex-col items-center p-2 rounded-2xl border transition-all ${
                        username === 'dr_sarah'
                          ? 'bg-purple-50/90 border-purple-400 text-purple-900 shadow-xs'
                          : 'border-slate-200 hover:bg-purple-50/40 text-slate-700'
                      }`}
                    >
                      <Stethoscope className="h-4 w-4 text-purple-600 mb-0.5" />
                      <span className="text-[11px] font-bold">Doctor</span>
                      <span className="text-[9px] text-slate-400">Dr. Sarah</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDemoFill('ADMIN')}
                      className={`flex flex-col items-center p-2 rounded-2xl border transition-all ${
                        username === 'admin_sys'
                          ? 'bg-indigo-50/90 border-indigo-400 text-indigo-900 shadow-xs'
                          : 'border-slate-200 hover:bg-indigo-50/40 text-slate-700'
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4 text-indigo-600 mb-0.5" />
                      <span className="text-[11px] font-bold">Admin</span>
                      <span className="text-[9px] text-slate-400">Chief Officer</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Mother & Baby Vector Illustration with Floating Animated Hearts (Matching Screenshot) */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            
            {/* Animated Floating Ambient Glow Circles */}
            <div className="absolute h-72 w-72 rounded-full bg-pink-100/60 blur-3xl animate-pulse-glow" />
            <div className="absolute h-64 w-64 rounded-full bg-purple-100/60 blur-3xl -bottom-10 -right-10 animate-pulse-glow" />

            {/* Floating Animated Hearts & Symbols */}
            {/* Heart 1 (Top Left) */}
            <div className="absolute top-4 left-6 z-20 animate-float-slow">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-lg border border-pink-100 text-pink-500">
                <Heart className="h-5 w-5 fill-pink-500 text-pink-500" />
              </div>
            </div>

            {/* Heart 2 (Top Right) */}
            <div className="absolute top-12 right-6 z-20 animate-float-fast">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-lg border border-purple-100 text-purple-500">
                <Heart className="h-6 w-6 fill-purple-500 text-purple-500" />
              </div>
            </div>

            {/* Star Accent (Bottom Left) */}
            <div className="absolute bottom-16 left-4 z-20 animate-float-fast">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white shadow-lg border border-amber-100 text-amber-500">
                <Sparkles className="h-4 w-4 fill-amber-400 text-amber-500" />
              </div>
            </div>

            {/* Floating Badge 1: AI Nutrition Accuracy */}
            <div className="absolute bottom-6 right-6 z-20 animate-float-slow">
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-purple-100 text-xs">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">96.8% Precision</p>
                  <p className="text-[10px] text-slate-400">Stratified ML Pipeline</p>
                </div>
              </div>
            </div>

            {/* Main Vector Art Image (Mother breastfeeding / holding baby surrounded by foliage) */}
            <div className="relative z-10 p-2 max-w-[480px] w-full">
              <img
                src="/mother_baby_illustration.png"
                alt="Mother lovingly holding newborn baby surrounded by green foliage"
                className="w-full h-auto object-contain drop-shadow-xl rounded-3xl hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </main>

      {/* Footer subtle attribution */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-400 border-t border-slate-100">
        <span>NutriGrad-MatriCare Maternal Healthcare AI Platform • Secure HIPAA & RBAC Compliant</span>
      </footer>
    </div>
  );
}
