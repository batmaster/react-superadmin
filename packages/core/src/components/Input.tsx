import React, { InputHTMLAttributes, forwardRef } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { cn } from "../utils/cn";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Input label */
  label?: string;
  /** Helper text below the input */
  helperText?: string;
  /** Error message to display */
  error?: string;
  /** Whether the input is required */
  required?: boolean;
  /** Input size */
  size?: "sm" | "md" | "lg";
  /** Whether the input is full width */
  fullWidth?: boolean;
  /** Left icon/element */
  leftIcon?: React.ReactNode;
  /** Right icon/element */
  rightIcon?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Input wrapper class names */
  wrapperClassName?: string;
}

/**
 * Input component that provides various input field types and states.
 * This component supports different sizes, validation states, and icon placement.
 *
 * @example
 * ```tsx
 * import { Input } from '@react-superadmin/core';
 *
 * const MyForm = () => (
 *   <Input
 *     label="Email Address"
 *     type="email"
 *     placeholder="Enter your email"
 *     required
 *     leftIcon={<MailIcon />}
 *   />
 * );
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      required = false,
      size = "md",
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = "",
      wrapperClassName = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const { theme } = useSuperAdmin();

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-3 text-base",
    };

    const iconSizeClasses = {
      sm: "w-4 h-4",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    const hasError = !!error;
    const isDisabled = disabled;

    return (
      <div className={cn("space-y-1", fullWidth && "w-full", wrapperClassName)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400",
                iconSizeClasses[size],
              )}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              "block w-full rounded-md border transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              sizeClasses[size],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              hasError
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500",
              "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
              "placeholder-gray-400 dark:placeholder-gray-500",
              className,
            )}
            style={{
              ...(hasError && {
                borderColor: theme.secondaryColor + "40",
              }),
            }}
            disabled={isDisabled}
            data-testid="input"
            data-size={size}
            data-error={hasError}
            data-disabled={isDisabled}
            data-full-width={fullWidth}
            {...props}
          />

          {rightIcon && (
            <div
              className={cn(
                "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400",
                iconSizeClasses[size],
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {(helperText || error) && (
          <p
            className={cn(
              "text-sm",
              hasError
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400",
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
