import React from "react";
import { cn } from "../../utils/cn";

export interface BooleanFieldProps {
  /** The boolean value to display */
  value?: boolean | null;

  /** The source record containing the field data */
  record?: Record<string, any>;

  /** The source field name in the record */
  source?: string;

  /** Custom CSS classes for the field container */
  className?: string;

  /** Custom CSS classes for the field label */
  labelClassName?: string;

  /** Custom CSS classes for the boolean value */
  valueClassName?: string;

  /** Whether to show the field label */
  showLabel?: boolean;

  /** Custom label text */
  label?: string;

  /** Display style for the boolean value */
  style?: "text" | "icon" | "badge" | "toggle" | "checkbox";

  /** Custom text for true values */
  trueText?: string;

  /** Custom text for false values */
  falseText?: string;

  /** Custom text for null/undefined values */
  nullText?: string;

  /** Custom icon for true values */
  trueIcon?: React.ReactNode;

  /** Custom icon for false values */
  falseIcon?: React.ReactNode;

  /** Custom icon for null/undefined values */
  nullIcon?: React.ReactNode;

  /** Color variant for the boolean display */
  variant?: "default" | "primary" | "success" | "warning" | "error" | "info";

  /** Size of the boolean display */
  size?: "sm" | "md" | "lg";

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

  /** Click handler for the boolean value */
  onClick?: (value: boolean | null, record: Record<string, any>) => void;

  /** Whether the boolean value is clickable */
  clickable?: boolean;

  /** Whether to show a tooltip on hover */
  showTooltip?: boolean;

  /** Custom tooltip content */
  tooltipContent?: string;

  /** Whether to animate value changes */
  animate?: boolean;

  /** Custom CSS classes for true values */
  trueClassName?: string;

  /** Custom CSS classes for false values */
  falseClassName?: string;

  /** Custom CSS classes for null values */
  nullClassName?: string;
}

export const BooleanField: React.FC<BooleanFieldProps> = ({
  value,
  record,
  source,
  className,
  labelClassName,
  valueClassName,
  showLabel = true,
  label,
  style = "text",
  trueText = "Yes",
  falseText = "No",
  nullText = "Unknown",
  trueIcon,
  falseIcon,
  nullIcon,
  variant = "default",
  size = "md",
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  emptyText = "No data",
  showEmpty = true,
  onClick,
  clickable = false,
  showTooltip = false,
  tooltipContent,
  animate = false,
  trueClassName,
  falseClassName,
  nullClassName,
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

  // Get variant classes
  const getVariantClasses = (isTrue: boolean): string => {
    if (isTrue) {
      switch (variant) {
        case "primary":
          return "text-blue-600 bg-blue-50 border-blue-200";
        case "success":
          return "text-green-600 bg-green-50 border-green-200";
        case "warning":
          return "text-yellow-600 bg-yellow-50 border-yellow-200";
        case "error":
          return "text-red-600 bg-red-50 border-red-200";
        case "info":
          return "text-cyan-600 bg-cyan-50 border-cyan-200";
        default:
          return "text-green-600 bg-green-50 border-green-200";
      }
    } else {
      switch (variant) {
        case "primary":
          return "text-blue-600 bg-blue-50 border-blue-200";
        case "success":
          return "text-gray-600 bg-gray-50 border-gray-200";
        case "warning":
          return "text-yellow-600 bg-yellow-50 border-yellow-200";
        case "error":
          return "text-red-600 bg-red-50 border-red-200";
        case "info":
          return "text-cyan-600 bg-cyan-50 border-cyan-200";
        default:
          return "text-gray-600 bg-gray-50 border-gray-200";
      }
    }
  };

  // Get size classes
  const getSizeClasses = (): string => {
    switch (size) {
      case "sm":
        return "px-2 py-1 text-xs";
      case "lg":
        return "px-4 py-2 text-base";
      default:
        return "px-3 py-1.5 text-sm";
    }
  };

  // Handle click
  const handleClick = () => {
    if (clickable && onClick && !disabled && !loading) {
      onClick(actualValue, record || {});
    }
  };

  // Get display content based on style
  const getDisplayContent = () => {
    if (actualValue === true) {
      switch (style) {
        case "icon":
          return (
            trueIcon || (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )
          );
        case "badge":
          return (
            <span
              className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                getVariantClasses(true),
                trueClassName,
              )}
            >
              {trueIcon && <span className="mr-1">{trueIcon}</span>}
              {trueText}
            </span>
          );
        case "toggle":
          return (
            <div
              className={cn(
                "relative inline-block w-10 h-6 rounded-full bg-green-500",
                animate && "transition-colors duration-200",
              )}
            >
              <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200" />
            </div>
          );
        case "checkbox":
          return (
            <div
              className={cn(
                "w-5 h-5 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center",
                animate && "transition-colors duration-200",
              )}
            >
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          );
        default:
          return (
            <span
              className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium border",
                getVariantClasses(true),
                trueClassName,
              )}
            >
              {trueIcon && <span className="mr-2">{trueIcon}</span>}
              {trueText}
            </span>
          );
      }
    } else if (actualValue === false) {
      switch (style) {
        case "icon":
          return (
            falseIcon || (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )
          );
        case "badge":
          return (
            <span
              className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                getVariantClasses(false),
                falseClassName,
              )}
            >
              {falseIcon && <span className="mr-1">{falseIcon}</span>}
              {falseText}
            </span>
          );
        case "toggle":
          return (
            <div
              className={cn(
                "relative inline-block w-10 h-6 rounded-full bg-gray-300",
                animate && "transition-colors duration-200",
              )}
            >
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200" />
            </div>
          );
        case "checkbox":
          return (
            <div
              className={cn(
                "w-5 h-5 rounded border-2 border-gray-300 bg-white",
                animate && "transition-colors duration-200",
              )}
            />
          );
        default:
          return (
            <span
              className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium border",
                getVariantClasses(false),
                falseClassName,
              )}
            >
              {falseIcon && <span className="mr-2">{falseIcon}</span>}
              {falseText}
            </span>
          );
      }
    } else {
      // null/undefined value
      switch (style) {
        case "icon":
          return (
            nullIcon || (
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )
          );
        case "badge":
          return (
            <span
              className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-300 bg-gray-50 text-gray-500",
                nullClassName,
              )}
            >
              {nullIcon && <span className="mr-1">{nullIcon}</span>}
              {nullText}
            </span>
          );
        case "toggle":
          return (
            <div className="relative inline-block w-10 h-6 rounded-full bg-gray-300">
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow" />
            </div>
          );
        case "checkbox":
          return (
            <div className="w-5 h-5 rounded border-2 border-gray-300 bg-gray-100" />
          );
        default:
          return (
            <span
              className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium border border-gray-300 bg-gray-50 text-gray-500",
                nullClassName,
              )}
            >
              {nullIcon && <span className="mr-2">{nullIcon}</span>}
              {nullText}
            </span>
          );
      }
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
  if (actualValue === undefined && showEmpty) {
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

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {showLabel && getFieldLabel() && (
        <span
          className={cn("text-sm font-medium text-gray-700", labelClassName)}
        >
          {getFieldLabel()}
        </span>
      )}

      <div
        className={cn(
          "inline-flex items-center",
          clickable && !disabled
            ? "cursor-pointer hover:opacity-80 transition-opacity"
            : "",
          disabled ? "opacity-50 cursor-not-allowed" : "",
          valueClassName,
        )}
        onClick={handleClick}
        title={
          showTooltip ? tooltipContent || `Value: ${actualValue}` : undefined
        }
      >
        {getDisplayContent()}
      </div>
    </div>
  );
};

BooleanField.displayName = "BooleanField";
