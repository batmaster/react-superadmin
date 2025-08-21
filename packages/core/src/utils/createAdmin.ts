import {
  AdminConfig,
  AuthConfig,
  LayoutConfig,
  ResourceConfig,
  ThemeConfig,
} from "../types";

export interface CreateAdminOptions {
  title: string;
  resources: ResourceConfig[];
  dataProvider?: any;
  theme?: Partial<ThemeConfig>;
  layout?: Partial<LayoutConfig>;
  auth?: Partial<AuthConfig>;
}

export function createAdmin(options: CreateAdminOptions): AdminConfig {
  return {
    title: options.title,
    resources: options.resources,
    dataProvider: options.dataProvider,
    theme: {
      primaryColor: "#3b82f6",
      secondaryColor: "#6b7280",
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
