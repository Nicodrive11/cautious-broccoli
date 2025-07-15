import React from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from '../src/contexts/ThemeContext';
import { ThemeSelector } from '../src/components/settings/ThemeSelector';

export default function SettingsScreen() {
  const { currentTheme } = useTheme();

  return (
    <ScrollView 
      style={{ backgroundColor: currentTheme.colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      <ThemeSelector />
    </ScrollView>
  );
}
