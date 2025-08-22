import { Clock } from "lucide-react";
import React, { forwardRef, useState } from "react";
import { cn } from "../../utils/cn";

export interface TimeInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type" | "size"
  > {
  /** Current time value (HH:MM format or null) */
  value?: string | null;

  /** Callback when time changes */
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

  /** Minimum allowed time (HH:MM format) */
  min?: string;

  /** Maximum allowed time (HH:MM format) */
  max?: string;

  /** Time step in minutes */
  step?: number;

  /** Whether to show an icon */
  showIcon?: boolean;

  /** Whether to show seconds input */
  showSeconds?: boolean;

  /** Whether to use 12-hour format */
  use12Hour?: boolean;

  /** Whether to show AM/PM selector */
  showAMPM?: boolean;

  /** Custom class names */
  className?: string;

  /** Custom class names for the input element */
  inputClassName?: string;

  /** Custom class names for the label */
  labelClassName?: string;

  /** Placeholder text */
  placeholder?: string;

  /** Whether to show time picker */
  showTimePicker?: boolean;

  /** Whether to show quick time options */
  showQuickOptions?: boolean;

  /** Quick time options to display */
  quickTimeOptions?: string[];

  /** Whether to show current time button */
  showCurrentTime?: boolean;

  /** Whether to show time validation */
  showValidation?: boolean;

  /** Custom validation function */
  validateTime?: (time: string) => string | null;

  /** Whether to show time format help */
  showFormatHelp?: boolean;

  /** Whether to show time zone info */
  showTimeZone?: boolean;

  /** Current time zone */
  timeZone?: string;
}

/**
 * A specialized time input component with validation, accessibility features,
 * and flexible styling options specifically designed for time input.
 *
 * @example
 * // Basic usage
 * <TimeInput
 *   label="Meeting Time"
 *   value={meetingTime}
 *   onChange={setMeetingTime}
 * />
 *
 * @example
 * // With validation and constraints
 * <TimeInput
 *   label="Business Hours"
 *   value={businessHours}
 *   onChange={setBusinessHours}
 *   min="09:00"
 *   max="17:00"
 *   step={30}
 *   required
 *   error={businessHoursError}
 * />
 *
 * @example
 * // With 12-hour format
 * <TimeInput
 *   label="Appointment Time"
 *   value={appointmentTime}
 *   onChange={setAppointmentTime}
 *   use12Hour
 *   showAMPM
 *   showIcon
 * />
 */
export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
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
      min,
      max,
      step = 15,
      showIcon = true,
      showSeconds = false,
      use12Hour = false,
      showAMPM = false,
      className,
      inputClassName,
      labelClassName,
      placeholder,
      showTimePicker = false,
      showQuickOptions = false,
      quickTimeOptions = ["09:00", "12:00", "15:00", "18:00"],
      showCurrentTime = false,
      showValidation = false,
      validateTime,
      showFormatHelp = false,
      showTimeZone = false,
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
      id,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

    const inputId = id || `time-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const isDisabled = disabled;

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
      showIcon && "pl-10",
      inputClassName,
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      // Validate time format
      if (newValue && validateTime) {
        const validationError = validateTime(newValue);
        if (validationError) {
          // Handle validation error
          return;
        }
      }

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

    const handleQuickTimeSelect = (time: string) => {
      onChange(time);
      setIsTimePickerOpen(false);
    };

    const handleCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const currentTime = `${hours}:${minutes}`;
      onChange(currentTime);
    };

    const formatTimeForDisplay = (time: string) => {
      if (!time) return "";

      if (use12Hour && showAMPM) {
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
      }

      return time;
    };

    const getInputType = () => {
      if (showSeconds) return "time";
      return "time";
    };

    const getStepValue = () => {
      if (showSeconds) return step;
      return step;
    };

    return (
      <div className={cn("w-full", className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-gray-700 mb-1",
              hasError && "text-red-700",
              isDisabled && "text-gray-500",
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
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
          )}

          {/* Time Input */}
          <input
            ref={ref}
            id={inputId}
            type={getInputType()}
            value={value || ""}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            min={min}
            max={max}
            step={getStepValue()}
            disabled={isDisabled}
            placeholder={placeholder || (use12Hour ? "12:00 PM" : "14:30")}
            className={baseInputClasses}
            {...props}
          />

          {/* Current Time Button */}
          {showCurrentTime && (
            <button
              type="button"
              onClick={handleCurrentTime}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              title="Set to current time"
            >
              <Clock className="h-4 w-4" />
            </button>
          )}

          {/* Time Picker Toggle */}
          {showTimePicker && (
            <button
              type="button"
              onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
              className="absolute inset-y-0 right-0 pr-8 flex items-center text-gray-400 hover:text-gray-600"
              title="Open time picker"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Helper Text */}
        {helperText && (
          <p
            className={cn(
              "mt-1 text-sm",
              hasError ? "text-red-600" : "text-gray-500",
            )}
          >
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {/* Time Format Help */}
        {showFormatHelp && (
          <p className="mt-1 text-xs text-gray-500">
            Format: {use12Hour ? "12:00 AM/PM" : "24:00"}
          </p>
        )}

        {/* Time Zone Info */}
        {showTimeZone && timeZone && (
          <p className="mt-1 text-xs text-gray-500">Time zone: {timeZone}</p>
        )}

        {/* Quick Time Options */}
        {showQuickOptions && (
          <div className="mt-2 flex flex-wrap gap-2">
            {quickTimeOptions.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => handleQuickTimeSelect(time)}
                className={cn(
                  "px-2 py-1 text-xs rounded border transition-colors",
                  value === time
                    ? "bg-primary-100 border-primary-300 text-primary-700"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100",
                )}
              >
                {formatTimeForDisplay(time)}
              </button>
            ))}
          </div>
        )}

        {/* Time Picker Dropdown */}
        {showTimePicker && isTimePickerOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="p-2 max-h-48 overflow-y-auto">
              {/* Generate time options based on step */}
              {Array.from({ length: 24 * (60 / step) }, (_, i) => {
                const totalMinutes = i * step;
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => handleQuickTimeSelect(time)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded",
                      value === time && "bg-primary-100 text-primary-700",
                    )}
                  >
                    {formatTimeForDisplay(time)}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  },
);

TimeInput.displayName = "TimeInput";
