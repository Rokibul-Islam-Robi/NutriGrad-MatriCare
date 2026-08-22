import React from 'react';

export default function RiskBadge({ risk, size = 'md' }) {
  const riskStr = (risk || 'Unknown').toString().toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-300';
  let dotColor = 'bg-slate-400';
  let label = risk || 'Not Assessed';

  if (riskStr.includes('high')) {
    colorClasses = 'bg-red-50 text-red-700 border-red-200';
    dotColor = 'bg-red-500 animate-pulse';
    label = 'High Risk';
  } else if (riskStr.includes('mid') || riskStr.includes('medium')) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
    label = 'Mid Risk';
  } else if (riskStr.includes('low')) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
    label = 'Low Risk';
  }

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : size === 'lg' 
    ? 'px-3.5 py-1.5 text-sm font-semibold' 
    : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${colorClasses} ${sizeClasses}`}>
      <span className={`h-2 w-2 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
}
