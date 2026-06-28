import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[var(--border-premium)] py-8 mt-auto bg-[var(--bg-surface-glass)]/20 backdrop-blur-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 space-y-4 sm:space-y-0">
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">ResumeIQ</span> - Optimize. Match. Get Hired.
        </div>
        <div className="flex items-center space-x-6">
          <span>© 2026 Meghavarshni</span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
