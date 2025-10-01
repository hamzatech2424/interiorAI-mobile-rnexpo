import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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

  // Color scheme for interior design theme
  const colors = {
    light: {
      primary: '#2C3E50', // Deep blue-gray
      secondary: '#E8F4FD', // Light blue
      accent: '#F39C12', // Warm orange
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: '#2C3E50',
      textSecondary: '#7F8C8D',
    },
    dark: {
      primary: '#ECF0F1', // Light gray
      secondary: '#34495E', // Dark blue-gray
      accent: '#F39C12', // Warm orange
      background: '#1A1A1A',
      surface: '#2C2C2C',
      text: '#ECF0F1',
      textSecondary: '#BDC3C7',
    },
  };

  const currentColors = colors[isDark ? 'dark' : 'light'];

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

      // Navigate to main app after animation
      setTimeout(() => {
        runOnJS(() => router.replace('/home'))();
      }, 3000);
    };

    startAnimations();
  }, []);

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
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={currentColors.background}
      />
      
      <Animated.View style={[styles.background, backgroundAnimatedStyle]}>
        <LinearGradient
          colors={
            isDark
              ? [currentColors.background, currentColors.surface, currentColors.secondary]
              : [currentColors.background, currentColors.secondary, currentColors.surface]
          }
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Decorative elements */}
      <View style={styles.decorativeContainer}>
        <Animated.View
          style={[
            styles.decorativeCircle,
            {
              backgroundColor: currentColors.accent,
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
              backgroundColor: currentColors.primary,
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
              backgroundColor: currentColors.accent,
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
          <View style={[styles.logo, { backgroundColor: currentColors.primary }]}>
            <Ionicons
              name="home"
              size={40}
              color={currentColors.background}
            />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.Text style={[styles.title, { color: currentColors.text }, titleAnimatedStyle]}>
          InteriorAI
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text style={[styles.subtitle, { color: currentColors.textSecondary }, subtitleAnimatedStyle]}>
          Transform your space with AI-powered design
        </Animated.Text>

        {/* Loading indicator */}
        <Animated.View style={[styles.loadingContainer, iconAnimatedStyle]}>
          <View style={[styles.loadingDot, { backgroundColor: currentColors.accent }]} />
          <View style={[styles.loadingDot, { backgroundColor: currentColors.primary }]} />
          <View style={[styles.loadingDot, { backgroundColor: currentColors.accent }]} />
        </Animated.View>
      </View>
    </View>
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
    borderRadius: 40,
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
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});