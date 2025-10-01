import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { borderRadius } from '../colors';
import { useTheme } from '../hooks/useTheme';

interface BackgroundProps {
  children: React.ReactNode;
}

export default function Background({ children }: BackgroundProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={
          isDark
            ? [colors.background, colors.surface, colors.secondary]
            : [colors.background, colors.secondary, colors.surface]
        }
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative bubbles */}
        <View style={styles.bubblesContainer}>
          <View style={[
            styles.bubble,
            {
              backgroundColor: colors.accent,
              top: 20,
              right: 30,
              opacity: 0.1,
            }
          ]} />
          <View style={[
            styles.bubble,
            {
              backgroundColor: colors.primary,
              bottom: 40,
              left: 20,
              width: 60,
              height: 60,
              opacity: 0.08,
            }
          ]} />
          <View style={[
            styles.bubble,
            {
              backgroundColor: colors.accent,
              top: 80,
              left: 40,
              opacity: 0.06,
            }
          ]} />
          <View style={[
            styles.bubble,
            {
              backgroundColor: colors.primary,
              top: 200,
              right: 60,
              width: 40,
              height: 40,
              opacity: 0.05,
            }
          ]} />
          <View style={[
            styles.bubble,
            {
              backgroundColor: colors.accent,
              bottom: 100,
              right: 20,
              width: 50,
              height: 50,
              opacity: 0.07,
            }
          ]} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  bubblesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
});
