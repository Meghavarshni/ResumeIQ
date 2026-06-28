import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  onCancel?: () => void;
}

const STAGES = [
  'Scanning Resume...',
  'Extracting Resume Content...',
  'Reading Candidate Information...',
  'Running ATS Evaluation...',
  'Analyzing Skills...',
  'Checking Keyword Coverage...',
  'Comparing Against Job Description...',
  'Evaluating Hiring Readiness...',
  'Generating Recommendations...',
  'Building Resume Blueprint...'
];

const RECRUITER_QUOTES = [
  'Teaching AI to think like HR...',
  'Reviewing recruiter expectations...',
  'Comparing skill requirements...',
  'Checking hidden ATS signals...',
  'Finding missing keywords...',
  'Generating recruiter insights...'
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, onCancel }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setStageIndex(0);
      setQuoteIndex(0);
      setProgress(0);
      return;
    }

    // Increment progress bar slowly
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return prev;
        return prev + 1;
      });
    }, 350);

    // Stagger stages
    const stageTimer = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 2800);

    // Stagger funny quotes
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev < RECRUITER_QUOTES.length - 1 ? prev + 1 : 0));
    }, 4500);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stageTimer);
      clearInterval(quoteTimer);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-app)]/90 backdrop-blur-xl transition-colors duration-300 overflow-y-auto px-4"
      >
        <div className="max-w-xl w-full flex flex-col items-center justify-center text-center space-y-8 py-8 relative">
          
          {/* Animated Glowing AI Orb */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            
            {/* Pulsing Outer Ring 1 */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--primary-base)] to-[var(--secondary-base)] opacity-10"
              animate={{ scale: [1, 1.3, 1], rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />

            {/* Pulsing Outer Ring 2 */}
            <motion.div
              className="absolute inset-2 rounded-full border border-[var(--primary-base)]/20"
              animate={{ scale: [1.1, 0.9, 1.1], rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Orbiting Satellite Dot */}
            <motion.div
              className="absolute w-3.5 h-3.5 rounded-full bg-[var(--secondary-base)] shadow-[0_0_10px_var(--secondary-base)]"
              animate={{
                rotate: 360,
                x: [0, 60, 0, -60, 0],
                y: [60, 0, -60, 0, 60],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            {/* Core Glowing Orb */}
            <div className="w-20 h-20 rounded-full bg-slate-900 border border-[var(--primary-base)]/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(99,102,241,0.25)]">
              <Brain className="w-8 h-8 text-[var(--primary-base)] animate-pulse" />
            </div>
          </div>

          {/* Heading Stages */}
          <div className="space-y-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-spin-slow" />
              <span>ResumeIQ AI Engine</span>
            </h2>

            <div className="h-7 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.p
                  key={stageIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-bold text-[var(--primary-base)] font-mono"
                >
                  {STAGES[stageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
            
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium h-5 italic">
              {RECRUITER_QUOTES[quoteIndex]}
            </p>
          </div>

          {/* Progress bar container */}
          <div className="w-full max-w-sm space-y-2">
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-[1px]">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--primary-base)] via-[var(--primary-light)] to-[var(--secondary-base)] rounded-full shadow-[0_0_8px_rgba(99,102,241,0.3)]"
                style={{ width: `${progress}%` }}
                layoutId="loaderProgress"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>ESTIMATING METRICS</span>
              <span>{progress}% COMPLETE</span>
            </div>
          </div>

          {/* Skeleton representation cards floating underneath */}
          <div className="w-full max-w-md p-4 rounded-xl border border-[var(--border-premium)] bg-slate-900/5 dark:bg-white/5 space-y-3 opacity-30 select-none pointer-events-none">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-slate-700/30 shimmer-bg" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-1/4 bg-slate-700/30 rounded shimmer-bg" />
                <div className="h-2.5 w-1/2 bg-slate-700/20 rounded shimmer-bg" />
              </div>
            </div>
            <div className="h-1.5 w-full bg-slate-700/20 rounded shimmer-bg" />
            <div className="h-1.5 w-5/6 bg-slate-700/20 rounded shimmer-bg" />
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-rose-500/20 text-rose-500 hover:bg-rose-500/5 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cancel Request
            </button>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default LoadingOverlay;
