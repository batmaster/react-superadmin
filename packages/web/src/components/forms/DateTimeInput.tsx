import { Calendar, Clock } from "lucide-react";
import React, { forwardRef, useCallback, useState } from "react";
import { cn } from "../../utils/cn";

export interface DateTimeInputProps {
  /** The name of the field */
  name: string;
  /** The label to display */
  label?: string;
  /** The current value */
  value?: Date | string;
  /** Callback when the value changes */
  onChange?: (value: Date | string) => void;
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
  /** The minimum date allowed */
  min?: Date;
  /** The maximum date allowed */
  max?: Date;
  /** The date format to use */
  format?: "date" | "datetime" | "time";
  /** The locale for date formatting */
  locale?: string;
  /** The timezone to use */
  timezone?: string;
  /** Whether to show time picker */
  showTime?: boolean;
  /** Whether to show seconds */
  showSeconds?: boolean;
  /** Whether to use 12-hour format */
  use12Hour?: boolean;
  /** Whether to show timezone selector */
  showTimezone?: boolean;
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
 * DateTimeInput component for handling date and time input with validation
 *
 * This component provides enhanced date and time input functionality with
 * various format options, validation, and accessibility features.
 *
 * @example
 * ```tsx
 * <DateTimeInput
 *   name="appointment"
 *   label="Appointment Date & Time"
 *   format="datetime"
 *   showTime={true}
 *   required
 * />
 * ```
 */
export const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
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
      format = "datetime",
      locale = "en-US",
      timezone = "UTC",
      showTime = true,
      showSeconds = false,
      use12Hour = false,
      showTimezone = false,
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
    const inputId = `datetime-input-${name}`;

    // Format date for display
    const formatDate = useCallback(
      (date: Date | string): string => {
        if (!date) return "";

        const dateObj = typeof date === "string" ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) return "";

        try {
          switch (format) {
            case "date":
              return dateObj.toISOString().split("T")[0]; // YYYY-MM-DD format
            case "time":
              return dateObj.toTimeString().slice(0, 5); // HH:MM format
            case "datetime":
            default:
              return dateObj.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM format
          }
        } catch (error) {
          console.error("Error formatting date:", error);
          return "";
        }
      },
      [format],
    );

    // Parse date from display value
    const parseDate = useCallback((displayVal: string): Date | string => {
      if (!displayVal) return "";

      try {
        const parsed = new Date(displayVal);
        return isNaN(parsed.getTime()) ? "" : parsed;
      } catch (error) {
        console.error("Error parsing date:", error);
        return "";
      }
    }, []);

    // Update display value when value prop changes
    React.useEffect(() => {
      if (value !== undefined && value !== null) {
        setDisplayValue(formatDate(value));
      } else {
        setDisplayValue("");
      }
    }, [value, formatDate]);

    // Handle input change
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setDisplayValue(newValue);

        const parsedValue = parseDate(newValue);
        onChange?.(parsedValue);
      },
      [onChange, parseDate],
    );

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
        const parsedValue = parseDate(displayValue);
        if (parsedValue instanceof Date) {
          const formattedValue = formatDate(parsedValue);
          setDisplayValue(formattedValue);
        }

        onBlur?.();
      },
      [displayValue, parseDate, formatDate, onBlur],
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

    // Determine input type based on format
    const getInputType = () => {
      switch (format) {
        case "date":
          return "date";
        case "time":
          return "time";
        case "datetime":
        default:
          return "datetime-local";
      }
    };

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
          {icon ? (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          ) : (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {format === "time" ? (
                <Clock className="h-4 w-4" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
            </div>
          )}

          {/* DateTime Input */}
          <input
            ref={ref}
            id={inputId}
            type={getInputType()}
            name={name}
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            min={min?.toISOString().slice(0, 16)}
            max={max?.toISOString().slice(0, 16)}
            className={cn(
              baseInputClasses,
              "pl-10",
              clearable && displayValue && !disabled && "pr-10",
            )}
            aria-describedby={cn(
              helperText && `${inputId}-helper`,
              errorMessage && `${inputId}-error`,
            )}
            aria-invalid={showError}
            {...props}
          />

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

DateTimeInput.displayName = "DateTimeInput";
