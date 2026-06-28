import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ChevronDown, 
  Plus,
  ShieldCheck,
  TrendingUp,
  Sliders,
  Sparkles,
  Search,
  BookOpen
} from 'lucide-react';
import type { 
  KeywordGapItem, 
  StrengthItem, 
  WeaknessItem, 
  ImprovementRecommendation 
} from '../../types';
import GlassCard from '../../components/GlassCard';

// 1. HIRING READINESS CARD
interface HiringReadinessCardProps {
  readiness: 'Low' | 'Moderate' | 'Strong' | 'Excellent';
  probability: number;
}

export const HiringReadinessCard: React.FC<HiringReadinessCardProps> = ({ readiness, probability }) => {
  const levels = ['Low', 'Moderate', 'Strong', 'Excellent'];
  const activeIndex = levels.indexOf(readiness);

  const colors = {
    Low: 'bg-rose-500 shadow-rose-500/20 text-rose-500',
    Moderate: 'bg-amber-500 shadow-amber-500/20 text-amber-500',
    Strong: 'bg-[var(--primary-base)] shadow-indigo-500/20 text-indigo-500',
    Excellent: 'bg-[var(--accent-base)] shadow-emerald-500/20 text-emerald-500',
  };

  return (
    <GlassCard className="border-[var(--border-premium)] flex flex-col justify-between h-full" glow>
      <div className="space-y-4 text-left">
        
        {/* Header */}
        <div className="flex items-center space-x-2 pb-3 border-b border-[var(--border-premium)]">
          <Sliders className="w-4 h-4 text-[var(--primary-base)]" />
          <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
            Hiring Readiness Rating
          </h3>
        </div>

        {/* Big Probability Count */}
        <div className="flex items-baseline space-x-2">
          <span className={`text-4xl font-black tracking-tighter ${colors[readiness].split(' ')[2]}`}>
            {probability}%
          </span>
          <span className="text-xs text-slate-400 font-bold uppercase">
            Hiring Probability
          </span>
        </div>

        {/* Visual Segmented Meter */}
        <div className="space-y-2 pt-2">
          <div className="grid grid-cols-4 gap-2">
            {levels.map((level, idx) => {
              const isActive = idx === activeIndex;
              const isPast = idx < activeIndex;
              
              return (
                <div key={level} className="space-y-1">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isActive 
                        ? colors[readiness].split(' ')[0] + ' shadow-[0_0_8px_rgba(99,102,241,0.25)]' 
                        : isPast 
                          ? 'bg-slate-350 dark:bg-slate-700/60'
                          : 'bg-slate-200 dark:bg-slate-800/40'
                    }`}
                  />
                  <span className={`block text-[9px] font-bold text-center uppercase tracking-wider ${
                    isActive ? colors[readiness].split(' ')[2] : 'text-slate-400'
                  }`}>
                    {level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explanatory Verdict */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed pt-2">
          Recruitment index matches candidate experience with hiring thresholds. 
          Rating indicates a <span className="font-bold text-slate-800 dark:text-slate-200">{readiness}</span> entry alignment.
        </p>

      </div>
    </GlassCard>
  );
};


// 2. MISSING SKILLS CARD
interface MissingSkillsCardProps {
  skills: string[];
}

export const MissingSkillsCard: React.FC<MissingSkillsCardProps> = ({ skills }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => {
    if (skills.length === 0) return;
    navigator.clipboard.writeText(skills.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard className="border-[var(--border-premium)] flex flex-col justify-between h-full" glow>
      <div className="space-y-4 text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-premium)]">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-[var(--secondary-base)]" />
            <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
              Target Skills Deficit
            </h3>
          </div>
          
          {skills.length > 0 && (
            <button
              onClick={handleCopyAll}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-[var(--primary-base)]/10 text-[var(--primary-base)] border border-[var(--primary-base)]/10 hover:bg-[var(--primary-base)]/15 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Chips grid */}
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.map((skill) => (
              <motion.span
                key={skill}
                whileHover={{ scale: 1.05, y: -1 }}
                className="px-2.5 py-1 text-xs rounded-lg font-bold bg-amber-500/5 text-amber-600 dark:text-amber-400 border border-amber-500/10 shadow-sm"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        ) : (
          <div className="py-6 flex items-center justify-center border border-dashed border-[var(--border-premium)] rounded-xl">
            <p className="text-xs text-slate-400 italic">No missing target skills detected! Profile is fully compatible.</p>
          </div>
        )}

      </div>
    </GlassCard>
  );
};


// 3. KEYWORD GAPS CARD
interface KeywordGapsCardProps {
  gaps: KeywordGapItem[];
}

export const KeywordGapsCard: React.FC<KeywordGapsCardProps> = ({ gaps }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopied(keyword);
    setTimeout(() => setCopied(null), 2000);
  };

  const getImportanceStyles = (importance: string) => {
    switch (importance) {
      case 'High': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
    }
  };

  return (
    <GlassCard className="border-[var(--border-premium)] flex flex-col justify-between h-full" glow>
      <div className="space-y-4 text-left">
        
        {/* Header */}
        <div className="flex items-center space-x-2 pb-3 border-b border-[var(--border-premium)]">
          <Search className="w-4 h-4 text-[var(--secondary-base)]" />
          <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
            ATS Keyword Coverage Gaps
          </h3>
        </div>

        {/* List items */}
        {gaps.length > 0 ? (
          <div className="space-y-2 pt-1">
            {gaps.map((item) => (
              <div 
                key={item.keyword}
                className="flex items-center justify-between p-2 rounded-xl border border-[var(--border-premium)] bg-[var(--bg-app)]/30 group hover:border-[var(--primary-base)]/25 transition-all duration-300"
              >
                <div className="flex items-center space-x-2.5">
                  <span className={`px-2 py-0.5 rounded-md border text-[9px] uppercase tracking-wider font-extrabold ${getImportanceStyles(item.importance)}`}>
                    {item.importance}
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {item.keyword}
                  </span>
                </div>
                
                <button
                  onClick={() => handleCopy(item.keyword)}
                  className="p-1 rounded bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-premium)] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                  title="Copy Keyword"
                >
                  {copied === item.keyword ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 flex items-center justify-center border border-dashed border-[var(--border-premium)] rounded-xl">
            <p className="text-xs text-slate-400 italic">No key vocabulary gaps detected.</p>
          </div>
        )}

      </div>
    </GlassCard>
  );
};


// 4. STRENGTHS LIST
interface StrengthsCardProps {
  strengths: StrengthItem[];
}

export const StrengthsCard: React.FC<StrengthsCardProps> = ({ strengths }) => {
  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center space-x-2 pb-2">
        <TrendingUp className="w-4.5 h-4.5 text-[var(--accent-base)]" />
        <h3 className="text-base font-black tracking-tight text-slate-800 dark:text-white">
          Recruitment Strengths
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strengths.map((str, idx) => (
          <GlassCard key={idx} className="border-emerald-500/10 dark:border-emerald-500/5 bg-emerald-500/2 hover:bg-emerald-500/5 shadow-emerald-500/5" hoverEffect glow>
            <div className="flex items-start space-x-3.5">
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl flex-shrink-0">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {str.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {str.explanation}
                </p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};


// 5. WEAKNESSES LIST
interface WeaknessesCardProps {
  weaknesses: WeaknessItem[];
}

export const WeaknessesCard: React.FC<WeaknessesCardProps> = ({ weaknesses }) => {
  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center space-x-2 pb-2">
        <AlertTriangle className="w-4.5 h-4.5 text-[var(--status-danger)]" />
        <h3 className="text-base font-black tracking-tight text-slate-800 dark:text-white">
          Recruiter Flagged Weaknesses
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weaknesses.map((weak, idx) => (
          <GlassCard key={idx} className="border-rose-500/15 dark:border-rose-500/5 bg-rose-500/2 hover:bg-rose-500/5 shadow-rose-500/5" hoverEffect glow>
            <div className="flex items-start space-x-3.5">
              <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl flex-shrink-0">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {weak.issue}
                </h4>
                <div className="text-xs leading-relaxed space-y-1.5 font-medium">
                  <p className="text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-[var(--status-danger)]">Impact:</span> {weak.impact}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 bg-slate-900/5 dark:bg-white/5 p-2 rounded-lg border border-[var(--border-premium)]">
                    <span className="font-bold text-[var(--primary-base)]">Optimization:</span> {weak.suggestion}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};


// 6. RECOMMENDATIONS ACCORDION
interface RecommendationsCardProps {
  recommendations: ImprovementRecommendation[];
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
    }
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center space-x-2 pb-2">
        <Sparkles className="w-4.5 h-4.5 text-[var(--primary-base)]" />
        <h3 className="text-base font-black tracking-tight text-slate-800 dark:text-white">
          Strategic Optimization Roadmap
        </h3>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, idx) => {
          const isOpen = openIndex === idx;
          
          return (
            <div 
              key={idx}
              className="rounded-xl border border-[var(--border-premium)] bg-[var(--bg-surface-glass)] backdrop-blur-sm overflow-hidden"
            >
              {/* Accordion Trigger header */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="flex items-center justify-between w-full p-4 text-left font-bold transition-colors hover:bg-[var(--bg-surface-hover)] cursor-pointer outline-none"
              >
                <div className="flex items-center space-x-3 text-xs sm:text-sm">
                  <span className={`px-2 py-0.5 rounded-md border text-[9px] uppercase tracking-wider font-extrabold ${getPriorityBadge(rec.priority)}`}>
                    {rec.priority} Priority
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 line-clamp-1 pr-4">
                    {rec.reason}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-slate-400 flex-shrink-0"
                >
                  <ChevronDown className="w-4.5 h-4.5" />
                </motion.div>
              </button>

              {/* Accordion Expandable panel */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 border-t border-[var(--border-premium)] bg-[var(--bg-app)]/20 space-y-3 text-xs font-medium">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                        <div className="space-y-1 p-3 rounded-xl border border-[var(--border-premium)] bg-[var(--bg-surface)]">
                          <p className="font-bold text-[var(--primary-base)] text-[9px] uppercase tracking-widest">
                            Recommended Action
                          </p>
                          <p className="text-slate-700 dark:text-slate-350 leading-relaxed text-[11px]">
                            {rec.action}
                          </p>
                        </div>
                        
                        <div className="space-y-1 p-3 rounded-xl border border-[var(--border-premium)] bg-[var(--bg-surface)]">
                          <p className="font-bold text-emerald-500 text-[9px] uppercase tracking-widest">
                            Estimated Impact
                          </p>
                          <p className="text-slate-700 dark:text-slate-350 leading-relaxed text-[11px]">
                            {rec.impact}
                          </p>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>
    </div>
  );
};


// 7. ATS SUGGESTIONS LIST (dedicated section)
interface AtsSuggestionsCardProps {
  suggestions: string[];
}

export const AtsSuggestionsCard: React.FC<AtsSuggestionsCardProps> = ({ suggestions }) => {
  return (
    <GlassCard className="border-[var(--border-premium)] text-left" glow>
      <div className="space-y-4">
        
        {/* Header */}
        <div className="flex items-center space-x-2 pb-3 border-b border-[var(--border-premium)]">
          <ShieldCheck className="w-4.5 h-4.5 text-[var(--primary-base)]" />
          <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
            ATS Formatting & Structure Optimizations
          </h3>
        </div>

        {/* Suggestion list */}
        {suggestions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {suggestions.map((sug, idx) => (
              <div 
                key={idx}
                className="flex items-start space-x-2.5 p-3 rounded-xl border border-[var(--border-premium)] bg-[var(--bg-app)]/20 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <Plus className="w-4 h-4 text-[var(--primary-base)] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{sug}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No layout warnings detected. Formatting complies with standard models.</p>
        )}

      </div>
    </GlassCard>
  );
};


// 8. FINAL VERDICT BANNER CALLOUT
interface FinalVerdictCardProps {
  verdict: 'Excellent Match' | 'Strong Match' | 'Moderate Match' | 'Weak Match';
  explanation: string;
}

export const FinalVerdictCard: React.FC<FinalVerdictCardProps> = ({ verdict, explanation }) => {
  
  const styles = {
    'Excellent Match': 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/5',
    'Strong Match': 'border-indigo-500/20 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 shadow-indigo-500/5',
    'Moderate Match': 'border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 shadow-amber-500/5',
    'Weak Match': 'border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400 shadow-rose-500/5',
  };

  return (
    <div className={`p-5 rounded-2xl border text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${styles[verdict]}`}>
      <div className="space-y-1.5">
        <span className="text-[10px] font-black uppercase tracking-wider opacity-60">
          Executive Final Verdict
        </span>
        <h4 className="text-lg font-black tracking-tight leading-none">
          {verdict}
        </h4>
        <p className="text-xs opacity-90 leading-relaxed font-semibold">
          {explanation}
        </p>
      </div>

      <div className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-xl border flex-shrink-0 text-center ${
        verdict === 'Excellent Match' 
          ? 'bg-emerald-500 text-white border-emerald-600 shadow-md' 
          : verdict === 'Strong Match' 
            ? 'bg-[var(--primary-base)] text-white border-indigo-600 shadow-md' 
            : verdict === 'Moderate Match' 
              ? 'bg-amber-500 text-white border-amber-600 shadow-md' 
              : 'bg-rose-500 text-white border-rose-600 shadow-md'
      }`}>
        {verdict.split(' ')[0]}
      </div>
    </div>
  );
};
