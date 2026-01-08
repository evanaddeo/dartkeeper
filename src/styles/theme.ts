/**
 * DartKeeper Theme Configuration
 * Modern pub-themed color palette and typography settings
 */

export const colors = {
  // Primary Colors
  primary: '#2C1810',        // Dark wood brown
  secondary: '#D4AF37',      // Brass/gold
  accent: '#1B5E20',         // Dartboard green
  
  // Background Colors
  background: '#F5F1E8',     // Warm cream/off-white
  
  // Text Colors
  textLight: '#F5F1E8',      // Cream
  textDark: '#2C1810',       // Dark brown
  
  // Status Colors
  success: '#4CAF50',        // Green
  error: '#E53935',          // Red
  neutral: '#6D4C41',        // Medium brown
  
  // UI Element Colors
  cardBg: '#FFFFFF',
  cardBorder: '#D4AF37',
  inputBorder: '#6D4C41',
  disabledBg: '#E0E0E0',
  disabledText: '#9E9E9E',
} as const;

export const typography = {
  // Font Families
  fontFamily: {
    heading: '"Roboto Condensed", "Arial Narrow", sans-serif',
    body: '"Open Sans", "Roboto", sans-serif',
    monospace: '"Roboto Mono", "Courier New", monospace',
  },
  
  // Font Sizes
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },
  
  // Font Weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const;

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

export const breakpoints = {
  mobile: '767px',
  tablet: '768px',
  desktop: '1024px',
} as const;

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
} as const;

export type Theme = typeof theme;

