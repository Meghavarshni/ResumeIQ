import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Star, 
  Trash2, 
  Copy, 
  FileText, 
  Calendar, 
  ArrowRight,
  FolderOpen,
  Edit2,
  AlertCircle,
  Columns,
  Sparkles,
  Info
} from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import { useToast } from '../providers/ToastProvider';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';
import type { HistoryItem } from '../types';

export const HistoryPage: React.FC = () => {
  const {
    history,
    deleteHistoryItem,
    duplicateHistoryItem,
    toggleFavorite,
    updateHistoryItem,
    setResumeText,
    setUploadedFile,
    setJobDescription,
    setAtsScore,
    setAiAnalysis,
    setOptimizedResume,
    setActiveHistoryId,
    selectedForComparison,
    setSelectedForComparison,
  } = useResumeStore();

  const { addToast } = useToast();
  const navigate = useNavigate();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [readinessFilter, setReadinessFilter] = useState<string>('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  
  // Inline rename item
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  // Workspace restore
  const handleOpen = (item: HistoryItem) => {
    setResumeText(item.resumeText);
    setUploadedFile({
      name: item.resumeFileName,
      size: 0,
      type: 'application/pdf',
      uploadTime: item.analysisDate,
    });
    setJobDescription(item.jobDescription);
    setAtsScore(item.atsScore);
    setAiAnalysis(item.aiAnalysisRaw);
    setOptimizedResume(item.optimizedResumeRaw);
    setActiveHistoryId(item.id);

    addToast(`Restored snapshot for ${item.candidateName}`, 'success');
    navigate('/');
  };

  const handleStartRename = (item: HistoryItem) => {
    setEditingId(item.id);
    setNewName(item.candidateName);
  };

  const handleSaveRename = (id: string) => {
    if (newName.trim() === '') return;
    updateHistoryItem(id, { candidateName: newName.trim() });
    setEditingId(null);
    addToast('Candidate report name updated.', 'success');
  };

  // Compare Checkboxes
  const handleToggleCompare = (id: string) => {
    const [c1, c2] = selectedForComparison;
    if (c1 === id) {
      setSelectedForComparison([c2, null]);
    } else if (c2 === id) {
      setSelectedForComparison([c1, null]);
    } else {
      if (!c1) {
        setSelectedForComparison([id, c2]);
      } else if (!c2) {
        setSelectedForComparison([c1, id]);
      } else {
        // Swap out the first one
        setSelectedForComparison([c2, id]);
        addToast('Comparison list updated (holds max 2 reports).', 'info');
      }
    }
  };

  // Filter & Search Logic
  const filteredHistory = history
    .filter((item) => {
      const matchSearch =
        item.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.resumeFileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.missingSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.keywordGaps.some((k) => k.keyword.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchReadiness = readinessFilter === 'All' || item.hiringReadiness === readinessFilter;
      const matchFavs = !favoritesOnly || item.isFavorite;

      return matchSearch && matchReadiness && matchFavs;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return 0; // Zustand adds items to start, so list matches insertions order
      if (sortBy === 'oldest') return 1; // reverse insertions
      
      const scoreA = a.atsScore;
      const scoreB = b.atsScore;
      if (sortBy === 'highest') return scoreB - scoreA;
      return scoreA - scoreB;
    });

  return (
    <div className="space-y-8 py-4 relative text-left">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-[var(--border-premium)]">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center space-x-2.5">
          <FolderOpen className="w-6 h-6 text-[var(--primary-base)]" />
          <span>Historical Analyses</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-semibold">
          Review, rename, download, or compare previous candidate compatibility score sheets stored in the browser database.
        </p>
      </div>

      {/* Filter / Search header Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[var(--bg-surface-glass)] p-4 rounded-2xl border border-[var(--border-premium)]">
        
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates, files, keywords, skills..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[var(--bg-app)] text-slate-800 dark:text-slate-200 border border-[var(--border-premium)] rounded-xl outline-none focus:border-[var(--primary-base)] transition-colors"
          />
        </div>

        {/* Readiness Filter */}
        <div className="md:col-span-3">
          <select
            value={readinessFilter}
            onChange={(e) => setReadinessFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[var(--bg-app)] text-slate-800 dark:text-slate-200 border border-[var(--border-premium)] rounded-xl outline-none focus:border-[var(--primary-base)] transition-colors"
          >
            <option value="All">All Readiness levels</option>
            <option value="Excellent">Excellent</option>
            <option value="Strong">Strong</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Sort Select */}
        <div className="md:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 text-xs bg-[var(--bg-app)] text-slate-800 dark:text-slate-200 border border-[var(--border-premium)] rounded-xl outline-none focus:border-[var(--primary-base)] transition-colors"
          >
            <option value="newest">Newest Runs</option>
            <option value="oldest">Oldest Runs</option>
            <option value="highest">Highest Score</option>
            <option value="lowest">Lowest Score</option>
          </select>
        </div>

        {/* Favorites check toggle */}
        <div className="md:col-span-2 flex items-center justify-end">
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors w-full sm:w-auto justify-center cursor-pointer ${
              favoritesOnly 
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' 
                : 'border-[var(--border-premium)] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-[var(--bg-app)]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-current' : ''}`} />
            <span>Starred</span>
          </button>
        </div>

      </div>

      {/* Grid listing */}
      {filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => {
            const isComparing = selectedForComparison.includes(item.id);
            const isEditing = editingId === item.id;

            return (
              <GlassCard 
                key={item.id} 
                className={`border-[var(--border-premium)] flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300 ${
                  isComparing ? 'ring-2 ring-[var(--primary-base)] shadow-lg' : ''
                }`}
                glow={isComparing}
              >
                <div className="space-y-4">
                  
                  {/* Card Header (Scores & Star) */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2.5">
                      {/* Score badge */}
                      <div className="px-2.5 py-1 rounded-lg bg-[var(--primary-base)] text-white text-xs font-black">
                        ATS {item.atsScore}
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-[var(--secondary-base)]/10 text-[var(--secondary-base)] text-xs font-black border border-[var(--secondary-base)]/20">
                        Match {item.jobMatchScore}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {/* Star Favorite */}
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="p-1 rounded text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Star Favorite"
                      >
                        <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Candidate Profile Details */}
                  <div className="space-y-2">
                    
                    {/* Candidate Name Rename / Display */}
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 text-xs bg-[var(--bg-app)] border border-[var(--primary-base)] rounded-lg outline-none text-slate-800 dark:text-slate-200"
                        />
                        <button
                          onClick={() => handleSaveRename(item.id)}
                          className="px-2 py-1.5 rounded-lg bg-emerald-500 text-white text-[10px] font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5 group">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[170px]">
                          {item.candidateName}
                        </h4>
                        <button
                          onClick={() => handleStartRename(item)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Rename report"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* File name / Version tag */}
                    <div className="flex flex-col space-y-1 text-[11px] text-slate-500">
                      <div className="flex items-center space-x-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{item.resumeFileName}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 font-mono text-[9px] text-[var(--primary-base)] font-bold">
                        <Sparkles className="w-3 h-3" />
                        <span>{item.versionLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Indicators (Readiness / Date) */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-[var(--border-premium)]">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.analysisDate}</span>
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold border ${
                      item.hiringReadiness === 'Excellent' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : item.hiringReadiness === 'Strong' 
                          ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' 
                          : item.hiringReadiness === 'Moderate' 
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                            : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}>
                      {item.hiringReadiness}
                    </span>
                  </div>

                </div>

                {/* Card Quick Actions bar */}
                <div className="pt-4 mt-4 border-t border-[var(--border-premium)] flex items-center justify-between gap-1.5">
                  <div className="flex items-center space-x-1">
                    
                    {/* Checkbox Compare Toggle */}
                    <button
                      onClick={() => handleToggleCompare(item.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isComparing
                          ? 'bg-[var(--primary-base)] text-white border-[var(--primary-base)]'
                          : 'border-[var(--border-premium)] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={isComparing ? 'Remove from Compare' : 'Add to Compare'}
                    >
                      <Columns className="w-3.5 h-3.5" />
                    </button>

                    {/* Clone Duplicate */}
                    <button
                      onClick={() => duplicateHistoryItem(item.id)}
                      className="p-1.5 rounded-lg border border-[var(--border-premium)] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Duplicate run"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Run */}
                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      className="p-1.5 rounded-lg border border-rose-500/10 text-rose-500 hover:bg-rose-500/5 transition-colors cursor-pointer"
                      title="Delete run"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Open details restore */}
                  <CustomButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpen(item)}
                    icon={<ArrowRight className="w-3 h-3" />}
                    iconPosition="right"
                  >
                    Open
                  </CustomButton>

                </div>

              </GlassCard>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-5 border border-dashed border-[var(--border-premium)] rounded-2xl bg-[var(--bg-surface-glass)]">
          <div className="p-4 bg-[var(--primary-base)]/10 text-[var(--primary-base)] rounded-full">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No Matching Reports</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              {history.length === 0 
                ? 'Your local dashboard registry is empty. Upload and analyze a resume file to generate reports.' 
                : 'No historical analyses match your selected filters or search terms.'}
            </p>
          </div>
          <CustomButton variant="primary" size="sm" onClick={() => navigate('/')}>
            Analyze a Resume
          </CustomButton>
        </div>
      )}

      {/* Floating Compare Notification Bar */}
      {selectedForComparison.filter(Boolean).length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-lg w-full px-4 z-40"
        >
          <div className="p-3 bg-slate-900 border border-slate-800 text-white rounded-2xl flex items-center justify-between shadow-2xl">
            <div className="flex items-center space-x-2 text-xs">
              <Info className="w-4.5 h-4.5 text-indigo-400" />
              <span>
                {selectedForComparison.filter(Boolean).length} item(s) selected for side-by-side comparison.
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedForComparison([null, null])}
                className="text-[10px] text-slate-400 hover:text-slate-200 px-2 py-1"
              >
                Clear
              </button>
              <CustomButton
                variant="primary"
                size="sm"
                onClick={() => navigate('/comparison')}
                disabled={selectedForComparison.filter(Boolean).length < 2}
              >
                Compare Now
              </CustomButton>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
};
export default HistoryPage;
