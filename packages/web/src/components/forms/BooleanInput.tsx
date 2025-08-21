import React, { forwardRef, useState } from "react";
import { cn } from "../../utils/cn";
import { Check, X } from "lucide-react";

export interface BooleanInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "size" | "value" | "onChange" | "defaultValue"
  > {
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

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Whether the input is read-only */
  readOnly?: boolean;

  /** The current boolean value */
  value?: boolean | null;

  /** Default value for uncontrolled usage */
  defaultValue?: boolean | null;

  /** Callback when the value changes */
  onChange?: (value: boolean | null) => void;

  /** Variant of the boolean input */
  variant?: "checkbox" | "radio" | "toggle";

  /** Text to display when value is true */
  trueLabel?: string;

  /** Text to display when value is false */
  falseLabel?: string;

  /** Text to display when value is null/undefined */
  nullLabel?: string;

  /** Whether to allow null/undefined values (nullable) */
  nullable?: boolean;

  /** Custom icon for true state */
  trueIcon?: React.ReactNode;

  /** Custom icon for false state */
  falseIcon?: React.ReactNode;

  /** Custom icon for null state */
  nullIcon?: React.ReactNode;

  /** Whether to show labels inline with the input */
  showLabels?: boolean;

  /** Layout direction for radio buttons */
  direction?: "horizontal" | "vertical";
}

/**
 * A comprehensive boolean input component that supports checkbox, radio button,
 * and toggle switch variants. Follows React Admin patterns and provides
 * enhanced boolean input functionality with nullable support.
 *
 * @example
 * // Basic checkbox usage
 * <BooleanInput label="Agree to terms" variant="checkbox" />
 *
 * @example
 * // Radio buttons with custom labels
 * <BooleanInput
 *   label="User Status"
 *   variant="radio"
 *   trueLabel="Active"
 *   falseLabel="Inactive"
 *   direction="horizontal"
 * />
 *
 * @example
 * // Toggle switch with nullable support
 * <BooleanInput
 *   label="Feature Flag"
 *   variant="toggle"
 *   nullable
 *   trueLabel="Enabled"
 *   falseLabel="Disabled"
 *   nullLabel="Not Set"
 * />
 */
export const BooleanInput = forwardRef<HTMLInputElement, BooleanInputProps>(
  (
    {
      label,
      helperText,
      error,
      required = false,
      size = "md",
      loading = false,
      disabled = false,
      readOnly = false,
      value: controlledValue,
      defaultValue,
      onChange,
      variant = "checkbox",
      trueLabel = "Yes",
      falseLabel = "No",
      nullLabel = "Not Set",
      nullable = false,
      trueIcon,
      falseIcon,
      nullIcon,
      showLabels = false,
      direction = "horizontal",
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState<boolean | null>(
      defaultValue ?? false,
    );

    // Use controlled value if provided, otherwise use internal state
    const value =
      controlledValue !== undefined ? controlledValue : internalValue;

    // For toggle logic, treat null/undefined as false
    const effectiveValue = value ?? false;

    const inputId =
      id || `boolean-input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const isDisabled = disabled || loading || readOnly;

    const sizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    const baseClasses = cn(
      "transition-all duration-200 ease-in-out",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "read-only:opacity-75 read-only:cursor-not-allowed",
      sizeClasses[size],
      hasError ? "focus:ring-red-500" : "focus:ring-primary-500",
      className,
    );

    const handleChange = (newValue: boolean | null) => {
      // Only update internal state if not controlled
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    const handleKeyDown = (
      e: React.KeyboardEvent,
      newValue: boolean | null,
    ) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!isDisabled) {
          handleChange(newValue);
        }
      }
    };

    const renderCheckbox = () => (
      <div className="flex items-center space-x-2">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          checked={value === true}
          onChange={(e) => handleChange(e.target.checked ? true : false)}
          disabled={isDisabled}
          readOnly={readOnly}
          aria-invalid={hasError}
          aria-describedby={cn(
            helperText && `${inputId}-helper`,
            error && `${inputId}-error`,
          )}
          className={cn(
            "h-4 w-4 text-primary-600",
            "border-gray-300 rounded",
            "focus:ring-primary-500 focus:ring-2",
            "disabled:bg-gray-100 disabled:border-gray-300",
            baseClasses,
          )}
          {...props}
        />
        {showLabels && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium text-gray-700",
              hasError && "text-red-700",
              isDisabled && "text-gray-500",
            )}
          >
            {value === true
              ? trueLabel
              : value === false
                ? falseLabel
                : nullLabel}
          </label>
        )}
      </div>
    );

    const renderRadio = () => (
      <div
        role="group"
        className={cn(
          "space-y-2",
          direction === "horizontal" && "flex flex-row space-x-4 space-y-0",
        )}
      >
        {[true, false, ...(nullable ? [null] : [])].map((optionValue) => {
          const optionId = `${inputId}-${optionValue === null ? "null" : optionValue}`;
          const isSelected = value === optionValue;

          return (
            <div
              key={optionValue === null ? "null" : String(optionValue)}
              className="flex items-center space-x-2"
            >
              <input
                ref={optionValue === true ? ref : undefined}
                id={optionId}
                type="radio"
                name={inputId}
                checked={isSelected}
                onChange={() => handleChange(optionValue)}
                disabled={isDisabled}
                readOnly={readOnly}
                aria-describedby={cn(
                  helperText && `${inputId}-helper`,
                  error && `${inputId}-error`,
                )}
                className={cn(
                  "h-4 w-4 text-primary-600",
                  "border-gray-300",
                  "focus:ring-primary-500 focus:ring-2",
                  "disabled:bg-gray-100 disabled:border-gray-300",
                  baseClasses,
                )}
                {...(optionValue === true ? props : {})}
              />
              <label
                htmlFor={optionId}
                className={cn(
                  "text-sm font-medium text-gray-700 cursor-pointer",
                  hasError && "text-red-700",
                  isDisabled && "text-gray-500",
                  !isDisabled && "hover:text-gray-900",
                )}
              >
                {optionValue === true
                  ? trueLabel
                  : optionValue === false
                    ? falseLabel
                    : nullLabel}
              </label>
            </div>
          );
        })}
      </div>
    );

    const renderToggle = () => (
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => {
            if (!isDisabled) {
              let nextValue: boolean | null;
              if (value === true) {
                nextValue = nullable ? null : false;
              } else if (value === false) {
                nextValue = true;
              } else {
                // value is null - go back to false
                nextValue = false;
              }
              handleChange(nextValue);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              let nextValue: boolean | null;
              if (value === true) {
                nextValue = nullable ? null : false;
              } else if (value === false) {
                nextValue = true;
              } else {
                // value is null - go back to false
                nextValue = false;
              }
              handleChange(nextValue);
            }
          }}
          disabled={isDisabled}
          aria-label={`Toggle ${label || "boolean value"}`}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "disabled:cursor-not-allowed",
            effectiveValue === true
              ? "bg-primary-600 focus:ring-primary-500"
              : effectiveValue === false
                ? "bg-gray-200 focus:ring-gray-500"
                : "bg-gray-300 focus:ring-gray-500",
            baseClasses,
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out",
              effectiveValue === true
                ? "translate-x-6"
                : effectiveValue === false
                  ? "translate-x-1"
                  : "translate-x-3",
            )}
          />
        </button>
        {showLabels && (
          <span
            className={cn(
              "text-sm font-medium text-gray-700",
              hasError && "text-red-700",
              isDisabled && "text-gray-500",
            )}
          >
            {effectiveValue === true
              ? trueLabel
              : effectiveValue === false
                ? falseLabel
                : nullLabel}
          </span>
        )}
      </div>
    );

    const renderValue = () => {
      switch (variant) {
        case "checkbox":
          return renderCheckbox();
        case "radio":
          return renderRadio();
        case "toggle":
          return renderToggle();
        default:
          return renderCheckbox();
      }
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-gray-700 mb-2",
              hasError && "text-red-700",
              isDisabled && "text-gray-500",
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {renderValue()}

          {/* Loading Spinner */}
          {loading && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <div
                data-testid="loading-spinner"
                className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"
                role="status"
                aria-label="Loading"
              ></div>
            </div>
          )}
        </div>

        {/* Helper Text and Error */}
        <div className="mt-2 min-h-[20px]">
          {helperText && !hasError && (
            <p id={`${inputId}-helper`} className="text-sm text-gray-500">
              {helperText}
            </p>
          )}

          {error && (
            <p id={`${inputId}-error`} className="text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  },
);

BooleanInput.displayName = "BooleanInput";
