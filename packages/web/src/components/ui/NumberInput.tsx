import { ChevronDown, ChevronUp } from "lucide-react";
import React, { forwardRef, useCallback, useState } from "react";
import { cn } from "../../utils/cn";

export interface NumberInputProps {
  /** The name of the field */
  name: string;
  /** The label to display */
  label?: string;
  /** The current value */
  value?: number | string;
  /** Callback when the value changes */
  onChange?: (value: number | string) => void;
  /** Callback when the field is focused */
  onFocus?: () => void;
  /** Callback when the field is blurred */
  onBlur?: () => void;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether to show the field */
  hidden?: boolean;
  /** The placeholder text */
  placeholder?: string;
  /** The minimum value allowed */
  min?: number;
  /** The maximum value allowed */
  max?: number;
  /** The step increment/decrement */
  step?: number;
  /** The number format to use */
  format?: "integer" | "decimal" | "currency";
  /** The locale for number formatting */
  locale?: string;
  /** The currency code for currency format */
  currency?: string;
  /** The number of decimal places */
  decimals?: number;
  /** Whether to show thousand separators */
  showThousandSeparator?: boolean;
  /** Whether to show step controls */
  showStepControls?: boolean;
  /** Custom CSS class name */
  className?: string;
  /** Custom CSS class name for the label */
  labelClassName?: string;
  /** Custom CSS class name for the input */
  inputClassName?: string;
  /** Custom CSS class name for error messages */
  errorClassName?: string;
  /** Helper text to display */
  helperText?: string;
  /** Custom CSS class name for helper text */
  helperClassName?: string;
  /** Whether to show validation errors */
  showValidationErrors?: boolean;
  /** The validation errors */
  errors?: string[];
  /** The touched state */
  touched?: boolean;
  /** The size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to show a clear button */
  clearable?: boolean;
  /** The icon to display */
  icon?: React.ReactNode;
  /** Whether to show loading spinner */
  showLoadingSpinner?: boolean;
  /** The empty state text */
  emptyText?: string;
  /** The no options text */
  noOptionsText?: string;
  /** The loading text */
  loadingText?: string;
  /** The error text */
  errorText?: string;
}

/**
 * NumberInput component for handling numeric input with formatting and validation
 *
 * This component provides enhanced number input functionality with step controls,
 * number formatting, and validation. It supports different number formats including
 * integers, decimals, and currency.
 *
 * @example
 * ```tsx
 * <NumberInput
 *   name="price"
 *   label="Price"
 *   format="currency"
 *   currency="USD"
 *   min={0}
 *   step={0.01}
 *   required
 * />
 * ```
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      name,
      label,
      value = "",
      onChange,
      onFocus,
      onBlur,
      required = false,
      disabled = false,
      hidden = false,
      placeholder,
      min,
      max,
      step = 1,
      format = "decimal",
      locale = "en-US",
      currency = "USD",
      decimals = 2,
      showThousandSeparator = true,
      showStepControls = true,
      className = "",
      labelClassName = "",
      inputClassName = "",
      errorClassName = "",
      helperText,
      helperClassName = "",
      showValidationErrors = true,
      errors = [],
      touched = false,
      size = "md",
      clearable = true,
      icon,
      showLoadingSpinner = true,
      emptyText = "No options available",
      noOptionsText = "No options found",
      loadingText = "Loading...",
      errorText = "Error loading options",
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [displayValue, setDisplayValue] = useState<string>("");

    // Generate unique ID for the input
    const inputId = `number-input-${name}`;

    // Format number for display
    const formatNumber = useCallback(
      (num: number | string): string => {
        if (num === "" || num === null || num === undefined) return "";

        const number = typeof num === "string" ? parseFloat(num) : num;
        if (isNaN(number)) return "";

        switch (format) {
          case "integer":
            return showThousandSeparator
              ? Math.round(number).toLocaleString(locale)
              : Math.round(number).toString();
          case "currency":
            return new Intl.NumberFormat(locale, {
              style: "currency",
              currency,
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
              useGrouping: showThousandSeparator,
            }).format(number);
          case "decimal":
          default:
            return new Intl.NumberFormat(locale, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
              useGrouping: showThousandSeparator,
            }).format(number);
        }
      },
      [format, locale, currency, decimals, showThousandSeparator],
    );

    // Parse number from display value
    const parseNumber = useCallback(
      (displayVal: string): number | string => {
        if (!displayVal) return "";

        // Remove formatting characters
        let cleanValue = displayVal.replace(/[^\d.-]/g, "");

        // Handle currency format
        if (format === "currency") {
          cleanValue = displayVal.replace(/[^\d.-]/g, "");
        }

        const number = parseFloat(cleanValue);
        return isNaN(number) ? "" : number;
      },
      [format],
    );

    // Update display value when value prop changes
    React.useEffect(() => {
      if (value !== undefined && value !== null) {
        setDisplayValue(formatNumber(value));
      } else {
        setDisplayValue("");
      }
    }, [value, formatNumber]);

    // Handle input change
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setDisplayValue(newValue);

        const parsedValue = parseNumber(newValue);
        onChange?.(parsedValue);
      },
      [onChange, parseNumber],
    );

    // Handle step increment
    const handleStepUp = useCallback(() => {
      if (disabled) return;

      const currentValue = parseNumber(displayValue);
      if (typeof currentValue === "number") {
        const newValue = currentValue + step;
        if (max === undefined || newValue <= max) {
          const formattedValue = formatNumber(newValue);
          setDisplayValue(formattedValue);
          onChange?.(newValue);
        }
      } else {
        const newValue = step;
        const formattedValue = formatNumber(newValue);
        setDisplayValue(formattedValue);
        onChange?.(newValue);
      }
    }, [
      disabled,
      displayValue,
      step,
      max,
      onChange,
      parseNumber,
      formatNumber,
    ]);

    // Handle step decrement
    const handleStepDown = useCallback(() => {
      if (disabled) return;

      const currentValue = parseNumber(displayValue);
      if (typeof currentValue === "number") {
        const newValue = currentValue - step;
        if (min === undefined || newValue >= min) {
          const formattedValue = formatNumber(newValue);
          setDisplayValue(formattedValue);
          onChange?.(newValue);
        }
      } else {
        const newValue = -step;
        if (min === undefined || newValue >= min) {
          const formattedValue = formatNumber(newValue);
          setDisplayValue(formattedValue);
          onChange?.(newValue);
        }
      }
    }, [
      disabled,
      displayValue,
      step,
      min,
      onChange,
      parseNumber,
      formatNumber,
    ]);

    // Handle clear
    const handleClear = useCallback(() => {
      setDisplayValue("");
      onChange?.("");
    }, [onChange]);

    // Handle focus
    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.();
      },
      [onFocus],
    );

    // Handle blur
    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);

        // Format the value on blur
        const parsedValue = parseNumber(displayValue);
        if (typeof parsedValue === "number") {
          const formattedValue = formatNumber(parsedValue);
          setDisplayValue(formattedValue);
        }

        onBlur?.();
      },
      [displayValue, parseNumber, formatNumber, onBlur],
    );

    // Handle key down
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          handleStepUp();
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          handleStepDown();
        }
      },
      [handleStepUp, handleStepDown],
    );

    // Show error if validation errors exist and field is touched or showing all errors
    const showError = errors.length > 0 && (touched || showValidationErrors);
    const errorMessage = showError ? errors[0] : null;

    // Size classes
    const sizeClasses = {
      sm: "px-2 py-1 text-sm",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-3 text-base",
    };

    // Base input classes
    const baseInputClasses = cn(
      "w-full border rounded-md transition-colors duration-200",
      sizeClasses[size],
      showError
        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-primary-500 focus:border-primary-500",
      disabled && "opacity-60 cursor-not-allowed",
      inputClassName,
    );

    // If hidden, don't render anything
    if (hidden) {
      return null;
    }

    return (
      <div className={cn("w-full", className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-gray-700 mb-1",
              showError && "text-red-700",
              disabled && "text-gray-500",
              labelClassName,
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          {/* Number Input */}
          <input
            ref={ref}
            id={inputId}
            type="text"
            name={name}
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            step={step}
            className={cn(
              baseInputClasses,
              icon && "pl-10",
              showStepControls && "pr-20",
              clearable && displayValue && !disabled && "pr-10",
            )}
            aria-describedby={cn(
              helperText && `${inputId}-helper`,
              errorMessage && `${inputId}-error`,
            )}
            aria-invalid={showError}
            {...props}
          />

          {/* Step Controls */}
          {showStepControls && !disabled && (
            <div className="absolute right-0 top-0 h-full flex flex-col">
              <button
                type="button"
                onClick={handleStepUp}
                className="flex-1 px-2 border-l border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                aria-label="Increase value"
              >
                <ChevronUp className="h-3 w-3 text-gray-400" />
              </button>
              <button
                type="button"
                onClick={handleStepDown}
                className="flex-1 px-2 border-l border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                aria-label="Decrease value"
              >
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </button>
            </div>
          )}

          {/* Clear Button */}
          {clearable && displayValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
              aria-label="Clear value"
            >
              ×
            </button>
          )}

          {/* Loading Spinner */}
          {showLoadingSpinner && (
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
          {helperText && !showError && (
            <p
              id={`${inputId}-helper`}
              className={cn("text-sm text-gray-500", helperClassName)}
            >
              {helperText}
            </p>
          )}

          {errorMessage && (
            <p
              id={`${inputId}-error`}
              className={cn("text-sm text-red-600", errorClassName)}
            >
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    );
  },
);

NumberInput.displayName = "NumberInput";
