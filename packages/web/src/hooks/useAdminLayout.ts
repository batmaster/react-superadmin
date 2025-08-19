import { useSuperAdmin } from '@react-superadmin/core';

export function useAdminLayout() {
  const { layout, theme } = useSuperAdmin();

  return {
    layout,
    theme,
    isSidebarCollapsed: false, // This could be managed with local state
    toggleSidebar: () => {}, // This could toggle sidebar state
  };
}
