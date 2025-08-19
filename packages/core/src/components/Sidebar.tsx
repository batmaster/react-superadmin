import React, { ReactNode, useState } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { cn } from "../utils/cn";

export interface SidebarProps {
  /** Child components to render within the sidebar */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Whether the sidebar is collapsible */
  collapsible?: boolean;
  /** Whether the sidebar is initially collapsed */
  defaultCollapsed?: boolean;
  /** Width of the sidebar when expanded */
  width?: number;
  /** Width of the sidebar when collapsed */
  collapsedWidth?: number;
}

/**
 * Sidebar component that provides the left navigation sidebar.
 * This component should be used within the Layout component.
 *
 * @example
 * ```tsx
 * import { Sidebar } from '@react-superadmin/core';
 *
 * const NavigationSidebar = () => (
 *   <Sidebar collapsible>
 *     <NavigationMenu />
 *     <UserProfile />
 *   </Sidebar>
 * );
 * ```
 */
export const Sidebar: React.FC<SidebarProps> = ({
  children,
  className = "",
  style = {},
  collapsible = false,
  defaultCollapsed = false,
  width = 250,
  collapsedWidth = 64,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const { layout, theme } = useSuperAdmin();

  const currentWidth = isCollapsed ? collapsedWidth : width;

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <aside
      className={cn(
        "react-superadmin-sidebar",
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
        "transition-all duration-300 ease-in-out",
        className,
      )}
      style={{
        ...style,
        width: currentWidth,
        minWidth: currentWidth,
        borderRightColor: theme.secondaryColor + "20",
      }}
      data-testid="sidebar"
      data-collapsed={isCollapsed}
      data-collapsible={collapsible}
    >
      <div className="flex flex-col h-full">
        {collapsible && (
          <button
            onClick={toggleCollapse}
            className={cn(
              "p-2 m-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700",
              "transition-colors duration-200",
            )}
            data-testid="sidebar-toggle"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={cn(
                "w-5 h-5 transition-transform duration-300",
                isCollapsed && "rotate-180",
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </aside>
  );
};

export default Sidebar;
