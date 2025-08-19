import React, { ReactNode } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { cn } from "../utils/cn";

export interface AppBarProps {
  /** Child components to render within the app bar */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Whether the app bar is elevated */
  elevated?: boolean;
  /** Whether the app bar is transparent */
  transparent?: boolean;
}

/**
 * AppBar component that provides the top navigation bar.
 * This component should be used within the Layout component.
 *
 * @example
 * ```tsx
 * import { AppBar } from '@react-superadmin/core';
 *
 * const TopBar = () => (
 *   <AppBar>
 *     <Logo />
 *     <Navigation />
 *     <UserMenu />
 *   </AppBar>
 * );
 * ```
 */
export const AppBar: React.FC<AppBarProps> = ({
  children,
  className = "",
  style = {},
  elevated = true,
  transparent = false,
}) => {
  const { theme } = useSuperAdmin();

  return (
    <header
      className={cn(
        "react-superadmin-appbar",
        elevated && "shadow-md",
        transparent && "bg-transparent",
        !transparent && "bg-white dark:bg-gray-800",
        className,
      )}
      style={{
        ...style,
        borderBottom: elevated ? `1px solid ${theme.secondaryColor}20` : "none",
      }}
      data-testid="app-bar"
      data-elevated={elevated}
      data-transparent={transparent}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {children}
      </div>
    </header>
  );
};

export default AppBar;
