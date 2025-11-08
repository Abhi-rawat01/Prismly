import React from 'react';
import { fluidSize } from '../../utils/responsiveStyles';

/**
 * Automatically scales text based on viewport
 */
const AdaptiveText = ({ 
  variant = 'body',
  children,
  minSize,
  maxSize,
  className = '',
  as: Component = 'p'
}) => {
  // Predefined variants
  const variants = {
    h1: { min: 32, max: 48 },
    h2: { min: 24, max: 36 },
    h3: { min: 20, max: 28 },
    h4: { min: 18, max: 24 },
    body: { min: 16, max: 18 },
    small: { min: 14, max: 16 },
    caption: { min: 12, max: 14 },
  };

  const sizes = variants[variant] || variants.body;
  const min = minSize || sizes.min;
  const max = maxSize || sizes.max;

  const style = {
    fontSize: fluidSize(min, max),
    lineHeight: variant.startsWith('h') ? '1.2' : '1.6',
  };

  return (
    <Component className={className} style={style}>
      {children}
    </Component>
  );
};

export default AdaptiveText;
