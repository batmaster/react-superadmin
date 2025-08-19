import React from "react";
import { cn } from "../utils/cn";

export interface TextFieldProps {
  /** The text content to display */
  children?: React.ReactNode;
  /** The text value (alternative to children) */
  value?: string;
  /** Whether to truncate long text */
  truncate?: boolean;
  /** Maximum length before truncation */
  maxLength?: number;
  /** Truncation indicator */
  truncateIndicator?: string;
  /** Text alignment */
  align?: "left" | "center" | "right" | "justify";
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
  /** Whether to make text selectable */
  selectable?: boolean;
  /** Whether to show copy button */
  showCopyButton?: boolean;
  /** Custom CSS class names */
  className?: string;
  /** Custom CSS styles */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: () => void;
  /** Whether the text is clickable */
  clickable?: boolean;
  /** Whether to show ellipsis for overflow */
  ellipsis?: boolean;
  /** Number of lines to show before truncating */
  lines?: number;
}

export const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(
  (
    {
      children,
      value,
      truncate = false,
      maxLength,
      truncateIndicator = "...",
      align = "left",
      variant = "default",
      size = "md",
      weight = "normal",
      selectable = true,
      showCopyButton = false,
      className,
      style,
      onClick,
      clickable = false,
      ellipsis = false,
      lines,
      ...props
    },
    ref,
  ) => {
    const textContent = value || children;
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
      if (typeof textContent === "string") {
        try {
          await navigator.clipboard.writeText(textContent);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy text:", err);
        }
      }
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
        case "justify":
          return "text-justify";
        default:
          return "text-left";
      }
    };

    const renderText = () => {
      if (!textContent) return null;

      if (typeof textContent === "string") {
        if (truncate && maxLength && textContent.length > maxLength) {
          return textContent.substring(0, maxLength) + truncateIndicator;
        }
        return textContent;
      }

      return textContent;
    };

    const containerClasses = cn(
      "inline-block",
      getVariantClasses(),
      getSizeClasses(),
      getWeightClasses(),
      getAlignClasses(),
      clickable && "cursor-pointer hover:opacity-80",
      !selectable && "select-none",
      ellipsis && "truncate",
      lines === 1 && "line-clamp-1",
      lines === 2 && "line-clamp-2",
      lines === 3 && "line-clamp-3",
      lines === 4 && "line-clamp-4",
      lines === 5 && "line-clamp-5",
      lines === 6 && "line-clamp-6",
      className,
    );

    return (
      <div className="flex items-center space-x-2">
        <div
          ref={ref}
          className={containerClasses}
          style={style}
          onClick={onClick}
          {...props}
        >
          {renderText()}
        </div>
        {showCopyButton && typeof textContent === "string" && (
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

TextField.displayName = "TextField";
