import React from "react";
import { cn } from "../../utils/cn";

export interface DateFieldProps {
  /** The date value to display (ISO string, Date object, or timestamp) */
  value?: string | Date | number | null;

  /** The source record containing the field data */
  record?: Record<string, any>;

  /** The source field name in the record */
  source?: string;

  /** Custom CSS classes for the field container */
  className?: string;

  /** Custom CSS classes for the field label */
  labelClassName?: string;

  /** Custom CSS classes for the date value */
  valueClassName?: string;

  /** Whether to show the field label */
  showLabel?: boolean;

  /** Custom label text */
  label?: string;

  /** Display style for the date */
  style?: "text" | "badge" | "icon" | "button" | "relative";

  /** Date format type */
  format?: "short" | "long" | "relative" | "time" | "datetime" | "custom";

  /** Custom date format string (for Intl.DateTimeFormat) */
  customFormat?: string;

  /** Locale for date formatting */
  locale?: string;

  /** Timezone for date formatting */
  timezone?: string;

  /** Whether to show time along with date */
  showTime?: boolean;

  /** Whether to show relative time (e.g., "2 hours ago") */
  showRelative?: boolean;

  /** Whether to show a loading state */
  loading?: boolean;

  /** Loading text */
  loadingText?: string;

  /** Whether the field is disabled */
  disabled?: boolean;

  /** Custom empty state text */
  emptyText?: string;

  /** Whether to show the empty state */
  showEmpty?: boolean;

  /** Whether to validate date format */
  validateDate?: boolean;

  /** Custom validation error message */
  validationErrorMessage?: string;

  /** Whether to show date validation status */
  showValidation?: boolean;

  /** Custom icon for the date */
  icon?: React.ReactNode;

  /** Whether to show date preview on hover */
  showPreview?: boolean;

  /** Custom preview content */
  previewContent?: React.ReactNode;

  /** Click handler for the date */
  onClick?: (
    value: string | Date | number | null,
    record: Record<string, any>,
  ) => void;

  /** Whether the date is clickable */
  clickable?: boolean;

  /** Whether to show a tooltip */
  showTooltip?: boolean;

  /** Custom tooltip content */
  tooltipContent?: string;

  /** Whether to animate date changes */
  animate?: boolean;

  /** Custom CSS classes for valid dates */
  validDateClassName?: string;

  /** Custom CSS classes for invalid dates */
  invalidDateClassName?: string;

  /** Whether to show date metadata (day of week, etc.) */
  showMetadata?: boolean;

  /** Whether to show date accessibility features */
  showAccessibility?: boolean;

  /** Whether to show date status indicators */
  showStatus?: boolean;

  /** Whether the date is in the past, present, or future */
  dateStatus?: "past" | "present" | "future";

  /** Whether to show date range indicators */
  showRange?: boolean;

  /** Minimum date for range validation */
  minDate?: string | Date;

  /** Maximum date for range validation */
  maxDate?: string | Date;
}

export const DateField: React.FC<DateFieldProps> = ({
  value,
  record,
  source,
  className,
  labelClassName,
  valueClassName,
  showLabel = true,
  label,
  style = "text",
  format = "short",
  customFormat,
  locale = "en-US",
  timezone,
  showTime = false,
  showRelative = false,
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  emptyText = "No date",
  showEmpty = true,
  validateDate = true,
  validationErrorMessage = "Invalid date format",
  showValidation = false,
  icon,
  showPreview = false,
  previewContent,
  onClick,
  clickable = false,
  showTooltip = false,
  tooltipContent,
  animate = false,
  validDateClassName,
  invalidDateClassName,
  showMetadata = false,
  showAccessibility = false,
  showStatus = false,
  dateStatus,
  showRange = false,
  minDate,
  maxDate,
}) => {
  // Get the actual value from record if source is provided
  const actualValue = source && record ? record[source] : value;

  // Get field label
  const getFieldLabel = (): string => {
    if (label) return label;
    if (source)
      return (
        source.charAt(0).toUpperCase() +
        source.slice(1).replace(/([A-Z])/g, " $1")
      );
    return "";
  };

  // Parse and validate date
  const parseDate = (dateValue: any): Date | null => {
    if (!dateValue) return null;

    try {
      if (dateValue instanceof Date) return dateValue;
      if (typeof dateValue === "number") return new Date(dateValue);
      if (typeof dateValue === "string") return new Date(dateValue);
      return null;
    } catch {
      return null;
    }
  };

  // Check if date is valid
  const isValidDate = (date: Date): boolean => {
    return !isNaN(date.getTime());
  };

  // Format date based on format type
  const formatDate = (date: Date): string => {
    try {
      switch (format) {
        case "short":
          return date.toLocaleDateString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

        case "long":
          return date.toLocaleDateString(locale, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

        case "time":
          return date.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
          });

        case "datetime":
          return date.toLocaleString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

        case "custom":
          if (customFormat) {
            return new Intl.DateTimeFormat(locale, {
              timeZone: timezone,
              ...JSON.parse(customFormat),
            }).format(date);
          }
          return date.toLocaleDateString(locale);

        default:
          return date.toLocaleDateString(locale);
      }
    } catch {
      return date.toLocaleDateString(locale);
    }
  };

  // Get relative time string
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;

    return formatDate(date);
  };

  // Get date metadata
  const getDateMetadata = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    return {
      dayOfWeek: date.toLocaleDateString(locale, { weekday: "long" }),
      isToday: dateOnly.getTime() === today.getTime(),
      isTomorrow: dateOnly.getTime() === tomorrow.getTime(),
      isYesterday: dateOnly.getTime() === yesterday.getTime(),
      isPast: date < now,
      isFuture: date > now,
      isThisYear: date.getFullYear() === now.getFullYear(),
      isThisMonth:
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear(),
    };
  };

  // Get date status
  const getDateStatus = (date: Date): "past" | "present" | "future" => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    if (dateOnly.getTime() === today.getTime()) return "present";
    if (date < now) return "past";
    return "future";
  };

  // Check if date is within range
  const isDateInRange = (date: Date): boolean => {
    if (!showRange || (!minDate && !maxDate)) return true;

    const min = minDate ? new Date(minDate) : null;
    const max = maxDate ? new Date(maxDate) : null;

    if (min && date < min) return false;
    if (max && date > max) return false;

    return true;
  };

  // Handle click
  const handleClick = () => {
    if (clickable && onClick && !disabled && !loading && actualValue) {
      onClick(actualValue, record || {});
    }
  };

  // Get display content based on style
  const getDisplayContent = () => {
    if (!actualValue) return null;

    const date = parseDate(actualValue);
    if (!date || !isValidDate(date)) return null;

    const displayDate = showRelative ? getRelativeTime(date) : formatDate(date);
    const metadata = getDateMetadata(date);
    const status = dateStatus || getDateStatus(date);
    const inRange = isDateInRange(date);

    switch (style) {
      case "button":
        return (
          <button
            type="button"
            className={cn(
              "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md",
              "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-colors duration-200",
              animate && "animate-in fade-in-0",
              inRange ? validDateClassName : invalidDateClassName,
            )}
            onClick={handleClick}
            disabled={disabled || loading}
            title={showTooltip ? tooltipContent || displayDate : undefined}
          >
            {icon && <span className="mr-2">{icon}</span>}
            {displayDate}
          </button>
        );

      case "badge":
        return (
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full",
              "bg-gray-100 text-gray-800 border border-gray-300",
              "hover:bg-gray-200 transition-colors duration-200",
              animate && "animate-in fade-in-0",
              inRange ? validDateClassName : invalidDateClassName,
            )}
          >
            {icon && <span className="mr-1">{icon}</span>}
            {displayDate}
          </span>
        );

      case "icon":
        return (
          <div
            className={cn(
              "inline-flex items-center justify-center w-8 h-8 rounded-full",
              "bg-blue-100 text-blue-600 hover:bg-blue-200",
              "transition-colors duration-200 cursor-pointer",
              animate && "animate-in fade-in-0",
              inRange ? validDateClassName : invalidDateClassName,
            )}
            onClick={handleClick}
            title={displayDate}
          >
            {icon || (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>
        );

      case "relative":
        return (
          <span
            className={cn(
              "text-sm text-gray-600",
              clickable && !disabled
                ? "cursor-pointer hover:text-blue-600"
                : "",
              disabled ? "opacity-50 cursor-not-allowed" : "",
              animate && "animate-in fade-in-0",
              inRange ? validDateClassName : invalidDateClassName,
              valueClassName,
            )}
            onClick={handleClick}
          >
            {icon && <span className="mr-2">{icon}</span>}
            {getRelativeTime(date)}
          </span>
        );

      default: // 'text'
        return (
          <span
            className={cn(
              "text-gray-900 transition-colors duration-200",
              clickable && !disabled
                ? "cursor-pointer hover:text-blue-600"
                : "",
              disabled ? "opacity-50 cursor-not-allowed" : "",
              animate && "animate-in fade-in-0",
              inRange ? validDateClassName : invalidDateClassName,
              valueClassName,
            )}
            onClick={handleClick}
          >
            {icon && <span className="mr-2">{icon}</span>}
            {displayDate}
          </span>
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        {showLabel && getFieldLabel() && (
          <span
            className={cn("text-sm font-medium text-gray-700", labelClassName)}
          >
            {getFieldLabel()}
          </span>
        )}
        <div className="flex items-center space-x-2">
          <div className="animate-pulse bg-gray-200 rounded px-3 py-1.5 text-sm">
            {loadingText}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!actualValue && showEmpty) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        {showLabel && getFieldLabel() && (
          <span
            className={cn("text-sm font-medium text-gray-700", labelClassName)}
          >
            {getFieldLabel()}
          </span>
        )}
        <span className="text-sm text-gray-500">{emptyText}</span>
      </div>
    );
  }

  // Invalid date state
  if (actualValue && validateDate) {
    const date = parseDate(actualValue);
    if (!date || !isValidDate(date)) {
      return (
        <div className={cn("flex items-center space-x-2", className)}>
          {showLabel && getFieldLabel() && (
            <span
              className={cn(
                "text-sm font-medium text-gray-700",
                labelClassName,
              )}
            >
              {getFieldLabel()}
            </span>
          )}
          <div className="flex items-center space-x-2">
            <span className={cn("text-sm text-red-600", invalidDateClassName)}>
              {validationErrorMessage}
            </span>
            {showValidation && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                Invalid
              </span>
            )}
          </div>
        </div>
      );
    }
  }

  const date = parseDate(actualValue);
  if (!date) return null;

  const metadata = getDateMetadata(date);
  const status = dateStatus || getDateStatus(date);
  const inRange = isDateInRange(date);

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {showLabel && getFieldLabel() && (
        <span
          className={cn("text-sm font-medium text-gray-700", labelClassName)}
        >
          {getFieldLabel()}
        </span>
      )}

      <div className="relative group">
        {getDisplayContent()}

        {/* Date Status */}
        {showStatus && (
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ml-2",
              status === "past"
                ? "bg-gray-100 text-gray-800"
                : status === "present"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800",
            )}
          >
            {status === "past"
              ? "Past"
              : status === "present"
                ? "Today"
                : "Future"}
          </span>
        )}

        {/* Range Status */}
        {showRange && !inRange && (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ml-2 bg-red-100 text-red-800">
            Out of Range
          </span>
        )}

        {/* Date Preview */}
        {showPreview && (
          <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 max-w-xs">
            {previewContent || (
              <div>
                <div className="font-medium mb-1">Date Details</div>
                <div className="text-gray-300 space-y-1">
                  <div>{formatDate(date)}</div>
                  {showTime && <div>{date.toLocaleTimeString(locale)}</div>}
                  <div>{metadata.dayOfWeek}</div>
                  {metadata.isToday && (
                    <div className="text-green-400">Today</div>
                  )}
                  {metadata.isTomorrow && (
                    <div className="text-blue-400">Tomorrow</div>
                  )}
                  {metadata.isYesterday && (
                    <div className="text-yellow-400">Yesterday</div>
                  )}
                </div>
              </div>
            )}
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      {/* Additional metadata below date */}
      {showMetadata && (
        <div className="text-xs text-gray-500 space-y-1 ml-4">
          <div>{metadata.dayOfWeek}</div>
          {metadata.isToday && <div className="text-green-600">Today</div>}
          {metadata.isTomorrow && <div className="text-blue-600">Tomorrow</div>}
          {metadata.isYesterday && (
            <div className="text-yellow-600">Yesterday</div>
          )}
          {showTime && <div>Time: {date.toLocaleTimeString(locale)}</div>}
        </div>
      )}
    </div>
  );
};

DateField.displayName = "DateField";
