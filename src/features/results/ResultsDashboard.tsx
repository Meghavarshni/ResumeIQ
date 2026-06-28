import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  User, 
  Sparkles, 
  FileCheck,
  RotateCcw
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { formatBytes } from '../../utils/fileHelpers';
import GlassCard from '../../components/GlassCard';
import CustomButton from '../../components/CustomButton';
import RadialGauge from './RadialGauge';
import {
  HiringReadinessCard,
  MissingSkillsCard,
  KeywordGapsCard,
  StrengthsCard,
  WeaknessesCard,
  RecommendationsCard,
  AtsSuggestionsCard,
  FinalVerdictCard
} from './DashboardCards';
import OptimizedResumeSection from './OptimizedResumeSection';
import VersionTimeline from '../history/VersionTimeline';

export const ResultsDashboard: React.FC = () => {
  const { 
    uploadedFile, 
    candidateInfo, 
    atsScore, 
    aiAnalysis, 
    resetAll 
  } = useResumeStore();

  if (!aiAnalysis) return null;

  const today = new Date().toLocaleDateString([], { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <section 
      id="results-dashboard-anchor" 
      className="w-full pt-12 border-t border-[var(--border-premium)] space-y-8 scroll-mt-20 text-left"
    >
      
      {/* 1. Header with diagnostics status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[var(--border-premium)]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[var(--primary-base)]">
            <FileCheck className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest font-mono">
              Recruitment Alignment Index
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            ATS Match Report
          </h2>
        </div>

        {/* Clear Analysis Action */}
        <CustomButton
          variant="secondary"
          size="sm"
          onClick={resetAll}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset Match Context
        </CustomButton>
      </div>

      {/* Version timeline connector */}
      <VersionTimeline />

      {/* 2. Executive Final Verdict banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        <FinalVerdictCard 
          verdict={aiAnalysis.final_verdict} 
          explanation={aiAnalysis.summary} 
        />
      </motion.div>

      {/* 3. Main Scoring dashboard (Grid of Gauges and Readiness) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Gauge 1: ATS Precalculated Score */}
        <GlassCard className="border-[var(--border-premium)] flex items-center justify-center py-8" glow>
          <RadialGauge
            score={aiAnalysis.ats_score || atsScore || 0}
            label="ATS Compliance"
            grade={
              scoreToGrade(aiAnalysis.ats_score || atsScore || 0)
            }
            tooltipText="Measures format compliance, bullet layout, contact sections, and structure compliance."
            colorType="primary"
          />
        </GlassCard>

        {/* Gauge 2: Job Match Score */}
        <GlassCard className="border-[var(--border-premium)] flex items-center justify-center py-8" glow>
          <RadialGauge
            score={aiAnalysis.job_match_score}
            label="Role Specification Match"
            grade={
              scoreToGrade(aiAnalysis.job_match_score)
            }
            tooltipText="AI-driven score analyzing specific skill overlaps and core developer roles alignment."
            colorType="secondary"
          />
        </GlassCard>

        {/* Readiness Meter */}
        <HiringReadinessCard 
          readiness={aiAnalysis.hiring_readiness} 
          probability={aiAnalysis.hiring_probability} 
        />

      </div>

      {/* 4. Executive Summary card */}
      <GlassCard className="border-[var(--border-premium)] space-y-3" glow>
        <div className="flex items-center space-x-2 text-slate-800 dark:text-white">
          <Sparkles className="w-4 h-4 text-[var(--primary-base)]" />
          <h3 className="text-sm font-extrabold tracking-tight">Executive Recruiter Summary</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
          {aiAnalysis.summary}
        </p>
      </GlassCard>

      {/* 5. Gaps Analysis (Skills & Keyword checks) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MissingSkillsCard skills={aiAnalysis.missing_skills} />
        <KeywordGapsCard gaps={aiAnalysis.keyword_gaps} />
      </div>

      {/* 6. Strengths & Weaknesses checklists */}
      <div className="space-y-6">
        <StrengthsCard strengths={aiAnalysis.strengths} />
        <WeaknessesCard weaknesses={aiAnalysis.weaknesses} />
      </div>

      {/* 7. Actionable Roadmap & Accordions */}
      <RecommendationsCard recommendations={aiAnalysis.improvement_suggestions} />

      {/* 8. ATS Specific Formatting recommendations */}
      <AtsSuggestionsCard suggestions={aiAnalysis.ats_suggestions} />

      {/* AI Resume Recommendation Section */}
      <OptimizedResumeSection />

      {/* 9. Candidate Profile recap card */}
      <GlassCard className="border-[var(--border-premium)] space-y-6 bg-slate-900/5 dark:bg-black/10">
        
        {/* Title */}
        <div className="flex items-center space-x-2 text-slate-800 dark:text-white pb-3 border-b border-[var(--border-premium)]">
          <User className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-extrabold tracking-tight">Candidate Verification Context</h3>
        </div>

        {/* Profile Recap grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
          
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Candidate Profile</p>
            <p className="text-slate-800 dark:text-slate-200">{candidateInfo?.name || 'Candidate Name'}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Analysis Date</p>
            <div className="flex items-center space-x-1 text-slate-800 dark:text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{today}</span>
            </div>
          </div>

          {uploadedFile && (
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Analyzed File</p>
              <div className="flex items-center space-x-1 text-slate-800 dark:text-slate-200">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[120px]">{uploadedFile.name}</span>
                <span className="text-[10px] text-slate-400">({formatBytes(uploadedFile.size)})</span>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Integrations Profile</p>
            <div className="flex items-center space-x-1 text-emerald-500 font-mono text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>ZUSTAND_LOCALSTORE_ACTIVE</span>
            </div>
          </div>

        </div>

      </GlassCard>

    </section>
  );
};

// Heuristic score grader
function scoreToGrade(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Strong';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Average';
  return 'Improvement Needed';
}

export default ResultsDashboard;
