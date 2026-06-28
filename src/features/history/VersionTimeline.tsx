import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { useToast } from '../../providers/ToastProvider';
import GlassCard from '../../components/GlassCard';

export const VersionTimeline: React.FC = () => {
  const {
    history,
    activeHistoryId,
    setActiveHistoryId,
    setResumeText,
    setUploadedFile,
    setJobDescription,
    setAtsScore,
    setAiAnalysis,
    setOptimizedResume
  } = useResumeStore();

  const { addToast } = useToast();

  if (!activeHistoryId) return null;

  const currentItem = history.find((h) => h.id === activeHistoryId);
  if (!currentItem) return null;

  // Find all items sharing the same version family group
  const versions = history
    .filter((h) => h.versionGroupId === currentItem.versionGroupId)
    // Chronological order: oldest first (reverse insertion history list)
    .reverse();

  if (versions.length <= 1) return null; // No timeline needed if only one version exists

  const handleRestore = (item: any) => {
    if (item.id === activeHistoryId) return;

    setResumeText(item.resumeText);
    setUploadedFile({
      name: item.resumeFileName,
      size: 0,
      type: 'application/pdf',
      uploadTime: item.analysisDate,
    });
    setJobDescription(item.jobDescription);
    setAtsScore(item.atsScore);
    setAiAnalysis(item.aiAnalysisRaw);
    setOptimizedResume(item.optimizedResumeRaw);
    setActiveHistoryId(item.id);

    addToast(`Switched to version: ${item.versionLabel}`, 'info');
  };

  return (
    <GlassCard className="border-[var(--border-premium)] bg-slate-900/5 dark:bg-black/10 text-left p-4 space-y-4" glow>
      
      {/* Header */}
      <div className="flex items-center space-x-2 text-slate-800 dark:text-white pb-2 border-b border-[var(--border-premium)]">
        <UserCheck className="w-4.5 h-4.5 text-[var(--primary-base)]" />
        <h3 className="text-sm font-extrabold tracking-tight">Version Evolution Timeline</h3>
        <span className="text-[10px] bg-[var(--primary-base)]/10 text-[var(--primary-base)] border border-[var(--primary-base)]/25 px-2 py-0.5 rounded-full font-mono font-bold">
          {versions.length} versions
        </span>
      </div>

      {/* Timeline connectors */}
      <div className="relative flex items-center justify-between py-6 overflow-x-auto select-none no-scrollbar">
        {/* Horizontal Line connector */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />

        {versions.map((item) => {
          const isActive = item.id === activeHistoryId;
          
          return (
            <div 
              key={item.id}
              onClick={() => handleRestore(item)}
              className="flex flex-col items-center relative z-10 cursor-pointer group min-w-[120px] px-2 text-center"
            >
              
              {/* Score bubble / Node */}
              <motion.div
                whileHover={{ scale: 1.15 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-black border-2 transition-all ${
                  isActive
                    ? 'bg-[var(--primary-base)] text-white border-[var(--primary-base)] shadow-[0_0_12px_rgba(99,102,241,0.4)] scale-110'
                    : 'bg-[var(--bg-surface)] text-slate-600 dark:text-slate-350 border-slate-300 dark:border-slate-700 hover:border-[var(--primary-base)]/50'
                }`}
              >
                {item.atsScore}
              </motion.div>

              {/* Version title & stamp */}
              <div className="mt-3 space-y-0.5">
                <span className={`block text-[10px] font-black uppercase tracking-wider ${
                  isActive ? 'text-[var(--primary-base)] font-extrabold' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                }`}>
                  {item.versionLabel.split(' ')[0]}
                </span>
                <span className="block text-[8px] text-slate-400 font-medium">
                  {item.analysisDate.split(', ')[1]}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </GlassCard>
  );
};
export default VersionTimeline;
