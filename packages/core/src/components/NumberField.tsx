import React from "react";
import { cn } from "../utils/cn";

export interface NumberFieldProps {
  /** The numeric value to display */
  value: number;
  /** Number of decimal places to show */
  decimals?: number;
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
  /** Whether to show copy button */
  showCopyButton?: boolean;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Text color variant */
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "muted";
  /** Text size */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  /** Font weight */
  weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  /** Custom CSS class names */
  className?: string;
  /** Custom CSS styles */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: () => void;
  /** Whether the field is clickable */
  clickable?: boolean;
}

export const NumberField = React.forwardRef<HTMLDivElement, NumberFieldProps>(
  (
    {
      value,
      decimals = 2,
      showThousandsSeparator = true,
      thousandsSeparator = ",",
      decimalSeparator = ".",
      showPlusSign = false,
      showMinusSign = true,
      prefix = "",
      suffix = "",
      currency = false,
      currencyCode,
      currencySymbol = "$",
      percentage = false,
      showPercentageSign = true,
      scientific = false,
      significantDigits = 3,
      compact = false,
      showCopyButton = false,
      align = "right",
      variant = "default",
      size = "md",
      weight = "normal",
      className,
      style,
      onClick,
      clickable = false,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(value.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy number:", err);
      }
    };

    const formatNumber = (): string => {
      if (isNaN(value) || !isFinite(value)) {
        return "Invalid Number";
      }

      let formattedValue = value;

      // Handle scientific notation
      if (scientific) {
        return value.toExponential(significantDigits - 1);
      }

      // Handle compact notation
      if (compact) {
        if (Math.abs(value) >= 1e12) {
          return (value / 1e12).toFixed(1) + "T";
        } else if (Math.abs(value) >= 1e9) {
          return (value / 1e9).toFixed(1) + "B";
        } else if (Math.abs(value) >= 1e6) {
          return (value / 1e6).toFixed(1) + "M";
        } else if (Math.abs(value) >= 1e3) {
          return (value / 1e3).toFixed(1) + "K";
        }
      }

      // Handle percentage
      if (percentage) {
        formattedValue = value * 100;
        if (showPercentageSign) {
          suffix = "%";
        }
      }

      // Handle currency
      if (currency) {
        if (currencyCode) {
          // Use Intl.NumberFormat for proper currency formatting
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currencyCode,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }).format(formattedValue);
        } else {
          prefix = currencySymbol;
        }
      }

      // Format decimal places
      let numStr = Math.abs(formattedValue).toFixed(decimals);

      // Remove trailing zeros if decimals > 0
      if (decimals > 0) {
        numStr = numStr.replace(/\.?0+$/, "");
        if (numStr.includes(".")) {
          numStr = numStr.replace(/\.$/, "");
        }
      }

      // Add thousands separator
      if (showThousandsSeparator) {
        const parts = numStr.split(".");
        parts[0] = parts[0].replace(
          /\B(?=(\d{3})+(?!\d))/g,
          thousandsSeparator,
        );
        numStr = parts.join(decimalSeparator);
      }

      // Add signs
      let result = "";
      if (formattedValue < 0 && showMinusSign) {
        result += "-";
      } else if (formattedValue > 0 && showPlusSign) {
        result += "+";
      }

      // Add prefix, number, and suffix
      result += prefix + numStr + suffix;

      return result;
    };

    const getVariantClasses = () => {
      switch (variant) {
        case "primary":
          return "text-blue-600";
        case "secondary":
          return "text-gray-600";
        case "success":
          return "text-green-600";
        case "warning":
          return "text-yellow-600";
        case "error":
          return "text-red-600";
        case "muted":
          return "text-gray-400";
        default:
          return "text-gray-900";
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case "xs":
          return "text-xs";
        case "sm":
          return "text-sm";
        case "md":
          return "text-base";
        case "lg":
          return "text-lg";
        case "xl":
          return "text-xl";
        case "2xl":
          return "text-2xl";
        case "3xl":
          return "text-3xl";
        default:
          return "text-base";
      }
    };

    const getWeightClasses = () => {
      switch (weight) {
        case "medium":
          return "font-medium";
        case "semibold":
          return "font-semibold";
        case "bold":
          return "font-bold";
        case "extrabold":
          return "font-extrabold";
        default:
          return "font-normal";
      }
    };

    const getAlignClasses = () => {
      switch (align) {
        case "center":
          return "text-center";
        case "right":
          return "text-right";
        default:
          return "text-left";
      }
    };

    const containerClasses = cn(
      "inline-block font-mono",
      getVariantClasses(),
      getSizeClasses(),
      getWeightClasses(),
      getAlignClasses(),
      clickable && "cursor-pointer hover:opacity-80",
      className,
    );

    const formattedNumber = formatNumber();

    return (
      <div className="flex items-center space-x-2">
        <div
          ref={ref}
          className={containerClasses}
          style={style}
          onClick={onClick}
          {...props}
        >
          {formattedNumber}
        </div>
        {showCopyButton && (
          <button
            onClick={handleCopy}
            className={cn(
              "ml-2 p-1 rounded hover:bg-gray-100 transition-colors",
              "text-gray-400 hover:text-gray-600",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
            )}
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            {copied ? (
              <span className="text-green-500">✓</span>
            ) : (
              <span>📋</span>
            )}
          </button>
        )}
      </div>
    );
  },
);

NumberField.displayName = "NumberField";
