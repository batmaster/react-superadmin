import React, { forwardRef, useState } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { cn } from "../utils/cn";

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
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
  /** Minimum value allowed */
  min?: number;
  /** Maximum value allowed */
  max?: number;
  /** Step increment for number input */
  step?: number;
  /** Whether to show increment/decrement buttons */
  showControls?: boolean;
  /** Whether to allow decimal values */
  allowDecimals?: boolean;
  /** Number of decimal places to show */
  decimalPlaces?: number;
  /** Whether to show thousands separator */
  showThousandsSeparator?: boolean;
  /** Custom thousands separator character */
  thousandsSeparator?: string;
  /** Custom decimal separator character */
  decimalSeparator?: string;
  /** Whether to show the plus sign for positive numbers */
  showPlusSign?: boolean;
  /** Whether to show the minus sign for negative numbers */
  showMinusSign?: boolean;
  /** Custom prefix to show before the number */
  prefix?: string;
  /** Custom suffix to show after the number */
  suffix?: string;
  /** Whether to format as currency */
  currency?: boolean;
  /** Currency code (e.g., 'USD', 'EUR') */
  currencyCode?: string;
  /** Currency symbol (e.g., '$', '€') */
  currencySymbol?: string;
  /** Whether to format as percentage */
  percentage?: boolean;
  /** Whether to show percentage sign */
  showPercentageSign?: boolean;
  /** Whether to format as scientific notation */
  scientific?: boolean;
  /** Number of significant digits for scientific notation */
  significantDigits?: number;
  /** Whether to format as compact notation (e.g., 1K, 1M) */
  compact?: boolean;
  /** Whether to show number formatting options */
  showFormattingOptions?: boolean;
  /** Whether to show number validation */
  showValidation?: boolean;
  /** Custom number validation function */
  validateNumber?: (value: number) => boolean | string;
  /** Whether to show number preview */
  showPreview?: boolean;
  /** Whether to show number statistics */
  showStatistics?: boolean;
  /** Whether to show number history */
  showHistory?: boolean;
  /** Whether to allow negative numbers */
  allowNegative?: boolean;
  /** Whether to show number range indicator */
  showRangeIndicator?: boolean;
  /** Whether to show number suggestions */
  showSuggestions?: boolean;
  /** Suggested number values */
  suggestions?: number[];
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
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
      className,
      wrapperClassName,
      min,
      max,
      step = 1,
      showControls = false,
      allowDecimals = true,
      decimalPlaces = 2,
      showThousandsSeparator = false,
      thousandsSeparator = ",",
      decimalSeparator = ".",
      showPlusSign = false,
      showMinusSign = true,
      prefix,
      suffix,
      currency = false,
      currencySymbol = "$",
      percentage = false,
      showPercentageSign = true,
      scientific = false,
      significantDigits = 3,
      compact = false,
      showValidation = true,
      validateNumber,
      showPreview = false,
      showStatistics = false,
      allowNegative = true,
      showRangeIndicator = false,
      showSuggestions = false,
      suggestions = [],
      value,
      onChange,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const [displayValue, setDisplayValue] = useState<string>("");

    // Default number validation
    const defaultValidateNumber = (num: number): boolean | string => {
      if (isNaN(num)) return "Please enter a valid number";

      if (min !== undefined && num < min) {
        return `Value must be at least ${min}`;
      }

      if (max !== undefined && num > max) {
        return `Value must be at most ${max}`;
      }

      if (!allowNegative && num < 0) {
        return "Negative numbers are not allowed";
      }

      if (!allowDecimals && num % 1 !== 0) {
        return "Decimal values are not allowed";
      }

      return true;
    };

    const validateNumberFn = validateNumber || defaultValidateNumber;
    const validationResult =
      value && showValidation ? validateNumberFn(Number(value)) : true;
    const hasError =
      error ||
      (typeof validationResult === "string" && validationResult !== "true");

    // Format number for display
    const formatNumber = (num: number): string => {
      if (isNaN(num)) return "";

      let formatted = num.toString();

      // Apply decimal places
      if (allowDecimals && decimalPlaces !== undefined) {
        formatted = num.toFixed(decimalPlaces);
      }

      // Apply thousands separator
      if (showThousandsSeparator) {
        const parts = formatted.split(".");
        parts[0] = parts[0].replace(
          /\B(?=(\d{3})+(?!\d))/g,
          thousandsSeparator,
        );
        formatted = parts.join(".");
      }

      // Apply prefix and suffix
      if (prefix) formatted = prefix + formatted;
      if (suffix) formatted = formatted + suffix;

      // Apply signs
      if (showPlusSign && num > 0) formatted = "+" + formatted;
      // Note: showMinusSign is handled by the number itself, no need to modify formatted

      // Apply currency formatting
      if (currency) {
        formatted = currencySymbol + formatted;
      }

      // Apply percentage formatting
      if (percentage) {
        if (showPercentageSign) formatted = formatted + "%";
      }

      // Apply scientific notation
      if (scientific) {
        formatted = num.toExponential(significantDigits);
      }

      // Apply compact notation
      if (compact) {
        if (num >= 1000000) formatted = (num / 1000000).toFixed(1) + "M";
        else if (num >= 1000) formatted = (num / 1000).toFixed(1) + "K";
      }

      return formatted;
    };

    // Parse number from display value
    const parseNumber = (displayVal: string): number => {
      let cleanValue = displayVal;

      // Remove prefix, suffix, and formatting
      if (prefix)
        cleanValue = cleanValue.replace(
          new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
          "",
        );
      if (suffix)
        cleanValue = cleanValue.replace(
          new RegExp(`${suffix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
          "",
        );
      if (currency)
        cleanValue = cleanValue.replace(
          new RegExp(
            `^${currencySymbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
          ),
          "",
        );
      if (percentage) cleanValue = cleanValue.replace(/%$/, "");
      if (showThousandsSeparator)
        cleanValue = cleanValue.replace(
          new RegExp(`\\${thousandsSeparator}`, "g"),
          "",
        );

      // Parse the number
      const parsed = parseFloat(cleanValue);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Initialize display value
    React.useEffect(() => {
      if (value !== undefined && value !== null) {
        const numValue = Number(value);
        setDisplayValue(formatNumber(numValue));
      } else {
        setDisplayValue("");
      }
    }, [value, currency, percentage, scientific, compact]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setDisplayValue(newValue);

      if (onChange) {
        const parsedValue = parseNumber(newValue);
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: parsedValue.toString(),
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);

      // Format the display value on blur
      const parsedValue = parseNumber(displayValue);
      if (!isNaN(parsedValue)) {
        setDisplayValue(formatNumber(parsedValue));
      }

      if (onBlur) {
        onBlur(e);
      }
    };

    const handleInputFocus = () => {
      setFocused(true);
    };

    const increment = () => {
      const currentValue = value ? Number(value) : 0;
      const newValue = currentValue + step;

      if (max !== undefined && newValue > max) return;

      if (onChange) {
        const syntheticEvent = {
          target: { value: newValue.toString() },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const decrement = () => {
      const currentValue = value ? Number(value) : 0;
      const newValue = currentValue - step;

      if (min !== undefined && newValue < min) return;

      if (onChange) {
        const syntheticEvent = {
          target: { value: newValue.toString() },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "px-3 py-1.5 text-sm";
        case "lg":
          return "px-4 py-3 text-lg";
        default:
          return "px-3 py-2 text-base";
      }
    };

    const getIconSizeClasses = () => {
      switch (size) {
        case "sm":
          return "w-4 h-4";
        case "lg":
          return "w-6 h-6";
        default:
          return "w-5 h-5";
      }
    };

    const getNumberStatistics = () => {
      if (!value) return null;
      const numValue = Number(value);
      return {
        isEven: numValue % 2 === 0,
        isPositive: numValue > 0,
        isInteger: Number.isInteger(numValue),
        absoluteValue: Math.abs(numValue),
        square: numValue * numValue,
        squareRoot: Math.sqrt(Math.abs(numValue)),
      };
    };

    const getRangeIndicator = () => {
      if (min === undefined && max === undefined) return null;

      const currentValue = value ? Number(value) : 0;
      let percentage = 0;

      if (min !== undefined && max !== undefined) {
        percentage = ((currentValue - min) / (max - min)) * 100;
      } else if (min !== undefined) {
        percentage = Math.min((currentValue / Math.abs(min)) * 100, 100);
      } else if (max !== undefined) {
        percentage = Math.min((currentValue / max) * 100, 100);
      }

      return Math.max(0, Math.min(100, percentage));
    };

    return (
      <div className={cn("space-y-1", fullWidth && "w-full", wrapperClassName)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <div className={getIconSizeClasses()}>{leftIcon}</div>
            </div>
          )}

          <input
            ref={ref}
            type="number"
            value={displayValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            min={min}
            max={max}
            step={step}
            className={cn(
              "block w-full border border-gray-300 rounded-md shadow-sm",
              "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
              "transition-colors duration-200",
              getSizeClasses(),
              leftIcon && "pl-10",
              (rightIcon || showControls) && "pr-24",
              hasError &&
                "border-red-300 focus:ring-red-500 focus:border-red-500",
              focused && "border-blue-500",
              fullWidth && "w-full",
              className,
            )}
            placeholder={props.placeholder || "Enter number"}
            {...props}
          />

          {/* Right side controls */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {showControls && (
              <>
                <button
                  type="button"
                  onClick={decrement}
                  className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-50"
                  title="Decrease value"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={increment}
                  className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-50"
                  title="Increase value"
                >
                  +
                </button>
              </>
            )}

            {rightIcon && (
              <div className="text-gray-400">
                <div className={getIconSizeClasses()}>{rightIcon}</div>
              </div>
            )}
          </div>
        </div>

        {/* Range indicator */}
        {showRangeIndicator && (min !== undefined || max !== undefined) && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getRangeIndicator()}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {min !== undefined && `Min: ${min}`}
              {min !== undefined && max !== undefined && " - "}
              {max !== undefined && `Max: ${max}`}
            </div>
          </div>
        )}

        {/* Number statistics */}
        {showStatistics && value && (
          <div className="mt-2 space-y-1">
            <div className="text-xs font-medium text-gray-700">Statistics:</div>
            {getNumberStatistics() && (
              <div className="text-xs text-gray-600 space-y-1">
                <div>Even: {getNumberStatistics()?.isEven ? "Yes" : "No"}</div>
                <div>
                  Positive: {getNumberStatistics()?.isPositive ? "Yes" : "No"}
                </div>
                <div>
                  Integer: {getNumberStatistics()?.isInteger ? "Yes" : "No"}
                </div>
                <div>Absolute: {getNumberStatistics()?.absoluteValue}</div>
                <div>Square: {getNumberStatistics()?.square}</div>
                <div>
                  Square Root: {getNumberStatistics()?.squareRoot.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Number suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="mt-2">
            <div className="text-xs font-medium text-gray-700 mb-1">
              Suggestions:
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    if (onChange) {
                      const syntheticEvent = {
                        target: { value: suggestion.toString() },
                      } as React.ChangeEvent<HTMLInputElement>;
                      onChange(syntheticEvent);
                    }
                  }}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Number preview */}
        {showPreview && value && (
          <div className="text-xs text-gray-600 mt-1">
            Preview: {formatNumber(Number(value))}
          </div>
        )}

        {/* Validation error or helper text */}
        {(hasError || helperText) && (
          <div
            className={cn(
              "text-sm",
              hasError ? "text-red-600" : "text-gray-500",
            )}
          >
            {hasError || helperText}
          </div>
        )}
      </div>
    );
  },
);

NumberInput.displayName = "NumberInput";
