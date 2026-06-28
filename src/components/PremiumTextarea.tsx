import React, { useRef, useEffect } from 'react';
import { Sparkles, Trash2, Clipboard } from 'lucide-react';

interface PremiumTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minCharacters?: number;
  maxCharacters?: number;
  label?: string;
  id?: string;
  error?: string;
}

const PRESET_JOB = `Software Engineer (Frontend)

Requirements:
- 3+ years of experience with React, TypeScript, and Tailwind CSS.
- Strong understanding of component composition, responsive design, and state management (Zustand/Redux).
- Experience working with bundlers (Vite/Webpack) and modern client-side extraction services.
- Passion for visual excellence, micro-interactions, and accessibility standards (ARIA).
- Excellent communication skills and pair-programming collaboration.`;

export const PremiumTextarea: React.FC<PremiumTextareaProps> = ({
  value,
  onChange,
  placeholder = 'Paste job description here...',
  minCharacters = 100,
  maxCharacters = 20000,
  label = 'Job Description',
  id = 'job-description-textarea',
  error,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize height effect
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(textarea.scrollHeight, 120)}px`;
  }, [value]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch {
      // Fallback if clipboard API is not available
      alert('Clipboard paste not supported in this browser. Please use Ctrl+V / Cmd+V.');
    }
  };

  const loadPreset = () => {
    onChange(PRESET_JOB);
  };

  // Metrics
  const charCount = value.length;
  const wordCount = value.trim() === '' ? 0 : value.trim().split(/\s+/).length;
  const showWarning = charCount > 0 && charCount < minCharacters;
  const showMaxWarning = charCount > maxCharacters;

  return (
    <div className="flex flex-col space-y-2.5 w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200"
        >
          {label}
        </label>
        
        {/* Helper quick actions */}
        <div className="flex items-center space-y-0 space-x-1.5">
          <button
            type="button"
            onClick={loadPreset}
            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs rounded-md bg-[var(--primary-base)]/10 text-[var(--primary-base)] hover:bg-[var(--primary-base)]/15 border border-[var(--primary-base)]/10 transition-colors"
          >
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>Load Example Job</span>
          </button>
        </div>
      </div>

      {/* Input container */}
      <div className={`relative group rounded-xl border bg-[var(--bg-surface-glass)] focus-within:border-[var(--primary-base)]/50 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.08)] transition-all duration-300 ${
        showMaxWarning ? 'border-[var(--status-danger)]/55' : 'border-[var(--border-premium)]'
      }`}>
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[120px] max-h-[450px] bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 p-4 border-0 outline-none resize-none focus:ring-0 focus:outline-none"
        />

        {/* Textarea quick buttons */}
        <div className="absolute right-3 bottom-3 flex items-center space-x-1.5 opacity-40 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={handlePaste}
            className="p-1.5 rounded-lg border border-[var(--border-premium)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            title="Paste Clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
          </button>
          
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg border border-[var(--border-premium)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-rose-500 hover:text-rose-700 transition-colors"
              title="Clear Text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Counters & Validations footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 dark:text-slate-400 gap-1.5">
        <div className="flex items-center space-x-4">
          <span>Words: <span className="font-semibold text-slate-700 dark:text-slate-300">{wordCount}</span></span>
          <span className={showMaxWarning ? 'text-[var(--status-danger)] font-bold' : ''}>
            Characters: <span className="font-semibold">{charCount}</span> / {maxCharacters}
          </span>
        </div>

        <div>
          {showWarning ? (
            <span className="text-[var(--status-warning)] font-medium">
              Requires at least {minCharacters - charCount} more characters to validate.
            </span>
          ) : showMaxWarning ? (
            <span className="text-[var(--status-danger)] font-medium">
              Exceeds limit by {charCount - maxCharacters} characters.
            </span>
          ) : charCount >= minCharacters ? (
            <span className="text-[var(--status-success)] font-medium flex items-center">
              ✓ Ready for analysis
            </span>
          ) : (
            <span className="text-slate-400">Min {minCharacters} characters</span>
          )}
        </div>
      </div>

      {/* Explicit error card */}
      {error && (
        <span className="text-xs text-[var(--status-danger)] font-medium mt-1">
          {error}
        </span>
      )}
    </div>
  );
};
export default PremiumTextarea;

