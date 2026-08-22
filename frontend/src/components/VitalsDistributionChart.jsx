import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function VitalsDistributionChart({ averages }) {
  if (!averages) return null;

  const data = {
    labels: ['BMI', 'Hemoglobin (x10)', 'Blood Pressure', 'Blood Sugar', 'Protein (g/d)'],
    datasets: [
      {
        label: 'Population Clinical Average',
        data: [
          averages.bmi || 0,
          (averages.hemoglobin || 0) * 10,
          averages.blood_pressure || 0,
          averages.sugar_level || 0,
          averages.protein_intake || 0,
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.75)',
          'rgba(16, 185, 129, 0.75)',
          'rgba(239, 68, 68, 0.75)',
          'rgba(245, 158, 11, 0.75)',
          'rgba(139, 92, 246, 0.75)',
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            if (ctx.dataIndex === 1) {
              return ` Hemoglobin: ${(ctx.raw / 10).toFixed(1)} g/dL`;
            }
            return ` Value: ${ctx.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  );
}
