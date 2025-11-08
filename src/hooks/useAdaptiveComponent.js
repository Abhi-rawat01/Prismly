import { useResponsive } from './useResponsive';

/**
 * Returns appropriate component variant based on device
 * @param {Object} variants - Object with device keys and component values
 * @param {React.Component} variants.mobile - Mobile component
 * @param {React.Component} variants.tablet - Tablet component (optional)
 * @param {React.Component} variants.desktop - Desktop component
 * @param {React.Component} variants.ultrawide - Ultrawide component (optional)
 * @returns {React.Component} - Appropriate component for current device
 */
export const useAdaptiveComponent = (variants) => {
  const { device } = useResponsive();

  // Return exact match if available
  if (variants[device]) {
    return variants[device];
  }

  // Fallback logic
  if (device === 'mobile') {
    return variants.mobile || variants.tablet || variants.desktop;
  }
  
  if (device === 'tablet') {
    return variants.tablet || variants.mobile || variants.desktop;
  }
  
  if (device === 'ultrawide') {
    return variants.ultrawide || variants.desktopLg || variants.desktop;
  }
  
  if (device === 'desktopLg') {
    return variants.desktopLg || variants.desktop || variants.ultrawide;
  }

  // Default to desktop
  return variants.desktop || variants.tablet || variants.mobile;
};

export default useAdaptiveComponent;
