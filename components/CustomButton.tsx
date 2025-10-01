import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { borderRadius, shadows, spacing, typography } from '../colors';
import { useTheme } from '../hooks/useTheme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
}

export default function CustomButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
}: CustomButtonProps) {
  const { colors } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = [styles.button, style];
    
    switch (variant) {
      case 'primary':
        return baseStyle;
      case 'secondary':
        return [...baseStyle, { backgroundColor: colors.secondary }];
      case 'outline':
        return [
          ...baseStyle,
          {
            backgroundColor: 'transparent',
            borderColor: colors.primary,
            borderWidth: 2,
          }
        ];
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, { color: colors.background }];
      case 'secondary':
        return [...baseStyle, { color: colors.text }];
      case 'outline':
        return [...baseStyle, { color: colors.primary }];
      default:
        return [...baseStyle, { color: colors.background }];
    }
  };

  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[getButtonStyle(), isDisabled && styles.disabled]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isDisabled ? [colors.textSecondary, colors.textSecondary] : [colors.accent, colors.primary]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} size="small" />
          ) : (
            <Text style={getTextStyle()}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[getButtonStyle(), isDisabled && styles.disabled, shadows.md]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? colors.primary : colors.text} 
          size="small" 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  gradient: {
    flex: 1,
    width: '100%',
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  disabled: {
    opacity: 0.6,
  },
});
