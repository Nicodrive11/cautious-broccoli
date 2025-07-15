// src/components/settings/ThemeSelector.tsx
import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme, Theme } from '../../contexts/ThemeContext';
import { ThemeOption } from './ThemeOption';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  const handleThemeSelect = (theme: Theme) => {
    if (theme.id !== currentTheme.id) {
      setTheme(theme);
      Alert.alert(
        'Theme Changed',
        `Successfully switched to ${theme.name} theme`,
        [{ text: 'OK' }]
      );
    }
  };

  const lightThemes = availableThemes.filter(theme => !theme.isDark);
  const darkThemes = availableThemes.filter(theme => theme.isDark);

  return (
    <View>
      <ThemeSection
        title="Light Themes"
        description="Choose from our bright and clean theme options"
        themes={lightThemes}
        currentTheme={currentTheme}
        onThemeSelect={handleThemeSelect}
      />

      <ThemeSection
        title="Dark Themes"
        description="Easy on the eyes for low-light environments"
        themes={darkThemes}
        currentTheme={currentTheme}
        onThemeSelect={handleThemeSelect}
      />

      <InfoBox />
    </View>
  );
};

interface ThemeSectionProps {
  title: string;
  description: string;
  themes: Theme[];
  currentTheme: Theme;
  onThemeSelect: (theme: Theme) => void;
}

const ThemeSection: React.FC<ThemeSectionProps> = ({
  title,
  description,
  themes,
  currentTheme,
  onThemeSelect
}) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.sectionDescription, { color: currentTheme.colors.textSecondary }]}>
        {description}
      </Text>
      
      {themes.map((theme) => (
        <ThemeOption
          key={theme.id}
          theme={theme}
          isSelected={currentTheme.id === theme.id}
          onSelect={() => onThemeSelect(theme)}
        />
      ))}
    </View>
  );
};

const InfoBox: React.FC = () => {
  const { currentTheme } = useTheme();
  
  return (
    <View style={styles.section}>
      <View style={[styles.infoBox, { 
        backgroundColor: currentTheme.colors.surface,
        borderColor: currentTheme.colors.border 
      }]}>
        <Text style={[styles.infoText, { color: currentTheme.colors.textSecondary }]}>
          💡 Your theme preference is automatically saved and will be restored when you restart the app.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  infoBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});