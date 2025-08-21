import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { AlertCircle } from "lucide-react";

export interface LabelProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "size"> {
  /** The text content for the label */
  children: React.ReactNode;

  /** The ID of the form control this label is associated with */
  htmlFor?: string;

  /** Whether the field is required (shows required indicator) */
  required?: boolean;

  /** Label size variant */
  size?: "sm" | "md" | "lg";

  /** Label variant/style */
  variant?: "default" | "bold" | "subtle" | "error";

  /** Whether to show an icon */
  showIcon?: boolean;

  /** Custom icon component */
  icon?: React.ComponentType<{ className?: string }>;

  /** Helper text below the label */
  helperText?: string;

  /** Error message to display */
  error?: string;

  /** Whether the label is disabled */
  disabled?: boolean;

  /** Custom class names */
  className?: string;

  /** Custom class names for the text content */
  textClassName?: string;

  /** Custom class names for the required indicator */
  requiredClassName?: string;

  /** Custom class names for the helper text */
  helperClassName?: string;

  /** Custom class names for the error message */
  errorClassName?: string;
}

/**
 * A flexible and accessible label component that follows React Admin patterns.
 * Supports required field indicators, accessibility features, theme integration,
 * and different sizes and variants.
 *
 * @example
 * // Basic usage
 * <Label htmlFor="email">Email Address</Label>
 *
 * @example
 * // With required indicator
 * <Label htmlFor="name" required>Full Name</Label>
 *
 * @example
 * // With helper text and error
 * <Label htmlFor="password" helperText="Must be at least 8 characters" error="Password is too short">
 *   Password
 * </Label>
 *
 * @example
 * // With custom styling
 * <Label
 *   htmlFor="username"
 *   size="lg"
 *   variant="bold"
 *   className="custom-label"
 * >
 *   Username
 * </Label>
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      children,
      htmlFor,
      required = false,
      size = "md",
      variant = "default",
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
      ...props
    },
    ref,
  ) => {
    const hasError = !!error;
    const isDisabled = disabled;

    // Size classes
    const sizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    // Variant classes
    const variantClasses = {
      default: "text-gray-700",
      bold: "text-gray-900 font-semibold",
      subtle: "text-gray-500",
      error: "text-red-700",
    };

    // Base label classes
    const baseClasses = cn(
      "block font-medium transition-colors duration-200",
      sizeClasses[size],
      variantClasses[variant],
      isDisabled && "text-gray-400 cursor-not-allowed",
      hasError && "text-red-700",
      className,
    );

    // Text content classes
    const textClasses = cn("label-text", textClassName);

    // Required indicator classes
    const requiredClasses = cn(
      "text-red-500 ml-1 font-normal",
      requiredClassName,
    );

    // Helper text classes
    const helperClasses = cn(
      "mt-1 text-sm text-gray-500",
      isDisabled && "text-gray-400",
      hasError && "text-red-600",
      helperClassName,
    );

    // Error message classes
    const errorClasses = cn(
      "mt-1 text-sm text-red-600 flex items-center gap-1",
      errorClassName,
    );

    // Icon classes
    const iconClasses = cn(
      "h-4 w-4",
      hasError ? "text-red-500" : "text-gray-400",
    );

    return (
      <div className="label-container">
        <label
          ref={ref}
          htmlFor={htmlFor}
          className={baseClasses}
          aria-disabled={isDisabled || undefined}
          {...props}
        >
          <span className={textClasses}>
            {children}
            {required && (
              <span className={requiredClasses} aria-label="required">
                *
              </span>
            )}
          </span>
        </label>

        {/* Helper Text */}
        {helperText && !hasError && (
          <p className={helperClasses} id={`${htmlFor}-helper`}>
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className={errorClasses} id={`${htmlFor}-error`} role="alert">
            {showIcon &&
              (IconComponent ? (
                <IconComponent className={iconClasses} />
              ) : (
                <AlertCircle className={iconClasses} />
              ))}
            {error}
          </p>
        )}
      </div>
    );
  },
);

Label.displayName = "Label";
