import React, { ReactNode } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { cn } from "../utils/cn";

export interface ContainerLayoutProps {
  /** Child components to render within the container */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Maximum width of the container */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";
  /** Whether the container has padding */
  padded?: boolean;
  /** Whether the container is centered */
  centered?: boolean;
  /** Whether the container has a background */
  withBackground?: boolean;
}

/**
 * ContainerLayout component that provides a container-based layout for content.
 * This component is useful for wrapping content in a constrained width container.
 *
 * @example
 * ```tsx
 * import { ContainerLayout } from '@react-superadmin/core';
 *
 * const ContentContainer = () => (
 *   <ContainerLayout maxWidth="lg" padded centered>
 *     <ArticleContent />
 *   </ContainerLayout>
 * );
 * ```
 */
export const ContainerLayout: React.FC<ContainerLayoutProps> = ({
  children,
  className = "",
  style = {},
  maxWidth = "lg",
  padded = true,
  centered = true,
  withBackground = false,
}) => {
  const { theme } = useSuperAdmin();

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
    none: "",
  };

  return (
    <div
      className={cn(
        "react-superadmin-container-layout",
        maxWidthClasses[maxWidth],
        padded && "px-4 sm:px-6 lg:px-8",
        centered && "mx-auto",
        withBackground && "bg-white dark:bg-gray-800 rounded-lg shadow-sm",
        className,
      )}
      style={{
        ...style,
        ...(withBackground && {
          border: `1px solid ${theme.secondaryColor}20`,
        }),
      }}
      data-testid="container-layout"
      data-max-width={maxWidth}
      data-padded={padded}
      data-centered={centered}
      data-with-background={withBackground}
    >
      {children}
    </div>
  );
};

export default ContainerLayout;
