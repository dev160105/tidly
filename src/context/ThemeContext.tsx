import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Colors, Theme, ThemeMode } from '../constants/theme';

interface ThemeContextType {
  mode: ThemeMode;
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  theme: Colors.dark,
  toggleTheme: () => { },
  isDark: true,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const theme = Colors[mode];
  const isDark = mode === 'dark';

  const toggleTheme = () => setMode(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
