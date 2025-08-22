import React from "react";
import { cn } from "../../utils/cn";

export interface UrlFieldProps {
  /** The URL value to display */
  value?: string | null;

  /** The source record containing the field data */
  record?: Record<string, any>;

  /** The source field name in the record */
  source?: string;

  /** Custom CSS classes for the field container */
  className?: string;

  /** Custom CSS classes for the field label */
  labelClassName?: string;

  /** Custom CSS classes for the URL link */
  linkClassName?: string;

  /** Whether to show the field label */
  showLabel?: boolean;

  /** Custom label text */
  label?: string;

  /** Display style for the URL */
  style?: "link" | "text" | "button" | "badge" | "icon";

  /** Whether to open links in a new tab */
  openInNewTab?: boolean;

  /** Whether to show URL protocol (http://, https://) */
  showProtocol?: boolean;

  /** Whether to truncate long URLs */
  truncate?: boolean;

  /** Maximum length before truncation */
  maxLength?: number;

  /** Custom text for truncated URLs */
  truncateText?: string;

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

  /** Whether to validate URL format */
  validateUrl?: boolean;

  /** Custom validation error message */
  validationErrorMessage?: string;

  /** Whether to show URL status (valid/invalid) */
  showStatus?: boolean;

  /** Custom icon for the URL */
  icon?: React.ReactNode;

  /** Whether to show URL preview on hover */
  showPreview?: boolean;

  /** Custom preview content */
  previewContent?: React.ReactNode;

  /** Click handler for the URL */
  onClick?: (value: string | null, record: Record<string, any>) => void;

  /** Whether the URL is clickable */
  clickable?: boolean;

  /** Whether to show a tooltip */
  showTooltip?: boolean;

  /** Custom tooltip content */
  tooltipContent?: string;

  /** Whether to animate URL changes */
  animate?: boolean;

  /** Custom CSS classes for valid URLs */
  validUrlClassName?: string;

  /** Custom CSS classes for invalid URLs */
  invalidUrlClassName?: string;

  /** Whether to show URL metadata (domain, path, etc.) */
  showMetadata?: boolean;

  /** Whether to show URL security status (HTTPS indicator) */
  showSecurityStatus?: boolean;

  /** Whether to show URL accessibility features */
  showAccessibility?: boolean;
}

export const UrlField: React.FC<UrlFieldProps> = ({
  value,
  record,
  source,
  className,
  labelClassName,
  linkClassName,
  showLabel = true,
  label,
  style = "link",
  openInNewTab = true,
  showProtocol = false,
  truncate = false,
  maxLength = 50,
  truncateText = "...",
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  emptyText = "No URL",
  showEmpty = true,
  validateUrl = true,
  validationErrorMessage = "Invalid URL format",
  showStatus = false,
  icon,
  showPreview = false,
  previewContent,
  onClick,
  clickable = false,
  showTooltip = false,
  tooltipContent,
  animate = false,
  validUrlClassName,
  invalidUrlClassName,
  showMetadata = false,
  showSecurityStatus = false,
  showAccessibility = false,
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

  // Validate URL format
  const isValidUrl = (url: string): boolean => {
    if (!validateUrl) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Get URL metadata
  const getUrlMetadata = (url: string) => {
    try {
      const urlObj = new URL(url);
      return {
        protocol: urlObj.protocol,
        domain: urlObj.hostname,
        path: urlObj.pathname,
        isSecure: urlObj.protocol === "https:",
        port: urlObj.port,
        search: urlObj.search,
        hash: urlObj.hash,
      };
    } catch {
      return null;
    }
  };

  // Truncate URL if needed
  const truncateUrl = (url: string): string => {
    if (!truncate || url.length <= maxLength) return url;
    return `${url.substring(0, maxLength)}${truncateText}`;
  };

  // Format URL for display
  const formatUrl = (url: string): string => {
    if (showProtocol) return url;
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname + urlObj.search + urlObj.hash;
    } catch {
      return url;
    }
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

    const isValid = isValidUrl(actualValue);
    const displayUrl = formatUrl(actualValue);
    const truncatedUrl = truncate ? truncateUrl(displayUrl) : displayUrl;
    const metadata = getUrlMetadata(actualValue);

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
              isValid ? validUrlClassName : invalidUrlClassName,
            )}
            onClick={handleClick}
            disabled={disabled || loading}
            title={showTooltip ? tooltipContent || actualValue : undefined}
          >
            {icon && <span className="mr-2">{icon}</span>}
            {truncatedUrl}
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
              isValid ? validUrlClassName : invalidUrlClassName,
            )}
          >
            {icon && <span className="mr-1">{icon}</span>}
            {truncatedUrl}
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
              isValid ? validUrlClassName : invalidUrlClassName,
            )}
            onClick={handleClick}
            title={actualValue}
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            )}
          </div>
        );

      case "text":
        return (
          <span
            className={cn(
              "text-gray-900 hover:text-blue-600 transition-colors duration-200",
              clickable && !disabled ? "cursor-pointer" : "",
              disabled ? "opacity-50 cursor-not-allowed" : "",
              animate && "animate-in fade-in-0",
              isValid ? validUrlClassName : invalidUrlClassName,
            )}
            onClick={handleClick}
          >
            {truncatedUrl}
          </span>
        );

      default: // 'link'
        return (
          <a
            href={actualValue}
            target={openInNewTab ? "_blank" : undefined}
            rel={openInNewTab ? "noopener noreferrer" : undefined}
            className={cn(
              "text-blue-600 hover:text-blue-800 underline transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded",
              disabled
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : "",
              animate && "animate-in fade-in-0",
              isValid ? validUrlClassName : invalidUrlClassName,
              linkClassName,
            )}
            onClick={handleClick}
            title={showTooltip ? tooltipContent || actualValue : undefined}
          >
            {icon && <span className="mr-2">{icon}</span>}
            {truncatedUrl}
          </a>
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

  // Invalid URL state
  if (actualValue && validateUrl && !isValidUrl(actualValue)) {
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
          <span className={cn("text-sm text-red-600", invalidUrlClassName)}>
            {validationErrorMessage}
          </span>
          {showStatus && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
              Invalid
            </span>
          )}
        </div>
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

      <div className="relative group">
        {getDisplayContent()}

        {/* URL Status */}
        {showStatus && actualValue && (
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ml-2",
              isValidUrl(actualValue)
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800",
            )}
          >
            {isValidUrl(actualValue) ? "Valid" : "Invalid"}
          </span>
        )}

        {/* Security Status */}
        {showSecurityStatus &&
          actualValue &&
          getUrlMetadata(actualValue)?.isSecure && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ml-2 bg-green-100 text-green-800">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Secure
            </span>
          )}

        {/* URL Preview */}
        {showPreview && actualValue && (
          <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 max-w-xs">
            {previewContent || (
              <div>
                <div className="font-medium mb-1">URL Preview</div>
                <div className="text-gray-300 break-all">{actualValue}</div>
                {showMetadata && getUrlMetadata(actualValue) && (
                  <div className="mt-2 text-xs text-gray-400">
                    <div>Domain: {getUrlMetadata(actualValue)?.domain}</div>
                    <div>Protocol: {getUrlMetadata(actualValue)?.protocol}</div>
                  </div>
                )}
              </div>
            )}
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      {/* Additional metadata below URL */}
      {showMetadata && actualValue && getUrlMetadata(actualValue) && (
        <div className="text-xs text-gray-500 space-y-1 ml-4">
          <div>Domain: {getUrlMetadata(actualValue)?.domain}</div>
          {getUrlMetadata(actualValue)?.path && (
            <div>Path: {getUrlMetadata(actualValue)?.path}</div>
          )}
          {getUrlMetadata(actualValue)?.isSecure && (
            <div className="text-green-600">HTTPS Secure</div>
          )}
        </div>
      )}
    </div>
  );
};

UrlField.displayName = "UrlField";
