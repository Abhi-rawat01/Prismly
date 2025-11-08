import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';

/**
 * Automatically switches between layout variants based on device
 */
const AdaptiveLayout = ({ 
  mobile, 
  tablet, 
  desktop, 
  desktopLg,
  ultrawide,
  className = '',
  animate = false 
}) => {
  const { device } = useResponsive();

  // Select appropriate component
  let Component = null;
  
  switch (device) {
    case 'mobile':
      Component = mobile || tablet || desktop;
      break;
    case 'tablet':
      Component = tablet || mobile || desktop;
      break;
    case 'desktop':
      Component = desktop || desktopLg || tablet;
      break;
    case 'desktopLg':
      Component = desktopLg || desktop || ultrawide;
      break;
    case 'ultrawide':
      Component = ultrawide || desktopLg || desktop;
      break;
    default:
      Component = desktop || mobile;
  }

  if (!Component) {
    console.warn('AdaptiveLayout: No component provided for current device');
    return null;
  }

  const wrapperClass = animate 
    ? `${className} transition-all duration-300 ease-in-out` 
    : className;

  return (
    <div className={wrapperClass}>
      {Component}
    </div>
  );
};

export default AdaptiveLayout;
