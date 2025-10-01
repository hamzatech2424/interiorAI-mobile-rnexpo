export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface Theme {
  light: ColorScheme;
  dark: ColorScheme;
}

export const theme: Theme = {
  light: {
    primary: '#2C3E50', // Deep blue-gray - professional and trustworthy
    secondary: '#E8F4FD', // Light blue - calming and modern
    accent: '#F39C12', // Warm orange - energetic and creative
    background: '#FFFFFF', // Pure white - clean and minimal
    surface: '#F8F9FA', // Light gray - subtle contrast
    text: '#2C3E50', // Dark blue-gray - excellent readability
    textSecondary: '#7F8C8D', // Medium gray - secondary text
    border: '#E1E8ED', // Light border
    success: '#27AE60', // Green - success states
    warning: '#F39C12', // Orange - warning states
    error: '#E74C3C', // Red - error states
    info: '#3498DB', // Blue - info states
  },
  dark: {
    primary: '#ECF0F1', // Light gray - high contrast on dark
    secondary: '#34495E', // Dark blue-gray - sophisticated
    accent: '#F39C12', // Warm orange - consistent brand color
    background: '#1A1A1A', // Very dark - easy on eyes
    surface: '#2C2C2C', // Dark gray - subtle elevation
    text: '#ECF0F1', // Light gray - excellent readability
    textSecondary: '#BDC3C7', // Medium light gray - secondary text
    border: '#34495E', // Dark border
    success: '#2ECC71', // Bright green - success states
    warning: '#F39C12', // Orange - warning states
    error: '#E74C3C', // Red - error states
    info: '#3498DB', // Blue - info states
  },
};

// Interior design specific colors
export const interiorColors = {
  // Neutral tones for walls and furniture
  neutrals: {
    white: '#FFFFFF',
    cream: '#F5F5DC',
    beige: '#F5DEB3',
    taupe: '#D2B48C',
    gray: '#808080',
    charcoal: '#36454F',
    black: '#000000',
  },
  
  // Warm colors for cozy spaces
  warm: {
    terracotta: '#E2725B',
    rust: '#B7410E',
    gold: '#FFD700',
    amber: '#FFBF00',
    peach: '#FFCCCB',
    coral: '#FF7F50',
  },
  
  // Cool colors for modern spaces
  cool: {
    navy: '#000080',
    teal: '#008080',
    mint: '#98FB98',
    sage: '#9CAF88',
    lavender: '#E6E6FA',
    periwinkle: '#CCCCFF',
  },
  
  // Earth tones for natural spaces
  earth: {
    forest: '#228B22',
    olive: '#808000',
    moss: '#8A9A5B',
    sand: '#C2B280',
    stone: '#8B8680',
    clay: '#CD853F',
  },
};

// Typography scale
export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 48,
  },
  weights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
};

// Border radius scale
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Shadow presets
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
};
