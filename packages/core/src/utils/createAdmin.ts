import { AdminConfig, ResourceConfig, ThemeConfig, LayoutConfig, AuthConfig } from '../types';

export interface CreateAdminOptions {
  title: string;
  resources: ResourceConfig[];
  theme?: Partial<ThemeConfig>;
  layout?: Partial<LayoutConfig>;
  auth?: Partial<AuthConfig>;
}

export function createAdmin(options: CreateAdminOptions): AdminConfig {
  return {
    title: options.title,
    resources: options.resources,
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#6b7280',
      darkMode: false,
      ...options.theme,
    },
    layout: {
      sidebar: true,
      header: true,
      footer: true,
      sidebarWidth: 250,
      ...options.layout,
    },
    auth: {
      enabled: false,
      ...options.auth,
    },
  };
}
