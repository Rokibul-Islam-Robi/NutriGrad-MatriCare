import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RiskDistributionChart({ distribution, total = 0 }) {
  const lowCount = distribution?.['Low Risk'] ?? distribution?.low ?? 0;
  const midCount = distribution?.['Mid Risk'] ?? distribution?.mid ?? 0;
  const highCount = distribution?.['High Risk'] ?? distribution?.high ?? 0;

  const data = {
    labels: ['Low Risk', 'Mid Risk', 'High Risk'],
    datasets: [
      {
        data: [lowCount, midCount, highCount],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 16,
          font: {
            family: 'Inter',
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const val = context.raw || 0;
            const sum = context.dataset.data.reduce((a, b) => a + b, 0) || 1;
            const pct = Math.round((val / sum) * 100);
            return ` ${context.label}: ${val} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="relative h-64 w-full">
      <Doughnut data={data} options={options} />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
        <span className="text-2xl font-bold text-slate-800">{total}</span>
        <span className="text-[11px] font-medium text-slate-400">Total Assessed</span>
      </div>
    </div>
  );
}
