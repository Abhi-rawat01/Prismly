import { useResponsiveContext } from '../contexts/ResponsiveContext';

/**
 * Returns current viewport dimensions
 * @returns {{ width: number, height: number }}
 */
export const useViewportSize = () => {
  const { viewport } = useResponsiveContext();
  return viewport;
};

export default useViewportSize;
