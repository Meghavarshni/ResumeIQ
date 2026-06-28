import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  TrendingUp, 
  FileCheck, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';

export const AnalyticsPage: React.FC = () => {
  const { history } = useResumeStore();
  const navigate = useNavigate();

  // If no history, render empty state
  if (history.length === 0) {
    return (
      <div className="py-16 max-w-md mx-auto text-center space-y-6 text-left">
        <GlassCard className="border-[var(--border-premium)] bg-[var(--bg-surface-glass)] p-8 flex flex-col items-center space-y-5">
          <div className="p-4 bg-[var(--primary-base)]/10 text-[var(--primary-base)] rounded-full">
            <BarChart2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No Analytics Data Yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Analytics aggregate scores, frequencies, and compatibility trends across multiple sessions. Perform your first analysis to see data.
            </p>
          </div>
          <CustomButton 
            variant="primary" 
            size="sm" 
            onClick={() => navigate('/')}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Analyze Resume
          </CustomButton>
        </GlassCard>
      </div>
    );
  }

  // 1. KPI Calculations
  const totalAnalyses = history.length;
  const favoriteCount = history.filter((h) => h.isFavorite).length;

  const atsScores = history.map((h) => h.atsScore);
  const matchScores = history.map((h) => h.jobMatchScore);

  const highestAts = Math.max(...atsScores);
  const highestMatch = Math.max(...matchScores);

  const avgAts = Math.round(atsScores.reduce((sum, s) => sum + s, 0) / totalAnalyses);
  const avgMatch = Math.round(matchScores.reduce((sum, s) => sum + s, 0) / totalAnalyses);

  // 2. Skill Frequency Grouping (Top 5 Gaps)
  const skillFreqs: Record<string, number> = {};
  history.flatMap((h) => h.missingSkills).forEach((skill) => {
    skillFreqs[skill] = (skillFreqs[skill] || 0) + 1;
  });
  const topSkills = Object.entries(skillFreqs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 3. Keyword Frequency Grouping (Top 5 Gaps)
  const keywordFreqs: Record<string, number> = {};
  history.flatMap((h) => h.keywordGaps.map((k) => k.keyword)).forEach((k) => {
    keywordFreqs[k] = (keywordFreqs[k] || 0) + 1;
  });
  const topKeywords = Object.entries(keywordFreqs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 4. Hiring Readiness Distribution
  const readinessCounts = { Low: 0, Moderate: 0, Strong: 0, Excellent: 0 };
  history.forEach((h) => {
    if (readinessCounts[h.hiringReadiness] !== undefined) {
      readinessCounts[h.hiringReadiness]++;
    }
  });

  // 5. SVG Custom Line Chart coordinates (Chronological: oldest to newest)
  const chronologicalHistory = [...history].reverse();
  const chartHeight = 100;
  const chartWidth = 500;
  const padding = 20;

  // Make points coordinates
  const atsPoints = chronologicalHistory.map((item, idx) => {
    const x = padding + (idx * (chartWidth - 2 * padding)) / (totalAnalyses - 1 || 1);
    const y = chartHeight - padding - (item.atsScore * (chartHeight - 2 * padding)) / 100;
    return { x, y, score: item.atsScore, label: item.versionLabel };
  });

  const matchPoints = chronologicalHistory.map((item, idx) => {
    const x = padding + (idx * (chartWidth - 2 * padding)) / (totalAnalyses - 1 || 1);
    const y = chartHeight - padding - (item.jobMatchScore * (chartHeight - 2 * padding)) / 100;
    return { x, y, score: item.jobMatchScore, label: item.versionLabel };
  });

  const generatePathD = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    return points.reduce((path, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, '');
  };

  return (
    <div className="space-y-8 py-4 text-left">
      
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border-premium)]">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center space-x-2.5">
          <TrendingUp className="w-6 h-6 text-[var(--primary-base)]" />
          <span>Analytics & Progress</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-semibold">
          Aggregate performance statistics, common keywords gap analysis, and readiness score distributions.
        </p>
      </div>

      {/* KPI Overview row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total analyses */}
        <GlassCard className="border-[var(--border-premium)] bg-slate-500/2 space-y-1.5">
          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Total Analyses</span>
          <p className="text-3xl font-black text-slate-800 dark:text-white">{totalAnalyses}</p>
          <div className="text-[10px] text-slate-400 font-medium font-mono">
            {favoriteCount} favorited reports ({history.length} versions)
          </div>
        </GlassCard>

        {/* Card 2: Highest Score milestones */}
        <GlassCard className="border-[var(--border-premium)] bg-[var(--primary-base)]/2 space-y-1.5" glow>
          <span className="text-[9px] uppercase tracking-widest text-[var(--primary-base)] font-bold">Highest Score Milestone</span>
          <div className="flex items-baseline space-x-2.5">
            <span className="text-3xl font-black text-slate-800 dark:text-white">{highestAts}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">ATS</span>
            <span className="text-2xl font-black text-slate-400">/</span>
            <span className="text-3xl font-black text-slate-800 dark:text-white">{highestMatch}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Match</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">Record metrics across database</div>
        </GlassCard>

        {/* Card 3: Averages ATS */}
        <GlassCard className="border-[var(--border-premium)] bg-indigo-500/2 space-y-1.5">
          <span className="text-[9px] uppercase tracking-widest text-indigo-400 font-bold">Average ATS compliance</span>
          <p className="text-3xl font-black text-slate-800 dark:text-white">{avgAts}/100</p>
          <div className="text-[10px] text-slate-400 font-medium">Target format score benchmark</div>
        </GlassCard>

        {/* Card 4: Average Job Match */}
        <GlassCard className="border-[var(--border-premium)] bg-cyan-500/2 space-y-1.5">
          <span className="text-[9px] uppercase tracking-widest text-cyan-400 font-bold">Average role match</span>
          <p className="text-3xl font-black text-slate-800 dark:text-white">{avgMatch}%</p>
          <div className="text-[10px] text-slate-400 font-medium">Skills requirements matching alignment</div>
        </GlassCard>

      </div>

      {/* SVG Improvement Trend Line Chart */}
      <GlassCard className="border-[var(--border-premium)] space-y-4" glow>
        <div className="flex items-center space-x-2 text-slate-800 dark:text-white">
          <TrendingUp className="w-4.5 h-4.5 text-[var(--primary-base)]" />
          <h3 className="text-sm font-extrabold tracking-tight">Performance Evolution Trend</h3>
        </div>

        {/* Chart Viewbox */}
        <div className="relative w-full h-[180px] sm:h-[220px]">
          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            className="w-full h-full overflow-visible"
          >
            {/* Grid Line Tracks */}
            <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-slate-800/40" />
            <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-slate-800/40" />
            <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#f8fafc" strokeWidth="1" className="dark:stroke-slate-800" />

            {/* Path 1: ATS Scores (Indigo Line) */}
            {atsPoints.length > 0 && (
              <motion.path
                d={generatePathD(atsPoints)}
                fill="none"
                stroke="var(--primary-base)"
                strokeWidth="2.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            )}

            {/* Path 2: Match Scores (Cyan Line) */}
            {matchPoints.length > 0 && (
              <motion.path
                d={generatePathD(matchPoints)}
                fill="none"
                stroke="var(--secondary-base)"
                strokeWidth="2"
                strokeDasharray="4 2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
              />
            )}

            {/* Data Circles (ATS Points) */}
            {atsPoints.map((pt, idx) => (
              <g key={`ats-${idx}`}>
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r="3.5" 
                  fill="var(--primary-base)" 
                  className="shadow-md"
                />
                {totalAnalyses <= 10 && (
                  <text 
                    x={pt.x} 
                    y={pt.y - 8} 
                    textAnchor="middle" 
                    className="text-[7px] font-mono fill-slate-500 font-bold"
                  >
                    {pt.score}
                  </text>
                )}
              </g>
            ))}

            {/* Data Circles (Match Points) */}
            {matchPoints.map((pt, idx) => (
              <g key={`match-${idx}`}>
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r="3" 
                  fill="var(--secondary-base)" 
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-center space-x-6 text-[10px] font-mono text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-[var(--primary-base)]" />
            <span>ATS Formatting Score</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 border-t-2 border-dashed border-[var(--secondary-base)]" />
            <span>Job Match Score</span>
          </div>
        </div>

      </GlassCard>

      {/* Skill Gaps & Keyword Gaps frequency distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Missing Skills Horizontal Bars */}
        <GlassCard className="border-[var(--border-premium)] space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 dark:text-white pb-2 border-b border-[var(--border-premium)]">
            <Layers className="w-4 h-4 text-[var(--primary-base)]" />
            <h4 className="text-sm font-bold tracking-tight">Most Common Missing Skill Gaps</h4>
          </div>

          <div className="space-y-3 pt-1">
            {topSkills.length > 0 ? (
              topSkills.map(([skill, count]) => {
                const percent = Math.round((count / totalAnalyses) * 100);
                return (
                  <div key={skill} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                      <span>{skill}</span>
                      <span className="font-mono text-slate-400">{count} analysis ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/40 rounded-full overflow-hidden p-[1px]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic py-4">No skills Gaps detected across runs.</p>
            )}
          </div>
        </GlassCard>

        {/* Missing Keywords Horizontal Bars */}
        <GlassCard className="border-[var(--border-premium)] space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 dark:text-white pb-2 border-b border-[var(--border-premium)]">
            <BarChart2 className="w-4 h-4 text-[var(--secondary-base)]" />
            <h4 className="text-sm font-bold tracking-tight">Most Frequent Keyword Deficits</h4>
          </div>

          <div className="space-y-3 pt-1">
            {topKeywords.length > 0 ? (
              topKeywords.map(([keyword, count]) => {
                const percent = Math.round((count / totalAnalyses) * 100);
                return (
                  <div key={keyword} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                      <span>{keyword}</span>
                      <span className="font-mono text-slate-400">{count} times ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/40 rounded-full overflow-hidden p-[1px]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[var(--primary-base)] to-indigo-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic py-4">No vocabulary gaps detected.</p>
            )}
          </div>
        </GlassCard>

      </div>

      {/* Hiring Readiness Distribution Segmented Progress Card */}
      <GlassCard className="border-[var(--border-premium)] space-y-4">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-white pb-2 border-b border-[var(--border-premium)]">
          <FileCheck className="w-4.5 h-4.5 text-[var(--primary-base)]" />
          <h4 className="text-sm font-bold tracking-tight">Hiring Readiness split</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          {Object.entries(readinessCounts).map(([level, count]) => {
            const percent = Math.round((count / totalAnalyses) * 100);
            
            const borderColors = {
              Low: 'border-rose-500/20 bg-rose-500/2 text-rose-500',
              Moderate: 'border-amber-500/20 bg-amber-500/2 text-amber-500',
              Strong: 'border-indigo-500/20 bg-indigo-500/2 text-indigo-500',
              Excellent: 'border-emerald-500/20 bg-emerald-500/2 text-emerald-500',
            };

            return (
              <div 
                key={level} 
                className={`p-3 rounded-xl border flex flex-col justify-between h-[80px] ${borderColors[level as keyof typeof readinessCounts]}`}
              >
                <div className="flex justify-between font-bold text-[9px] uppercase tracking-wider opacity-75">
                  <span>{level}</span>
                  <span>{count}</span>
                </div>
                <div className="flex items-baseline space-x-1 mt-2">
                  <span className="text-2xl font-black">{percent}</span>
                  <span className="text-[10px] font-bold">%</span>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

    </div>
  );
};
export default AnalyticsPage;
