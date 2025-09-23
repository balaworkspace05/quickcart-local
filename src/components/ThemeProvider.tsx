import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system',
  ...props 
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    
    const updateEffectiveTheme = () => {
      let newEffectiveTheme: 'light' | 'dark' = 'light';
      
      if (theme === 'system') {
        newEffectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        newEffectiveTheme = theme;
      }
      
      return newEffectiveTheme;
    };

    const newEffectiveTheme = updateEffectiveTheme();
    
    if (newEffectiveTheme !== effectiveTheme) {
      setIsTransitioning(true);
      
      // Smooth transition animation
      setTimeout(() => {
        root.classList.remove('light', 'dark');
        root.classList.add(newEffectiveTheme);
        setEffectiveTheme(newEffectiveTheme);
        
        setTimeout(() => setIsTransitioning(false), 150);
      }, 75);
    }
  }, [theme, effectiveTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const newEffectiveTheme = mediaQuery.matches ? 'dark' : 'light';
        if (newEffectiveTheme !== effectiveTheme) {
          setIsTransitioning(true);
          setTimeout(() => {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(newEffectiveTheme);
            setEffectiveTheme(newEffectiveTheme);
            setTimeout(() => setIsTransitioning(false), 150);
          }, 75);
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, effectiveTheme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
    effectiveTheme,
  };

  return (
    <ThemeContext.Provider value={value} {...props}>
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};