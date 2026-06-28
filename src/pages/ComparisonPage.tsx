import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Columns, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle, 
  AlertTriangle, 
  Minus, 
  ChevronRight,
  Cpu
} from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';

export const ComparisonPage: React.FC = () => {
  const { history, selectedForComparison, setSelectedForComparison } = useResumeStore();
  const navigate = useNavigate();

  const [idA, idB] = selectedForComparison;
  const runA = history.find((h) => h.id === idA);
  const runB = history.find((h) => h.id === idB);

  // If items are not selected, show empty state
  if (!runA || !runB) {
    return (
      <div className="py-16 max-w-md mx-auto text-center space-y-6 text-left">
        <GlassCard className="border-[var(--border-premium)] bg-[var(--bg-surface-glass)] p-8 flex flex-col items-center space-y-5">
          <div className="p-4 bg-[var(--primary-base)]/10 text-[var(--primary-base)] rounded-full">
            <Columns className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Select Reports to Compare</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Compare score enhancements, keyword additions, and candidate readies side-by-side. Please choose two reports from your history.
            </p>
          </div>
          <CustomButton 
            variant="primary" 
            size="sm" 
            onClick={() => navigate('/history')}
            icon={<ChevronRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Go to History Registry
          </CustomButton>
        </GlassCard>
      </div>
    );
  }

  // Calculate Deltas (Run B - Run A)
  const atsDiff = runB.atsScore - runA.atsScore;
  const matchDiff = runB.jobMatchScore - runA.jobMatchScore;

  // Added skills = Gaps in A that are resolved in B
  const addedSkills = runA.missingSkills.filter((s) => !runB.missingSkills.includes(s));
  // Removed skills = New deficits in B
  const removedSkills = runB.missingSkills.filter((s) => !runA.missingSkills.includes(s));

  // Resolved keyword gaps
  const resolvedKeywords = runA.keywordGaps
    .filter((ka) => !runB.keywordGaps.some((kb) => kb.keyword === ka.keyword))
    .map((k) => k.keyword);

  // New keyword gaps
  const newKeywordGaps = runB.keywordGaps
    .filter((kb) => !runA.keywordGaps.some((ka) => ka.keyword === kb.keyword))
    .map((k) => k.keyword);

  return (
    <div className="space-y-8 py-4 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[var(--border-premium)] gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[var(--primary-base)]">
            <Columns className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest font-mono">
              Diagnostics Comparer
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Match Comparison Dashboard
          </h2>
        </div>

        <button
          onClick={() => setSelectedForComparison([null, null])}
          className="text-xs text-rose-500 hover:bg-rose-500/5 px-3 py-1.5 rounded-lg border border-rose-500/10 transition-colors font-semibold"
        >
          Reset Selection
        </button>
      </div>

      {/* Side-by-side Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Run A (Left) */}
        <GlassCard className="border-[var(--border-premium)] bg-slate-100/10 dark:bg-slate-900/10 p-5 space-y-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Base Version (A)
          </span>
          <h3 className="text-lg font-black text-slate-800 dark:text-white truncate">
            {runA.candidateName}
          </h3>
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pt-1 border-t border-[var(--border-premium)]">
            <span>{runA.resumeFileName}</span>
            <span>{runA.versionLabel}</span>
          </div>
        </GlassCard>

        {/* Run B (Right) */}
        <GlassCard className="border-[var(--border-premium)] bg-slate-100/10 dark:bg-slate-900/10 p-5 space-y-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--primary-base)]">
            Compared Version (B)
          </span>
          <h3 className="text-lg font-black text-slate-800 dark:text-white truncate">
            {runB.candidateName}
          </h3>
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pt-1 border-t border-[var(--border-premium)]">
            <span>{runB.resumeFileName}</span>
            <span>{runB.versionLabel}</span>
          </div>
        </GlassCard>

      </div>

      {/* Averages Deltas Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ATS Score Comparer */}
        <GlassCard className="border-[var(--border-premium)] p-6 text-center space-y-3" glow>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ATS score change</p>
          <div className="flex items-center justify-center space-x-6">
            <span className="text-2xl font-black text-slate-400">{runA.atsScore}</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
            <span className="text-4xl font-black text-slate-800 dark:text-white">{runB.atsScore}</span>
          </div>
          <div className="flex items-center justify-center">
            {atsDiff > 0 ? (
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+{atsDiff} points improved</span>
              </span>
            ) : atsDiff < 0 ? (
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold border border-rose-500/20">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>{atsDiff} points regression</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-500 text-[10px] font-bold">
                <Minus className="w-3 h-3" />
                <span>No Score Delta</span>
              </span>
            )}
          </div>
        </GlassCard>

        {/* Match Score Comparer */}
        <GlassCard className="border-[var(--border-premium)] p-6 text-center space-y-3" glow>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job match change</p>
          <div className="flex items-center justify-center space-x-6">
            <span className="text-2xl font-black text-slate-400">{runA.jobMatchScore}</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
            <span className="text-4xl font-black text-slate-800 dark:text-white">{runB.jobMatchScore}</span>
          </div>
          <div className="flex items-center justify-center">
            {matchDiff > 0 ? (
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+{matchDiff}% match alignment</span>
              </span>
            ) : matchDiff < 0 ? (
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold border border-rose-500/20">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>{matchDiff}% match regression</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-500 text-[10px] font-bold">
                <Minus className="w-3 h-3" />
                <span>No Match Delta</span>
              </span>
            )}
          </div>
        </GlassCard>

        {/* Readiness Comparer */}
        <GlassCard className="border-[var(--border-premium)] p-6 text-center space-y-3" glow>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hiring readiness</p>
          <div className="flex items-center justify-center space-x-6">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">{runA.hiringReadiness}</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-black text-[var(--primary-base)] uppercase tracking-widest">{runB.hiringReadiness}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium font-mono">
            Hiring probability: {runA.aiAnalysisRaw.hiring_probability}% → {runB.aiAnalysisRaw.hiring_probability}%
          </div>
        </GlassCard>

      </div>

      {/* Improvements (Added Skills & Keywords) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Resolved Deficits (Success) */}
        <GlassCard className="border-emerald-500/15 dark:border-emerald-500/5 bg-emerald-500/2 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-500 pb-2 border-b border-emerald-500/10">
            <CheckCircle className="w-4.5 h-4.5" />
            <h4 className="text-sm font-bold tracking-tight">Resolved deficits (Optimized B)</h4>
          </div>

          <div className="space-y-4">
            {/* Added Skills */}
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Added Skills ({addedSkills.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {addedSkills.length > 0 ? (
                  addedSkills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      +{s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills resolved in this run.</span>
                )}
              </div>
            </div>

            {/* Resolved Keywords */}
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Resolved Keywords ({resolvedKeywords.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {resolvedKeywords.length > 0 ? (
                  resolvedKeywords.map((k) => (
                    <span key={k} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      +{k}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No keywords resolved.</span>
                )}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Regressions / Lost coverage */}
        <GlassCard className="border-rose-500/15 dark:border-rose-500/5 bg-rose-500/2 space-y-4">
          <div className="flex items-center space-x-2 text-rose-500 pb-2 border-b border-rose-500/10">
            <AlertTriangle className="w-4.5 h-4.5" />
            <h4 className="text-sm font-bold tracking-tight">New Deficits Created (Loss in B)</h4>
          </div>

          <div className="space-y-4">
            {/* Removed Skills */}
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Removed Skills ({removedSkills.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {removedSkills.length > 0 ? (
                  removedSkills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                      -{s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills lost.</span>
                )}
              </div>
            </div>

            {/* New Keyword Gaps */}
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Lost Keywords ({newKeywordGaps.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {newKeywordGaps.length > 0 ? (
                  newKeywordGaps.map((k) => (
                    <span key={k} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                      -{k}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No keywords lost.</span>
                )}
              </div>
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Side-by-side Recruiter Summary Paragraphs */}
      <GlassCard className="border-[var(--border-premium)] space-y-4">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-white pb-2 border-b border-[var(--border-premium)]">
          <Cpu className="w-4.5 h-4.5 text-[var(--primary-base)]" />
          <h4 className="text-sm font-bold tracking-tight">Executive Recruiter Analysis Diff</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Version A Summary</span>
            <p className="text-slate-600 dark:text-slate-350 p-3 rounded-xl border border-[var(--border-premium)] bg-[var(--bg-app)]/30 font-medium">
              {runA.aiSummary}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-[var(--primary-base)] font-bold uppercase">Version B Summary</span>
            <p className="text-slate-600 dark:text-slate-350 p-3 rounded-xl border border-[var(--border-premium)] bg-[var(--bg-app)]/30 font-semibold">
              {runB.aiSummary}
            </p>
          </div>
        </div>
      </GlassCard>

    </div>
  );
};
export default ComparisonPage;
