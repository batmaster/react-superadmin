import React from "react";
import { cn } from "../../utils/cn";

export interface NumberFieldProps {
  /** The number value to display */
  value?: number | string | null;

  /** The source record containing the field data */
  record?: Record<string, any>;

  /** The source field name in the record */
  source?: string;

  /** Custom CSS classes for the field container */
  className?: string;

  /** Custom CSS classes for the field label */
  labelClassName?: string;

  /** Custom CSS classes for the number value */
  valueClassName?: string;

  /** Whether to show the field label */
  showLabel?: boolean;

  /** Custom label text */
  label?: string;

  /** Display style for the number */
  style?: "text" | "badge" | "icon" | "button" | "currency" | "percentage";

  /** Number format type */
  format?:
    | "default"
    | "currency"
    | "percentage"
    | "scientific"
    | "compact"
    | "custom";

  /** Currency code for currency formatting */
  currency?: string;

  /** Locale for number formatting */
  locale?: string;

  /** Number of decimal places to display */
  decimalPlaces?: number;

  /** Whether to show thousands separators */
  showThousandsSeparator?: boolean;

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

  /** Whether to validate number format */
  validateNumber?: boolean;

  /** Custom validation error message */
  validationErrorMessage?: string;

  /** Whether to show number validation status */
  showValidation?: boolean;

  /** Custom icon for the number */
  icon?: React.ReactNode;

  /** Whether to show number preview on hover */
  showPreview?: boolean;

  /** Custom preview content */
  previewContent?: React.ReactNode;

  /** Click handler for the number */
  onClick?: (
    value: number | string | null,
    record: Record<string, any>,
  ) => void;

  /** Whether the number is clickable */
  clickable?: boolean;

  /** Whether to show a tooltip */
  showTooltip?: boolean;

  /** Custom tooltip content */
  tooltipContent?: string;

  /** Whether to animate number changes */
  animate?: boolean;

  /** Custom CSS classes for valid numbers */
  validNumberClassName?: string;

  /** Custom CSS classes for invalid numbers */
  invalidNumberClassName?: string;

  /** Whether to show number metadata (range, etc.) */
  showMetadata?: boolean;

  /** Whether to show number accessibility features */
  showAccessibility?: boolean;

  /** Whether to show number status indicators */
  showStatus?: boolean;

  /** Whether the number is positive, negative, or zero */
  numberStatus?: "positive" | "negative" | "zero";

  /** Whether to show number range indicators */
  showRange?: boolean;

  /** Minimum number for range validation */
  minValue?: number;

  /** Maximum number for range validation */
  maxValue?: number;

  /** Whether to show number trends (increasing, decreasing) */
  showTrend?: boolean;

  /** Previous value for trend calculation */
  previousValue?: number;

  /** Whether to show number comparison */
  showComparison?: boolean;

  /** Comparison value */
  comparisonValue?: number;

  /** Whether to show number units */
  showUnits?: boolean;

  /** Unit text to display */
  unit?: string;

  /** Whether to show number precision */
  showPrecision?: boolean;

  /** Whether to show number rounding */
  showRounding?: boolean;

  /** Rounding method */
  roundingMethod?: "round" | "floor" | "ceil";
}

export const NumberField: React.FC<NumberFieldProps> = ({
  value,
  record,
  source,
  className,
  labelClassName,
  valueClassName,
  showLabel = true,
  label,
  style = "text",
  format = "default",
  currency = "USD",
  locale = "en-US",
  decimalPlaces,
  showThousandsSeparator = true,
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  emptyText = "No value",
  showEmpty = true,
  validateNumber = true,
  validationErrorMessage = "Invalid number format",
  showValidation = false,
  icon,
  showPreview = false,
  previewContent,
  onClick,
  clickable = false,
  showTooltip = false,
  tooltipContent,
  animate = false,
  validNumberClassName,
  invalidNumberClassName,
  showMetadata = false,
  showStatus = false,
  numberStatus,
  showRange = false,
  minValue,
  maxValue,
  showTrend = false,
  previousValue,
  showComparison = false,
  comparisonValue,
  showUnits = false,
  unit,
  showPrecision = false,
  showRounding = false,
  roundingMethod = "round",
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

  // Parse and validate number
  const parseNumber = (numValue: any): number | null => {
    if (numValue === null || numValue === undefined || numValue === "")
      return null;

    const parsed = typeof numValue === "number" ? numValue : Number(numValue);
    return isNaN(parsed) ? null : parsed;
  };

  // Check if number is valid
  const isValidNumber = (num: number): boolean => {
    return !isNaN(num) && isFinite(num);
  };

  // Format number based on format type
  const formatNumber = (num: number): string => {
    try {
      switch (format) {
        case "currency":
          return new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            minimumFractionDigits: decimalPlaces ?? 2,
            maximumFractionDigits: decimalPlaces ?? 2,
            useGrouping: showThousandsSeparator,
          }).format(num);

        case "percentage": {
          const percentageValue = num * 100;
          return new Intl.NumberFormat(locale, {
            style: "percent",
            minimumFractionDigits: decimalPlaces ?? 0,
            maximumFractionDigits: decimalPlaces ?? 2,
            useGrouping: showThousandsSeparator,
          }).format(percentageValue / 100);
        }

        case "scientific":
          return num.toExponential(decimalPlaces ?? 2);

        case "compact":
          return new Intl.NumberFormat(locale, {
            notation: "compact",
            maximumFractionDigits: decimalPlaces ?? 1,
          }).format(num);

        case "custom":
          return new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimalPlaces ?? 0,
            maximumFractionDigits: decimalPlaces ?? 2,
            useGrouping: showThousandsSeparator,
          }).format(num);

        default:
          return new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimalPlaces ?? 0,
            maximumFractionDigits: decimalPlaces ?? 2,
            useGrouping: showThousandsSeparator,
          }).format(num);
      }
    } catch {
      return num.toString();
    }
  };

  // Get number metadata
  const getNumberMetadata = (num: number) => {
    const isPositive = num > 0;
    const isNegative = num < 0;
    const isZero = num === 0;
    const isInteger = Number.isInteger(num);
    const isEven = isInteger && num % 2 === 0;
    const isOdd = isInteger && num % 2 === 1;

    return {
      isPositive,
      isNegative,
      isZero,
      isInteger,
      isEven,
      isOdd,
      absoluteValue: Math.abs(num),
      sign: Math.sign(num),
      precision: num.toString().split(".")[1]?.length || 0,
    };
  };

  // Get number status
  const getNumberStatus = (num: number): "positive" | "negative" | "zero" => {
    if (num === 0) return "zero";
    return num > 0 ? "positive" : "negative";
  };

  // Check if number is within range
  const isNumberInRange = (num: number): boolean => {
    if (!showRange || (minValue === undefined && maxValue === undefined))
      return true;

    if (minValue !== undefined && num < minValue) return false;
    if (maxValue !== undefined && num > maxValue) return false;

    return true;
  };

  // Get number trend
  const getNumberTrend = (
    current: number,
    previous?: number,
  ): "increasing" | "decreasing" | "stable" | null => {
    if (previous === undefined) return null;

    if (current > previous) return "increasing";
    if (current < previous) return "decreasing";
    return "stable";
  };

  // Get number comparison
  const getNumberComparison = (current: number, comparison?: number) => {
    if (comparison === undefined) return null;

    const difference = current - comparison;
    const percentageChange =
      comparison !== 0 ? (difference / Math.abs(comparison)) * 100 : 0;

    return {
      difference,
      percentageChange,
      isIncrease: difference > 0,
      isDecrease: difference < 0,
      isSame: difference === 0,
    };
  };

  // Round number
  const roundNumber = (num: number): number => {
    switch (roundingMethod) {
      case "floor":
        return Math.floor(num);
      case "ceil":
        return Math.ceil(num);
      default:
        return Math.round(num);
    }
  };

  // Handle click
  const handleClick = () => {
    if (clickable && onClick && !disabled && !loading && actualValue !== null) {
      onClick(actualValue, record || {});
    }
  };

  // Get display content based on style
  const getDisplayContent = () => {
    if (actualValue === null || actualValue === undefined) return null;

    const num = parseNumber(actualValue);
    if (num === null || !isValidNumber(num)) return null;

    const displayNumber = formatNumber(num);
    const inRange = isNumberInRange(num);

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
              inRange ? validNumberClassName : invalidNumberClassName,
            )}
            onClick={handleClick}
            disabled={disabled || loading}
            title={showTooltip ? tooltipContent || displayNumber : undefined}
          >
            {icon && <span className="mr-2">{icon}</span>}
            {displayNumber}
            {showUnits && unit && <span className="ml-1">{unit}</span>}
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
              inRange ? validNumberClassName : invalidNumberClassName,
            )}
          >
            {icon && <span className="mr-1">{icon}</span>}
            {displayNumber}
            {showUnits && unit && <span className="ml-1">{unit}</span>}
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
              inRange ? validNumberClassName : invalidNumberClassName,
            )}
            onClick={handleClick}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
            role="button"
            tabIndex={0}
            title={displayNumber}
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
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            )}
          </div>
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
              inRange ? validNumberClassName : invalidNumberClassName,
              valueClassName,
            )}
            onClick={handleClick}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
          >
            {icon && <span className="mr-2">{icon}</span>}
            {displayNumber}
            {showUnits && unit && (
              <span className="ml-1 text-gray-500">{unit}</span>
            )}
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
  if (actualValue === null || actualValue === undefined || actualValue === "") {
    if (showEmpty) {
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
          <span className="text-sm text-gray-500">{emptyText}</span>
        </div>
      );
    }
    return null;
  }

  // Invalid number state
  if (validateNumber) {
    const num = parseNumber(actualValue);
    if (num === null || !isValidNumber(num)) {
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
            <span
              className={cn("text-sm text-red-600", invalidNumberClassName)}
            >
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

  const num = parseNumber(actualValue);
  if (num === null) return null;

  const metadata = getNumberMetadata(num);
  const status = numberStatus || getNumberStatus(num);
  const inRange = isNumberInRange(num);
  const trend = showTrend ? getNumberTrend(num, previousValue) : null;
  const comparison = showComparison
    ? getNumberComparison(num, comparisonValue)
    : null;

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

        {/* Number Status */}
        {showStatus && (
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ml-2",
              status === "positive"
                ? "bg-green-100 text-green-800"
                : status === "negative"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800",
            )}
          >
            {status === "positive"
              ? "Positive"
              : status === "negative"
                ? "Negative"
                : "Zero"}
          </span>
        )}

        {/* Range Status */}
        {showRange && !inRange && (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ml-2 bg-red-100 text-red-800">
            Out of Range
          </span>
        )}

        {/* Trend Indicator */}
        {trend && (
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ml-2",
              trend === "increasing"
                ? "bg-green-100 text-green-800"
                : trend === "decreasing"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800",
            )}
          >
            {trend === "increasing"
              ? "↗"
              : trend === "decreasing"
                ? "↘"
                : "→"}
            {trend === "increasing"
              ? "Increasing"
              : trend === "decreasing"
                ? "Decreasing"
                : "Stable"}
          </span>
        )}

        {/* Comparison Indicator */}
        {comparison && (
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ml-2",
              comparison.isIncrease
                ? "bg-green-100 text-green-800"
                : comparison.isDecrease
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800",
            )}
          >
            {comparison.isIncrease ? "+" : comparison.isDecrease ? "-" : "="}
            {Math.abs(comparison.percentageChange).toFixed(1)}%
          </span>
        )}

        {/* Number Preview */}
        {showPreview && (
          <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 max-w-xs">
            {previewContent || (
              <div>
                <div className="font-medium mb-1">Number Details</div>
                <div className="text-gray-300 space-y-1">
                  <div>Value: {formatNumber(num)}</div>
                  <div>Type: {metadata.isInteger ? "Integer" : "Decimal"}</div>
                  {metadata.isEven && (
                    <div className="text-blue-400">Even Number</div>
                  )}
                  {metadata.isOdd && (
                    <div className="text-purple-400">Odd Number</div>
                  )}
                  {showPrecision && (
                    <div>Precision: {metadata.precision} decimal places</div>
                  )}
                  {showUnits && unit && <div>Unit: {unit}</div>}
                </div>
              </div>
            )}
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      {/* Additional metadata below number */}
      {showMetadata && (
        <div className="text-xs text-gray-500 space-y-1 ml-4">
          <div>Type: {metadata.isInteger ? "Integer" : "Decimal"}</div>
          {metadata.isEven && <div className="text-blue-600">Even</div>}
          {metadata.isOdd && <div className="text-purple-600">Odd</div>}
          {showPrecision && <div>Precision: {metadata.precision} places</div>}
          {showUnits && unit && <div>Unit: {unit}</div>}
          {showRange && (minValue !== undefined || maxValue !== undefined) && (
            <div>
              Range: {minValue !== undefined ? minValue : "-∞"} to{" "}
              {maxValue !== undefined ? maxValue : "∞"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

NumberField.displayName = "NumberField";
