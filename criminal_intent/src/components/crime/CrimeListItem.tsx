import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHandcuffs } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Crime } from '../../types/Crime';

interface CrimeListItemProps {
  crime: Crime;
  onPress: () => void;
}

export const CrimeListItem: React.FC<CrimeListItemProps> = ({ crime, onPress }) => {
  const { currentTheme } = useTheme();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { 
        backgroundColor: currentTheme.colors.surface,
        borderBottomColor: currentTheme.colors.border 
      }]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>
          {crime.title || 'Untitled Crime'}
        </Text>
        <Text style={[styles.date, { color: currentTheme.colors.textSecondary }]}>
          {formatDate(crime.date)}
        </Text>
        {crime.details && (
          <Text 
            style={[styles.details, { color: currentTheme.colors.textSecondary }]}
            numberOfLines={2}
          >
            {crime.details}
          </Text>
        )}
      </View>
      {crime.isSolved && (
        <FontAwesomeIcon 
          icon={faHandcuffs} 
          size={24} 
          color={currentTheme.colors.accent}
          style={styles.solvedIcon}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    lineHeight: 20,
  },
  solvedIcon: {
    marginLeft: 12,
  },
});