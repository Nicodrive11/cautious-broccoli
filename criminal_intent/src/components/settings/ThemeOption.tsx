// src/components/settings/ThemeOption.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '../../contexts/ThemeContext';
import { Card } from '../ui/Card';

interface ThemeOptionProps {
  theme: Theme;
  isSelected: boolean;
  onSelect: () => void;
}

export const ThemeOption: React.FC<ThemeOptionProps> = ({ 
  theme, 
  isSelected, 
  onSelect 
}) => {
  const { currentTheme } = useTheme();

  return (
    <TouchableOpacity onPress={onSelect}>
      <Card style={[
        styles.container,
        { 
          borderColor: isSelected ? currentTheme.colors.primary : currentTheme.colors.border,
          borderWidth: isSelected ? 2 : 1,
        }
      ]}>
        <View style={styles.header}>
          <View style={styles.themeInfo}>
            <Text style={[styles.themeName, { color: currentTheme.colors.text }]}>
              {theme.name}
            </Text>
            <Text style={[styles.themeType, { color: currentTheme.colors.textSecondary }]}>
              {theme.isDark ? 'Dark Theme' : 'Light Theme'}
            </Text>
          </View>
          {isSelected && (
            <Ionicons 
              name="checkmark-circle" 
              size={24} 
              color={currentTheme.colors.primary}
            />
          )}
        </View>
        
        <ThemePreview theme={theme} />
      </Card>
    </TouchableOpacity>
  );
};

interface ThemePreviewProps {
  theme: Theme;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  const { currentTheme } = useTheme();
  
  return (
    <View style={styles.preview}>
      <View style={styles.colorRow}>
        <ColorSample color={theme.colors.background} />
        <ColorSample color={theme.colors.surface} />
        <ColorSample color={theme.colors.primary} />
        <ColorSample color={theme.colors.accent} />
      </View>
      <Text style={[styles.previewText, { color: currentTheme.colors.textSecondary }]}>
        Preview colors
      </Text>
    </View>
  );
};

interface ColorSampleProps {
  color: string;
}

const ColorSample: React.FC<ColorSampleProps> = ({ color }) => (
  <View style={[styles.colorSample, { backgroundColor: color }]} />
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 0, // Override Card's default marginBottom
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeType: {
    fontSize: 14,
  },
  preview: {
    marginTop: 8,
  },
  colorRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  colorSample: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  previewText: {
    fontSize: 12,
  },
});