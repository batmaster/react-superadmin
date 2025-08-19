import React, { ReactNode } from "react";
import { cn } from "../utils/cn";
import { AppBar } from "./AppBar";
import { Footer } from "./Footer";
import { Layout } from "./Layout";
import { Sidebar } from "./Sidebar";

export interface AdminLayoutProps {
  /** Child components to render within the admin layout */
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
  /** Whether the sidebar is collapsible */
  sidebarCollapsible?: boolean;
  /** Whether the sidebar is initially collapsed */
  sidebarDefaultCollapsed?: boolean;
  /** Header content */
  headerContent?: ReactNode;
  /** Sidebar content */
  sidebarContent?: ReactNode;
  /** Footer content */
  footerContent?: ReactNode;
}

/**
 * AdminLayout component that provides the standard admin interface layout.
 * This component combines Layout, AppBar, Sidebar, and Footer components.
 *
 * @example
 * ```tsx
 * import { AdminLayout } from '@react-superadmin/core';
 *
 * const App = () => (
 *   <AdminLayout
 *     headerContent={<NavigationHeader />}
 *     sidebarContent={<NavigationMenu />}
 *     footerContent={<Copyright />}
 *   >
 *     <MainContent />
 *   </AdminLayout>
 * );
 * ```
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  className = "",
  style = {},
  showHeader = true,
  showSidebar = true,
  showFooter = true,
  sidebarCollapsible = true,
  sidebarDefaultCollapsed = false,
  headerContent,
  sidebarContent,
  footerContent,
}) => {
  return (
    <Layout
      className={cn("react-superadmin-admin-layout", className)}
      style={style}
      showHeader={showHeader}
      showSidebar={showSidebar}
      showFooter={showFooter}
    >
      <div className="flex flex-col h-screen">
        {showHeader && headerContent && <AppBar>{headerContent}</AppBar>}

        <div className="flex flex-1 overflow-hidden">
          {showSidebar && sidebarContent && (
            <Sidebar
              collapsible={sidebarCollapsible}
              defaultCollapsed={sidebarDefaultCollapsed}
            >
              {sidebarContent}
            </Sidebar>
          )}

          <main className="flex-1 overflow-auto">{children}</main>
        </div>

        {showFooter && footerContent && <Footer>{footerContent}</Footer>}
      </div>
    </Layout>
  );
};

export default AdminLayout;
