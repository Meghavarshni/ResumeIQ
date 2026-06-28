import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  ThemeMode, 
  UploadedFileInfo, 
  CandidateProfile, 
  AppSettings, 
  ExtractionProgressState,
  AIAnalysisResponse,
  OptimizedResumeResponse,
  HistoryItem 
} from '../types';

interface ResumeState {
  // Theme & Workspace files
  theme: ThemeMode;
  resumeText: string | null;
  candidateInfo: CandidateProfile | null;
  uploadedFile: UploadedFileInfo | null;
  jobDescription: string;
  settings: AppSettings;
  extractionProgress: ExtractionProgressState;

  // Prompt 2 states
  atsScore: number | null;
  aiAnalysis: AIAnalysisResponse | null;
  analysisLoading: boolean;
  analysisError: string | null;
  analysisStage: string | null;
  rateLimitTimestamps: number[];

  // Prompt 3 states
  optimizedResume: OptimizedResumeResponse | null;
  resumeRecommendationLoading: boolean;
  resumeRecommendationError: string | null;
  history: HistoryItem[];
  activeHistoryId: string | null; // Tracks active historical snapshot if restored
  selectedForComparison: [string | null, string | null];

  // Original actions
  setTheme: (theme: ThemeMode) => void;
  setResumeText: (text: string | null) => void;
  setCandidateInfo: (info: CandidateProfile | null) => void;
  setUploadedFile: (file: UploadedFileInfo | null) => void;
  setJobDescription: (desc: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setExtractionProgress: (progress: Partial<ExtractionProgressState>) => void;
  resetAll: () => void;

  // Prompt 2 actions
  setAtsScore: (score: number | null) => void;
  setAiAnalysis: (analysis: AIAnalysisResponse | null) => void;
  setAnalysisLoading: (loading: boolean) => void;
  setAnalysisError: (error: string | null) => void;
  setAnalysisStage: (stage: string | null) => void;
  addAnalysisTimestamp: (timestamp: number) => void;

  // Prompt 3 actions
  setOptimizedResume: (resume: OptimizedResumeResponse | null) => void;
  setResumeRecommendationLoading: (loading: boolean) => void;
  setResumeRecommendationError: (error: string | null) => void;
  addToHistory: (item: HistoryItem) => void;
  updateHistoryItem: (id: string, updates: Partial<HistoryItem>) => void;
  deleteHistoryItem: (id: string) => void;
  duplicateHistoryItem: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setActiveHistoryId: (id: string | null) => void;
  setSelectedForComparison: (selected: [string | null, string | null]) => void;
  clearHistory: () => void;
  importHistory: (imported: HistoryItem[]) => void;
}

const defaultProgress: ExtractionProgressState = {
  stage: 'idle',
  stageText: 'Ready to receive file',
  percent: 0,
  ocrConfidence: null,
  log: '',
};

const defaultSettings: AppSettings = {
  ocrEnabled: true,
  autoParseCandidates: true,
  persistSessions: true,
  animationsEnabled: true,
  highContrastEnabled: false,
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      // Defaults
      theme: 'system',
      resumeText: null,
      candidateInfo: null,
      uploadedFile: null,
      jobDescription: '',
      settings: defaultSettings,
      extractionProgress: defaultProgress,

      atsScore: null,
      aiAnalysis: null,
      analysisLoading: false,
      analysisError: null,
      analysisStage: null,
      rateLimitTimestamps: [],

      optimizedResume: null,
      resumeRecommendationLoading: false,
      resumeRecommendationError: null,
      history: [],
      activeHistoryId: null,
      selectedForComparison: [null, null],

      // Standard Actions
      setTheme: (theme) => set({ theme }),
      setResumeText: (resumeText) => set({ resumeText }),
      setCandidateInfo: (candidateInfo) => set({ candidateInfo }),
      setUploadedFile: (uploadedFile) => set({ uploadedFile }),
      setJobDescription: (jobDescription) => set({ jobDescription }),
      updateSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),
      setExtractionProgress: (progress) =>
        set((state) => ({
          extractionProgress: { ...state.extractionProgress, ...progress },
        })),

      // Reset workspace details (preserving persistent history list)
      resetAll: () =>
        set({
          resumeText: null,
          candidateInfo: null,
          uploadedFile: null,
          extractionProgress: defaultProgress,
          atsScore: null,
          aiAnalysis: null,
          analysisLoading: false,
          analysisError: null,
          analysisStage: null,
          optimizedResume: null,
          activeHistoryId: null,
        }),

      // Prompt 2 Actions
      setAtsScore: (atsScore) => set({ atsScore }),
      setAiAnalysis: (aiAnalysis) => set({ aiAnalysis }),
      setAnalysisLoading: (analysisLoading) => set({ analysisLoading }),
      setAnalysisError: (analysisError) => set({ analysisError }),
      setAnalysisStage: (analysisStage) => set({ analysisStage }),
      addAnalysisTimestamp: (timestamp) =>
        set((state) => ({
          rateLimitTimestamps: [...state.rateLimitTimestamps, timestamp],
        })),

      // Prompt 3 Actions
      setOptimizedResume: (optimizedResume) => set({ optimizedResume }),
      setResumeRecommendationLoading: (resumeRecommendationLoading) =>
        set({ resumeRecommendationLoading }),
      setResumeRecommendationError: (resumeRecommendationError) =>
        set({ resumeRecommendationError }),
      
      addToHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history],
        })),
        
      updateHistoryItem: (id, updates) =>
        set((state) => ({
          history: state.history.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
        
      deleteHistoryItem: (id) =>
        set((state) => {
          // If active workspace is bound to this item, clear it
          const wasActive = state.activeHistoryId === id;
          const cleanActive = wasActive ? null : state.activeHistoryId;
          return {
            history: state.history.filter((item) => item.id !== id),
            activeHistoryId: cleanActive,
          };
        }),
        
      duplicateHistoryItem: (id) =>
        set((state) => {
          const target = state.history.find((item) => item.id === id);
          if (!target) return {};
          
          const newId = Math.random().toString(36).substring(2, 9);
          
          // Get all elements in version family to determine V number
          const familyCount = state.history.filter(
            (item) => item.versionGroupId === target.versionGroupId
          ).length;
          
          const clone: HistoryItem = {
            ...target,
            id: newId,
            candidateName: `${target.candidateName} (Copy)`,
            versionLabel: `V${familyCount + 1} (Duplicate Analysis)`,
            analysisDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
          };
          
          return {
            history: [clone, ...state.history],
          };
        }),

      toggleFavorite: (id) =>
        set((state) => ({
          history: state.history.map((item) =>
            item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
          ),
        })),

      setActiveHistoryId: (activeHistoryId) => set({ activeHistoryId }),
      
      setSelectedForComparison: (selectedForComparison) =>
        set({ selectedForComparison }),
        
      clearHistory: () =>
        set({
          history: [],
          activeHistoryId: null,
          selectedForComparison: [null, null],
        }),
        
      importHistory: (imported) =>
        set((state) => {
          // Merge imported history items, avoiding exact ID collisions
          const existingIds = new Set(state.history.map((item) => item.id));
          const cleanedImported = imported.map((item) => {
            if (existingIds.has(item.id)) {
              return { ...item, id: Math.random().toString(36).substring(2, 9) };
            }
            return item;
          });
          return {
            history: [...cleanedImported, ...state.history],
          };
        }),
    }),
    {
      name: 'resume-iq-storage',
      // Persist crucial system caches across refreshing sessions
      partialize: (state) => ({
        theme: state.theme,
        resumeText: state.resumeText,
        candidateInfo: state.candidateInfo,
        uploadedFile: state.uploadedFile,
        jobDescription: state.jobDescription,
        settings: state.settings,
        atsScore: state.atsScore,
        aiAnalysis: state.aiAnalysis,
        rateLimitTimestamps: state.rateLimitTimestamps,
        optimizedResume: state.optimizedResume,
        history: state.history,
        activeHistoryId: state.activeHistoryId,
        selectedForComparison: state.selectedForComparison,
      }),
    }
  )
);
export default useResumeStore;
