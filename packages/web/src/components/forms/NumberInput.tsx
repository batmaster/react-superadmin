import React, { forwardRef, useState } from "react";
import { cn } from "../../utils/cn";
import { Minus, Plus } from "lucide-react";

export interface NumberInputProps
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

  /** Icon to display on the right side */
  rightIcon?: React.ReactNode;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Whether the input is read-only */
  readOnly?: boolean;

  /** Minimum value allowed */
  min?: number;

  /** Maximum value allowed */
  max?: number;

  /** Step increment for up/down buttons */
  step?: number;

  /** Whether to show step controls (up/down buttons) */
  showStepControls?: boolean;

  /** Whether to allow decimal values */
  allowDecimals?: boolean;

  /** Number of decimal places to display */
  decimalPlaces?: number;

  /** Whether to format the number with thousands separators */
  formatThousands?: false;

  /** Whether to show the current value as a percentage */
  showAsPercentage?: false;

  /** Custom step up handler */
  onStepUp?: (currentValue: number, step: number) => number;

  /** Custom step down handler */
  onStepDown?: (currentValue: number, step: number) => number;
}

/**
 * A specialized number input component with step controls, validation,
 * and number formatting options. Follows React Admin patterns and
 * provides enhanced number input functionality.
 *
 * @example
 * // Basic usage
 * <NumberInput label="Quantity" placeholder="Enter quantity" />
 *
 * @example
 * // With step controls and validation
 * <NumberInput
 *   label="Price"
 *   min={0}
 *   max={1000}
 *   step={0.01}
 *   allowDecimals
 *   decimalPlaces={2}
 *   showStepControls
 * />
 *
 * @example
 * // With formatting
 * <NumberInput
 *   label="Population"
 *   formatThousands
 *   showStepControls
 *   step={1000}
 * />
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      label,
      helperText,
      error,
      required = false,
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      disabled = false,
      readOnly = false,
      min,
      max,
      step = 1,
      showStepControls = false,
      allowDecimals = true,
      decimalPlaces,
      formatThousands = false,
      showAsPercentage = false,
      onStepUp,
      onStepDown,
      className,
      id,
      value: controlledValue,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");

    // Use controlled value if provided, otherwise use internal state
    const value =
      controlledValue !== undefined ? controlledValue : internalValue;

    // Ensure value is never null or undefined for the input element
    const inputValue = value ?? "";

    const inputId =
      id || `number-input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const isDisabled = disabled || loading;

    const sizeClasses = {
      sm: "px-2 py-1 text-sm",
      md: "px-3 py-2 text-base",
      lg: "px-4 py-3 text-lg",
    };

    const baseInputClasses = cn(
      "block w-full border rounded-md shadow-sm placeholder-gray-400 transition-colors duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-0",
      "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
      "read-only:bg-gray-50 read-only:text-gray-700",
      sizeClasses[size],
      hasError
        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-primary-500 focus:border-primary-500",
      isDisabled && "opacity-60",
      showStepControls && "pr-20", // Extra padding for step controls
      className,
    );

    // Parse number from input
    const parseNumber = (input: string): number => {
      const cleaned = input.replace(/[^\d.-]/g, "");
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Handle step up
    const handleStepUp = () => {
      if (isDisabled || readOnly) return;

      const currentValue = parseNumber(String(inputValue)) || 0;
      let newValue: number;

      if (onStepUp) {
        newValue = onStepUp(currentValue, step);
      } else {
        newValue = currentValue + step;
      }

      // Apply min/max constraints
      if (max !== undefined) {
        newValue = Math.min(newValue, max);
      }

      const formattedValue = newValue.toString();

      if (controlledValue === undefined) {
        setInternalValue(formattedValue);
      }

      // Create synthetic change event
      const syntheticEvent = {
        target: { value: formattedValue, type: "number" },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange?.(syntheticEvent);
    };

    // Handle step down
    const handleStepDown = () => {
      if (isDisabled || readOnly) return;

      const currentValue = parseNumber(String(inputValue)) || 0;
      let newValue: number;

      if (onStepDown) {
        newValue = onStepDown(currentValue, step);
      } else {
        newValue = currentValue - step;
      }

      // Apply min/max constraints
      if (min !== undefined) {
        newValue = Math.max(newValue, min);
      }

      const formattedValue = newValue.toString();

      if (controlledValue === undefined) {
        setInternalValue(formattedValue);
      }

      // Create synthetic change event
      const syntheticEvent = {
        target: { value: formattedValue, type: "number" },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange?.(syntheticEvent);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;

      // Handle empty string
      if (newValue === "") {
        if (controlledValue === undefined) {
          setInternalValue("");
        }
        onChange?.(e);
        return;
      }

      // Parse the input value
      const parsed = parseNumber(newValue);

      // Apply constraints
      if (min !== undefined && parsed < min) {
        newValue = min.toString();
      } else if (max !== undefined && parsed > max) {
        newValue = max.toString();
      } else {
        // Handle decimal places
        if (decimalPlaces !== undefined) {
          if (!allowDecimals) {
            newValue = Math.round(parsed).toString();
          } else {
            newValue = parsed.toFixed(decimalPlaces);
          }
        } else {
          newValue = parsed.toString();
        }
      }

      // Update internal state if not controlled
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }

      // Create synthetic event with processed value
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: newValue },
      };

      onChange?.(syntheticEvent);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-gray-700 mb-1",
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
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input Element */}
          <input
            ref={ref}
            id={inputId}
            type="number"
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isDisabled}
            readOnly={readOnly}
            min={min}
            max={max}
            step={step}
            aria-invalid={hasError}
            aria-describedby={cn(
              helperText && `${inputId}-helper`,
              error && `${inputId}-error`,
            )}
            className={cn(
              baseInputClasses,
              leftIcon && "pl-10",
              rightIcon && !showStepControls && "pr-10",
            )}
            {...props}
          />

          {/* Right Icon (only if no step controls) */}
          {rightIcon && !showStepControls && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}

          {/* Step Controls */}
          {showStepControls && (
            <div className="absolute right-0 top-0 bottom-0 flex flex-col">
              <button
                type="button"
                onClick={handleStepUp}
                disabled={isDisabled || readOnly}
                className={cn(
                  "flex-1 px-2 border-l border-b border-gray-300 bg-gray-50 hover:bg-gray-100",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset",
                  "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50",
                  "transition-colors duration-150",
                )}
                aria-label="Increase value"
              >
                <Plus className="w-3 h-3 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={handleStepDown}
                disabled={isDisabled || readOnly}
                className={cn(
                  "flex-1 px-2 border-l border-gray-300 bg-gray-50 hover:bg-gray-100",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset",
                  "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50",
                  "transition-colors duration-150",
                )}
                aria-label="Decrease value"
              >
                <Minus className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div
                data-testid="loading-spinner"
                className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"
              ></div>
            </div>
          )}
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

NumberInput.displayName = "NumberInput";
