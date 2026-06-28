import React, { useState, useRef } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Monitor, 
  Trash2, 
  Download, 
  Upload, 
  AlertTriangle, 
  Accessibility,
  Eye
} from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import { useToast } from '../providers/ToastProvider';
import GlassCard from '../components/GlassCard';

export const SettingsPage: React.FC = () => {
  const {
    theme,
    setTheme,
    settings,
    updateSettings,
    history,
    clearHistory,
    importHistory,
    resetAll
  } = useResumeStore();

  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal confirmations states
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Backup Export
  const handleExportData = () => {
    if (history.length === 0) {
      addToast('No history records to export.', 'info');
      return;
    }

    try {
      const dataStr = JSON.stringify(history, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `resumeiq_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      addToast('Backup JSON exported successfully!', 'success');
    } catch {
      addToast('Failed to export backup.', 'error');
    }
  };

  // Backup Import
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!Array.isArray(parsed)) {
          throw new Error('Backup data must be an array of history snapshots.');
        }

        // Validate basic keys of history item to verify format
        if (parsed.length > 0 && (!parsed[0].id || !parsed[0].candidateName)) {
          throw new Error('Invalid schema format. Missing candidate name references.');
        }

        importHistory(parsed);
        addToast(`Successfully merged ${parsed.length} reports into database!`, 'success');
      } catch (err: any) {
        addToast(err.message || 'Failed to parse backup JSON file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input value
  };

  const handleClearHistoryAction = () => {
    clearHistory();
    setShowClearConfirm(false);
    addToast('All historical runs cleared successfully.', 'success');
  };

  const handleResetAppAction = () => {
    clearHistory();
    resetAll();
    setShowResetConfirm(false);
    addToast('Application reset to factory defaults.', 'success');
  };

  return (
    <div className="space-y-8 py-4 text-left relative max-w-4xl">
      
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border-premium)]">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center space-x-2.5">
          <Settings className="w-6 h-6 text-[var(--primary-base)]" />
          <span>System Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-semibold">
          Configure interface options, toggle accessibility enhancements, and manage report backups.
        </p>
      </div>

      {/* Grid boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Appearance Settings */}
        <GlassCard className="border-[var(--border-premium)] space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 dark:text-white pb-2 border-b border-[var(--border-premium)]">
            <Sun className="w-4.5 h-4.5 text-[var(--primary-base)]" />
            <h3 className="text-sm font-extrabold tracking-tight">Appearance & Theme</h3>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            {/* Theme mode triggers */}
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Theme Profile</p>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'system'] as const).map((mode) => {
                  const isActive = theme === mode;
                  const icons = {
                    light: <Sun className="w-3.5 h-3.5" />,
                    dark: <Moon className="w-3.5 h-3.5" />,
                    system: <Monitor className="w-3.5 h-3.5" />,
                  };
                  
                  return (
                    <button
                      key={mode}
                      onClick={() => setTheme(mode)}
                      className={`flex items-center justify-center space-x-1.5 py-2 px-3.5 rounded-xl border text-xs font-bold transition-colors capitalize cursor-pointer ${
                        isActive
                          ? 'bg-[var(--primary-base)]/10 text-[var(--primary-base)] border-[var(--primary-base)]/30'
                          : 'border-[var(--border-premium)] text-slate-500 hover:text-slate-700 bg-[var(--bg-app)]/30 dark:hover:text-slate-200'
                      }`}
                    >
                      {icons[mode]}
                      <span>{mode}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Animations Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-premium)] bg-[var(--bg-app)]/20">
              <div className="space-y-0.5">
                <p className="text-slate-800 dark:text-slate-200">Interactive Animations</p>
                <p className="text-[10px] text-slate-400 font-medium leading-normal">
                  Smooth Framer Motion hover translations and timelines.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.animationsEnabled}
                onChange={(e) => updateSettings({ animationsEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-[var(--primary-base)] border-[var(--border-premium)] focus:ring-[var(--primary-base)] outline-none"
              />
            </div>
          </div>
        </GlassCard>

        {/* Accessibility Panel */}
        <GlassCard className="border-[var(--border-premium)] space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 dark:text-white pb-2 border-b border-[var(--border-premium)]">
            <Accessibility className="w-4.5 h-4.5 text-[var(--secondary-base)]" />
            <h3 className="text-sm font-extrabold tracking-tight">Accessibility Overrides</h3>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            {/* High Contrast */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-premium)] bg-[var(--bg-app)]/20">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-slate-800 dark:text-slate-200">High Contrast Mode</p>
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-normal">
                  Standardizes border contrast boundaries to conform with WCAG levels.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.highContrastEnabled}
                onChange={(e) => {
                  updateSettings({ highContrastEnabled: e.target.checked });
                  addToast(e.target.checked ? 'High contrast enabled.' : 'High contrast disabled.', 'info');
                }}
                className="w-4 h-4 rounded text-[var(--primary-base)] border-[var(--border-premium)] focus:ring-[var(--primary-base)] outline-none"
              />
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">
              * Accessibility modes add additional focus rings and keyboard tab navigation rules dynamically.
            </p>
          </div>
        </GlassCard>

        {/* Backup manager */}
        <GlassCard className="border-[var(--border-premium)] space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 dark:text-white pb-2 border-b border-[var(--border-premium)]">
            <Upload className="w-4.5 h-4.5 text-[var(--accent-base)]" />
            <h3 className="text-sm font-extrabold tracking-tight">Backup Registry Manager</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Export */}
            <button
              onClick={handleExportData}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-[var(--border-premium)] bg-[var(--bg-app)] hover:bg-[var(--bg-surface-hover)] text-xs font-bold text-slate-600 dark:text-slate-350 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export History JSON</span>
            </button>

            {/* Import */}
            <button
              onClick={handleImportClick}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-[var(--border-premium)] bg-[var(--bg-app)] hover:bg-[var(--bg-surface-hover)] text-xs font-bold text-slate-600 dark:text-slate-350 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Import History JSON</span>
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            Backup exports capture all history entries, candidates tags, and versions into a single JSON file. Imports will merge data.
          </p>
        </GlassCard>

        {/* Danger zone */}
        <GlassCard className="border-rose-500/10 dark:border-rose-500/5 bg-rose-500/2 space-y-4">
          <div className="flex items-center space-x-2 text-rose-500 pb-2 border-b border-rose-500/10">
            <Trash2 className="w-4.5 h-4.5" />
            <h3 className="text-sm font-extrabold tracking-tight">Danger Zone</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1 text-xs">
            {/* Clear history */}
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/5 font-bold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>

            {/* Reset App */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-all shadow-md cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Reset Application</span>
            </button>
          </div>
        </GlassCard>

      </div>

      {/* 1. Modal Confirmation: Clear History */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="max-w-sm w-full p-6 bg-slate-900 border border-slate-800 text-white rounded-2xl space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2 text-amber-500">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-bold text-sm">Clear History Registry?</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              This action clears all saved candidate report profiles, keyword matching logs, and version folders. This cannot be undone.
            </p>
            <div className="flex justify-end space-x-2.5 text-xs">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-1.5 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistoryAction}
                className="px-3.5 py-1.5 rounded-lg bg-rose-500 text-white font-bold"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Confirmation: Reset App */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="max-w-sm w-full p-6 bg-slate-900 border border-slate-800 text-white rounded-2xl space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2 text-rose-500">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-bold text-sm">Reset Complete Application?</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              This resets settings, theme setups, clears the history caches, and clears the active file analysis workspace.
            </p>
            <div className="flex justify-end space-x-2.5 text-xs">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleResetAppAction}
                className="px-3.5 py-1.5 rounded-lg bg-rose-500 text-white font-bold"
              >
                Confirm Factory Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default SettingsPage;
