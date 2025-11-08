import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';

/**
 * Auto-adjusting grid that changes columns based on screen size
 */
const AdaptiveGrid = ({ 
  children, 
  minCardWidth = 280, 
  gap = '1rem',
  maxColumns = null,
  className = '' 
}) => {
  const { viewport } = useResponsive();

  // Calculate optimal columns based on viewport
  const calculateColumns = () => {
    if (!maxColumns) return null;
    const availableWidth = viewport.width - 32; // Account for padding
    const possibleColumns = Math.floor(availableWidth / minCardWidth);
    return Math.min(possibleColumns, maxColumns);
  };

  const columns = calculateColumns();

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: columns 
      ? `repeat(${columns}, 1fr)`
      : `repeat(auto-fit, minmax(min(100%, ${minCardWidth}px), 1fr))`,
    gap: gap,
  };

  return (
    <div className={className} style={gridStyle}>
      {children}
    </div>
  );
};

export default AdaptiveGrid;
