import React, { useEffect } from 'react';
import { useResumeStore } from '../store/useResumeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useResumeStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (currentTheme: 'light' | 'dark') => {
      root.classList.remove('light', 'dark');
      root.classList.add(currentTheme);
    };

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      applyTheme(systemTheme);

      // Set up listener for system media query changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  return <>{children}</>;
};
export default ThemeProvider;
