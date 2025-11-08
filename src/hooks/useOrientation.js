import { useResponsiveContext } from '../contexts/ResponsiveContext';

/**
 * Returns current device orientation
 * @returns {'portrait' | 'landscape'}
 */
export const useOrientation = () => {
  const { orientation } = useResponsiveContext();
  return orientation;
};

export default useOrientation;
