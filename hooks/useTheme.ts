import { useColorScheme } from 'react-native';
import { ColorScheme, theme } from '../colors';

export interface UseThemeReturn {
  colors: ColorScheme;
  isDark: boolean;
  colorScheme: 'light' | 'dark' | null | undefined;
}

export function useTheme(): UseThemeReturn {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return {
    colors: theme[isDark ? 'dark' : 'light'],
    isDark,
    colorScheme,
  };
}
