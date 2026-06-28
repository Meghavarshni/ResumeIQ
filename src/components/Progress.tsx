import React from 'react';

interface ProgressProps {
  percent: number;
  label?: string;
  sublabel?: string;
  color?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  percent,
  label,
  sublabel,
  color = 'bg-gradient-to-r from-[var(--primary-base)] to-[var(--secondary-base)]',
}) => {
  const boundedPercent = Math.min(Math.max(percent, 0), 100);

  return (
    <div className="w-full space-y-2">
      {(label || sublabel) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-semibold text-slate-700 dark:text-slate-300">{label}</span>}
          <span className="font-bold text-slate-900 dark:text-slate-100">{boundedPercent}%</span>
        </div>
      )}
      
      {/* Background track */}
      <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-[2px]">
        {/* Glow fill container */}
        <div
          className={`h-full ${color} rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(99,102,241,0.3)]`}
          style={{ width: `${boundedPercent}%` }}
        />
      </div>
      
      {sublabel && (
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-tight line-clamp-1">
          {sublabel}
        </p>
      )}
    </div>
  );
};
export default Progress;
