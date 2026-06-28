import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSearch, 
  Binary, 
  UserCheck, 
  Cpu, 
  Terminal,
  Activity,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import Progress from '../../components/Progress';
import GlassCard from '../../components/GlassCard';

export const ExtractionStatusCard: React.FC = () => {
  const { extractionProgress } = useResumeStore();
  const { stage, stageText, percent, ocrConfidence, log } = extractionProgress;

  if (stage === 'idle') return null;

  const steps = [
    { id: 'reading', label: 'Reading Resume', icon: <FileSearch className="w-4 h-4" /> },
    { id: 'extracting', label: 'Extracting Text', icon: <Binary className="w-4 h-4" /> },
    { id: 'parsing', label: 'Candidate Detection', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'preparing', label: 'Context Preparation', icon: <Cpu className="w-4 h-4" /> },
  ];

  const getStepStatus = (stepId: string) => {
    const stageOrder = ['idle', 'reading', 'extracting', 'parsing', 'preparing', 'success'];
    const currentIdx = stageOrder.indexOf(stage);
    const stepIdx = stageOrder.indexOf(stepId);

    if (stage === 'error') {
      return stepIdx < currentIdx ? 'complete' : stepIdx === currentIdx ? 'error' : 'upcoming';
    }

    if (stage === 'success') return 'complete';
    if (currentIdx > stepIdx) return 'complete';
    if (currentIdx === stepIdx) return 'active';
    return 'upcoming';
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        className="w-full"
      >
        <GlassCard className="border-[var(--border-premium)] relative overflow-hidden" glow>
          {/* Decorative background grid line */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--primary-base)]/5 to-[var(--secondary-base)]/5 blur-2xl pointer-events-none" />

          <div className="space-y-6">
            
            {/* Header title */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-premium)]">
              <div className="flex items-center space-x-2.5">
                <Activity className="w-5 h-5 text-[var(--primary-base)] animate-pulse" />
                <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
                  Extraction Pipeline Diagnostics
                </h3>
              </div>
              
              {ocrConfidence !== null && (
                <div className="text-xs bg-[var(--secondary-base)]/10 text-[var(--secondary-base)] border border-[var(--secondary-base)]/10 px-2.5 py-1 rounded-md font-bold">
                  OCR Confidence: {ocrConfidence}%
                </div>
              )}
            </div>

            {/* Stages tracker */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((step) => {
                const status = getStepStatus(step.id);
                
                return (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-2.5 p-3 rounded-xl border transition-all duration-300 ${
                      status === 'complete'
                        ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                        : status === 'active'
                          ? 'border-[var(--primary-base)]/30 bg-[var(--primary-base)]/5 text-[var(--primary-base)] shadow-[0_0_12px_rgba(99,102,241,0.05)]'
                          : status === 'error'
                            ? 'border-rose-500/30 bg-rose-500/5 text-rose-500'
                            : 'border-transparent bg-[var(--bg-app)]/40 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${
                      status === 'active' ? 'bg-[var(--primary-base)] text-white' : 'bg-current/10'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-wider font-bold opacity-60">
                        {status === 'complete' ? 'Done' : status === 'active' ? 'Running' : status === 'error' ? 'Failed' : 'Pending'}
                      </p>
                      <p className="text-xs font-bold truncate max-w-[110px]">
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Progress Indicator bar */}
            <div className="space-y-1.5">
              <Progress
                percent={percent}
                label={stageText}
                sublabel={log ? `Pipeline trace: ${log}` : undefined}
                color={stage === 'error' ? 'bg-rose-500' : undefined}
              />
            </div>

            {/* Terminal log panel */}
            <div className="rounded-xl border border-[var(--border-premium)] bg-slate-950 dark:bg-black/40 overflow-hidden shadow-inner">
              
              {/* Terminal top header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-900 bg-slate-900/60 text-slate-500 text-[10px] font-mono select-none">
                <div className="flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>resume-diagnostics-cli</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-800" />
                  <span className="w-2 h-2 rounded-full bg-slate-800" />
                  <span className="w-2 h-2 rounded-full bg-slate-800" />
                </div>
              </div>

              {/* Logs display output */}
              <div className="p-3.5 font-mono text-[11px] leading-relaxed text-indigo-300 dark:text-indigo-400 text-left min-h-[70px] max-h-[140px] overflow-y-auto">
                <div className="flex items-start space-x-2">
                  <span className="text-slate-600 select-none">$</span>
                  <div className="flex-1 space-y-1 break-all">
                    <p className="text-slate-400">./start-pipeline.sh --verbose --file-context</p>
                    <p className="text-emerald-400/90">[INIT] Connected client-side parser thread...</p>
                    {stage === 'error' ? (
                      <p className="text-rose-400 font-bold">[FATAL] {log}</p>
                    ) : (
                      <>
                        <p>{log || 'Awaiting file diagnostics...'}</p>
                        {stage === 'success' && (
                          <p className="text-emerald-400 font-bold">[READY] Extraction complete. Profile stored in local context.</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Stage specific error boxes */}
            {stage === 'error' && (
              <div className="flex items-start space-x-3 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400 text-left">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <h4 className="font-bold">Extraction Error Details</h4>
                  <p className="text-xs text-rose-500/80 leading-relaxed">
                    The document content could not be fully parsed. Ensure the file is not corrupted, is under the 10MB limit, and has searchable text or high-contrast scan characters for OCR.
                  </p>
                </div>
              </div>
            )}

            {/* Stage success indicator banner */}
            {stage === 'success' && (
              <div className="flex items-center space-x-3 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-left">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-bold">Parsing Completed:</span> Candidate metadata structured and loaded locally.
                </div>
              </div>
            )}

          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
};
export default ExtractionStatusCard;
