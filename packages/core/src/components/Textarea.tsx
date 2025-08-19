import React, { TextareaHTMLAttributes, forwardRef } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { cn } from "../utils/cn";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  /** Textarea label */
  label?: string;
  /** Helper text below the textarea */
  helperText?: string;
  /** Error message to display */
  error?: string;
  /** Whether the textarea is required */
  required?: boolean;
  /** Textarea size */
  size?: "sm" | "md" | "lg";
  /** Whether the textarea is full width */
  fullWidth?: boolean;
  /** Left icon/element */
  leftIcon?: React.ReactNode;
  /** Right icon/element */
  rightIcon?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Textarea wrapper class names */
  wrapperClassName?: string;
  /** Number of rows to display */
  rows?: number;
  /** Whether to show character count */
  showCharacterCount?: boolean;
  /** Maximum number of characters */
  maxLength?: number;
}

/**
 * Textarea component that provides multi-line text input with various states.
 * This component supports different sizes, validation states, and icon placement.
 *
 * @example
 * ```tsx
 * import { Textarea } from '@react-superadmin/core';
 *
 * const MyForm = () => (
 *   <Textarea
 *     label="Description"
 *     placeholder="Enter your description"
 *     rows={4}
 *     showCharacterCount
 *     maxLength={500}
 *   />
 * );
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      rows = 3,
      showCharacterCount = false,
      maxLength,
      disabled,
      ...props
    },
    ref,
  ) => {
    const { theme } = useSuperAdmin();

    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
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
    const currentLength = props.value?.toString().length || 0;

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
                "absolute left-3 top-3 text-gray-400",
                iconSizeClasses[size],
              )}
            >
              {leftIcon}
            </div>
          )}

          <textarea
            ref={ref}
            rows={rows}
            maxLength={maxLength}
            className={cn(
              "block w-full rounded-md border transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "resize-vertical",
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
            data-testid="textarea"
            data-size={size}
            data-error={hasError}
            data-disabled={isDisabled}
            data-full-width={fullWidth}
            {...props}
          />

          {rightIcon && (
            <div
              className={cn(
                "absolute right-3 top-3 text-gray-400",
                iconSizeClasses[size],
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
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

          {showCharacterCount && maxLength && (
            <span
              className={cn(
                "text-sm ml-auto",
                currentLength > maxLength * 0.9
                  ? "text-red-600 dark:text-red-400"
                  : currentLength > maxLength * 0.75
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-gray-500 dark:text-gray-400",
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
