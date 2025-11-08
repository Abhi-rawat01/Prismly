import { fluidSize } from '../utils/responsiveStyles';

/**
 * Design tokens that auto-adapt based on viewport
 */

// Fluid spacing scale
export const spacing = {
  xs: fluidSize(4, 8),
  sm: fluidSize(8, 12),
  md: fluidSize(16, 24),
  lg: fluidSize(24, 32),
  xl: fluidSize(32, 48),
  xxl: fluidSize(48, 64),
};

// Fluid typography scale
export const fontSize = {
  xs: fluidSize(12, 14),
  sm: fluidSize(14, 16),
  base: fluidSize(16, 18),
  lg: fluidSize(18, 20),
  xl: fluidSize(20, 24),
  '2xl': fluidSize(24, 30),
  '3xl': fluidSize(30, 36),
  '4xl': fluidSize(36, 48),
  '5xl': fluidSize(48, 64),
};

// Container widths
export const containerWidth = {
  mobile: '100%',
  tablet: '90%',
  desktop: '1280px',
  max: '1536px',
};

// Breakpoint values (in pixels)
export const breakpoints = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
  desktopLg: 1280,
  ultrawide: 1536,
};

// Fluid border radius
export const borderRadius = {
  sm: fluidSize(4, 6),
  md: fluidSize(8, 12),
  lg: fluidSize(12, 16),
  xl: fluidSize(16, 24),
  full: '9999px',
};

// Responsive shadows (lighter on mobile for performance)
export const shadows = {
  mobile: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  desktop: {
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
};

// Z-index scale
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

// Transition durations (shorter on mobile/reduced motion)
export const transitions = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
};

// Grid gaps
export const gridGap = {
  sm: fluidSize(8, 12),
  md: fluidSize(16, 24),
  lg: fluidSize(24, 32),
  xl: fluidSize(32, 48),
};

export default {
  spacing,
  fontSize,
  containerWidth,
  breakpoints,
  borderRadius,
  shadows,
  zIndex,
  transitions,
  gridGap,
};
