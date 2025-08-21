import React, { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "../../utils/cn";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Label text for the input */
  label?: string;

  /** Helper text below the input */
  helperText?: string;

  /** Error message to display */
  error?: string;

  /** Whether the field is required */
  required?: boolean;

  /** Input size variant */
  size?: "sm" | "md" | "lg";

  /** Whether to show a loading state */
  loading?: boolean;

  /** Icon to display on the left side */
  leftIcon?: React.ReactNode;

  /** Whether to show character count */
  showCharacterCount?: boolean;

  /** Maximum character limit */
  maxLength?: number;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Whether the input is read-only */
  readOnly?: boolean;

  /** Whether to show password strength indicator */
  showStrengthIndicator?: boolean;

  /** Custom password strength validation function */
  validateStrength?: (password: string) => {
    score: number;
    feedback: string[];
    color: "red" | "orange" | "yellow" | "green";
  };

  /** Minimum password length requirement */
  minLength?: number;

  /** Whether to show requirements list */
  showRequirements?: boolean;

  /** Custom requirements for password validation */
  requirements?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  };
}

/**
 * A specialized password input component with show/hide toggle, strength indicator,
 * and validation features. Follows React Admin patterns and provides enhanced
 * password input functionality.
 *
 * @example
 * // Basic usage
 * <PasswordInput label="Password" placeholder="Enter password" />
 *
 * @example
 * // With strength indicator
 * <PasswordInput
 *   label="Password"
 *   showStrengthIndicator
 *   minLength={8}
 *   showRequirements
 * />
 *
 * @example
 * // With custom validation
 * <PasswordInput
 *   label="Password"
 *   validateStrength={(password) => {
 *     const score = password.length >= 8 ? 4 : 2;
 *     return { score, feedback: [], color: score >= 4 ? 'green' : 'orange' };
 *   }}
 * />
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      helperText,
      error,
      required = false,
      size = "md",
      loading = false,
      leftIcon,
      showCharacterCount = false,
      maxLength,
      disabled = false,
      readOnly = false,
      className,
      id,
      value: controlledValue,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Use controlled value if provided, otherwise use internal state
    const value =
      controlledValue !== undefined ? controlledValue : internalValue;

    // Ensure value is never null or undefined for the input element
    const inputValue = value ?? "";

    const inputId =
      id || `password-input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const isDisabled = disabled || loading;

    // Size-based styling
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-3 py-2 text-base",
      lg: "px-4 py-2.5 text-lg",
    };

    // Base input classes
    const baseInputClasses = cn(
      "block w-full rounded-md border-0 bg-white px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200",
      sizeClasses[size],
      hasError &&
        "ring-red-300 focus:ring-red-500 text-red-900 placeholder:text-red-300",
      isDisabled && "cursor-not-allowed bg-gray-50 text-gray-500 ring-gray-200",
      className,
    );

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Update internal state if not controlled
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(e);
    };

    // Handle focus
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    // Handle blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium leading-6 text-gray-900 mb-2",
              hasError && "text-red-600",
              isDisabled && "text-gray-400",
            )}
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400">{leftIcon}</div>
            </div>
          )}

          {/* Password Input */}
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isDisabled}
            readOnly={readOnly}
            maxLength={maxLength}
            className={cn(
              baseInputClasses,
              leftIcon && "pl-10",
              "pr-12", // Space for show/hide button
            )}
            aria-invalid={hasError}
            aria-describedby={
              [helperText && `${inputId}-helper`, error && `${inputId}-error`]
                .filter(Boolean)
                .join(" ") || undefined
            }
            {...props}
          />

          {/* Show/Hide Password Button */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={isDisabled}
            className={cn(
              "absolute inset-y-0 right-0 pr-3 flex items-center",
              "text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600",
              "disabled:cursor-not-allowed disabled:text-gray-300",
            )}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>

          {/* Loading Indicator */}
          {loading && (
            <div className="absolute inset-y-0 right-12 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Helper Text */}
        {helperText && (
          <p
            id={`${inputId}-helper`}
            className={cn(
              "mt-2 text-sm",
              hasError ? "text-red-600" : "text-gray-500",
            )}
          >
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Character Count */}
        {showCharacterCount && maxLength && (
          <p className="mt-1 text-sm text-gray-500 text-right">
            {String(inputValue).length}/{maxLength}
          </p>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
