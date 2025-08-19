import React, { InputHTMLAttributes, forwardRef } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { cn } from "../utils/cn";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Checkbox label */
  label?: string;
  /** Helper text below the checkbox */
  helperText?: string;
  /** Error message to display */
  error?: string;
  /** Whether the checkbox is required */
  required?: boolean;
  /** Checkbox size */
  size?: "sm" | "md" | "lg";
  /** Whether the checkbox is full width */
  fullWidth?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Checkbox wrapper class names */
  wrapperClassName?: string;
  /** Whether to show the checkbox as indeterminate */
  indeterminate?: boolean;
  /** Whether to show a custom checkbox design */
  custom?: boolean;
  /** Whether to show the checkbox inline with label */
  inline?: boolean;
}

/**
 * Checkbox component that provides boolean input with various states.
 * This component supports different sizes, validation states, and custom styling.
 *
 * @example
 * ```tsx
 * import { Checkbox } from '@react-superadmin/core';
 *
 * const MyForm = () => (
 *   <Checkbox
 *     label="Accept terms and conditions"
 *     required
 *     helperText="You must accept to continue"
 *   />
 * );
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      error,
      required = false,
      size = "md",
      fullWidth = false,
      className = "",
      wrapperClassName = "",
      indeterminate = false,
      custom = false,
      inline = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const { theme } = useSuperAdmin();

    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const labelSizeClasses = {
      sm: "text-sm",
      md: "text-sm",
      lg: "text-base",
    };

    const hasError = !!error;
    const isDisabled = disabled;

    // Handle indeterminate state
    React.useEffect(() => {
      if (ref && typeof ref === "object" && ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    if (custom) {
      return (
        <div
          className={cn("space-y-1", fullWidth && "w-full", wrapperClassName)}
        >
          <label
            className={cn(
              "flex items-start space-x-3 cursor-pointer",
              inline && "flex-row items-center",
              isDisabled && "cursor-not-allowed opacity-50",
              fullWidth && "w-full",
            )}
          >
            <div className="relative flex-shrink-0">
              <input
                ref={ref}
                type="checkbox"
                className="sr-only"
                disabled={isDisabled}
                {...props}
              />
              <div
                className={cn(
                  "border-2 rounded transition-all duration-200",
                  "flex items-center justify-center",
                  sizeClasses[size],
                  hasError
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
                  props.checked && !hasError && "border-blue-500 bg-blue-500",
                  indeterminate && !hasError && "border-blue-500 bg-blue-500",
                  isDisabled && "opacity-50 cursor-not-allowed",
                )}
              >
                {props.checked && !indeterminate && (
                  <svg
                    className={cn(
                      "text-white",
                      size === "sm"
                        ? "w-2.5 h-2.5"
                        : size === "md"
                          ? "w-3 h-3"
                          : "w-4 h-4",
                    )}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {indeterminate && (
                  <svg
                    className={cn(
                      "text-white",
                      size === "sm"
                        ? "w-2.5 h-2.5"
                        : size === "md"
                          ? "w-3 h-3"
                          : "w-4 h-4",
                    )}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>

            <div className={cn("flex-1", labelSizeClasses[size])}>
              <span
                className={cn(
                  "font-medium",
                  hasError
                    ? "text-red-900 dark:text-red-100"
                    : "text-gray-900 dark:text-white",
                  isDisabled && "text-gray-500 dark:text-gray-400",
                )}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </span>

              {helperText && (
                <p
                  className={cn(
                    "mt-1",
                    hasError
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  {helperText}
                </p>
              )}

              {error && (
                <p className="mt-1 text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>
          </label>
        </div>
      );
    }

    return (
      <div className={cn("space-y-1", fullWidth && "w-full", wrapperClassName)}>
        <label
          className={cn(
            "flex items-start space-x-3 cursor-pointer",
            inline && "flex-row items-center",
            isDisabled && "cursor-not-allowed opacity-50",
            fullWidth && "w-full",
          )}
        >
          <input
            ref={ref}
            type="checkbox"
            className={cn(
              "rounded border-2 transition-colors duration-200",
              "focus:ring-2 focus:ring-offset-0",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              sizeClasses[size],
              hasError
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500",
              "bg-white dark:bg-gray-800",
              "text-blue-600 dark:text-blue-500",
              className,
            )}
            style={{
              ...(hasError && {
                borderColor: theme.secondaryColor + "40",
              }),
            }}
            disabled={isDisabled}
            data-testid="checkbox"
            data-size={size}
            data-error={hasError}
            data-disabled={isDisabled}
            data-full-width={fullWidth}
            data-custom={custom}
            data-inline={inline}
            {...props}
          />

          <div className={cn("flex-1", labelSizeClasses[size])}>
            <span
              className={cn(
                "font-medium",
                hasError
                  ? "text-red-900 dark:text-red-100"
                  : "text-gray-900 dark:text-white",
                isDisabled && "text-gray-500 dark:text-gray-400",
              )}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </span>

            {helperText && (
              <p
                className={cn(
                  "mt-1",
                  hasError
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400",
                )}
              >
                {helperText}
              </p>
            )}

            {error && (
              <p className="mt-1 text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
        </label>
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
