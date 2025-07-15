// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  id: string;
  name: string;
  isDark: boolean;
  colors: {
    background: string;
    surface: string;
    primary: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
  };
}

// Simplified theme options - fewer themes, cleaner structure
export const themes: Theme[] = [
  {
    id: 'light',
    name: 'Light',
    isDark: false,
    colors: {
      background: '#FFFFFF',
      surface: '#F8F9FA',
      primary: '#007AFF',
      text: '#000000',
      textSecondary: '#666666',
      border: '#E1E1E1',
      accent: '#FF3B30',
    },
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    isDark: false,
    colors: {
      background: '#F0F8FF',
      surface: '#E6F3FF',
      primary: '#0066CC',
      text: '#1A1A1A',
      textSecondary: '#4A4A4A',
      border: '#B3D9FF',
      accent: '#FF6B35',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    isDark: true,
    colors: {
      background: '#121212',
      surface: '#1E1E1E',
      primary: '#BB86FC',
      text: '#FFFFFF',
      textSecondary: '#AAAAAA',
      border: '#333333',
      accent: '#CF6679',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    isDark: true,
    colors: {
      background: '#0D1B2A',
      surface: '#1B263B',
      primary: '#6C9BD1',
      text: '#FFFFFF',
      textSecondary: '#B8C5D1',
      border: '#415A77',
      accent: '#F77F00',
    },
  },
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'selectedTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedThemeId = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedThemeId) {
        const savedTheme = themes.find(theme => theme.id === savedThemeId);
        if (savedTheme) {
          setCurrentTheme(savedTheme);
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (theme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme.id);
      setCurrentTheme(theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        currentTheme, 
        setTheme, 
        availableThemes: themes 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};