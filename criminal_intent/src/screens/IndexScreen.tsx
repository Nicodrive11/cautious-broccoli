import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHandcuffs, faPlus, faCog, faFileText } from '@fortawesome/free-solid-svg-icons';

import { RootStackParamList } from '../../App';
import { Crime } from '../types/Crime';
import { StorageService } from '../services/StorageService';
import { useTheme } from '../contexts/ThemeContext';

type IndexScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Index'>;

interface Props {
  navigation: IndexScreenNavigationProp;
}

interface CrimeListItemProps {
  crime: Crime;
  onPress: () => void;
  theme: any;
}

const CrimeListItem: React.FC<CrimeListItemProps> = ({ crime, onPress, theme }) => {
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
      style={[styles.crimeItem, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.border 
      }]}
      onPress={onPress}
    >
      <View style={styles.crimeContent}>
        <Text style={[styles.crimeTitle, { color: theme.colors.text }]}>
          {crime.title || 'Untitled Crime'}
        </Text>
        <Text style={[styles.crimeDate, { color: theme.colors.textSecondary }]}>
          {formatDate(crime.date)}
        </Text>
        {crime.details && (
          <Text 
            style={[styles.crimeDetails, { color: theme.colors.textSecondary }]}
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
            color={theme.colors.accent}
            style={styles.solvedIcon}
        />
        )}
    </TouchableOpacity>
  );
};

const IndexScreen: React.FC<Props> = ({ navigation }) => {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentTheme } = useTheme();

  const loadCrimes = async () => {
    try {
      setLoading(true);
      const loadedCrimes = await StorageService.getAllCrimes();
      // Sort by date (newest first)
      const sortedCrimes = loadedCrimes.sort((a, b) => b.date.getTime() - a.date.getTime());
      setCrimes(sortedCrimes);
    } catch (error) {
      console.error('Error loading crimes:', error);
      Alert.alert('Error', 'Failed to load crimes');
    } finally {
      setLoading(false);
    }
  };

  // Refresh crimes when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadCrimes();
    }, [])
  );

  // Set up header with + button and settings cog
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: currentTheme.colors.primary,
      },
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Detail', {})}
          >
            <FontAwesomeIcon icon={faPlus} size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <FontAwesomeIcon icon={faCog} size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, currentTheme]);

  const renderCrimeItem = ({ item }: { item: Crime }) => (
    <CrimeListItem
      crime={item}
      theme={currentTheme}
      onPress={() => navigation.navigate('Detail', { crimeId: item.id })}
    />
  );

  const renderEmptyList = () => (
    <View style={[styles.emptyContainer, { backgroundColor: currentTheme.colors.background }]}>
        <FontAwesomeIcon 
        icon={faFileText} 
        size={64} 
        color={currentTheme.colors.textSecondary}
        />
      <Text style={[styles.emptyTitle, { color: currentTheme.colors.text }]}>
        No Crimes Recorded
      </Text>
      <Text style={[styles.emptySubtitle, { color: currentTheme.colors.textSecondary }]}>
        Tap the + button to add your first crime
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <FlatList
        data={crimes}
        renderItem={renderCrimeItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyList}
        refreshing={loading}
        onRefresh={loadCrimes}
        style={{ backgroundColor: currentTheme.colors.background }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 10,
  },
  headerButton: {
    marginLeft: 15,
    padding: 5,
  },
  crimeItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  crimeContent: {
    flex: 1,
  },
  crimeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  crimeDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  crimeDetails: {
    fontSize: 14,
    lineHeight: 20,
  },
  solvedIcon: {
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default IndexScreen;