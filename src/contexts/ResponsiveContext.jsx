import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

// Breakpoint definitions
const BREAKPOINTS = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
  desktopLg: 1280,
  ultrawide: 1536,
};

// Helper to detect device type from width
const getDeviceType = (width) => {
  if (width < BREAKPOINTS.tablet) return 'mobile';
  if (width < BREAKPOINTS.desktop) return 'tablet';
  if (width < BREAKPOINTS.desktopLg) return 'desktop';
  if (width < BREAKPOINTS.ultrawide) return 'desktopLg';
  return 'ultrawide';
};

// Helper to detect network speed
const getNetworkSpeed = () => {
  if (!navigator.connection) return 'unknown';
  const conn = navigator.connection;
  const effectiveType = conn.effectiveType;
  
  if (!navigator.onLine) return 'offline';
  if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
  if (effectiveType === '3g') return 'medium';
  return 'fast';
};

// Helper to detect capabilities
const detectCapabilities = () => {
  const canvas = document.createElement('canvas');
  return {
    webgl: !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    canvas: !!(canvas.getContext && canvas.getContext('2d')),
    serviceWorker: 'serviceWorker' in navigator,
    intersectionObserver: 'IntersectionObserver' in window,
    resizeObserver: 'ResizeObserver' in window,
  };
};

const ResponsiveContext = createContext(null);

export const ResponsiveProvider = ({ children }) => {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [orientation, setOrientation] = useState(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );

  const [networkSpeed, setNetworkSpeed] = useState(getNetworkSpeed());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Detect device properties (static)
  const deviceInfo = useMemo(() => ({
    isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    isRetina: window.devicePixelRatio > 1,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    capabilities: detectCapabilities(),
  }), []);

  // Derived state
  const device = useMemo(() => getDeviceType(viewport.width), [viewport.width]);

  // Debounced resize handler
  useEffect(() => {
    let timeoutId;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        setViewport({ width, height });
        setOrientation(width > height ? 'landscape' : 'portrait');
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Network status listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setNetworkSpeed(getNetworkSpeed());
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setNetworkSpeed('offline');
    };

    const handleConnectionChange = () => {
      setNetworkSpeed(getNetworkSpeed());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if (navigator.connection) {
      navigator.connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  // Helper functions
  const isMobile = useCallback(() => device === 'mobile', [device]);
  const isTablet = useCallback(() => device === 'tablet', [device]);
  const isDesktop = useCallback(() => 
    device === 'desktop' || device === 'desktopLg' || device === 'ultrawide', 
    [device]
  );
  const isTouchDevice = useCallback(() => deviceInfo.isTouch, [deviceInfo.isTouch]);
  const isRetina = useCallback(() => deviceInfo.isRetina, [deviceInfo.isRetina]);
  const isSlowNetwork = useCallback(() => networkSpeed === 'slow' || networkSpeed === 'offline', [networkSpeed]);
  const prefersReducedMotion = useCallback(() => deviceInfo.prefersReducedMotion, [deviceInfo.prefersReducedMotion]);
  const prefersDarkMode = useCallback(() => deviceInfo.prefersDarkMode, [deviceInfo.prefersDarkMode]);

  // Performance helpers
  const shouldRenderHeavyComponent = useCallback(() => {
    return isDesktop() && networkSpeed !== 'slow' && !deviceInfo.prefersReducedMotion;
  }, [isDesktop, networkSpeed, deviceInfo.prefersReducedMotion]);

  const shouldUseSimplifiedUI = useCallback(() => {
    return isMobile() || isSlowNetwork() || deviceInfo.prefersReducedMotion;
  }, [isMobile, isSlowNetwork, deviceInfo.prefersReducedMotion]);

  const value = useMemo(() => ({
    // Device info
    viewport,
    device,
    orientation,
    isTouch: deviceInfo.isTouch,
    isRetina: deviceInfo.isRetina,
    
    // Network
    networkSpeed,
    isOnline,
    
    // Preferences
    prefersReducedMotion: deviceInfo.prefersReducedMotion,
    prefersDarkMode: deviceInfo.prefersDarkMode,
    
    // Capabilities
    capabilities: deviceInfo.capabilities,
    
    // Breakpoints
    breakpoints: BREAKPOINTS,
    
    // Helper functions
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    isSlowNetwork,
    shouldRenderHeavyComponent,
    shouldUseSimplifiedUI,
  }), [
    viewport,
    device,
    orientation,
    deviceInfo,
    networkSpeed,
    isOnline,
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    isRetina,
    isSlowNetwork,
    prefersReducedMotion,
    prefersDarkMode,
    shouldRenderHeavyComponent,
    shouldUseSimplifiedUI,
  ]);

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsiveContext = () => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsiveContext must be used within ResponsiveProvider');
  }
  return context;
};

export default ResponsiveContext;
