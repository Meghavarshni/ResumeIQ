import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Cpu } from 'lucide-react';

export const HeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full aspect-[4/3] max-w-[450px] mx-auto bg-slate-950/40 dark:bg-black/30 border border-[var(--border-premium)] rounded-2xl overflow-hidden glass-panel p-5 flex flex-col justify-between shadow-2xl">
      
      {/* Grid Pattern Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Decorative Blur glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[var(--primary-base)]/10 dark:bg-[var(--primary-base)]/5 blur-3xl rounded-full pointer-events-none" />

      {/* Animated Scanning Laser Line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--primary-base)] to-transparent opacity-80 shadow-[0_0_12px_rgba(99,102,241,0.5)] pointer-events-none z-10"
        animate={{
          top: ['8%', '92%', '8%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Header bar of scanner */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/40 relative z-20">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80 animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold">
            Live Analysis Active
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-[var(--primary-base)]/10 px-2 py-0.5 rounded-full border border-[var(--primary-base)]/15">
          <Cpu className="w-3 h-3 text-[var(--primary-base)]" />
          <span className="text-[9px] font-bold font-mono text-[var(--primary-base)]">Parsing engine v1</span>
        </div>
      </div>

      {/* Mock Resume Blocks & Nodes */}
      <div className="flex-1 py-4 flex flex-col space-y-3 relative z-20">
        
        {/* Name segment placeholder */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/30 flex items-center justify-center text-slate-400">
            <Sparkles className="w-4 h-4 text-[var(--primary-base)] animate-pulse" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-1/3 bg-slate-800/80 rounded-md" />
            <div className="h-2 w-1/2 bg-slate-800/40 rounded-md" />
          </div>
        </div>

        {/* Experience Blocks placeholders */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-1/4 bg-slate-800/60 rounded-md" />
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-12 bg-emerald-500/20 text-emerald-400 rounded-md text-[8px] font-bold text-center border border-emerald-500/30 flex items-center justify-center"
            >
              Matched
            </motion.div>
          </div>
          <div className="h-1.5 w-full bg-slate-800/40 rounded-md" />
          <div className="h-1.5 w-5/6 bg-slate-800/40 rounded-md" />
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-1/3 bg-slate-800/60 rounded-md" />
            <motion.div 
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="h-2 w-12 bg-[var(--primary-base)]/25 text-[var(--primary-light)] rounded-md text-[8px] font-bold text-center border border-[var(--primary-base)]/30 flex items-center justify-center"
            >
              Extracted
            </motion.div>
          </div>
          <div className="h-1.5 w-full bg-slate-800/40 rounded-md" />
          <div className="h-1.5 w-4/5 bg-slate-800/40 rounded-md" />
        </div>

      </div>

      {/* Scanner Diagnostic Stats Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/40 relative z-20 text-[10px] font-mono text-slate-500">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>No Data Stored on Server</span>
        </div>
        <div className="text-right">
          <span>Client Local Storage: active</span>
        </div>
      </div>

    </div>
  );
};
export default HeroIllustration;
