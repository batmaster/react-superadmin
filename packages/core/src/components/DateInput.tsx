import React, { forwardRef, useState, useEffect } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { cn } from "../utils/cn";

export interface DateInputProps
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
  /** Date format to display */
  dateFormat?: string;
  /** Minimum date allowed */
  minDate?: Date;
  /** Maximum date allowed */
  maxDate?: Date;
  /** Whether to show date picker */
  showDatePicker?: boolean;
  /** Whether to allow manual input */
  allowManualInput?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Whether to show today button */
  showTodayButton?: boolean;
  /** Whether to show clear button */
  showClearButton?: boolean;
  /** Custom date parser function */
  parseDate?: (value: string) => Date | null;
  /** Custom date formatter function */
  formatDate?: (date: Date) => string;
  /** Whether to use UTC dates */
  useUTC?: boolean;
  /** Timezone to use */
  timezone?: string;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
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
      dateFormat = "YYYY-MM-DD",
      minDate,
      maxDate,
      showDatePicker = true,
      allowManualInput = true,
      placeholder,
      showTodayButton = false,
      showClearButton = false,
      parseDate,
      formatDate,
      useUTC = false,
      timezone,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const { theme } = useSuperAdmin();
    const [inputValue, setInputValue] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);
    const [focused, setFocused] = useState(false);

    // Default date parser
    const defaultParseDate = (value: string): Date | null => {
      if (!value) return null;
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    };

    // Default date formatter
    const defaultFormatDate = (date: Date): string => {
      if (useUTC) {
        return date.toISOString().split("T")[0];
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const parseDateFn = parseDate || defaultParseDate;
    const formatDateFn = formatDate || defaultFormatDate;

    // Initialize input value
    useEffect(() => {
      if (value) {
        if (typeof value === "string") {
          const date = parseDateFn(value);
          setInputValue(date ? formatDateFn(date) : value);
        } else if (value instanceof Date) {
          setInputValue(formatDateFn(value));
        }
      } else {
        setInputValue("");
      }
    }, [value, parseDateFn, formatDateFn]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      if (onChange) {
        const date = parseDateFn(newValue);
        if (date) {
          // Create a synthetic event with the parsed date
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              value: date.toISOString(),
            },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        } else {
          onChange(e);
        }
      }
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      if (onBlur) {
        onBlur(e);
      }
    };

    const handleInputFocus = () => {
      setFocused(true);
    };

    const handleTodayClick = () => {
      const today = new Date();
      const formattedToday = formatDateFn(today);
      setInputValue(formattedToday);

      if (onChange) {
        const syntheticEvent = {
          target: { value: today.toISOString() },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const handleClearClick = () => {
      setInputValue("");
      if (onChange) {
        const syntheticEvent = {
          target: { value: "" },
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
            type="date"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            className={cn(
              "block w-full border border-gray-300 rounded-md shadow-sm",
              "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
              "transition-colors duration-200",
              getSizeClasses(),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-300 focus:ring-red-500 focus:border-red-500",
              focused && "border-blue-500",
              fullWidth && "w-full",
              className,
            )}
            min={minDate ? formatDateFn(minDate) : undefined}
            max={maxDate ? formatDateFn(maxDate) : undefined}
            placeholder={placeholder || "Select a date"}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <div className={getIconSizeClasses()}>{rightIcon}</div>
            </div>
          )}

          {/* Action buttons */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {showTodayButton && (
              <button
                type="button"
                onClick={handleTodayClick}
                className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
              >
                Today
              </button>
            )}

            {showClearButton && inputValue && (
              <button
                type="button"
                onClick={handleClearClick}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {(helperText || error) && (
          <div
            className={cn("text-sm", error ? "text-red-600" : "text-gray-500")}
          >
            {error || helperText}
          </div>
        )}
      </div>
    );
  },
);

DateInput.displayName = "DateInput";
