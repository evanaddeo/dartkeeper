/**
 * Modern Design System Theme
 * Professional, clean, sophisticated darts theme
 */

export const colors = {
  // Primary Colors - Modern slate palette
  primary: '#1E293B',        // Slate 800 - Professional dark
  primaryLight: '#334155',   // Slate 700
  primaryDark: '#0F172A',    // Slate 900
  
  // Accent Colors - Darts inspired
  accent: '#059669',         // Emerald 600 - Dart board felt
  accentLight: '#10B981',    // Emerald 500
  accentDark: '#047857',     // Emerald 700
  
  // Secondary Colors
  gold: '#F59E0B',           // Amber 500 - Elegant accent
  goldLight: '#FCD34D',      // Amber 300
  
  // CTA & Actions
  red: '#DC2626',            // Red 600 - Dart flight
  redLight: '#EF4444',       // Red 500
  
  // Success & Error
  success: '#10B981',        // Emerald 500
  error: '#EF4444',          // Red 500
  warning: '#F59E0B',        // Amber 500
  info: '#3B82F6',           // Blue 500
  
  // Backgrounds
  background: '#F8FAFC',     // Slate 50 - Clean, modern
  surface: '#FFFFFF',        // Pure white for cards
  surfaceHover: '#F1F5F9',   // Slate 100
  
  // Text
  textPrimary: '#0F172A',    // Slate 900
  textSecondary: '#64748B',  // Slate 500
  textTertiary: '#94A3B8',   // Slate 400
  textLight: '#FFFFFF',      // White text on dark backgrounds
  
  // Borders & Dividers
  border: '#E2E8F0',         // Slate 200
  borderLight: '#F1F5F9',    // Slate 100
  divider: '#CBD5E1',        // Slate 300
};

export const typography = {
  fontFamily: {
    // Modern, professional font stack
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    score: "'JetBrains Mono', 'Roboto Mono', 'Courier New', monospace",
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    md: '1.125rem',     // 18px
    lg: '1.25rem',      // 20px
    xl: '1.5rem',       // 24px
    '2xl': '1.875rem',  // 30px
    '3xl': '2.25rem',   // 36px
    '4xl': '3rem',      // 48px
    '5xl': '4rem',      // 64px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
};

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
};

export const borderRadius = {
  none: '0',
  sm: '0.375rem',    // 6px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  '2xl': '1.5rem',   // 24px
  full: '9999px',    // Pill shape
};

export const shadows = {
  // Modern, subtle shadows
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
};

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

// Export theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
};

export default theme;
