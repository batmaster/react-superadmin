import React, { ReactNode } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { cn } from "../utils/cn";

export interface CardProps {
  /** Child components to render within the card */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Whether the card is elevated */
  elevated?: boolean;
  /** Whether the card is interactive (hoverable) */
  interactive?: boolean;
  /** Whether the card is selected */
  selected?: boolean;
  /** Whether the card is disabled */
  disabled?: boolean;
  /** Card header content */
  header?: ReactNode;
  /** Card footer content */
  footer?: ReactNode;
  /** Whether the card has padding */
  padded?: boolean;
  /** Whether the card has a border */
  bordered?: boolean;
}

/**
 * Card component that provides a card-based layout for content.
 * This component is useful for displaying content in organized, visually
 * distinct containers.
 *
 * @example
 * ```tsx
 * import { Card } from '@react-superadmin/core';
 *
 * const UserCard = () => (
 *   <Card header={<h3>User Profile</h3>} footer={<button>Edit</button>}>
 *     <p>User information goes here...</p>
 *   </Card>
 * );
 * ```
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  style = {},
  elevated = true,
  interactive = false,
  selected = false,
  disabled = false,
  header,
  footer,
  padded = true,
  bordered = true,
}) => {
  const { theme } = useSuperAdmin();

  return (
    <div
      className={cn(
        "react-superadmin-card",
        "bg-white dark:bg-gray-800",
        "rounded-lg",
        elevated && "shadow-sm",
        interactive &&
          !disabled &&
          "cursor-pointer transition-all duration-200",
        interactive && !disabled && "hover:shadow-md hover:-translate-y-1",
        selected && "ring-2 ring-blue-500",
        disabled && "opacity-50 cursor-not-allowed",
        bordered && "border border-gray-200 dark:border-gray-700",
        className,
      )}
      style={{
        ...style,
        ...(bordered && {
          borderColor: theme.secondaryColor + "20",
        }),
      }}
      data-testid="card"
      data-elevated={elevated}
      data-interactive={interactive}
      data-selected={selected}
      data-disabled={disabled}
      data-padded={padded}
      data-bordered={bordered}
    >
      {header && (
        <div
          className={cn(
            "px-6 py-4",
            bordered && "border-b border-gray-200 dark:border-gray-700",
            !padded && "px-4 py-3",
          )}
        >
          {header}
        </div>
      )}

      <div className={cn(padded && "px-6 py-4", !padded && "px-4 py-3")}>
        {children}
      </div>

      {footer && (
        <div
          className={cn(
            "px-6 py-4",
            bordered && "border-t border-gray-200 dark:border-gray-700",
            !padded && "px-4 py-3",
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
