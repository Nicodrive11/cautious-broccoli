import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, StyleSheet, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../contexts/ThemeContext';
import { CrimeFormData } from '../../types/Crime';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface CrimeFormProps {
  initialData: CrimeFormData;
  onSubmit: (data: CrimeFormData) => void;
  loading?: boolean;
}

export const CrimeForm: React.FC<CrimeFormProps> = ({ 
  initialData, 
  onSubmit, 
  loading = false 
}) => {
  const { currentTheme } = useTheme();
  const [formData, setFormData] = useState<CrimeFormData>(initialData);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate });
    }
  };

  const handleDatePickerDone = () => {
    setShowDatePicker(false);
  };

  const handleImagePicker = async () => {
    try {
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

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title for the crime');
      return;
    }
    onSubmit(formData);
  };

  const toggleSolved = () => {
    setFormData({ ...formData, isSolved: !formData.isSolved });
  };

  return (
    <View>
      {/* Photo Display */}
      {formData.photoUri && (
        <Card style={styles.photoCard}>
          <Image source={{ uri: formData.photoUri }} style={styles.photo} />
        </Card>
      )}

      <Input
        label="Title"
        value={formData.title}
        onChangeText={(text) => setFormData({ ...formData, title: text })}
        placeholder="Enter crime title"
      />

      <Input
        label="Details"
        value={formData.details}
        onChangeText={(text) => setFormData({ ...formData, details: text })}
        placeholder="Enter crime details"
        multiline
        numberOfLines={4}
        style={styles.textArea}
      />

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

      {/* Solved Checkbox */}
      <Card>
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={toggleSolved}
          activeOpacity={0.7}
        >
          <View style={styles.checkboxRow}>
            <View style={[
              styles.checkbox, 
              { 
                borderColor: currentTheme.colors.border,
                backgroundColor: formData.isSolved ? currentTheme.colors.primary : 'transparent' 
              }
            ]}>
              {formData.isSolved && (
                <Ionicons 
                  name="checkmark" 
                  size={16} 
                  color="#fff" 
                />
              )}
            </View>
            <Text style={[styles.checkboxLabel, { color: currentTheme.colors.text }]}>
              Solved
            </Text>
          </View>
        </TouchableOpacity>
      </Card>

      <Button
        title={formData.photoUri ? 'Change Photo' : 'Add Photo'}
        onPress={handleImagePicker}
        variant="primary"
        icon={<Ionicons name="camera" size={20} color="#fff" />}
        style={styles.photoButton}
      />

      <Button
        title={loading ? 'Saving...' : 'Save Crime'}
        onPress={handleSubmit}
        variant="accent"
        disabled={loading}
        style={styles.saveButton}
      />

      {/* iOS Date Picker Modal */}
      {Platform.OS === 'ios' && showDatePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: currentTheme.colors.surface }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={[styles.modalButton, { color: currentTheme.colors.primary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDatePickerDone}>
                  <Text style={[styles.modalButton, { color: currentTheme.colors.primary }]}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={formData.date}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                style={styles.iosDatePicker}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Android Date Picker */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={formData.date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  photoCard: {
    alignItems: 'flex-start',
  },
  photo: {
    width: 120,
    height: 90,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textArea: {
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
  checkboxContainer: {
    padding: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  photoButton: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalButton: {
    fontSize: 17,
    fontWeight: '600',
  },
  iosDatePicker: {
    height: 200,
  },
});
