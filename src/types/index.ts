export type ThemeMode = 'light' | 'dark' | 'system';

export interface UploadedFileInfo {
  name: string;
  size: number;
  type: string;
  uploadTime: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

export interface CandidateProfile {
  name: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  skills: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  certifications: string[];
}

export type ExtractionStage = 
  | 'idle'
  | 'reading'
  | 'extracting'
  | 'parsing'
  | 'preparing'
  | 'success'
  | 'error'
  | 'analyzing';

export interface ExtractionProgressState {
  stage: ExtractionStage;
  stageText: string;
  percent: number;
  ocrConfidence: number | null;
  log: string;
}

export interface AppSettings {
  ocrEnabled: boolean;
  autoParseCandidates: boolean;
  persistSessions: boolean;
  animationsEnabled: boolean; // Prompt 3 settings
  highContrastEnabled: boolean; // Prompt 3 settings
}

// Prompt 2 Custom Types
export interface KeywordGapItem {
  keyword: string;
  importance: 'High' | 'Medium' | 'Low';
}

export interface StrengthItem {
  title: string;
  explanation: string;
}

export interface WeaknessItem {
  issue: string;
  impact: string;
  suggestion: string;
}

export interface ImprovementRecommendation {
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  action: string;
  impact: string;
}

export interface AIAnalysisResponse {
  ats_score: number;
  job_match_score: number;
  hiring_probability: number;
  hiring_readiness: 'Low' | 'Moderate' | 'Strong' | 'Excellent';
  missing_skills: string[];
  missing_keywords: string[];
  keyword_gaps: KeywordGapItem[];
  strengths: StrengthItem[];
  weaknesses: WeaknessItem[];
  ats_suggestions: string[];
  improvement_suggestions: ImprovementRecommendation[];
  recommended_resume_changes: string[];
  certifications_to_consider: string[];
  experience_gaps: string[];
  soft_skill_gaps: string[];
  technical_skill_gaps: string[];
  summary: string;
  final_verdict: 'Excellent Match' | 'Strong Match' | 'Moderate Match' | 'Weak Match';
}

// Prompt 3 Custom Types: Resume Recommendation Scheme
export interface OptimizedResumeHeader {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface OptimizedExperienceItem {
  role: string;
  company: string;
  duration: string;
  bullet_points: string[];
}

export interface OptimizedEducationItem {
  degree: string;
  institution: string;
  year: string;
}

export interface OptimizedProjectItem {
  title: string;
  technologies: string[];
  bullet_points: string[];
}

export interface OptimizedResumeResponse {
  header: OptimizedResumeHeader;
  professional_summary: string;
  skills: string[];
  experience: OptimizedExperienceItem[];
  education: OptimizedEducationItem[];
  projects: OptimizedProjectItem[];
  certifications: string[];
  achievements: string[];
}

// Persisted History Schema
export interface HistoryItem {
  id: string;
  candidateName: string;
  resumeFileName: string;
  resumeText: string;
  jobDescription: string;
  atsScore: number;
  jobMatchScore: number;
  hiringReadiness: 'Low' | 'Moderate' | 'Strong' | 'Excellent';
  missingSkills: string[];
  keywordGaps: KeywordGapItem[];
  recommendations: ImprovementRecommendation[];
  aiSummary: string;
  aiAnalysisRaw: AIAnalysisResponse;
  optimizedResumeRaw: OptimizedResumeResponse | null;
  analysisDate: string;
  isFavorite: boolean;
  versionGroupId: string; // Grouping token to find versions of the same file
  versionLabel: string; // Label (e.g. "V1 (Initial Analysis)", "V2 (Post-Keywords)")
}
