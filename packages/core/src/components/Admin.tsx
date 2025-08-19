import React, { ReactNode } from "react";
import { SuperAdminProvider } from "../contexts/SuperAdminContext";
import { AdminConfig } from "../types";

export interface AdminProps {
  /** Configuration object for the admin application */
  config: AdminConfig;
  /** Child components to render within the admin context */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * Main Admin component that provides the application context and configuration.
 * This component should wrap your entire admin application.
 *
 * @example
 * ```tsx
 * import { Admin } from '@react-superadmin/core';
 *
 * const App = () => (
 *   <Admin config={adminConfig}>
 *     <YourAdminComponents />
 *   </Admin>
 * );
 * ```
 */
export const Admin: React.FC<AdminProps> = ({
  config,
  children,
  className = "",
  style = {},
}) => {
  return (
    <SuperAdminProvider config={config}>
      <div
        className={`react-superadmin ${className}`.trim()}
        style={style}
        data-testid="admin-container"
      >
        {children}
      </div>
    </SuperAdminProvider>
  );
};

export default Admin;
