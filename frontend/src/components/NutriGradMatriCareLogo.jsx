import React from 'react';

export default function NutriGradMatriCareLogo({ size = 'md', className = '', showText = false, textVariant = 'dark' }) {
  const sizeMap = {
    xs: 'h-7 w-7',
    sm: 'h-9 w-9',
    md: 'h-11 w-11',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };

  const dim = sizeMap[size] || sizeMap.md;

  // Ultra-modern NutriGrad-MatriCare emblem with high-resolution image and interactive glow
  const ExactEmblem = (
    <div className={`relative ${dim} shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-50 via-purple-50 to-indigo-50 p-0.5 shadow-md border border-rose-200/80 hover:scale-105 hover:shadow-rose-300/40 transition-all duration-300 ${className}`}>
      <img
        src="/nutrigrad_matricare_logo.png"
        alt="NutriGrad-MatriCare AI Logo"
        className="w-full h-full object-contain rounded-xl"
        onError={(e) => {
          // Fallback if image path differs
          e.target.style.display = 'none';
        }}
      />
    </div>
  );

  if (showText) {
    return (
      <div className="flex items-center gap-3">
        {ExactEmblem}
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight">
            <span className={`text-xl sm:text-2xl font-black ${textVariant === 'light' ? 'text-white' : 'text-[#0f172a]'}`}>
              NutriGrad
            </span>
            <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#8b5cf6] bg-clip-text text-transparent ml-1">
              MatriCare
            </span>
            <span className="ml-2 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[9px] font-extrabold text-rose-600 uppercase tracking-wider shadow-xs">
              AI Health
            </span>
          </div>
          <span className={`text-[10px] font-semibold tracking-wide ${textVariant === 'light' ? 'text-purple-200' : 'text-slate-500'}`}>
            Maternal Nutrition & Risk Intelligence
          </span>
        </div>
      </div>
    );
  }

  return ExactEmblem;
}
