import Background from '@/components/Background';
import { useSession } from '@/helper/auth-client';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { borderRadius, shadows, spacing } from '../colors';
import { useTheme } from '../hooks/useTheme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  // Animation values
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(30);
  const iconOpacity = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const backgroundOpacity = useSharedValue(0);
  const { data: session, user, isPending } = useSession();

  useEffect(() => {
    // Start animations sequence
    const startAnimations = () => {
      // Background fade in
      backgroundOpacity.value = withTiming(1, { duration: 500 });

      // Logo animation
      logoScale.value = withSequence(
        withTiming(1.2, { duration: 800 }),
        withTiming(1, { duration: 200 })
      );
      logoOpacity.value = withTiming(1, { duration: 800 });

      // Title animation
      titleOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
      titleTranslateY.value = withDelay(600, withTiming(0, { duration: 800 }));

      // Subtitle animation
      subtitleOpacity.value = withDelay(1000, withTiming(1, { duration: 600 }));
      subtitleTranslateY.value = withDelay(1000, withTiming(0, { duration: 600 }));

      // Icon animation
      iconOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
      iconRotation.value = withDelay(1200, withTiming(360, { duration: 1000 }));
    };

    startAnimations();
  }, []);

  // Handle navigation after animations and session loading
  useEffect(() => {
    if (!isPending) {
      const timer = setTimeout(() => {
        if (session) {
          router.replace('/(appStack)/home');
        } else {
          router.replace('/(authStack)/signin');
        }
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [session, isPending]);

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  return (
    <Background>
      <View style={styles.container}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />

        {/* Decorative elements */}
        <View style={styles.decorativeContainer}>
          <Animated.View
            style={[
              styles.decorativeCircle,
              {
                backgroundColor: colors.accent,
                top: height * 0.1,
                right: width * 0.1,
              },
              iconAnimatedStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.decorativeCircle,
              {
                backgroundColor: colors.primary,
                bottom: height * 0.2,
                left: width * 0.15,
                width: 60,
                height: 60,
              },
              iconAnimatedStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.decorativeSquare,
              {
                backgroundColor: colors.accent,
                top: height * 0.3,
                left: width * 0.1,
              },
              iconAnimatedStyle,
            ]}
          />
        </View>

        {/* Main content */}
        <View style={styles.content}>
          {/* Logo */}
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <View style={[styles.logo, { backgroundColor: colors.primary }, shadows.lg]}>
              <Ionicons
                name="home"
                size={40}
                color={colors.background}
              />
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.Text style={[styles.title, { color: colors.text }, titleAnimatedStyle]}>
            InteriorAI
          </Animated.Text>

          {/* Subtitle */}
          <Animated.Text style={[styles.subtitle, { color: colors.textSecondary }, subtitleAnimatedStyle]}>
            Transform your space with AI-powered design
          </Animated.Text>

          {/* Loading indicator */}
          <Animated.View style={[styles.loadingContainer, iconAnimatedStyle]}>
            <View style={[styles.loadingDot, { backgroundColor: colors.accent }]} />
            <View style={[styles.loadingDot, { backgroundColor: colors.primary }]} />
            <View style={[styles.loadingDot, { backgroundColor: colors.accent }]} />
          </Animated.View>
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    opacity: 0.1,
  },
  decorativeSquare: {
    position: 'absolute',
    width: 40,
    height: 40,
    opacity: 0.1,
    transform: [{ rotate: '45deg' }],
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
    paddingHorizontal: spacing['2xl'],
    lineHeight: 22,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.xs,
  },
});
