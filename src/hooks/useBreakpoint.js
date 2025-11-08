import { useResponsiveContext } from '../contexts/ResponsiveContext';

/**
 * Returns current breakpoint name
 * @returns {'mobile' | 'tablet' | 'desktop' | 'desktopLg' | 'ultrawide'}
 */
export const useBreakpoint = () => {
  const { device } = useResponsiveContext();
  return device;
};

export default useBreakpoint;
