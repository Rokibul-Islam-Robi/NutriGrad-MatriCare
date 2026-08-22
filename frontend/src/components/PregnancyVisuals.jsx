import React from 'react';
import { Heart, Sparkles, AlertTriangle, ShieldAlert, CheckCircle2, Stethoscope, Apple, Baby } from 'lucide-react';

export function PregnancyIllustration({ risk = 'idle' }) {
  const riskType = (risk || 'idle').toLowerCase();

  if (riskType.includes('low')) {
    return (
      <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-gradient-to-b from-emerald-50/80 to-emerald-100/40 border border-emerald-200/80 text-center shadow-sm">
        <div className="relative mb-3 flex items-center justify-center">
          {/* Circular glow */}
          <div className="absolute h-36 w-36 rounded-full bg-emerald-200/50 blur-xl animate-pulse" />
          
          <svg className="relative h-44 w-44" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background nature/leaf accents */}
            <circle cx="100" cy="100" r="85" fill="#E6F4EA" />
            <path d="M45 130 C30 90 70 60 90 75 C100 85 80 120 45 130 Z" fill="#34A853" opacity="0.3" />
            <path d="M155 130 C170 90 130 60 110 75 C100 85 120 120 155 130 Z" fill="#34A853" opacity="0.3" />

            {/* Mother Figure */}
            {/* Hair */}
            <path d="M85 50 C85 30 115 30 115 50 C125 55 125 75 115 80 C110 70 90 70 85 80 C75 75 75 55 85 50 Z" fill="#4A3B32" />
            {/* Head & Neck */}
            <circle cx="100" cy="58" r="16" fill="#FBD8C5" />
            {/* Soft smiling face */}
            <path d="M96 61 Q100 66 104 61" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="94" cy="55" r="1.5" fill="#4A3B32" />
            <circle cx="106" cy="55" r="1.5" fill="#4A3B32" />
            <circle cx="92" cy="59" r="2.5" fill="#F87171" opacity="0.4" />
            <circle cx="108" cy="59" r="2.5" fill="#F87171" opacity="0.4" />

            {/* Floral hair accessory */}
            <circle cx="86" cy="48" r="4" fill="#34D399" />
            <circle cx="86" cy="48" r="1.5" fill="#FDE047" />

            {/* Torso & Maternity Dress (Green patterned) */}
            <path d="M90 76 L82 110 C80 135 78 170 100 170 C122 170 120 135 118 110 L110 76 Z" fill="#10B981" />
            {/* Pregnant Belly Glow / Shape */}
            <path d="M86 100 C80 120 90 148 110 148 C124 148 126 125 114 100 Z" fill="#059669" opacity="0.3" />
            <circle cx="100" cy="124" r="22" fill="#34D399" opacity="0.25" />

            {/* Loving Hands on Belly */}
            <path d="M78 95 Q86 118 96 128" stroke="#FBD8C5" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M122 95 Q114 118 104 128" stroke="#FBD8C5" strokeWidth="5.5" strokeLinecap="round" />

            {/* Tiny Heart on baby bump */}
            <path d="M100 122 C100 119 96 116 93 118 C89 121 91 126 100 132 C109 126 111 121 107 118 C104 116 100 119 100 122 Z" fill="#EF4444" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-1 shadow-xs">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>Healthy Pregnancy • Low Risk</span>
        </div>
        <p className="text-xs text-emerald-700 font-medium max-w-[200px]">
          Maternal biomarkers & nutrition parameters are within optimal ranges!
        </p>
      </div>
    );
  }

  if (riskType.includes('mid') || riskType.includes('medium')) {
    return (
      <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-gradient-to-b from-amber-50/90 to-amber-100/50 border border-amber-200 text-center shadow-sm">
        <div className="relative mb-3 flex items-center justify-center">
          <div className="absolute h-36 w-36 rounded-full bg-amber-200/50 blur-xl animate-pulse" />
          
          <svg className="relative h-44 w-44" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="85" fill="#FEF3C7" />
            
            {/* Comfortable armchair / sitting setting */}
            <path d="M50 145 C50 125 60 115 70 115 L130 115 C140 115 150 125 150 145 L150 165 L50 165 Z" fill="#FDE68A" opacity="0.6" />

            {/* Mother Figure sitting with thoughtful expression */}
            <path d="M85 50 C85 30 115 30 115 50 C125 55 125 75 115 80 C110 70 90 70 85 80 C75 75 75 55 85 50 Z" fill="#6B4F3A" />
            <circle cx="100" cy="58" r="16" fill="#FBD8C5" />
            {/* Concerned / resting face */}
            <path d="M96 64 Q100 62 104 64" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="94" cy="55" r="1.5" fill="#4A3B32" />
            <circle cx="106" cy="55" r="1.5" fill="#4A3B32" />

            {/* Mustard / Amber Maternity Dress */}
            <path d="M88 76 L80 110 C78 135 80 165 100 165 C120 165 122 135 120 110 L112 76 Z" fill="#D97706" />
            <circle cx="100" cy="120" r="22" fill="#F59E0B" opacity="0.3" />

            {/* Gentle Hand supporting back / belly */}
            <path d="M78 95 Q88 115 98 125" stroke="#FBD8C5" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M122 95 Q115 105 112 120" stroke="#FBD8C5" strokeWidth="5.5" strokeLinecap="round" />

            {/* Warning Shield Badge */}
            <circle cx="145" cy="55" r="14" fill="#F59E0B" />
            <path d="M145 47 L145 56 M145 61 L145 62" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-1 shadow-xs">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
          <span>Medium Risk • Dietary Care</span>
        </div>
        <p className="text-xs text-amber-700 font-medium max-w-[200px]">
          Mild nutritional deficit or borderline vitals detected. Adjustment suggested.
        </p>
      </div>
    );
  }

  if (riskType.includes('high')) {
    return (
      <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-gradient-to-b from-rose-50 to-red-100/50 border border-red-200 text-center shadow-sm">
        <div className="relative mb-3 flex items-center justify-center">
          <div className="absolute h-36 w-36 rounded-full bg-red-200/60 blur-xl animate-pulse" />
          
          <svg className="relative h-44 w-44" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="85" fill="#FFE4E6" />

            {/* Clinic / Medical Room setting */}
            <rect x="40" y="110" width="120" height="55" rx="10" fill="#FECDD3" opacity="0.6" />

            {/* Mother + Doctor silhouette */}
            {/* Mother */}
            <circle cx="80" cy="62" r="14" fill="#FBD8C5" />
            <path d="M68 56 C68 40 92 40 92 56 C98 60 96 74 90 78 C86 70 74 70 70 78 Z" fill="#3B2E2A" />
            <path d="M72 78 L66 115 C66 135 70 155 85 155 C98 155 100 135 96 115 L90 78 Z" fill="#E11D48" />
            <circle cx="84" cy="115" r="18" fill="#FB7185" opacity="0.4" />

            {/* Doctor with stethoscope */}
            <circle cx="130" cy="58" r="13" fill="#FCD34D" />
            <path d="M120 54 C120 40 140 40 140 54 C144 58 142 70 138 72 Z" fill="#1E293B" />
            <path d="M118 74 L114 110 L146 110 L142 74 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <path d="M125 78 C125 88 135 88 135 78" stroke="#3B82F6" strokeWidth="2" fill="none" />

            {/* Alert Cross Icon */}
            <circle cx="155" cy="45" r="13" fill="#EF4444" />
            <path d="M150 45 L160 45 M155 40 L155 50" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-bold uppercase tracking-wider mb-1 shadow-xs">
          <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
          <span>High Risk • Clinical Review</span>
        </div>
        <p className="text-xs text-red-700 font-medium max-w-[200px]">
          Critical indicators found. Obstetrician consultation is strongly advised.
        </p>
      </div>
    );
  }

  // Default / Idle state
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-gradient-to-b from-purple-50/80 to-rose-50/60 border border-purple-100 text-center shadow-sm">
      <div className="relative mb-3 flex items-center justify-center">
        <div className="absolute h-36 w-36 rounded-full bg-purple-100 blur-xl" />
        
        <svg className="relative h-44 w-44" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" fill="#F3E8FF" />
          
          {/* Gentle background clouds/sparkles */}
          <circle cx="55" cy="60" r="8" fill="#E9D5FF" opacity="0.7" />
          <circle cx="145" cy="70" r="10" fill="#FCE7F3" opacity="0.8" />
          
          {/* Mother Figure with flowers */}
          <path d="M85 50 C85 30 115 30 115 50 C125 55 125 75 115 80 C110 70 90 70 85 80 C75 75 75 55 85 50 Z" fill="#382D28" />
          <circle cx="100" cy="58" r="16" fill="#FBD8C5" />
          <path d="M96 61 Q100 65 104 61" stroke="#4A3B32" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="94" cy="55" r="1.5" fill="#4A3B32" />
          <circle cx="106" cy="55" r="1.5" fill="#4A3B32" />
          <circle cx="92" cy="59" r="2.5" fill="#F472B6" opacity="0.5" />
          <circle cx="108" cy="59" r="2.5" fill="#F472B6" opacity="0.5" />

          {/* Pretty Floral dress */}
          <path d="M90 76 L82 110 C80 135 78 170 100 170 C122 170 120 135 118 110 L110 76 Z" fill="#8B5CF6" />
          <circle cx="100" cy="124" r="22" fill="#A78BFA" opacity="0.3" />

          {/* Gentle Hands */}
          <path d="M78 95 Q86 118 96 128" stroke="#FBD8C5" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M122 95 Q114 118 104 128" stroke="#FBD8C5" strokeWidth="5.5" strokeLinecap="round" />

          {/* Little floral dots on dress */}
          <circle cx="92" cy="130" r="2.5" fill="#FDE047" />
          <circle cx="108" cy="135" r="2.5" fill="#F472B6" />
          <circle cx="100" cy="148" r="2.5" fill="#34D399" />
        </svg>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold uppercase tracking-wider mb-1 shadow-xs">
        <Sparkles className="h-3.5 w-3.5 text-purple-600" />
        <span>Maternal Health Intelligence</span>
      </div>
      <p className="text-xs text-purple-700 font-medium max-w-[200px]">
        Fill in clinical parameters to receive instant AI evaluation & diet guide.
      </p>
    </div>
  );
}
