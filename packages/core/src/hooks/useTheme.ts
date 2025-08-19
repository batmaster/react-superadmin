import { useCallback } from 'react';
import { useSuperAdmin } from '../contexts/SuperAdminContext';

export interface UseThemeReturn {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    darkMode: boolean;
    customCSS?: string;
  };
  toggleDarkMode: () => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setCustomCSS: (css: string) => void;
}

export function useTheme(): UseThemeReturn {
  const { theme } = useSuperAdmin();

  const toggleDarkMode = useCallback(() => {
    // This would typically update the theme context
    console.log('Toggle dark mode');
  }, []);

  const setPrimaryColor = useCallback((color: string) => {
    // This would typically update the theme context
    console.log('Set primary color:', color);
  }, []);

  const setSecondaryColor = useCallback((color: string) => {
    // This would typically update the theme context
    console.log('Set secondary color:', color);
  }, []);

  const setCustomCSS = useCallback((css: string) => {
    // This would typically update the theme context
    console.log('Set custom CSS:', css);
  }, []);

  return {
    theme: {
      primaryColor: theme.primaryColor || '#3b82f6',
      secondaryColor: theme.secondaryColor || '#6b7280',
      darkMode: theme.darkMode || false,
      customCSS: theme.customCSS,
    },
    toggleDarkMode,
    setPrimaryColor,
    setSecondaryColor,
    setCustomCSS,
  };
}
