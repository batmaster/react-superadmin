import React, { ReactNode } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { cn } from "../utils/cn";

export interface LayoutProps {
  /** Child components to render within the layout */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Whether to show the header */
  showHeader?: boolean;
  /** Whether to show the sidebar */
  showSidebar?: boolean;
  /** Whether to show the footer */
  showFooter?: boolean;
}

/**
 * Main Layout component that provides the application layout structure.
 * This component should be used within the Admin component to define the layout.
 *
 * @example
 * ```tsx
 * import { Layout } from '@react-superadmin/core';
 *
 * const AppLayout = () => (
 *   <Layout>
 *     <Header />
 *     <Sidebar />
 *     <MainContent />
 *     <Footer />
 *   </Layout>
 * );
 * ```
 */
export const Layout: React.FC<LayoutProps> = ({
  children,
  className = "",
  style = {},
  showHeader = true,
  showSidebar = true,
  showFooter = true,
}) => {
  const { layout } = useSuperAdmin();

  // Use context layout settings as defaults, but allow props to override
  const shouldShowHeader = showHeader && layout.header;
  const shouldShowSidebar = showSidebar && layout.sidebar;
  const shouldShowFooter = showFooter && layout.footer;

  return (
    <div
      className={cn("react-superadmin-layout", className)}
      style={style}
      data-testid="layout-container"
      data-show-header={shouldShowHeader}
      data-show-sidebar={shouldShowSidebar}
      data-show-footer={shouldShowFooter}
    >
      {children}
    </div>
  );
};

export default Layout;
