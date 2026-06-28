import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import type { ThemeMode } from '../types';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Menu, 
  X, 
  History, 
  Settings, 
  Sparkles,
  Columns,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { theme, setTheme } = useResumeStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  const cycleTheme = (mode: ThemeMode) => {
    setTheme(mode);
    setShowThemeOptions(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />;
      case 'dark': return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'system': return <Monitor className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-premium)] bg-[var(--bg-surface-glass)] backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative p-2 bg-gradient-to-br from-[var(--primary-base)] to-[var(--secondary-base)] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-5 h-5 text-white" />
            <div className="absolute inset-0 bg-white/20 rounded-xl filter blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent font-sans">
            Resume<span className="text-[var(--primary-base)] font-extrabold">IQ</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 font-sans">
          <Link 
            to="/" 
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/' 
                ? 'bg-[var(--primary-base)]/10 text-[var(--primary-base)] font-bold' 
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Optimizer</span>
          </Link>

          <Link 
            to="/history" 
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/history' 
                ? 'bg-[var(--primary-base)]/10 text-[var(--primary-base)] font-bold' 
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </Link>

          <Link 
            to="/comparison" 
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/comparison' 
                ? 'bg-[var(--primary-base)]/10 text-[var(--primary-base)] font-bold' 
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <Columns className="w-4 h-4" />
            <span>Compare</span>
          </Link>

          <Link 
            to="/analytics" 
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/analytics' 
                ? 'bg-[var(--primary-base)]/10 text-[var(--primary-base)] font-bold' 
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Analytics</span>
          </Link>
          
          <Link 
            to="/settings" 
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/settings' 
                ? 'bg-[var(--primary-base)]/10 text-[var(--primary-base)] font-bold' 
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>

          <div className="w-[1px] h-6 bg-[var(--border-premium)] mx-2" />

          {/* Theme Selector */}
          <div className="relative">
            <button
              onClick={() => setShowThemeOptions(!showThemeOptions)}
              className="flex items-center justify-center p-2 rounded-lg border border-[var(--border-premium)] hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {getThemeIcon()}
            </button>

            <AnimatePresence>
              {showThemeOptions && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowThemeOptions(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 rounded-xl border border-[var(--border-premium)] bg-[var(--bg-surface)] p-1 shadow-xl z-20"
                  >
                    <button
                      onClick={() => cycleTheme('light')}
                      className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        theme === 'light' 
                          ? 'bg-[var(--primary-base)] text-white' 
                          : 'text-slate-700 hover:bg-[var(--bg-surface-hover)] dark:text-slate-300'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span>Light</span>
                    </button>
                    <button
                      onClick={() => cycleTheme('dark')}
                      className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        theme === 'dark' 
                          ? 'bg-[var(--primary-base)] text-white' 
                          : 'text-slate-700 hover:bg-[var(--bg-surface-hover)] dark:text-slate-300'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Dark</span>
                    </button>
                    <button
                      onClick={() => cycleTheme('system')}
                      className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        theme === 'system' 
                          ? 'bg-[var(--primary-base)] text-white' 
                          : 'text-slate-700 hover:bg-[var(--bg-surface-hover)] dark:text-slate-300'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>System</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center space-x-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-[var(--border-premium)] hover:bg-[var(--bg-surface-hover)] text-slate-700 dark:text-slate-300 cursor-pointer"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[var(--border-premium)] bg-[var(--bg-surface)] overflow-hidden font-sans"
          >
            <div className="px-4 py-4 space-y-3 text-left">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-[var(--primary-base)]/10 text-[var(--primary-base)]' 
                    : 'text-slate-700 dark:text-slate-200 hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>Optimizer</span>
              </Link>
              
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === '/history' 
                    ? 'bg-[var(--primary-base)]/10 text-[var(--primary-base)]' 
                    : 'text-slate-700 dark:text-slate-200 hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <History className="w-5 h-5" />
                <span>History</span>
              </Link>

              <Link
                to="/comparison"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === '/comparison' 
                    ? 'bg-[var(--primary-base)]/10 text-[var(--primary-base)]' 
                    : 'text-slate-700 dark:text-slate-200 hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <Columns className="w-5 h-5" />
                <span>Compare</span>
              </Link>

              <Link
                to="/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === '/analytics' 
                    ? 'bg-[var(--primary-base)]/10 text-[var(--primary-base)]' 
                    : 'text-slate-700 dark:text-slate-200 hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Analytics</span>
              </Link>

              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === '/settings' 
                    ? 'bg-[var(--primary-base)]/10 text-[var(--primary-base)]' 
                    : 'text-slate-700 dark:text-slate-200 hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>

              <div className="h-[1px] bg-[var(--border-premium)] my-2" />

              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Theme</span>
                <div className="flex border border-[var(--border-premium)] rounded-lg p-0.5 bg-[var(--bg-app)]">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-1.5 rounded-md cursor-pointer ${theme === 'light' ? 'bg-white text-amber-500 shadow-sm dark:bg-slate-800' : 'text-slate-400'}`}
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-1.5 rounded-md cursor-pointer ${theme === 'dark' ? 'bg-white text-indigo-400 shadow-sm dark:bg-slate-800' : 'text-slate-400'}`}
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`p-1.5 rounded-md cursor-pointer ${theme === 'system' ? 'bg-white text-slate-500 shadow-sm dark:bg-slate-800' : 'text-slate-400'}`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default Header;
