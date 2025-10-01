import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { borderRadius, spacing, typography } from '../colors';
import { useTheme } from '../hooks/useTheme';

interface FormInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: any) => void;
  error?: string;
  touched?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  showPasswordToggle = false,
  onTogglePassword,
  icon,
}: FormInputProps) {
  const { colors } = useTheme();
  const hasError = error && touched;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
      </Text>
      
      <View style={[
        styles.inputContainer,
        {
          backgroundColor: colors.surface,
          borderColor: hasError ? colors.error : colors.border,
          borderWidth: 1,
        }
      ]}>
        {icon && (
          <View style={styles.iconContainer}>
          <Ionicons
            name={icon}
            size={20}
            color={hasError ? colors.error : colors.textSecondary}
            />
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              flex: 1,
            }
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
        />
        
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={onTogglePassword}
            style={styles.passwordToggle}
          >
            <Ionicons
              name={secureTextEntry ? 'eye-off' : 'eye'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {hasError && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    height: 56,
  },
  iconContainer: {
    marginRight: spacing.sm,
    height: 56,
    justifyContent:'center',
    alignItems:'center',
  },
  input: {
    fontSize: typography.sizes.base,
    height: 56,
  },
  passwordToggle: {
    height: 56,
    width: 30,
    justifyContent:'center',
    alignItems:'center',
  },
  errorText: {
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
