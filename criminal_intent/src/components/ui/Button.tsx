// src/components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  icon
}) => {
  const { currentTheme } = useTheme();
  
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return currentTheme.colors.primary;
      case 'accent':
        return currentTheme.colors.accent;
      case 'secondary':
      default:
        return currentTheme.colors.surface;
    }
  };
  
  const getTextColor = () => {
    return variant === 'secondary' ? currentTheme.colors.text : '#fff';
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon}
      <Text style={[
        styles.buttonText,
        { color: getTextColor() },
        icon && styles.buttonTextWithIcon,
        textStyle
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    minHeight: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextWithIcon: {
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});