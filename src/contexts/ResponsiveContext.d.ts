import { ReactNode } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'desktopLg' | 'ultrawide';
export type Orientation = 'portrait' | 'landscape';
export type NetworkSpeed = 'slow' | 'medium' | 'fast' | 'offline' | 'unknown';

export interface Viewport {
  width: number;
  height: number;
}

export interface Capabilities {
  webgl: boolean;
  canvas: boolean;
  serviceWorker: boolean;
  intersectionObserver: boolean;
  resizeObserver: boolean;
}

export interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  desktopLg: number;
  ultrawide: number;
}

export interface ResponsiveContextValue {
  // Device info
  viewport: Viewport;
  device: DeviceType;
  orientation: Orientation;
  isTouch: boolean;
  isRetina: boolean;
  
  // Network
  networkSpeed: NetworkSpeed;
  isOnline: boolean;
  
  // Preferences
  prefersReducedMotion: boolean;
  prefersDarkMode: boolean;
  
  // Capabilities
  capabilities: Capabilities;
  
  // Breakpoints
  breakpoints: Breakpoints;
  
  // Helper functions
  isMobile: () => boolean;
  isTablet: () => boolean;
  isDesktop: () => boolean;
  isTouchDevice: () => boolean;
  isRetina: () => boolean;
  isSlowNetwork: () => boolean;
  prefersReducedMotion: () => boolean;
  prefersDarkMode: () => boolean;
  shouldRenderHeavyComponent: () => boolean;
  shouldUseSimplifiedUI: () => boolean;
}

export interface ResponsiveProviderProps {
  children: ReactNode;
}

export const ResponsiveProvider: React.FC<ResponsiveProviderProps>;
export const useResponsiveContext: () => ResponsiveContextValue;
