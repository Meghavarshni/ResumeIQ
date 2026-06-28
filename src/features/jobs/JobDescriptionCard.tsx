import React, { useState, useEffect } from 'react';
import { Briefcase, Info, ShieldAlert, Cpu } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { useToast } from '../../providers/ToastProvider';
import { calculateATSScore } from '../../utils/atsEngine';
import { checkRateLimit } from '../../utils/rateLimiter';
import { fetchAIAnalysisFromOpenRouter, generateResumeRecommendation } from '../../services/openrouter';
import PremiumTextarea from '../../components/PremiumTextarea';
import GlassCard from '../../components/GlassCard';
import CustomButton from '../../components/CustomButton';
import LoadingOverlay from '../extraction/LoadingOverlay';

export const JobDescriptionCard: React.FC = () => {
  const {
    resumeText,
    candidateInfo,
    jobDescription,
    uploadedFile,
    setJobDescription,
    setAtsScore,
    setAiAnalysis,
    rateLimitTimestamps,
    addAnalysisTimestamp,
    analysisLoading,
    setAnalysisLoading,
    analysisError,
    setAnalysisError,
    setOptimizedResume,
    setResumeRecommendationLoading,
    setResumeRecommendationError,
    history,
    activeHistoryId,
    setActiveHistoryId,
    addToHistory,
  } = useResumeStore();

  const { addToast } = useToast();
  const [cooldown, setCooldown] = useState<number>(0);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Rate Limiting Evaluation
  const rateLimit = checkRateLimit(rateLimitTimestamps);

  // Cooldown effect
  useEffect(() => {
    if (rateLimit.cooldownSeconds > 0) {
      setCooldown(rateLimit.cooldownSeconds);
    }
  }, [rateLimit.cooldownSeconds]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Validation
  const isResumeLoaded = !!resumeText;
  const isJdValid = jobDescription.trim().length >= 100 && jobDescription.trim().length <= 20000;
  const isValid = isResumeLoaded && isJdValid;

  const handleAnalyze = async () => {
    if (!isValid) return;

    // Check rate limit one last time dynamically
    const dynamicRateLimit = checkRateLimit(rateLimitTimestamps);
    if (!dynamicRateLimit.allowed) {
      setCooldown(dynamicRateLimit.cooldownSeconds);
      addToast(`Rate limit reached. Please wait ${dynamicRateLimit.cooldownSeconds}s before analyzing.`, 'error');
      return;
    }

    setAnalysisLoading(true);
    setAnalysisError(null);

    // 1. Calculate ATS Score client-side first
    const score = calculateATSScore(resumeText || '', jobDescription);
    setAtsScore(score);

    // 2. Local Rate limit update
    const now = Date.now();
    addAnalysisTimestamp(now);

    // 3. Spawning controller for cancelable requests
    const controller = new AbortController();
    setAbortController(controller);

    try {
      // 4. Fetch analysis
      const result = await fetchAIAnalysisFromOpenRouter(
        resumeText || '',
        candidateInfo,
        jobDescription,
        score,
        controller.signal
      );

      setAiAnalysis(result);
      addToast('ATS analysis completed successfully!', 'success');

      // 5. Fetch recommended optimized resume
      setResumeRecommendationLoading(true);
      setResumeRecommendationError(null);
      let optResume = null;
      try {
        const optimized = await generateResumeRecommendation(
          resumeText || '',
          candidateInfo,
          jobDescription,
          score,
          result.job_match_score,
          result,
          controller.signal
        );
        setOptimizedResume(optimized);
        optResume = optimized;
        addToast('Optimized resume recommendations compiled!', 'success');
      } catch (optErr: any) {
        console.error('Optimized resume recommendation AI run failed:', optErr);
        setResumeRecommendationError(optErr.message || 'Failed to optimize resume structure.');
      } finally {
        setResumeRecommendationLoading(false);
      }

      // 6. Save Snapshot to Persistent History
      const histId = Math.random().toString(36).substring(2, 9);
      const isNewGroup = !activeHistoryId;
      const newGroupId = isNewGroup ? histId : (history.find(h => h.id === activeHistoryId)?.versionGroupId || histId);
      
      const familyCount = history.filter(h => h.versionGroupId === newGroupId).length;
      const vLabel = `V${familyCount + 1} (${isNewGroup ? 'Initial Analysis' : 'Re-Analysis'})`;

      const historyItem = {
        id: histId,
        candidateName: candidateInfo?.name || 'Unknown Candidate',
        resumeFileName: uploadedFile?.name || 'resume.pdf',
        resumeText: resumeText || '',
        jobDescription: jobDescription,
        atsScore: score,
        jobMatchScore: result.job_match_score,
        hiringReadiness: result.hiring_readiness,
        missingSkills: result.missing_skills,
        keywordGaps: result.keyword_gaps,
        recommendations: result.improvement_suggestions,
        aiSummary: result.summary,
        aiAnalysisRaw: result,
        optimizedResumeRaw: optResume,
        analysisDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
        isFavorite: false,
        versionGroupId: newGroupId,
        versionLabel: vLabel,
      };

      addToHistory(historyItem);
      setActiveHistoryId(histId);

      // Scroll to dashboard viewport
      setTimeout(() => {
        const dashboard = document.getElementById('results-dashboard-anchor');
        if (dashboard) {
          dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setAnalysisError(err.message || 'Connection failed.');
        addToast(err.message || 'Failed to complete analysis.', 'error');
      }
    } finally {
      setAnalysisLoading(false);
      setAbortController(null);
    }
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setAnalysisLoading(false);
      setAbortController(null);
      addToast('Analysis request cancelled.', 'info');
    }
  };

  return (
    <div className="space-y-4 h-full">
      <GlassCard className="border-[var(--border-premium)] h-full flex flex-col justify-between" glow>
        <div className="space-y-4 text-left">
          {/* Section Header */}
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[var(--border-premium)]">
            <div className="p-1.5 bg-[var(--primary-base)]/10 text-[var(--primary-base)] rounded-lg">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
                Target Job Specification
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Provide job context to enable recruitment analysis match checks.
              </p>
            </div>
          </div>

          {/* Text Input area component */}
          <div className="pt-2">
            <PremiumTextarea
              value={jobDescription}
              onChange={setJobDescription}
              placeholder="Paste target job descriptions (roles, core requirements, stack details) here..."
              minCharacters={100}
              maxCharacters={20000}
              label="Job Description details"
              id="main-job-details-area"
              error={analysisError || undefined}
            />
          </div>
        </div>

        {/* Action button & Rate limit summary widgets */}
        <div className="pt-6 border-t border-[var(--border-premium)] space-y-4">
          
          {/* Rate limiting warning */}
          {!rateLimit.allowed || cooldown > 0 ? (
            <div className="flex items-start space-x-2.5 p-3 rounded-xl border border-[var(--status-danger)]/20 bg-[var(--status-danger)]/5 text-[var(--status-danger)] text-xs text-left">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Rate Limit Reached</p>
                <p className="text-[10px] opacity-80 leading-normal">
                  ResumeIQ enforces local limits to protect API keys. Cooldown active for next {cooldown} seconds.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-500">
              <Info className="w-3.5 h-3.5" />
              <span>
                Quota: {rateLimit.remainingTotal} of 5 left this minute ({rateLimit.remainingHour} of 10 hourly).
              </span>
            </div>
          )}

          {/* Prompt missing resume alert */}
          {!isResumeLoaded && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500 italic text-left">
              * Please upload a resume file in the upload zone first to run checks.
            </p>
          )}

          {/* Master CTA analyze trigger */}
          <CustomButton
            variant="primary"
            size="lg"
            className="w-full justify-center"
            disabled={!isValid || cooldown > 0 || analysisLoading}
            onClick={handleAnalyze}
            loading={analysisLoading}
            icon={<Cpu className="w-4.5 h-4.5" />}
          >
            Analyze Resume
          </CustomButton>
        </div>
      </GlassCard>

      {/* Loading Overlay portal */}
      <LoadingOverlay isVisible={analysisLoading} onCancel={handleCancel} />
    </div>
  );
};
export default JobDescriptionCard;
