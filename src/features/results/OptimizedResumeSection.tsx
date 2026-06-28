import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Mail, 
  Phone,
  Loader2
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { useToast } from '../../providers/ToastProvider';
import { generateResumeRecommendation } from '../../services/openrouter';
import ResumePdfReport from '../../components/ResumePdfReport';
import OptimizedResumePdf from '../../components/OptimizedResumePdf';
import GlassCard from '../../components/GlassCard';
import CustomButton from '../../components/CustomButton';

export const OptimizedResumeSection: React.FC = () => {
  const {
    resumeText,
    candidateInfo,
    jobDescription,
    atsScore,
    aiAnalysis,
    optimizedResume,
    setOptimizedResume,
    resumeRecommendationLoading,
    setResumeRecommendationLoading,
    setResumeRecommendationError,
    history,
    activeHistoryId,
    updateHistoryItem,
  } = useResumeStore();

  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');

  if (!aiAnalysis) return null;

  const handleCopyJson = () => {
    if (!optimizedResume) return;
    navigator.clipboard.writeText(JSON.stringify(optimizedResume, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Optimized Resume JSON copied to clipboard!', 'success');
  };

  const handleRegenerate = async () => {
    if (!resumeText || !jobDescription || !aiAnalysis) return;

    setResumeRecommendationLoading(true);
    setResumeRecommendationError(null);
    addToast('Regenerating optimized resume structure...', 'info');

    try {
      const regenerated = await generateResumeRecommendation(
        resumeText,
        candidateInfo,
        jobDescription,
        atsScore || 70,
        aiAnalysis.job_match_score,
        aiAnalysis
      );

      setOptimizedResume(regenerated);
      addToast('ATS Optimized Resume regenerated successfully!', 'success');

      // Update history item if active
      if (activeHistoryId) {
        updateHistoryItem(activeHistoryId, { optimizedResumeRaw: regenerated });
      }
    } catch (err: any) {
      setResumeRecommendationError(err.message || 'Failed to regenerate resume.');
      addToast(err.message || 'Failed to regenerate resume.', 'error');
    } finally {
      setResumeRecommendationLoading(false);
    }
  };

  return (
    <GlassCard className="border-[var(--border-premium)] text-left space-y-6" glow>
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[var(--border-premium)] gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[var(--accent-base)]">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest font-mono">
              AI Recommendation Engine
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
            ATS Optimized Resume Blueprint
          </h3>
        </div>

        {/* Regenerate Trigger */}
        <CustomButton
          variant="secondary"
          size="sm"
          onClick={handleRegenerate}
          disabled={resumeRecommendationLoading}
          icon={resumeRecommendationLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
        >
          Regenerate Blueprint
        </CustomButton>
      </div>

      {/* Loading Overlay Spinner inside the card container */}
      {resumeRecommendationLoading && (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-[var(--primary-base)] animate-spin" />
          <p className="text-xs text-slate-500 font-mono">Synthesizing optimized single-column resume formatting...</p>
        </div>
      )}

      {!resumeRecommendationLoading && !optimizedResume && (
        <div className="py-8 text-center space-y-3 border border-dashed border-[var(--border-premium)] rounded-xl">
          <p className="text-xs text-slate-400 italic">Resume blueprint is not loaded yet.</p>
          <CustomButton variant="primary" size="sm" onClick={handleRegenerate}>
            Generate Optimized Resume
          </CustomButton>
        </div>
      )}

      {/* Recommended Details Preview */}
      {!resumeRecommendationLoading && optimizedResume && (
        <div className="space-y-6">
          
          {/* Action buttons (Download links / copy JSON) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Download Report */}
            <PDFDownloadLink
              document={
                <ResumePdfReport
                  candidateInfo={candidateInfo}
                  resumeFileName={history.find(h => h.id === activeHistoryId)?.resumeFileName || 'resume.pdf'}
                  atsScore={atsScore || 70}
                  aiAnalysis={aiAnalysis}
                  timestamp={new Date().toLocaleDateString()}
                />
              }
              fileName={`${candidateInfo?.name || 'candidate'}_ats_report.pdf`}
              className="w-full"
            >
              {/* @ts-ignore */}
              {({ loading }) => (
                <CustomButton
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                  icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  disabled={loading}
                >
                  {loading ? 'Compiling PDF...' : 'Download Report PDF'}
                </CustomButton>
              )}
            </PDFDownloadLink>

            {/* Download Resume */}
            <PDFDownloadLink
              document={<OptimizedResumePdf resumeData={optimizedResume} />}
              fileName={`${optimizedResume.header.name || 'candidate'}_optimized_resume.pdf`}
              className="w-full"
            >
              {/* @ts-ignore */}
              {({ loading }) => (
                <CustomButton
                  variant="accent"
                  size="sm"
                  className="w-full justify-center text-white"
                  icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  disabled={loading}
                >
                  {loading ? 'Compiling PDF...' : 'Download Resume PDF'}
                </CustomButton>
              )}
            </PDFDownloadLink>

            {/* Copy JSON */}
            <CustomButton
              variant="secondary"
              size="sm"
              className="w-full justify-center"
              onClick={handleCopyJson}
              icon={copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            >
              Copy Resume JSON
            </CustomButton>

          </div>

          {/* Interactive tabs */}
          <div className="flex border-b border-[var(--border-premium)]">
            <button
              onClick={() => setActiveTab('preview')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 outline-none cursor-pointer ${
                activeTab === 'preview'
                  ? 'border-[var(--primary-base)] text-[var(--primary-base)]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Interactive Layout
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 outline-none cursor-pointer ${
                activeTab === 'json'
                  ? 'border-[var(--primary-base)] text-[var(--primary-base)]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Raw Export JSON
            </button>
          </div>

          {/* Tab Content 1: Previewer */}
          {activeTab === 'preview' && (
            <div className="space-y-6 bg-white dark:bg-slate-900/40 p-5 rounded-2xl border border-[var(--border-premium)] font-sans text-slate-800 dark:text-slate-200">
              
              {/* Profile Header */}
              <div className="text-center pb-4 border-b border-[var(--border-premium)] space-y-2">
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  {optimizedResume.header.name}
                </h4>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{optimizedResume.header.email}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{optimizedResume.header.phone}</span>
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <h5 className="text-xs uppercase font-extrabold tracking-widest text-[var(--primary-base)] border-b border-[var(--border-premium)] pb-1">
                  Professional Summary
                </h5>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350">
                  {optimizedResume.professional_summary}
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <h5 className="text-xs uppercase font-extrabold tracking-widest text-[var(--primary-base)] border-b border-[var(--border-premium)] pb-1">
                  Core Skills Blueprint
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {optimizedResume.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-2.5 py-1 text-[10px] rounded-lg font-bold bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-850"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-4">
                <h5 className="text-xs uppercase font-extrabold tracking-widest text-[var(--primary-base)] border-b border-[var(--border-premium)] pb-1">
                  Professional Experience
                </h5>
                <div className="space-y-4">
                  {optimizedResume.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-900 dark:text-white">{exp.role}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{exp.duration}</span>
                      </div>
                      <p className="text-[10px] text-[var(--secondary-base)] font-bold">{exp.company}</p>
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        {exp.bullet_points.map((bullet, bIdx) => (
                          <li key={bIdx} className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed pl-1">
                            <span className="align-middle">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              {optimizedResume.projects && optimizedResume.projects.length > 0 && (
                <div className="space-y-4">
                  <h5 className="text-xs uppercase font-extrabold tracking-widest text-[var(--primary-base)] border-b border-[var(--border-premium)] pb-1">
                    Key Projects
                  </h5>
                  <div className="space-y-3">
                    {optimizedResume.projects.map((proj, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-900 dark:text-white">{proj.title}</span>
                          <span className="text-[10px] text-slate-400">[{proj.technologies.join(', ')}]</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 pl-1">
                          {proj.bullet_points.map((bullet, bIdx) => (
                            <li key={bIdx} className="text-xs text-slate-500 dark:text-slate-455 leading-relaxed pl-1">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              <div className="space-y-2">
                <h5 className="text-xs uppercase font-extrabold tracking-widest text-[var(--primary-base)] border-b border-[var(--border-premium)] pb-1">
                  Education
                </h5>
                <div className="space-y-2">
                  {optimizedResume.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span>
                        <span className="font-bold text-slate-900 dark:text-white">{edu.degree}</span>
                        <span className="text-slate-500"> - {edu.institution}</span>
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Tab Content 2: Raw Code export */}
          {activeTab === 'json' && (
            <div className="relative">
              <pre className="p-4 rounded-xl border border-[var(--border-premium)] bg-slate-950 text-emerald-400 text-xs overflow-x-auto font-mono max-h-[450px]">
                {JSON.stringify(optimizedResume, null, 2)}
              </pre>
            </div>
          )}

        </div>
      )}

    </GlassCard>
  );
};
export default OptimizedResumeSection;
