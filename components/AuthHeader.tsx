import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, shadows, spacing, typography } from '../colors';
import { useTheme } from '../hooks/useTheme';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function AuthHeader({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
}: AuthHeaderProps) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={false}
      />
       <View style={{height:insets.top}} />
      <View style={styles.content}>
        {/* Back button */}
        {showBackButton && (
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.surface }]}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        )}

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={[styles.logo, { backgroundColor: colors.primary }, shadows.lg]}>
            <Ionicons
              name="home"
              size={32}
              color={colors.background}
            />
          </View>
        </View>

        {/* Title and subtitle */}
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom:20,
    paddingHorizontal: spacing.lg,
  },
  content: {
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    alignSelf: 'flex-start',
    ...shadows.sm,
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.sizes.base,
    paddingHorizontal: spacing.md,
  },
});
