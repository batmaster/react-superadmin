import React, { ReactNode } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { cn } from "../utils/cn";

export interface PageLayoutProps {
  /** Child components to render within the page */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Page title */
  title?: string;
  /** Page subtitle or description */
  subtitle?: string;
  /** Whether to show the page header */
  showHeader?: boolean;
  /** Whether to show breadcrumbs */
  showBreadcrumbs?: boolean;
  /** Breadcrumb items */
  breadcrumbs?: Array<{ label: string; href?: string }>;
  /** Page actions (buttons, etc.) */
  actions?: ReactNode;
  /** Whether the page has a background */
  withBackground?: boolean;
  /** Whether the page has padding */
  padded?: boolean;
}

/**
 * PageLayout component that provides a page-level layout structure.
 * This component is useful for creating consistent page layouts with headers,
 * breadcrumbs, and content areas.
 *
 * @example
 * ```tsx
 * import { PageLayout } from '@react-superadmin/core';
 *
 * const UserListPage = () => (
 *   <PageLayout
 *     title="Users"
 *     subtitle="Manage user accounts"
 *     actions={<CreateUserButton />}
 *   >
 *     <UserList />
 *   </PageLayout>
 * );
 * ```
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = "",
  style = {},
  title,
  subtitle,
  showHeader = true,
  showBreadcrumbs = false,
  breadcrumbs = [],
  actions,
  withBackground = true,
  padded = true,
}) => {
  const { theme } = useSuperAdmin();

  return (
    <div
      className={cn(
        "react-superadmin-page-layout",
        "min-h-screen",
        withBackground && "bg-gray-50 dark:bg-gray-900",
        className,
      )}
      style={style}
      data-testid="page-layout"
      data-show-header={showHeader}
      data-show-breadcrumbs={showBreadcrumbs}
      data-with-background={withBackground}
      data-padded={padded}
    >
      {showHeader && (title || subtitle || actions) && (
        <header
          className={cn(
            "border-b border-gray-200 dark:border-gray-700",
            withBackground && "bg-white dark:bg-gray-800",
          )}
          style={{
            borderBottomColor: theme.secondaryColor + "20",
          }}
        >
          <div
            className={cn(
              "px-4 sm:px-6 lg:px-8",
              padded && "py-6",
              !padded && "py-4",
            )}
          >
            {showBreadcrumbs && breadcrumbs.length > 0 && (
              <nav className="mb-4" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && (
                        <svg
                          className="w-4 h-4 mx-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {crumb.href ? (
                        <a
                          href={crumb.href}
                          className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          {crumb.label}
                        </a>
                      ) : (
                        <span className="text-gray-900 dark:text-gray-100">
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {subtitle}
                  </p>
                )}
              </div>

              {actions && (
                <div className="flex items-center space-x-3">{actions}</div>
              )}
            </div>
          </div>
        </header>
      )}

      <main
        className={cn(
          "flex-1",
          padded && "px-4 sm:px-6 lg:px-8 py-6",
          !padded && "px-4 sm:px-6 lg:px-8 py-4",
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
