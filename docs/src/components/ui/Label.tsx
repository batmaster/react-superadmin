import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { AlertCircle } from 'lucide-react';

export interface LabelProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'size'> {
  /** The text content for the label */
  children: React.ReactNode;

  /** The ID of the form control this label is associated with */
  htmlFor?: string;

  /** Whether the field is required (shows required indicator) */
  required?: boolean;

  /** Label size variant */
  size?: 'sm' | 'md' | 'lg';

  /** Label variant/style */
  variant?: 'default' | 'bold' | 'subtle' | 'error';

  /** Whether to show an icon */
  showIcon?: boolean;

  /** Custom icon component */
  icon?: React.ComponentType<{ className?: string }>;

  /** Helper text to display below the label */
  helperText?: string;

  /** Error message to display (overrides helper text) */
  error?: string;

  /** Whether the label is disabled */
  disabled?: boolean;

  /** CSS class names for the container */
  className?: string;

  /** CSS class names for the text content */
  textClassName?: string;

  /** CSS class names for the required indicator */
  requiredClassName?: string;

  /** CSS class names for the helper text */
  helperClassName?: string;

  /** CSS class names for the error message */
  errorClassName?: string;

  /** CSS class names for the icon */
  iconClassName?: string;
}

/**
 * A comprehensive and accessible form label component that follows React Admin patterns.
 * Supports required field indicators, accessibility features, and flexible styling options.
 *
 * @example
 * // Basic label with required indicator
 * <Label htmlFor="email" required>Email Address</Label>
 *
 * @example
 * // Label with helper text
 * <Label htmlFor="password" helperText="Must be at least 8 characters">
 *   Password
 * </Label>
 *
 * @example
 * // Label with error state
 * <Label htmlFor="username" error="Username is required">
 *   Username
 * </Label>
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      children,
      htmlFor,
      required = false,
      size = 'md',
      variant = 'default',
      showIcon = false,
      icon: IconComponent,
      helperText,
      error,
      disabled = false,
      className,
      textClassName,
      requiredClassName,
      helperClassName,
      errorClassName,
      iconClassName,
      ...props
    },
    ref
  ) => {
    // Determine which icon to use
    const Icon = IconComponent || AlertCircle;

    // Size classes
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    // Variant classes
    const variantClasses = {
      default: 'text-gray-700',
      bold: 'text-gray-900 font-semibold',
      subtle: 'text-gray-500',
      error: 'text-red-700',
    };

    // Disabled classes
    const disabledClasses = disabled ? 'text-gray-400 cursor-not-allowed' : '';

    // Container classes
    const containerClasses = cn(
      'label-component',
      'flex flex-col gap-1',
      className
    );

    // Label classes
    const labelClasses = cn(
      'label-text',
      'flex items-center gap-2',
      sizeClasses[size],
      variantClasses[variant],
      disabledClasses,
      textClassName
    );

    // Required indicator classes
    const requiredClasses = cn(
      'required-indicator',
      'text-red-500 font-medium',
      requiredClassName
    );

    // Helper text classes
    const helperClasses = cn(
      'helper-text',
      'text-sm text-gray-600',
      disabled && 'text-gray-400',
      helperClassName
    );

    // Error message classes
    const errorClasses = cn(
      'error-message',
      'text-sm text-red-600 font-medium',
      'flex items-center gap-2',
      errorClassName
    );

    // Icon classes
    const iconClasses = cn('icon', 'w-4 h-4', iconClassName);

    return (
      <div className={containerClasses} ref={ref}>
        <label
          htmlFor={htmlFor}
          className={labelClasses}
          aria-required={required || undefined}
          aria-disabled={disabled || undefined}
          {...props}
        >
          <span>{children}</span>
          {required && (
            <span className={requiredClasses} aria-label='required'>
              *
            </span>
          )}
        </label>

        {/* Helper text or error message */}
        {error ? (
          <div className={errorClasses} role='alert'>
            {showIcon && <Icon className={iconClasses} />}
            {error}
          </div>
        ) : helperText ? (
          <div
            className={helperClasses}
            id={htmlFor ? `${htmlFor}-helper` : undefined}
          >
            {helperText}
          </div>
        ) : null}
      </div>
    );
  }
);

Label.displayName = 'Label';
