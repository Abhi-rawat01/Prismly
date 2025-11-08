import { useResponsiveContext } from '../contexts/ResponsiveContext';

/**
 * Main hook to access responsive context
 * Returns all device info and helper functions
 */
export const useResponsive = () => {
  return useResponsiveContext();
};

export default useResponsive;
