import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';

/**
 * Flexbox that auto-switches between row and column
 */
const AdaptiveStack = ({ 
  children,
  breakpoint = 'tablet',
  gap = '1rem',
  align = 'stretch',
  justify = 'flex-start',
  reverse = false,
  className = ''
}) => {
  const { device } = useResponsive();

  // Determine if we should use column layout
  const shouldStack = () => {
    const breakpointOrder = ['mobile', 'tablet', 'desktop', 'desktopLg', 'ultrawide'];
    const currentIndex = breakpointOrder.indexOf(device);
    const breakpointIndex = breakpointOrder.indexOf(breakpoint);
    return currentIndex < breakpointIndex;
  };

  const isStacked = shouldStack();

  const style = {
    display: 'flex',
    flexDirection: isStacked 
      ? (reverse ? 'column-reverse' : 'column')
      : (reverse ? 'row-reverse' : 'row'),
    gap: gap,
    alignItems: align,
    justifyContent: justify,
    transition: 'all 0.3s ease',
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

export default AdaptiveStack;
