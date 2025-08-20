import React, { forwardRef, useState } from "react";
import { cn } from "../../utils/cn";
import { Check } from "lucide-react";

export type BooleanInputVariant = "checkbox" | "switch" | "toggle";

export interface BooleanInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "type"
  > {
  /** Current boolean value */
  checked?: boolean;

  /** Callback when value changes */
  onChange: (checked: boolean) => void;

  /** Visual variant of the input */
  variant?: BooleanInputVariant;

  /** Label text for the input */
  label?: string;

  /** Helper text below the input */
  helperText?: string;

  /** Error message to display */
  error?: string;

  /** Whether the field is required */
  required?: boolean;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Input size variant */
  size?: "sm" | "md" | "lg";

  /** Whether to show an indeterminate state (checkbox only) */
  indeterminate?: boolean;

  /** Custom class names */
  className?: string;

  /** Custom class names for the input element */
  inputClassName?: string;

  /** Custom class names for the label */
  labelClassName?: string;

  /** Color scheme for the input */
  colorScheme?: "primary" | "secondary" | "success" | "warning" | "danger";

  /** Position of the label relative to the input */
  labelPosition?: "left" | "right";
}

/**
 * A versatile boolean input component that supports multiple variants:
 * checkbox, switch, and toggle with comprehensive styling and features.
 *
 * @example
 * // Basic checkbox
 * <BooleanInput
 *   label="Accept terms"
 *   checked={accepted}
 *   onChange={setAccepted}
 * />
 *
 * @example
 * // Switch variant
 * <BooleanInput
 *   variant="switch"
 *   label="Enable notifications"
 *   checked={notificationsEnabled}
 *   onChange={setNotificationsEnabled}
 *   colorScheme="success"
 * />
 *
 * @example
 * // Toggle variant with error state
 * <BooleanInput
 *   variant="toggle"
 *   label="Auto-save"
 *   checked={autoSave}
 *   onChange={setAutoSave}
 *   error="Auto-save requires cloud storage"
 *   helperText="Automatically save your work"
 * />
 */
export const BooleanInput = forwardRef<HTMLInputElement, BooleanInputProps>(
  (
    {
      checked = false,
      onChange,
      variant = "checkbox",
      label,
      helperText,
      error,
      required = false,
      disabled = false,
      size = "md",
      indeterminate = false,
      className,
      inputClassName,
      labelClassName,
      colorScheme = "primary",
      labelPosition = "right",
      id,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const inputId = id || `boolean-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const sizeClasses = {
      sm: variant === "checkbox" ? "h-3 w-3" : "h-4 w-7",
      md: variant === "checkbox" ? "h-4 w-4" : "h-5 w-9",
      lg: variant === "checkbox" ? "h-5 w-5" : "h-6 w-11",
    };

    const getColorClasses = (scheme: string) => {
      switch (scheme) {
        case "secondary":
          return "text-gray-600 focus:ring-gray-500 border-gray-300";
        case "success":
          return "text-green-600 focus:ring-green-500 border-green-300";
        case "warning":
          return "text-yellow-600 focus:ring-yellow-500 border-yellow-300";
        case "danger":
          return "text-red-600 focus:ring-red-500 border-red-300";
        case "primary":
        default:
          return "text-primary-600 focus:ring-primary-500 border-primary-300";
      }
    };

    const getSwitchBackgroundClass = (scheme: string) => {
      switch (scheme) {
        case "secondary":
          return "bg-gray-600 focus:ring-gray-500";
        case "success":
          return "bg-green-600 focus:ring-green-500";
        case "warning":
          return "bg-yellow-600 focus:ring-yellow-500";
        case "danger":
          return "bg-red-600 focus:ring-red-500";
        case "primary":
        default:
          return "bg-primary-600 focus:ring-primary-500";
      }
    };

    const getToggleBackgroundClass = (scheme: string) => {
      switch (scheme) {
        case "secondary":
          return "bg-gray-600 border-gray-600 focus:ring-gray-500";
        case "success":
          return "bg-green-600 border-green-600 focus:ring-green-500";
        case "warning":
          return "bg-yellow-600 border-yellow-600 focus:ring-yellow-500";
        case "danger":
          return "bg-red-600 border-red-600 focus:ring-red-500";
        case "primary":
        default:
          return "bg-primary-600 border-primary-600 focus:ring-primary-500";
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.checked);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(event);
    };

    const renderCheckbox = () => {
      const checkboxClasses = cn(
        "border rounded transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-0",
        "disabled:bg-gray-100 disabled:border-gray-300 disabled:cursor-not-allowed",
        sizeClasses[size],
        hasError
          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
          : getColorClasses(colorScheme),
        inputClassName,
      );

      return (
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          checked={checked}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          className={checkboxClasses}
          aria-invalid={hasError}
          aria-describedby={cn(
            helperText && `${inputId}-helper`,
            error && `${inputId}-error`,
          )}
          data-testid="boolean-input"
          {...props}
        />
      );
    };

    const renderSwitch = () => {
      const switchClasses = cn(
        "relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses[size],
        checked
          ? hasError
            ? "bg-red-600 focus:ring-red-500"
            : getSwitchBackgroundClass(colorScheme)
          : "bg-gray-200 focus:ring-gray-500",
        inputClassName,
      );

      const knobSize = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      };

      const knobTranslate = {
        sm: checked ? "translate-x-3" : "translate-x-0",
        md: checked ? "translate-x-4" : "translate-x-0",
        lg: checked ? "translate-x-5" : "translate-x-0",
      };

      return (
        <>
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            checked={checked}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            className="sr-only"
            aria-invalid={hasError}
            aria-describedby={cn(
              helperText && `${inputId}-helper`,
              error && `${inputId}-error`,
            )}
            data-testid="boolean-input"
            {...props}
          />
          <span
            className={switchClasses}
            onClick={() => !disabled && onChange(!checked)}
          >
            <span
              className={cn(
                "pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                knobSize[size],
                knobTranslate[size],
              )}
            />
          </span>
        </>
      );
    };

    const renderToggle = () => {
      const toggleClasses = cn(
        "relative inline-flex items-center cursor-pointer rounded-full border transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses[size],
        checked
          ? hasError
            ? "bg-red-600 border-red-600 focus:ring-red-500"
            : getToggleBackgroundClass(colorScheme)
          : "bg-gray-200 border-gray-300 focus:ring-gray-500",
        inputClassName,
      );

      return (
        <>
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            checked={checked}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            className="sr-only"
            aria-invalid={hasError}
            aria-describedby={cn(
              helperText && `${inputId}-helper`,
              error && `${inputId}-error`,
            )}
            data-testid="boolean-input"
            {...props}
          />
          <span
            className={toggleClasses}
            onClick={() => !disabled && onChange(!checked)}
          >
            {checked && (
              <Check
                className={cn(
                  "text-white",
                  size === "sm"
                    ? "h-2 w-2"
                    : size === "md"
                      ? "h-3 w-3"
                      : "h-4 w-4",
                )}
              />
            )}
          </span>
        </>
      );
    };

    const renderInput = () => {
      switch (variant) {
        case "switch":
          return renderSwitch();
        case "toggle":
          return renderToggle();
        case "checkbox":
        default:
          return renderCheckbox();
      }
    };

    const labelElement = label && (
      <label
        htmlFor={inputId}
        className={cn(
          "text-sm font-medium cursor-pointer",
          hasError ? "text-red-700" : "text-gray-700",
          disabled && "text-gray-500 cursor-not-allowed",
          labelClassName,
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );

    return (
      <div className={cn("w-full", className)}>
        {/* Input and Label Container */}
        <div className="flex items-center gap-2">
          {labelPosition === "left" && labelElement}
          {renderInput()}
          {labelPosition === "right" && labelElement}
        </div>

        {/* Helper Text and Error */}
        <div className="mt-1 min-h-[20px]">
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

// Keep the original CheckboxInput as an alias for backward compatibility
export const CheckboxInput = BooleanInput;
