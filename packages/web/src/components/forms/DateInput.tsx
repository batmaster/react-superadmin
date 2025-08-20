import React, { forwardRef, useState } from "react";
import { cn } from "../../utils/cn";
import { Calendar, Clock } from "lucide-react";

export interface DateInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type" | "size"
  > {
  /** Current date value (ISO string or null) */
  value?: string | null;

  /** Callback when date changes */
  onChange: (value: string | null) => void;

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

  /** Date format type */
  type?: "date" | "datetime-local" | "time";

  /** Minimum allowed date (ISO string) */
  min?: string;

  /** Maximum allowed date (ISO string) */
  max?: string;

  /** Whether to show an icon */
  showIcon?: boolean;

  /** Custom class names */
  className?: string;

  /** Custom class names for the input element */
  inputClassName?: string;

  /** Custom class names for the label */
  labelClassName?: string;

  /** Placeholder text */
  placeholder?: string;
}

/**
 * An enhanced date input component with validation, accessibility features,
 * and flexible styling options.
 *
 * @example
 * // Basic usage
 * <DateInput
 *   label="Birth Date"
 *   value={birthDate}
 *   onChange={setBirthDate}
 * />
 *
 * @example
 * // With validation and constraints
 * <DateInput
 *   label="Event Date"
 *   value={eventDate}
 *   onChange={setEventDate}
 *   min="2024-01-01"
 *   max="2024-12-31"
 *   required
 *   error={eventDateError}
 * />
 *
 * @example
 * // DateTime picker
 * <DateInput
 *   label="Appointment Time"
 *   type="datetime-local"
 *   value={appointmentTime}
 *   onChange={setAppointmentTime}
 *   showIcon
 * />
 */
export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      value,
      onChange,
      label,
      helperText,
      error,
      required = false,
      disabled = false,
      size = "md",
      type = "date",
      min,
      max,
      showIcon = true,
      className,
      inputClassName,
      labelClassName,
      placeholder,
      id,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const inputId = id || `date-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const sizeClasses = {
      sm: "px-2 py-1 text-sm",
      md: "px-3 py-2 text-base",
      lg: "px-4 py-3 text-lg",
    };

    const baseInputClasses = cn(
      "block w-full border rounded-md shadow-sm transition-colors duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-0",
      "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
      sizeClasses[size],
      hasError
        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-primary-500 focus:border-primary-500",
      showIcon &&
        (type === "date"
          ? "pl-10"
          : type === "datetime-local"
            ? "pl-10"
            : "pl-10"),
      inputClassName,
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      onChange(newValue || null);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(event);
    };

    const getIconComponent = () => {
      if (type === "time") return Clock;
      return Calendar;
    };

    const IconComponent = getIconComponent();

    return (
      <div className={cn("w-full", className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-gray-700 mb-1",
              hasError && "text-red-700",
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
          {showIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconComponent
                className={cn(
                  "h-4 w-4",
                  hasError ? "text-red-400" : "text-gray-400",
                  isFocused && !hasError && "text-primary-500",
                )}
              />
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={type}
            id={inputId}
            value={value || ""}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            placeholder={placeholder}
            className={baseInputClasses}
            aria-invalid={hasError}
            aria-describedby={cn(
              helperText && `${inputId}-helper`,
              error && `${inputId}-error`,
            )}
            data-testid="date-input"
            {...props}
          />
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

DateInput.displayName = "DateInput";
