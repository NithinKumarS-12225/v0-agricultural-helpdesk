'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      const isDarkMode = stored
        ? stored === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;

      setIsDark(isDarkMode);
      applyTheme(isDarkMode);
    } catch (error) {
      console.error('[v0] Theme setup error:', error);
    }
  }, []);

  const applyTheme = (isDarkMode: boolean) => {
    try {
      const html = document.documentElement;
      if (isDarkMode) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    } catch (error) {
      console.error('[v0] Theme apply error:', error);
    }
  };

  const toggleTheme = () => {
    try {
      const newDark = !isDark;
      setIsDark(newDark);
      localStorage.setItem('theme', newDark ? 'dark' : 'light');
      applyTheme(newDark);
    } catch (error) {
      console.error('[v0] Theme toggle error:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return { isDark: false, toggleTheme: () => {}, mounted: true };
  }
  return context;
}
