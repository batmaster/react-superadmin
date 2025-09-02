import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  /** Label to display for the breadcrumb item */
  label: string;
  /** URL to navigate to when clicked */
  href?: string;
  /** Whether this item is the current page (active) */
  active?: boolean;
  /** Icon to display before the label */
  icon?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface BreadcrumbProps {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[];
  /** Separator between breadcrumb items */
  separator?: React.ReactNode;
  /** Whether to show the home icon for the first item */
  showHomeIcon?: boolean;
  /** Maximum number of items to show (truncates with ellipsis) */
  maxItems?: number;
  /** Whether to show tooltips for truncated items */
  showTooltips?: boolean;
  /** Additional CSS classes for the breadcrumb container */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'default' | 'primary' | 'secondary' | 'muted';
}

/**
 * Modern, accessible breadcrumb component
 * 
 * Provides clear navigation context with proper accessibility features,
 * responsive design, and flexible customization options.
 * 
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', href: '/', icon: <Home /> },
 *     { label: 'Components', href: '/components' },
 *     { label: 'Modal', active: true }
 *   ]}
 *   showHomeIcon={true}
 *   variant="primary"
 * />
 * ```
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRight className="w-4 h-4" />,
  showHomeIcon = true,
  maxItems,
  showTooltips = true,
  className = '',
  size = 'md',
  variant = 'default',
}) => {
  // Truncate items if maxItems is specified
  const displayItems = maxItems && items.length > maxItems 
    ? [
        ...items.slice(0, 1), // Always show first item
        { label: '...', href: undefined, active: false },
        ...items.slice(-maxItems + 2) // Show last items
      ]
    : items;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const variantClasses = {
    default: 'text-gray-600',
    primary: 'text-blue-600',
    secondary: 'text-gray-700',
    muted: 'text-gray-500',
  };

  const activeClasses = {
    default: 'text-gray-900 font-medium',
    primary: 'text-blue-900 font-medium',
    secondary: 'text-gray-900 font-medium',
    muted: 'text-gray-700 font-medium',
  };

  const hoverClasses = {
    default: 'hover:text-gray-900',
    primary: 'hover:text-blue-800',
    secondary: 'hover:text-gray-800',
    muted: 'hover:text-gray-600',
  };

  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn(
        'flex items-center space-x-1',
        sizeClasses[size],
        className
      )}
    >
      <ol className="flex items-center space-x-1">
        {displayItems.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === displayItems.length - 1;
          const isActive = item.active || isLast;

          const itemClasses = cn(
            'flex items-center transition-colors duration-200',
            isActive 
              ? activeClasses[variant]
              : cn(variantClasses[variant], hoverClasses[variant]),
            item.className
          );

          const content = (
            <>
              {isFirst && showHomeIcon && !item.icon && (
                <Home className="w-4 h-4 mr-1" />
              )}
              {item.icon && <span className="mr-1">{item.icon}</span>}
              <span>{item.label}</span>
            </>
          );

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400" aria-hidden="true">
                  {separator}
                </span>
              )}
              
              {item.href && !isActive ? (
                <Link
                  to={item.href}
                  className={cn(
                    itemClasses,
                    'rounded-md px-2 py-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  )}
                  title={showTooltips && item.label === '...' ? 'More items' : item.label}
                >
                  {content}
                </Link>
              ) : (
                <span
                  className={cn(
                    itemClasses,
                    'px-2 py-1 rounded-md',
                    isActive && 'bg-gray-100'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  title={showTooltips && item.label === '...' ? 'More items' : item.label}
                >
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
