import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  FileText, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { useToast } from '../../providers/ToastProvider';
import { extractResume } from '../../services/extractionService';
import { parseCandidateProfile } from '../../utils/candidateParser';
import { formatBytes, getFriendlyFileType } from '../../utils/fileHelpers';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const UploadCard: React.FC = () => {
  const { 
    uploadedFile, 
    setUploadedFile, 
    setResumeText, 
    setCandidateInfo, 
    setExtractionProgress,
    extractionProgress,
    resetAll
  } = useResumeStore();
  
  const { addToast } = useToast();


  const handleProcessFile = async (file: File) => {
    // Reset any old parsing states
    resetAll();
    
    // Set uploaded file info
    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
    };
    
    setUploadedFile(fileInfo);
    
    try {
      // Run extraction pipeline
      const { text } = await extractResume(file, (stage, percent, log, confidence) => {
        setExtractionProgress({ stage, percent, log, ocrConfidence: confidence, stageText: getStageText(stage) });
      });

      // Run Candidate parsing
      setExtractionProgress({ stage: 'parsing', percent: 95, log: 'Running heuristic information extraction...', stageText: 'Detecting Candidate Information' });
      const profile = parseCandidateProfile(text);
      
      // Update state
      setResumeText(text);
      setCandidateInfo(profile);
      setExtractionProgress({ stage: 'success', percent: 100, log: 'Profile created successfully!', stageText: 'Context Ready' });
      
      addToast('Resume uploaded and processed successfully!', 'success');
    } catch (error: any) {
      setExtractionProgress({ stage: 'error', percent: 0, log: `Error: ${error.message || 'Failed to parse resume.'}`, stageText: 'Failed' });
      addToast(error.message || 'Failed to process resume.', 'error');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {

    if (rejectedFiles && rejectedFiles.length > 0) {
      const reject = rejectedFiles[0];
      if (reject.file.size > MAX_FILE_SIZE) {
        addToast('File is too large. Limit is 10MB.', 'error');
      } else {
        addToast('Unsupported file type. Please upload a PDF, DOCX, or Image (PNG/JPG/WEBP).', 'error');
      }
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      handleProcessFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    noClick: !!uploadedFile, // Disable click when file is already loaded
    maxSize: MAX_FILE_SIZE,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp']
    }
  });

  const removeCurrentFile = () => {
    resetAll();
    addToast('Resume removed successfully', 'info');
  };

  const getStageText = (stage: string) => {
    switch (stage) {
      case 'reading': return 'Reading Resume Document';
      case 'extracting': return 'Extracting Raw Text';
      case 'parsing': return 'Finding Candidate Information';
      case 'preparing': return 'Preparing Analysis Context';
      case 'success': return 'Extraction Completed';
      case 'error': return 'Extraction Interrupted';
      default: return 'Idle';
    }
  };

  const getStatusColorClass = () => {
    if (extractionProgress.stage === 'success') return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400';
    if (extractionProgress.stage === 'error') return 'border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400';
    if (extractionProgress.stage !== 'idle') return 'border-indigo-500/30 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400';
    return 'border-[var(--border-premium)] bg-slate-500/5 text-slate-500';
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Upload Zone container */}
      <div 
        {...getRootProps()}
        className={`relative w-full rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragActive 
            ? 'border-[var(--primary-base)] bg-[var(--primary-base)]/5 scale-[1.01] shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
            : uploadedFile 
              ? 'border-[var(--border-premium)] bg-[var(--bg-surface-glass)]' 
              : 'border-[var(--border-premium)] bg-[var(--bg-surface-glass)] hover:border-[var(--primary-base)]/40 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 cursor-pointer'
        }`}
      >
        <input {...getInputProps()} />

        {/* Outer animated gradient glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--primary-base)]/5 to-[var(--secondary-base)]/5 opacity-0 hover:opacity-100 dark:hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />

        <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4">
          
          <AnimatePresence mode="wait">
            {!uploadedFile ? (
              /* Drag & Drop State */
              <motion.div
                key="empty-upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-2xl text-[var(--primary-base)] border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud className="w-8 h-8 animate-bounce-slow" />
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-bold tracking-tight text-slate-800 dark:text-slate-200">
                    Drag and drop your resume here, or <span className="text-[var(--primary-base)] hover:underline decoration-2">browse</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Supports PDF, DOCX, PNG, JPG, WEBP (Max 10MB)
                  </p>
                </div>
              </motion.div>
            ) : (
              /* File Uploaded & Processing details */
              <motion.div
                key="uploaded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex flex-col items-center space-y-6"
              >
                <div className="flex items-center justify-between w-full p-4 rounded-xl border border-[var(--border-premium)] bg-[var(--bg-app)]/50">
                  
                  {/* File Metadata */}
                  <div className="flex items-center space-x-3 text-left min-w-0">
                    <div className="p-2.5 bg-[var(--primary-base)]/10 text-[var(--primary-base)] rounded-lg">
                      <FileText className="w-5 h-5 flex-shrink-0" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate pr-4">
                        {uploadedFile.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {getFriendlyFileType(uploadedFile.type, uploadedFile.name)} • {formatBytes(uploadedFile.size)}
                      </p>
                    </div>
                  </div>

                  {/* Actions (Replace, Remove) */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={open}
                      disabled={extractionProgress.stage === 'reading' || extractionProgress.stage === 'extracting'}
                      className="p-2 rounded-lg border border-[var(--border-premium)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
                      title="Replace Resume"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={removeCurrentFile}
                      disabled={extractionProgress.stage === 'reading' || extractionProgress.stage === 'extracting'}
                      className="p-2 rounded-lg border border-red-500/10 hover:border-red-500/20 bg-[var(--bg-surface)] hover:bg-red-500/5 text-rose-500 hover:text-rose-700 disabled:opacity-40 transition-colors cursor-pointer"
                      title="Remove Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Upload Status Card summary */}
                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusColorClass()}`}>
                  {extractionProgress.stage === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {extractionProgress.stage === 'error' && <AlertCircle className="w-3.5 h-3.5" />}
                  {['reading', 'extracting', 'parsing'].includes(extractionProgress.stage) && (
                    <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  <span>{extractionProgress.stageText}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};
export default UploadCard;
