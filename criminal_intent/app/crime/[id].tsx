import React, { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Crime, CrimeFormData } from '../../src/types/Crime';
import { StorageService } from '../../src/services/StorageService';
import { CrimeForm } from '../../src/components/crime/CrimeForm';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';

export default function CrimeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentTheme } = useTheme();
  const [crime, setCrime] = useState<Crime | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCrime();
  }, [id]);

  const loadCrime = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const loadedCrime = await StorageService.getCrimeById(id);
      setCrime(loadedCrime);
    } catch (error) {
      console.error('Error loading crime:', error);
      Alert.alert('Error', 'Failed to load crime details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: CrimeFormData) => {
    if (!crime) return;

    try {
      setSaving(true);
      
      const updatedCrime: Crime = {
        ...crime,
        title: formData.title.trim(),
        details: formData.details.trim(),
        date: formData.date,
        isSolved: formData.isSolved,
        photoUri: formData.photoUri,
        updatedAt: new Date(),
      };

      await StorageService.saveCrime(updatedCrime);
      
      Alert.alert(
        'Success',
        'Crime updated successfully'
      );
    } catch (error) {
      console.error('Error updating crime:', error);
      Alert.alert('Error', 'Failed to update crime');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!crime) {
    return null;
  }

  const formData: CrimeFormData = {
    title: crime.title,
    details: crime.details,
    date: crime.date,
    isSolved: crime.isSolved,
    photoUri: crime.photoUri,
  };

  return (
    <ScrollView 
      style={{ backgroundColor: currentTheme.colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      <CrimeForm
        initialData={formData}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </ScrollView>
  );
}
