export const Colors = {
  // Primary Colors
  primary: '#FF6B35',
  primaryLight: '#FF8A6B',
  primaryDark: '#E55A3C',

  primaryOrange: '#FF6B35',
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
  grayBackground: '#F8F9FA',
  grayBorder: '#E0E0E0',
  grayGhost: '#F9FAFB',
  graySilver: '#CCCCCC',
  noti: '#FE6303',
  redGoogle: '#FF0000',
  blueGoogle: '#4285F4',
  
  // Tailwind-style Grays (found in project)
  slate50: '#F9FAFB',
  slate100: '#F3F4F6',
  slate200: '#E5E7EB',
  slate500: '#6B7280',
  slate800: '#1F2937',
  slate900: '#111827',

  // Background Colors
  background: '#FAFAFA',
  backgroundDark: '#F5F5F5',
  backgroundLight: '#F8F9FA',
  backgroundAlt: '#F8F8F8',
  backgroundEmerald: '#F0FDF4',
  surface: '#FFFFFF',
  
  // Text Colors
  text: '#333333',
  textPrimary: '#212121',
  textSecondary: '#666666',
  textMuted: '#6C757D',
  textDark: '#212529',
  textGray: '#495057',
  textLight: '#999999',
  textDim: '#555555',
  textHeader: '#1F2937',
  textDisabled: '#BDBDBD',
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#FFFFFF',
  
  // Status Colors
  success: '#4CAF50',
  successDark: '#2E7D32',
  successLight: '#C8E6C9',
  successExtraLight: '#E8F5E8',
  emerald: '#10B981',
  warning: '#FF9800',
  warningLight: '#FFE0B2',
  error: '#F44336',
  errorDark: '#C62828',
  danger: '#DC3545',
  errorLight: '#FFCDD2',
  errorExtraLight: '#FFEBEE',
  info: '#2196F3',
  infoLight: '#BBDEFB',
  accentBlue: '#007AFF',
  accentLightBlue: '#F0F8FF',
  
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
  borderLight: '#DDD',
  borderLightAlt: '#F0F0F0',
  borderMedium: '#DEE2E6',
  borderSoft: '#E9ECEF',
  borderExtraSoft: '#EEEEEE',
  borderDark: '#BDBDBD',
  
  // Special Screen Colors
  welcome: {
    lightOrange: '#FFE5B4',
    secondaryOrange: '#FFB399',
  },

  // Nutri-score Colors
  nutriScore: {
    A: '#00AA00',
    B: '#7FBF00',
    C: '#FFAA00',
    D: '#FF7F00',
    E: '#FF0000',
  },

  // BMI Category Colors
  bmi: {
    underweight: '#3498DB',
    normal: '#27AE60',
    overweight: '#F39C12',
    obese: '#E74C3C',
  },

  // Plan & Nutrition Card Colors
  plan: {
    caloriesBg: '#FFF7ED',
    caloriesText: '#EA580C',
    proteinBg: '#F0FDF4',
    proteinText: '#16A34A',
    carbsBg: '#EFF6FF',
    carbsText: '#2563EB',
    fatBg: '#FAF5FF',
    fatText: '#9333EA',
  },

  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayWhite: 'rgba(255, 255, 255, 0.2)',
  overlayStrongWhite: 'rgba(255, 255, 255, 0.8)',
  
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