import React from "react";
import { cn } from "../../utils/cn";

export interface ChipFieldProps {
  /** The value to display as a chip */
  value?: string | number | boolean | null;

  /** The source record containing the field data */
  record?: Record<string, any>;

  /** The source field name in the record */
  source?: string;

  /** Custom CSS classes for the chip container */
  className?: string;

  /** Custom CSS classes for the chip label */
  labelClassName?: string;

  /** Custom CSS classes for the chip value */
  valueClassName?: string;

  /** Whether to show the field label */
  showLabel?: boolean;

  /** Custom label text */
  label?: string;

  /** Chip variant/style */
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info";

  /** Chip size */
  size?: "sm" | "md" | "lg";

  /** Whether the chip is outlined */
  outlined?: boolean;

  /** Whether the chip is rounded */
  rounded?: boolean;

  /** Whether the chip is clickable */
  clickable?: boolean;

  /** Click handler for the chip */
  onClick?: (value: any, record: Record<string, any>) => void;

  /** Whether to show a remove button */
  removable?: boolean;

  /** Remove button handler */
  onRemove?: (value: any, record: Record<string, any>) => void;

  /** Custom remove button text */
  removeText?: string;

  /** Custom remove button icon */
  removeIcon?: React.ReactNode;

  /** Maximum number of chips to display */
  maxChips?: number;

  /** Text to show when max chips is exceeded */
  maxChipsText?: string;

  /** Whether to truncate long chip values */
  truncate?: boolean;

  /** Maximum length before truncation */
  maxLength?: number;

  /** Tooltip content for truncated values */
  tooltipContent?: string;

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
}

export const ChipField: React.FC<ChipFieldProps> = ({
  value,
  record,
  source,
  className,
  labelClassName,
  valueClassName,
  showLabel = true,
  label,
  variant = "default",
  size = "md",
  outlined = false,
  rounded = false,
  clickable = false,
  onClick,
  removable = false,
  onRemove,
  removeText = "Remove",
  removeIcon,
  maxChips,
  maxChipsText = "more...",
  truncate = false,
  maxLength = 20,
  tooltipContent,
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  emptyText = "No data",
  showEmpty = true,
}) => {
  // Get the actual value from record if source is provided
  const actualValue = source && record ? record[source] : value;

  // Handle different value types
  const getDisplayValue = (val: any): string => {
    if (val === null || val === undefined) return "";
    if (typeof val === "boolean") return val ? "Yes" : "No";
    if (typeof val === "number") return val.toString();
    if (typeof val === "string") return val;
    if (Array.isArray(val)) return val.join(", ");
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  // Handle array values
  const getChips = (val: any): string[] => {
    if (Array.isArray(val)) {
      return val.map((item) => getDisplayValue(item)).filter(Boolean);
    }
    const displayValue = getDisplayValue(val);
    return displayValue ? [displayValue] : [];
  };

  const chips = getChips(actualValue);
  const displayChips = maxChips ? chips.slice(0, maxChips) : chips;
  const hasMoreChips = maxChips && chips.length > maxChips;

  // Truncate long values
  const truncateValue = (val: string): string => {
    if (!truncate || val.length <= maxLength) return val;
    return `${val.substring(0, maxLength)}...`;
  };

  // Get variant classes
  const getVariantClasses = (): string => {
    switch (variant) {
      case "primary":
        return outlined
          ? "text-blue-600 border border-blue-600 bg-blue-50"
          : "text-white bg-blue-600";
      case "secondary":
        return outlined
          ? "text-gray-600 border border-gray-600 bg-gray-50"
          : "text-white bg-gray-600";
      case "success":
        return outlined
          ? "text-green-600 border border-green-600 bg-green-50"
          : "text-white bg-green-600";
      case "warning":
        return outlined
          ? "text-yellow-600 border border-yellow-600 bg-yellow-50"
          : "text-white bg-yellow-600";
      case "error":
        return outlined
          ? "text-red-600 border border-red-600 bg-red-50"
          : "text-white bg-red-600";
      case "info":
        return outlined
          ? "text-cyan-600 border border-cyan-600 bg-cyan-50"
          : "text-white bg-cyan-600";
      default:
        return outlined
          ? "text-gray-700 border border-gray-300 bg-gray-100"
          : "text-gray-900 bg-gray-200";
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

  // Handle chip click
  const handleChipClick = (chipValue: string) => {
    if (clickable && onClick && !disabled) {
      onClick(chipValue, record || {});
    }
  };

  // Handle chip remove
  const handleChipRemove = (chipValue: string) => {
    if (removable && onRemove && !disabled) {
      onRemove(chipValue, record || {});
    }
  };

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
          <div className="animate-pulse bg-gray-200 rounded-full px-3 py-1.5 text-sm">
            {loadingText}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!chips.length && showEmpty) {
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

      <div className="flex flex-wrap items-center gap-2">
        {displayChips.map((chip, index) => (
          <div
            key={index}
            className={cn(
              "inline-flex items-center font-medium",
              getVariantClasses(),
              getSizeClasses(),
              rounded ? "rounded-full" : "rounded-md",
              clickable && !disabled
                ? "cursor-pointer hover:opacity-80 transition-opacity"
                : "",
              disabled ? "opacity-50 cursor-not-allowed" : "",
              valueClassName,
            )}
            onClick={() => handleChipClick(chip)}
            title={
              tooltipContent ||
              (truncate && chip.length > maxLength ? chip : undefined)
            }
          >
            <span className="truncate">
              {truncate ? truncateValue(chip) : chip}
            </span>

            {removable && !disabled && (
              <button
                type="button"
                className={cn(
                  "ml-2 inline-flex items-center justify-center",
                  "hover:bg-black hover:bg-opacity-10 rounded-full transition-colors",
                  size === "sm"
                    ? "w-4 h-4"
                    : size === "lg"
                      ? "w-6 h-6"
                      : "w-5 h-5",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChipRemove(chip);
                }}
                aria-label={`${removeText} ${chip}`}
                title={`${removeText} ${chip}`}
              >
                {removeIcon || (
                  <svg
                    className="w-full h-full"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
        ))}

        {hasMoreChips && (
          <span className="text-sm text-gray-500 px-2 py-1">
            +{chips.length - maxChips} {maxChipsText}
          </span>
        )}
      </div>
    </div>
  );
};

ChipField.displayName = "ChipField";
