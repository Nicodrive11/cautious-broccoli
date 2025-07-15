// src/components/ui/LoadingSpinner.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export const LoadingSpinner: React.FC = () => {
  const { currentTheme } = useTheme();
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={currentTheme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});