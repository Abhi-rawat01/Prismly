/**
 * Generates CSS clamp() for fluid sizing
 * @param {number} minPx - Minimum size in pixels
 * @param {number} maxPx - Maximum size in pixels
 * @param {number} minVw - Minimum viewport width (default: 320)
 * @param {number} maxVw - Maximum viewport width (default: 1920)
 * @returns {string} - CSS clamp() value
 */
export const fluidSize = (minPx, maxPx, minVw = 320, maxVw = 1920) => {
  const slope = (maxPx - minPx) / (maxVw - minVw);
  const yAxisIntersection = -minVw * slope + minPx;
  
  return `clamp(${minPx}px, ${yAxisIntersection.toFixed(2)}px + ${(slope * 100).toFixed(2)}vw, ${maxPx}px)`;
};

/**
 * Generates responsive spacing
 * @param {string} mobile - Mobile spacing
 * @param {string} tablet - Tablet spacing (optional)
 * @param {string} desktop - Desktop spacing
 * @returns {string} - CSS value with media queries
 */
export const responsiveSpacing = (mobile, tablet, desktop) => {
  if (!tablet) {
    return fluidSize(
      parseInt(mobile),
      parseInt(desktop)
    );
  }
  
  return {
    base: mobile,
    '@media (min-width: 640px)': tablet,
    '@media (min-width: 1024px)': desktop,
  };
};

/**
 * Generates responsive grid-template-columns
 * @param {number} minCardWidth - Minimum card width in pixels
 * @param {number} maxColumns - Maximum number of columns (optional)
 * @returns {string} - CSS grid-template-columns value
 */
export const responsiveGrid = (minCardWidth = 280, maxColumns = null) => {
  const minWidth = `min(100%, ${minCardWidth}px)`;
  
  if (maxColumns) {
    return `repeat(auto-fit, minmax(${minWidth}, ${100 / maxColumns}%))`;
  }
  
  return `repeat(auto-fit, minmax(${minWidth}, 1fr))`;
};

/**
 * Generates breakpoint-based styles
 * @param {Object} styles - Object with breakpoint keys and style values
 * @returns {Object} - CSS-in-JS object with media queries
 */
export const generateBreakpointStyles = (styles) => {
  const breakpoints = {
    mobile: 0,
    tablet: 640,
    desktop: 1024,
    desktopLg: 1280,
    ultrawide: 1536,
  };

  const result = {};
  
  // Add base (mobile) styles
  if (styles.mobile) {
    Object.assign(result, styles.mobile);
  }

  // Add media queries for other breakpoints
  Object.entries(styles).forEach(([breakpoint, breakpointStyles]) => {
    if (breakpoint === 'mobile') return;
    
    const minWidth = breakpoints[breakpoint];
    if (minWidth) {
      result[`@media (min-width: ${minWidth}px)`] = breakpointStyles;
    }
  });

  return result;
};

/**
 * Returns appropriate value based on current breakpoint
 * @param {*} mobileValue - Value for mobile
 * @param {*} desktopValue - Value for desktop
 * @param {string} currentBreakpoint - Current breakpoint
 * @returns {*} - Appropriate value
 */
export const adaptiveValue = (mobileValue, desktopValue, currentBreakpoint) => {
  const desktopBreakpoints = ['desktop', 'desktopLg', 'ultrawide'];
  return desktopBreakpoints.includes(currentBreakpoint) ? desktopValue : mobileValue;
};

/**
 * Generates touch-friendly size
 * @param {number} baseSize - Base size in pixels
 * @param {boolean} isTouch - Whether device is touch-enabled
 * @returns {number} - Adjusted size
 */
export const touchFriendlySize = (baseSize, isTouch) => {
  const minTouchTarget = 44; // Apple HIG recommendation
  return isTouch ? Math.max(baseSize, minTouchTarget) : baseSize;
};

/**
 * Calculates optimal font size for readability
 * @param {number} viewportWidth - Viewport width
 * @returns {number} - Font size in pixels
 */
export const optimalFontSize = (viewportWidth) => {
  if (viewportWidth < 640) return 16;
  if (viewportWidth < 1024) return 17;
  if (viewportWidth < 1280) return 18;
  return 18;
};

/**
 * Generates container padding based on viewport
 * @param {number} viewportWidth - Viewport width
 * @returns {string} - Padding value
 */
export const containerPadding = (viewportWidth) => {
  if (viewportWidth < 640) return '1rem';
  if (viewportWidth < 1024) return '2rem';
  if (viewportWidth < 1280) return '3rem';
  return '4rem';
};

export default {
  fluidSize,
  responsiveSpacing,
  responsiveGrid,
  generateBreakpointStyles,
  adaptiveValue,
  touchFriendlySize,
  optimalFontSize,
  containerPadding,
};
