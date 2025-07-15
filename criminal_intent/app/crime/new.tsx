import React from 'react';
import { ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Crime, CrimeFormData } from '../../src/types/Crime';
import { StorageService } from '../../src/services/StorageService';
import { CrimeForm } from '../../src/components/crime/CrimeForm';

export default function NewCrimeScreen() {
  const { currentTheme } = useTheme();
  const [loading, setLoading] = React.useState(false);

  const initialData: CrimeFormData = {
    title: '',
    details: '',
    date: new Date(),
    isSolved: false,
    photoUri: undefined,
  };

  const handleSubmit = async (formData: CrimeFormData) => {
    try {
      setLoading(true);
      
      const crime: Crime = {
        id: Crypto.randomUUID(),
        title: formData.title.trim(),
        details: formData.details.trim(),
        date: formData.date,
        isSolved: formData.isSolved,
        photoUri: formData.photoUri,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await StorageService.saveCrime(crime);
      
      Alert.alert(
        'Success',
        'Crime created successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              // Stay on detail screen as per requirements
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error saving crime:', error);
      Alert.alert('Error', 'Failed to save crime');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={{ backgroundColor: currentTheme.colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      <CrimeForm
        initialData={initialData}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </ScrollView>
  );
}
