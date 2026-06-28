import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface RadialGaugeProps {
  score: number;
  label: string;
  grade?: string;
  tooltipText?: string;
  colorType?: 'primary' | 'secondary' | 'accent';
  size?: number;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({
  score,
  label,
  grade,
  tooltipText,
  colorType = 'primary',
  size = 140,
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  // Count-up animation
  useEffect(() => {
    let start = 0;
    const end = Math.min(Math.max(score, 0), 100);
    if (start === end) {
      setDisplayScore(end);
      return;
    }

    const duration = 1.5; // seconds
    const stepTime = Math.abs(Math.floor((duration * 1000) / end));
    
    const timer = setInterval(() => {
      start += 1;
      setDisplayScore(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, Math.max(stepTime, 12));

    return () => clearInterval(timer);
  }, [score]);

  // SVG parameters
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius; // ~314.16
  const strokeDashoffset = circumference - (circumference * displayScore) / 100;



  return (
    <div className="flex flex-col items-center justify-center space-y-3 relative">
      
      {/* SVG Container */}
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 120 120"
          className="transform -rotate-90 select-none pointer-events-none"
        >
          {/* Inner Shadow definition */}
          <defs>
            <linearGradient id={`grad-${colorType}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorType === 'primary' ? 'var(--primary-base)' : colorType === 'secondary' ? 'var(--secondary-base)' : 'var(--accent-base)'} />
              <stop offset="100%" stopColor={colorType === 'primary' ? '#818cf8' : colorType === 'secondary' ? '#22d3ee' : '#34d399'} />
            </linearGradient>
          </defs>

          {/* Underlay Track Ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth - 1}
            className="text-slate-200 dark:text-slate-800/40"
          />

          {/* Animated Overlay Arc */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke={`url(#grad-${colorType})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Central Display Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5">
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter"
          >
            {displayScore}
          </motion.span>
          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
            Score
          </span>
        </div>
      </div>

      {/* Label and Badge indicators */}
      <div className="flex items-center space-x-1.5 justify-center">
        <span className="text-xs font-extrabold tracking-tight text-slate-700 dark:text-slate-300">
          {label}
        </span>
        
        {tooltipText && (
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors cursor-help outline-none"
              aria-label="Info info"
            >
              <Info className="w-3.5 h-3.5" />
            </button>

            {/* Tooltip Popup panel */}
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 rounded-xl border border-[var(--border-premium)] bg-[var(--bg-surface)] backdrop-blur-md text-[10px] leading-relaxed text-slate-600 dark:text-slate-300 shadow-2xl z-50 text-center font-medium">
                {tooltipText}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--bg-surface)] border-r border-b border-[var(--border-premium)] transform rotate-45 -mt-1" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grade badge */}
      {grade && (
        <span className={`px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-extrabold rounded-full border ${
          colorType === 'primary'
            ? 'bg-[var(--primary-base)]/10 text-[var(--primary-base)] border-[var(--primary-base)]/25'
            : colorType === 'secondary'
              ? 'bg-[var(--secondary-base)]/10 text-[var(--secondary-base)] border-[var(--secondary-base)]/25'
              : 'bg-[var(--accent-base)]/10 text-[var(--accent-base)] border-[var(--accent-base)]/25'
        }`}>
          {grade}
        </span>
      )}

    </div>
  );
};
export default RadialGauge;
