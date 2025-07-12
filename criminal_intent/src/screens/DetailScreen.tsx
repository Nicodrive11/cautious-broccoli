import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Switch,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Crypto from 'expo-crypto';

import { RootStackParamList } from '../../App';
import { Crime, CrimeFormData } from '../types/Crime';
import { StorageService } from '../services/StorageService';
import { useTheme } from '../contexts/ThemeContext';

type DetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Detail'>;
type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

interface Props {
  navigation: DetailScreenNavigationProp;
  route: DetailScreenRouteProp;
}

const generateSimpleUUID = (): string => {
  return 'crime_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const DetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { crimeId } = route.params;
  const { currentTheme } = useTheme();
  const [isNewCrime] = useState(!crimeId);
  
  const [formData, setFormData] = useState<CrimeFormData>({
    title: '',
    details: '',
    date: new Date(),
    isSolved: false,
    photoUri: undefined,
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (crimeId) {
      loadCrime();
    }
    setupHeader();
  }, [crimeId, currentTheme]);

  const setupHeader = () => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: currentTheme.colors.primary,
      },
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  };

  const loadCrime = async () => {
    if (!crimeId) return;
    
    try {
      setLoading(true);
      const crime = await StorageService.getCrimeById(crimeId);
      if (crime) {
        setFormData({
          title: crime.title,
          details: crime.details,
          date: crime.date,
          isSolved: crime.isSolved,
          photoUri: crime.photoUri,
        });
      }
    } catch (error) {
      console.error('Error loading crime:', error);
      Alert.alert('Error', 'Failed to load crime details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title for the crime');
      return;
    }

    try {
      setLoading(true);
      
      const crime: Crime = {
        id: crimeId || Crypto.randomUUID(),
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
        `Crime ${isNewCrime ? 'created' : 'updated'} successfully`,
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate });
    }
  };

  const handleImagePicker = async () => {
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData({ ...formData, photoUri: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: currentTheme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Photo Display */}
      {formData.photoUri && (
        <View style={styles.photoContainer}>
          <Image source={{ uri: formData.photoUri }} style={styles.photo} />
        </View>
      )}

      {/* Title Input */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: currentTheme.colors.text }]}>
          Title
        </Text>
        <TextInput
          style={[styles.textInput, { 
            backgroundColor: currentTheme.colors.surface,
            color: currentTheme.colors.text,
            borderColor: currentTheme.colors.border 
          }]}
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          placeholder="Enter crime title"
          placeholderTextColor={currentTheme.colors.textSecondary}
        />
      </View>

      {/* Details Input */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: currentTheme.colors.text }]}>
          Details
        </Text>
        <TextInput
          style={[styles.textArea, { 
            backgroundColor: currentTheme.colors.surface,
            color: currentTheme.colors.text,
            borderColor: currentTheme.colors.border 
          }]}
          value={formData.details}
          onChangeText={(text) => setFormData({ ...formData, details: text })}
          placeholder="Enter crime details"
          placeholderTextColor={currentTheme.colors.textSecondary}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Date Picker */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: currentTheme.colors.text }]}>
          Date
        </Text>
        <TouchableOpacity
          style={[styles.dateButton, { 
            backgroundColor: currentTheme.colors.surface,
            borderColor: currentTheme.colors.border 
          }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[styles.dateButtonText, { color: currentTheme.colors.text }]}>
            {formatDate(formData.date)}
          </Text>
          <Ionicons 
            name="calendar-outline" 
            size={20} 
            color={currentTheme.colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      {/* Solved Switch */}
      <View style={styles.inputGroup}>
        <View style={styles.switchContainer}>
          <Text style={[styles.label, { color: currentTheme.colors.text }]}>
            Solved
          </Text>
          <Switch
            value={formData.isSolved}
            onValueChange={(value) => setFormData({ ...formData, isSolved: value })}
            trackColor={{ false: currentTheme.colors.border, true: currentTheme.colors.primary }}
          />
        </View>
      </View>

      {/* Camera Button */}
      <TouchableOpacity
        style={[styles.cameraButton, { 
          backgroundColor: currentTheme.colors.primary,
        }]}
        onPress={handleImagePicker}
      >
        <Ionicons name="camera" size={20} color="#fff" />
        <Text style={styles.cameraButtonText}>
          {formData.photoUri ? 'Change Photo' : 'Add Photo'}
        </Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, { 
          backgroundColor: currentTheme.colors.accent,
        }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? 'Saving...' : 'Save Crime'}
        </Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  headerButton: {
    marginRight: 15,
    padding: 5,
  },
  photoContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  photo: {
    width: 120,
    height: 90,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 44,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 44,
  },
  dateButtonText: {
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default DetailScreen;