'use client';

import { useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  const applyTheme = useCallback((newTheme: Theme) => {
    const html = document.documentElement;
    
    // Remove all theme classes
    html.classList.remove('light', 'dark');
    
    // Add current theme class
    html.classList.add(newTheme);
  }, []);

  // Initialize theme
  useEffect(() => {
    setMounted(true);
    
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, [applyTheme]);

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [applyTheme]);

  // Apply theme when it changes
  useEffect(() => {
    if (mounted) {
      applyTheme(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted, applyTheme]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <div className="theme-provider">
      {children}
    </div>
  );
};

export default ThemeProvider;
