import React from 'react';

interface CategoryScoreProps {
  score: number;
  label: string;
  icon?: string;
  size?: 'sm' | 'md';
}

const CategoryScore = ({ score, label, icon, size = 'md' }: CategoryScoreProps) => {
  const radius = size === 'sm' ? 24 : 32;
  const stroke = size === 'sm' ? 4 : 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return 'text-emerald-500 stroke-emerald-500';
    if (s >= 60) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  return (
    <div className={`flex items-center gap-4 p-4 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 ${size === 'sm' ? 'w-full' : 'w-full md:w-64'}`}>
      <div className="relative shrink-0" style={{ width: radius * 2, height: radius * 2 }}>
        <svg
          height={radius * 2}
          width={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          className="transform -rotate-90"
        >
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            stroke="#f1f5f9"
            strokeWidth={stroke}
            fill="transparent"
          />
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            stroke="currentColor"
            strokeWidth={stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${getColor(score)} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${size === 'sm' ? 'text-xs' : 'text-sm'} text-slate-800`}>{score}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        {icon && <span className="text-sm font-semibold text-slate-900">{icon}</span>}
      </div>
    </div>
  );
};

export default CategoryScore;
