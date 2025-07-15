import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFileText } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  icon?: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  subtitle, 
  icon = faFileText 
}) => {
  const { currentTheme } = useTheme();
  
  return (
    <View style={styles.container}>
      <FontAwesomeIcon 
        icon={icon}
        size={64} 
        color={currentTheme.colors.textSecondary}
      />
      <Text style={[styles.title, { color: currentTheme.colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, { color: currentTheme.colors.textSecondary }]}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});