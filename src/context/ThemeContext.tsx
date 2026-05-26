import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, ThemeColors } from '../constants/colors';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const THEME_KEY = '@app_theme_mode';

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useSystemColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_KEY);
      if (savedMode) {
        setModeState(savedMode as ThemeMode);
      }
    } catch (e) {
      console.error('Failed to load theme', e);
    } finally {
      setIsReady(true);
    }
  };

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem(THEME_KEY, newMode);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  const isDark = mode === 'system' ? systemColorScheme === 'dark' : mode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  if (!isReady) return null;

  return (
    <ThemeContext.Provider value={{ mode, isDark, colors, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
