import AsyncStorage from '@react-native-async-storage/async-storage';
import { Crime } from '../types/Crime';

const CRIMES_STORAGE_KEY = 'crimes';

export class StorageService {
  static async getAllCrimes(): Promise<Crime[]> {
    try {
      const crimesJson = await AsyncStorage.getItem(CRIMES_STORAGE_KEY);
      if (crimesJson) {
        const crimes = JSON.parse(crimesJson);
        // Convert date strings back to Date objects
        return crimes.map((crime: any) => ({
          ...crime,
          date: new Date(crime.date),
          createdAt: new Date(crime.createdAt),
          updatedAt: new Date(crime.updatedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading crimes:', error);
      return [];
    }
  }

  static async getCrimeById(id: string): Promise<Crime | null> {
    try {
      const crimes = await this.getAllCrimes();
      return crimes.find(crime => crime.id === id) || null;
    } catch (error) {
      console.error('Error loading crime by ID:', error);
      return null;
    }
  }

  static async saveCrime(crime: Crime): Promise<void> {
    try {
      const crimes = await this.getAllCrimes();
      const existingIndex = crimes.findIndex(c => c.id === crime.id);
      
      if (existingIndex >= 0) {
        // Update existing crime
        crimes[existingIndex] = { ...crime, updatedAt: new Date() };
      } else {
        // Add new crime
        crimes.push({ ...crime, createdAt: new Date(), updatedAt: new Date() });
      }
      
      await AsyncStorage.setItem(CRIMES_STORAGE_KEY, JSON.stringify(crimes));
    } catch (error) {
      console.error('Error saving crime:', error);
      throw error;
    }
  }

  static async deleteCrime(id: string): Promise<void> {
    try {
      const crimes = await this.getAllCrimes();
      const filteredCrimes = crimes.filter(crime => crime.id !== id);
      await AsyncStorage.setItem(CRIMES_STORAGE_KEY, JSON.stringify(filteredCrimes));
    } catch (error) {
      console.error('Error deleting crime:', error);
      throw error;
    }
  }

  static async clearAllCrimes(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CRIMES_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing crimes:', error);
      throw error;
    }
  }
}