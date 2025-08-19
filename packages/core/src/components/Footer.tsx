import React, { ReactNode } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { cn } from "../utils/cn";

export interface FooterProps {
  /** Child components to render within the footer */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Whether the footer is elevated */
  elevated?: boolean;
  /** Whether the footer is transparent */
  transparent?: boolean;
}

/**
 * Footer component that provides the bottom footer.
 * This component should be used within the Layout component.
 *
 * @example
 * ```tsx
 * import { Footer } from '@react-superadmin/core';
 *
 * const AppFooter = () => (
 *   <Footer>
 *     <Copyright />
 *     <Links />
 *   </Footer>
 * );
 * ```
 */
export const Footer: React.FC<FooterProps> = ({
  children,
  className = "",
  style = {},
  elevated = true,
  transparent = false,
}) => {
  const { theme } = useSuperAdmin();

  return (
    <footer
      className={cn(
        "react-superadmin-footer",
        elevated && "shadow-md",
        transparent && "bg-transparent",
        !transparent && "bg-white dark:bg-gray-800",
        className,
      )}
      style={{
        ...style,
        borderTop: elevated ? `1px solid ${theme.secondaryColor}20` : "none",
      }}
      data-testid="footer"
      data-elevated={elevated}
      data-transparent={transparent}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {children}
      </div>
    </footer>
  );
};

export default Footer;
