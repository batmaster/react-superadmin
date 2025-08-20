import React, { ReactNode } from "react";
import { SuperAdminProvider } from "../contexts/SuperAdminContext";
import { AdminConfig } from "../types";

export interface AdminProps {
  /** Configuration for the admin application */
  config: AdminConfig;
  /** Custom layout component to override default */
  layout?: React.ComponentType<{ children: ReactNode }>;
  /** Custom theme provider */
  themeProvider?: React.ComponentType<{ children: ReactNode }>;
  /** Custom data provider */
  dataProvider?: any;
  /** Custom auth provider */
  authProvider?: any;
  /** Custom i18n provider */
  i18nProvider?: any;
  /** Children components */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Main Admin component that wraps the entire application
 *
 * This component provides the core context and configuration for React SuperAdmin.
 * It should be used as the root component of your admin application.
 *
 * @example
 * ```tsx
 * import { Admin, createAdmin } from '@react-superadmin/core';
 *
 * const adminConfig = createAdmin({
 *   title: 'My Admin',
 *   resources: [userResource, postResource],
 *   theme: { primaryColor: '#3b82f6' }
 * });
 *
 * function App() {
 *   return (
 *     <Admin config={adminConfig}>
 *       <Router>
 *         <Routes>
 *           <Route path="/" element={<Dashboard />} />
 *         </Routes>
 *       </Router>
 *     </Admin>
 *   );
 * }
 * ```
 */
export const Admin: React.FC<AdminProps> = ({
  config,
  layout,
  themeProvider: ThemeProvider,
  dataProvider,
  authProvider,
  i18nProvider: I18nProvider,
  children,
  className = "",
}) => {
  // Merge custom providers with config
  const finalConfig = {
    ...config,
    dataProvider: dataProvider || config.dataProvider,
    authProvider: authProvider || config.authProvider,
    i18nProvider: I18nProvider || config.i18nProvider,
  };

  // Wrap children with custom layout if provided
  const renderChildren = () => {
    if (layout) {
      const LayoutComponent = layout;
      return <LayoutComponent>{children}</LayoutComponent>;
    }
    return children;
  };

  // Wrap with theme provider if provided
  const renderWithTheme = (content: ReactNode) => {
    if (ThemeProvider) {
      return <ThemeProvider>{content}</ThemeProvider>;
    }
    return content;
  };

  // Wrap with i18n provider if provided
  const renderWithI18n = (content: ReactNode) => {
    if (I18nProvider) {
      return <I18nProvider>{content}</I18nProvider>;
    }
    return content;
  };

  return (
    <div className={`react-superadmin ${className}`}>
      <SuperAdminProvider config={finalConfig}>
        {renderWithI18n(renderWithTheme(renderChildren()))}
      </SuperAdminProvider>
    </div>
  );
};

export default Admin;
