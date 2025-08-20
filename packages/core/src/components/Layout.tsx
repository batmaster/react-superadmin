import React, { ReactNode } from "react";

export interface LayoutProps {
  /** Header component to render at the top */
  header?: ReactNode;
  /** Sidebar component to render on the left */
  sidebar?: ReactNode;
  /** Footer component to render at the bottom */
  footer?: ReactNode;
  /** Main content area */
  children: ReactNode;
  /** Additional CSS classes for the layout container */
  className?: string;
  /** Additional CSS classes for the header */
  headerClassName?: string;
  /** Additional CSS classes for the sidebar */
  sidebarClassName?: string;
  /** Additional CSS classes for the main content */
  mainClassName?: string;
  /** Additional CSS classes for the footer */
  footerClassName?: string;
  /** Whether to show the sidebar */
  showSidebar?: boolean;
  /** Whether to show the header */
  showHeader?: boolean;
  /** Whether to show the footer */
  showFooter?: boolean;
  /** Sidebar width in pixels */
  sidebarWidth?: number;
}

/**
 * Main Layout component that provides the basic structure for admin interfaces
 *
 * This component creates a responsive layout with header, sidebar, main content,
 * and footer areas. It's designed to be flexible and customizable.
 *
 * @example
 * ```tsx
 * import { Layout } from '@react-superadmin/core';
 *
 * function AdminLayout() {
 *   return (
 *     <Layout
 *       header={<Header />}
 *       sidebar={<Sidebar />}
 *       footer={<Footer />}
 *       showSidebar={true}
 *       sidebarWidth={250}
 *     >
 *       <main>Your content here</main>
 *     </Layout>
 *   );
 * }
 * ```
 */
export const Layout: React.FC<LayoutProps> = ({
  header,
  sidebar,
  footer,
  children,
  className = "",
  headerClassName = "",
  sidebarClassName = "",
  mainClassName = "",
  footerClassName = "",
  showSidebar = true,
  showHeader = true,
  showFooter = true,
  sidebarWidth = 250,
}) => {
  const layoutClasses = `rs-layout ${className}`.trim();
  const headerClasses = `rs-layout__header ${headerClassName}`.trim();
  const sidebarClasses = `rs-layout__sidebar ${sidebarClassName}`.trim();
  const mainClasses = `rs-layout__main ${mainClassName}`.trim();
  const footerClasses = `rs-layout__footer ${footerClassName}`.trim();

  return (
    <div className={layoutClasses}>
      {showHeader && header && (
        <header className={headerClasses}>{header}</header>
      )}

      <div className="rs-layout__body">
        {showSidebar && sidebar && (
          <aside className={sidebarClasses} style={{ width: sidebarWidth }}>
            {sidebar}
          </aside>
        )}

        <main className={mainClasses}>{children}</main>
      </div>

      {showFooter && footer && (
        <footer className={footerClasses}>{footer}</footer>
      )}
    </div>
  );
};

export default Layout;
