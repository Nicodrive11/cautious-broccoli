import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../../App';
import { useTheme, Theme } from '../contexts/ThemeContext';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

interface ThemeOptionProps {
  theme: Theme;
  isSelected: boolean;
  onSelect: () => void;
  currentTheme: Theme;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({ 
  theme, 
  isSelected, 
  onSelect, 
  currentTheme 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.themeOption,
        { 
          backgroundColor: currentTheme.colors.surface,
          borderColor: isSelected ? currentTheme.colors.primary : currentTheme.colors.border,
          borderWidth: isSelected ? 2 : 1,
        }
      ]}
      onPress={onSelect}
    >
      <View style={styles.themeHeader}>
        <View style={styles.themeInfo}>
          <Text style={[styles.themeName, { color: currentTheme.colors.text }]}>
            {theme.name}
          </Text>
          <Text style={[styles.themeType, { color: currentTheme.colors.textSecondary }]}>
            {theme.isDark ? 'Dark Theme' : 'Light Theme'}
          </Text>
        </View>
        {isSelected && (
          <Ionicons 
            name="checkmark-circle" 
            size={24} 
            color={currentTheme.colors.primary}
          />
        )}
      </View>
      
      {/* Theme Preview */}
      <View style={styles.themePreview}>
        <View style={styles.colorRow}>
          <View style={[styles.colorSample, { backgroundColor: theme.colors.background }]} />
          <View style={[styles.colorSample, { backgroundColor: theme.colors.surface }]} />
          <View style={[styles.colorSample, { backgroundColor: theme.colors.primary }]} />
          <View style={[styles.colorSample, { backgroundColor: theme.colors.accent }]} />
        </View>
        <Text style={[styles.previewText, { color: currentTheme.colors.textSecondary }]}>
          Preview colors
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  React.useEffect(() => {
    // Note: Settings screen should NOT show the settings cog in header
    navigation.setOptions({
      headerStyle: {
        backgroundColor: currentTheme.colors.primary,
      },
      headerRight: undefined, // No settings button on settings screen
    });
  }, [navigation, currentTheme]);

  const handleThemeSelect = (theme: Theme) => {
    if (theme.id !== currentTheme.id) {
      setTheme(theme);
      Alert.alert(
        'Theme Changed',
        `Successfully switched to ${theme.name} theme`,
        [{ text: 'OK' }]
      );
    }
  };

  const lightThemes = availableThemes.filter(theme => !theme.isDark);
  const darkThemes = availableThemes.filter(theme => theme.isDark);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: currentTheme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
          Light Themes
        </Text>
        <Text style={[styles.sectionDescription, { color: currentTheme.colors.textSecondary }]}>
          Choose from our bright and clean theme options
        </Text>
        
        {lightThemes.map((theme) => (
          <ThemeOption
            key={theme.id}
            theme={theme}
            isSelected={currentTheme.id === theme.id}
            onSelect={() => handleThemeSelect(theme)}
            currentTheme={currentTheme}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
          Dark Themes
        </Text>
        <Text style={[styles.sectionDescription, { color: currentTheme.colors.textSecondary }]}>
          Easy on the eyes for low-light environments
        </Text>
        
        {darkThemes.map((theme) => (
          <ThemeOption
            key={theme.id}
            theme={theme}
            isSelected={currentTheme.id === theme.id}
            onSelect={() => handleThemeSelect(theme)}
            currentTheme={currentTheme}
          />
        ))}
      </View>

      <View style={styles.section}>
        <View style={[styles.infoBox, { 
          backgroundColor: currentTheme.colors.surface,
          borderColor: currentTheme.colors.border 
        }]}>
          <Ionicons 
            name="information-circle-outline" 
            size={20} 
            color={currentTheme.colors.primary}
            style={styles.infoIcon}
          />
          <Text style={[styles.infoText, { color: currentTheme.colors.textSecondary }]}>
            Your theme preference is automatically saved and will be restored when you restart the app.
          </Text>
        </View>
      </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  themeOption: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeType: {
    fontSize: 14,
  },
  themePreview: {
    marginTop: 8,
  },
  colorRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  colorSample: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  previewText: {
    fontSize: 12,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SettingsScreen;