// src/components/ui/Input.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  const { currentTheme } = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: currentTheme.colors.text }]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: currentTheme.colors.surface,
            color: currentTheme.colors.text,
            borderColor: error ? currentTheme.colors.accent : currentTheme.colors.border,
          },
          style
        ]}
        placeholderTextColor={currentTheme.colors.textSecondary}
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: currentTheme.colors.accent }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 44,
  },
  error: {
    fontSize: 14,
    marginTop: 4,
  },
});