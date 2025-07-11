export const Colors = {
  // Primary Colors
  primary: '#FF6B47',
  primaryLight: '#FF8A6B',
  primaryDark: '#E55A3C',

  primaryOrange: 'FE6303',
  primaryInput: '#D9D9D9',
  primaryInputText: '#808080',
  // Secondary Colors
  secondary: '#4CAF50',
  secondaryLight: '#81C784',
  secondaryDark: '#388E3C',
  
  // Accent Colors
  accent: '#2196F3',
  accentLight: '#64B5F6',
  accentDark: '#1976D2',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  grayLight: '#F5F5F5',
  grayMedium: '#BDBDBD',
  grayDark: '#424242',
  noti: '#FE6303',
  redGoogle: '#FF0000',
  
  // Background Colors
  background: '#FAFAFA',
  backgroundDark: '#F5F5F5',
  surface: '#FFFFFF',
  
  // Text Colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#FFFFFF',
  
  // Status Colors
  success: '#4CAF50',
  successLight: '#C8E6C9',
  warning: '#FF9800',
  warningLight: '#FFE0B2',
  error: '#F44336',
  errorLight: '#FFCDD2',
  info: '#2196F3',
  infoLight: '#BBDEFB',
  
  // Nutrition Specific Colors
  protein: '#E91E63',
  carbs: '#FF9800',
  fat: '#9C27B0',
  fiber: '#4CAF50',
  sugar: '#F44336',
  sodium: '#FF5722',
  calories: '#FF6B47',
  
  // Chart Colors
  chartColors: [
    '#FF6B47',
    '#4CAF50',
    '#2196F3',
    '#FF9800',
    '#9C27B0',
    '#E91E63',
    '#795548',
    '#607D8B',
  ],
  
  // Opacity Variants
  opacity: {
    light: 0.1,
    medium: 0.3,
    heavy: 0.6,
    disabled: 0.4,
  },
  
  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    heavy: 'rgba(0, 0, 0, 0.3)',
  },
  
  // Border Colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#BDBDBD',
  
  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Gradient Colors
  gradients: {
    primary: ['#FF6B47', '#FF8A6B'],
    secondary: ['#4CAF50', '#81C784'],
    sunset: ['#FF6B47', '#FF9800'],
    ocean: ['#2196F3', '#00BCD4'],
    forest: ['#4CAF50', '#8BC34A'],
  },
} as const;

export default Colors;