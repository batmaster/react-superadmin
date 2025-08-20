import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  SuperAdminContextValue,
  AdminConfig,
  ResourceConfig,
  ThemeConfig,
  LayoutConfig,
  AuthConfig,
} from "../types";

const SuperAdminContext = createContext<SuperAdminContextValue | undefined>(
  undefined,
);

export interface SuperAdminProviderProps {
  children: ReactNode;
  config: AdminConfig;
}

export const SuperAdminProvider: React.FC<SuperAdminProviderProps> = ({
  children,
  config,
}) => {
  const [user, setUser] = useState<any>(null);

  // Convert resources array to object for easier access
  const resources = config.resources.reduce(
    (acc, resource) => {
      acc[resource.name] = resource;
      return acc;
    },
    {} as Record<string, ResourceConfig>,
  );

  // Default theme configuration
  const defaultTheme: ThemeConfig = {
    primaryColor: "#3b82f6",
    secondaryColor: "#6b7280",
    darkMode: false,
    ...config.theme,
  };

  // Default layout configuration
  const defaultLayout: LayoutConfig = {
    sidebar: true,
    header: true,
    footer: true,
    sidebarWidth: 250,
    ...config.layout,
  };

  // Default auth configuration
  const defaultAuth: AuthConfig = {
    enabled: false,
    ...config.auth,
  };

  const logout = useCallback(() => {
    setUser(null);
    // Additional logout logic can be added here
  }, []);

  const value: SuperAdminContextValue = {
    config,
    resources,
    theme: defaultTheme,
    layout: defaultLayout,
    auth: defaultAuth,
    user,
    setUser,
    logout,
    dataProvider: config.dataProvider,
  };

  return (
    <SuperAdminContext.Provider value={value}>
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdmin = (): SuperAdminContextValue => {
  const context = useContext(SuperAdminContext);
  if (context === undefined) {
    throw new Error("useSuperAdmin must be used within a SuperAdminProvider");
  }
  return context;
};
