import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faCog } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../src/contexts/ThemeContext';
import { Crime } from '../src/types/Crime';
import { StorageService } from '../src/services/StorageService';
import { CrimeListItem } from '../src/components/crime/CrimeListItem';
import { EmptyState } from '../src/components/crime/EmptyState';
import { LoadingSpinner } from '../src/components/ui/LoadingSpinner';

export default function IndexScreen() {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentTheme } = useTheme();

  const loadCrimes = async () => {
    try {
      setLoading(true);
      const loadedCrimes = await StorageService.getAllCrimes();
      const sortedCrimes = loadedCrimes.sort((a, b) => b.date.getTime() - a.date.getTime());
      setCrimes(sortedCrimes);
    } catch (error) {
      console.error('Error loading crimes:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadCrimes();
    }, [])
  );

  const renderCrimeItem = ({ item }: { item: Crime }) => (
    <CrimeListItem
      crime={item}
      onPress={() => router.push(`/crime/${item.id}`)}
    />
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <FlatList
        data={crimes}
        renderItem={renderCrimeItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState
            title="No Crimes Recorded"
            subtitle="Tap the + button to add your first crime"
          />
        }
        refreshing={loading}
        onRefresh={loadCrimes}
        style={{ backgroundColor: currentTheme.colors.background }}
      />
      
      {/* Floating Action Buttons */}
      <View style={styles.fab}>
        <TouchableOpacity
          style={[styles.fabButton, { backgroundColor: currentTheme.colors.primary }]}
          onPress={() => router.push('/crime/new')}
        >
          <FontAwesomeIcon icon={faPlus} size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fabButton, styles.fabSecondary, { backgroundColor: currentTheme.colors.accent }]}
          onPress={() => router.push('/settings')}
        >
          <FontAwesomeIcon icon={faCog} size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabSecondary: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginTop: 12,
  },
});