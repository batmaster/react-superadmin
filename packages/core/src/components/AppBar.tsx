import React, { ReactNode } from "react";

export interface AppBarProps {
  /** Title to display in the app bar */
  title?: ReactNode;
  /** Logo or brand element */
  logo?: ReactNode;
  /** Left side actions (e.g., menu toggle, breadcrumbs) */
  leftActions?: ReactNode;
  /** Right side actions (e.g., user menu, notifications) */
  rightActions?: ReactNode;
  /** Whether the app bar is elevated (has shadow) */
  elevated?: boolean;
  /** Whether the app bar is transparent */
  transparent?: boolean;
  /** Background color variant */
  variant?: "default" | "primary" | "secondary" | "dark";
  /** Additional CSS classes for the app bar container */
  className?: string;
  /** Additional CSS classes for the left section */
  leftClassName?: string;
  /** Additional CSS classes for the center section */
  centerClassName?: string;
  /** Additional CSS classes for the right section */
  rightClassName?: string;
  /** Whether to show the app bar */
  show?: boolean;
  /** Fixed positioning (stays at top when scrolling) */
  fixed?: boolean;
  /** Sticky positioning (sticks to top when scrolling) */
  sticky?: boolean;
}

/**
 * AppBar component for top navigation and branding
 *
 * This component provides a consistent top navigation bar with flexible
 * content areas for branding, navigation, and user actions.
 *
 * @example
 * ```tsx
 * import { AppBar } from '@react-superadmin/core';
 *
 * function Header() {
 *   return (
 *     <AppBar
 *       title="My Admin"
 *       logo={<img src="/logo.png" alt="Logo" />}
 *       leftActions={<MenuToggle />}
 *       rightActions={<UserMenu />}
 *       variant="primary"
 *       elevated={true}
 *     />
 *   );
 * }
 * ```
 */
export const AppBar: React.FC<AppBarProps> = ({
  title,
  logo,
  leftActions,
  rightActions,
  elevated = true,
  transparent = false,
  variant = "default",
  className = "",
  leftClassName = "",
  centerClassName = "",
  rightClassName = "",
  show = true,
  fixed = false,
  sticky = false,
}) => {
  if (!show) return null;

  const appBarClasses = [
    "rs-appbar",
    `rs-appbar--${variant}`,
    elevated && "rs-appbar--elevated",
    transparent && "rs-appbar--transparent",
    fixed && "rs-appbar--fixed",
    sticky && "rs-appbar--sticky",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const leftClasses = `rs-appbar__left ${leftClassName}`.trim();
  const centerClasses = `rs-appbar__center ${centerClassName}`.trim();
  const rightClasses = `rs-appbar__right ${rightClassName}`.trim();

  return (
    <header className={appBarClasses}>
      <div className="rs-appbar__container">
        {/* Left Section */}
        <div className={leftClasses}>{leftActions}</div>

        {/* Center Section */}
        <div className={centerClasses}>
          {logo && <div className="rs-appbar__logo">{logo}</div>}
          {title && <h1 className="rs-appbar__title">{title}</h1>}
        </div>

        {/* Right Section */}
        <div className={rightClasses}>{rightActions}</div>
      </div>
    </header>
  );
};

export default AppBar;
