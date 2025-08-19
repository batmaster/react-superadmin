import React, { forwardRef, useState } from "react";
import { cn } from "../utils/cn";

export interface UrlInputProps
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
  /** Whether to show URL validation */
  showValidation?: boolean;
  /** Whether to allow relative URLs */
  allowRelative?: boolean;
  /** Whether to allow data URLs */
  allowDataUrls?: boolean;
  /** Whether to allow file URLs */
  allowFileUrls?: boolean;
  /** Whether to allow mailto URLs */
  allowMailtoUrls?: boolean;
  /** Whether to allow tel URLs */
  allowTelUrls?: boolean;
  /** Whether to show URL preview */
  showPreview?: boolean;
  /** Whether to show URL breakdown */
  showBreakdown?: boolean;
  /** Whether to show protocol suggestions */
  showProtocolSuggestions?: boolean;
  /** Whether to auto-prepend protocol */
  autoPrependProtocol?: boolean;
  /** Default protocol to use */
  defaultProtocol?: string;
  /** Whether to show URL statistics */
  showStatistics?: boolean;
  /** Whether to show URL suggestions */
  showSuggestions?: boolean;
  /** Suggested URL values */
  suggestions?: string[];
  /** Custom URL validation function */
  validateUrl?: (url: string) => boolean | string;
  /** Whether to show URL format hint */
  showFormatHint?: boolean;
  /** Whether to show URL shortening */
  showUrlShortening?: boolean;
  /** Whether to show QR code generation */
  showQrCode?: boolean;
  /** Whether to show social media preview */
  showSocialPreview?: boolean;
  /** Whether to show URL history */
  showHistory?: boolean;
  /** Whether to show URL bookmarking */
  showBookmarking?: boolean;
  /** Whether to show URL sharing */
  showSharing?: boolean;
}

export const UrlInput = forwardRef<HTMLInputElement, UrlInputProps>(
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
      showValidation = true,
      allowRelative = true,
      allowDataUrls = false,
      allowFileUrls = false,
      allowMailtoUrls = false,
      allowTelUrls = false,
      showPreview = false,
      showBreakdown = false,
      showProtocolSuggestions = false,
      autoPrependProtocol = false,
      defaultProtocol = "https://",
      showStatistics = false,
      showSuggestions = false,
      suggestions = [],
      validateUrl,
      showFormatHint = false,
      showUrlShortening = false,
      showQrCode = false,
      showSocialPreview = false,
      showHistory = false,
      showBookmarking = false,
      showSharing = false,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const [showProtocolSuggestionsList, setShowProtocolSuggestionsList] =
      useState(false);

    // Default URL validation
    const defaultValidateUrl = (url: string): boolean | string => {
      if (!url) return "URL is required";

      try {
        // Handle relative URLs
        if (allowRelative && url.startsWith("/")) {
          return true;
        }

        // Handle data URLs
        if (allowDataUrls && url.startsWith("data:")) {
          return true;
        }

        // Handle file URLs
        if (allowFileUrls && url.startsWith("file:")) {
          return true;
        }

        // Handle mailto URLs
        if (allowMailtoUrls && url.startsWith("mailto:")) {
          return true;
        }

        // Handle tel URLs
        if (allowTelUrls && url.startsWith("tel:")) {
          return true;
        }

        // Validate standard URLs
        new URL(url);
        return true;
      } catch {
        return "Please enter a valid URL";
      }
    };

    const validateUrlFn = validateUrl || defaultValidateUrl;
    const validationResult =
      value && showValidation ? validateUrlFn(value as string) : true;
    const hasError =
      error ||
      (typeof validationResult === "string" && validationResult !== "true");

    // URL breakdown
    const getUrlBreakdown = (url: string) => {
      try {
        const urlObj = new URL(url);
        return {
          protocol: urlObj.protocol,
          hostname: urlObj.hostname,
          port: urlObj.port,
          pathname: urlObj.pathname,
          search: urlObj.search,
          hash: urlObj.hash,
        };
      } catch {
        return null;
      }
    };

    // URL statistics
    const getUrlStatistics = (url: string) => {
      if (!url) return null;

      return {
        length: url.length,
        hasProtocol: /^[a-zA-Z]+:/.test(url),
        hasSubdomain: /^https?:\/\/[^.]+\./.test(url),
        hasPath: /\//.test(url.replace(/^https?:\/\/[^/]+/, "")),
        hasQuery: /\?/.test(url),
        hasHash: /#/.test(url),
      };
    };

    // Protocol suggestions
    const getProtocolSuggestions = () => {
      const suggestions = ["https://", "http://"];

      if (allowMailtoUrls) suggestions.push("mailto:");
      if (allowTelUrls) suggestions.push("tel:");
      if (allowFileUrls) suggestions.push("file:");
      if (allowDataUrls) suggestions.push("data:");

      return suggestions;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;

      // Auto-prepend protocol if enabled
      if (autoPrependProtocol && newValue && !/^[a-zA-Z]+:/.test(newValue)) {
        if (newValue.startsWith("//")) {
          newValue = "https:" + newValue;
        } else if (!newValue.startsWith("/")) {
          newValue = defaultProtocol + newValue;
        }
      }

      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: newValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setShowProtocolSuggestionsList(false);
      if (onBlur) {
        onBlur(e);
      }
    };

    const handleInputFocus = () => {
      setFocused(true);
    };

    const handleProtocolSuggestionClick = (protocol: string) => {
      const currentValue = (value as string) || "";
      let newValue = currentValue;

      // Remove existing protocol if present
      if (/^[a-zA-Z]+:/.test(currentValue)) {
        newValue = currentValue.replace(/^[a-zA-Z]+:\/\/?/, "");
      }

      // Add new protocol
      newValue = protocol + newValue;

      if (onChange) {
        const syntheticEvent = {
          target: { value: newValue },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }

      setShowProtocolSuggestionsList(false);
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

    const urlBreakdown = value ? getUrlBreakdown(value as string) : null;
    const urlStatistics = value ? getUrlStatistics(value as string) : null;

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
            type="url"
            value={value}
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
              (rightIcon || showProtocolSuggestions) && "pr-24",
              hasError &&
                "border-red-300 focus:ring-red-500 focus:border-red-500",
              focused && "border-blue-500",
              fullWidth && "w-full",
              className,
            )}
            placeholder={props.placeholder || "Enter URL"}
            {...props}
          />

          {/* Right side controls */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {showProtocolSuggestions && (
              <button
                type="button"
                onClick={() =>
                  setShowProtocolSuggestionsList(!showProtocolSuggestionsList)
                }
                className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                title="Protocol suggestions"
              >
                🔗
              </button>
            )}

            {rightIcon && (
              <div className="text-gray-400">
                <div className={getIconSizeClasses()}>{rightIcon}</div>
              </div>
            )}
          </div>

          {/* Protocol suggestions dropdown */}
          {showProtocolSuggestionsList && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {getProtocolSuggestions().map((protocol, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleProtocolSuggestionClick(protocol)}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                >
                  {protocol}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* URL format hint */}
        {showFormatHint && (
          <div className="text-xs text-gray-500 mt-1">
            Format: https://example.com or /relative-path
            {allowMailtoUrls && " or mailto:email@example.com"}
            {allowTelUrls && " or tel:+1234567890"}
          </div>
        )}

        {/* URL preview */}
        {showPreview && value && (
          <div className="text-xs text-gray-600 mt-1">Preview: {value}</div>
        )}

        {/* URL breakdown */}
        {showBreakdown && urlBreakdown && (
          <div className="mt-2 space-y-1">
            <div className="text-xs font-medium text-gray-700">
              URL Breakdown:
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Protocol: {urlBreakdown.protocol}</div>
              <div>Hostname: {urlBreakdown.hostname}</div>
              {urlBreakdown.port && <div>Port: {urlBreakdown.port}</div>}
              {urlBreakdown.pathname && (
                <div>Path: {urlBreakdown.pathname}</div>
              )}
              {urlBreakdown.search && <div>Query: {urlBreakdown.search}</div>}
              {urlBreakdown.hash && <div>Hash: {urlBreakdown.hash}</div>}
            </div>
          </div>
        )}

        {/* URL statistics */}
        {showStatistics && urlStatistics && (
          <div className="mt-2 space-y-1">
            <div className="text-xs font-medium text-gray-700">Statistics:</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Length: {urlStatistics.length} characters</div>
              <div>
                Has Protocol: {urlStatistics.hasProtocol ? "Yes" : "No"}
              </div>
              <div>
                Has Subdomain: {urlStatistics.hasSubdomain ? "Yes" : "No"}
              </div>
              <div>Has Path: {urlStatistics.hasPath ? "Yes" : "No"}</div>
              <div>Has Query: {urlStatistics.hasQuery ? "Yes" : "No"}</div>
              <div>Has Hash: {urlStatistics.hasHash ? "Yes" : "No"}</div>
            </div>
          </div>
        )}

        {/* URL suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="mt-2">
            <div className="text-xs font-medium text-gray-700 mb-1">
              Suggestions:
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    if (onChange) {
                      const syntheticEvent = {
                        target: { value: suggestion },
                      } as React.ChangeEvent<HTMLInputElement>;
                      onChange(syntheticEvent);
                    }
                  }}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Additional features placeholders */}
        {(showUrlShortening ||
          showQrCode ||
          showSocialPreview ||
          showHistory ||
          showBookmarking ||
          showSharing) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {showUrlShortening && (
              <button
                type="button"
                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
              >
                🔗 Shorten URL
              </button>
            )}

            {showQrCode && (
              <button
                type="button"
                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
              >
                📱 Generate QR
              </button>
            )}

            {showSocialPreview && (
              <button
                type="button"
                className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200"
              >
                📱 Social Preview
              </button>
            )}

            {showHistory && (
              <button
                type="button"
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
              >
                📚 History
              </button>
            )}

            {showBookmarking && (
              <button
                type="button"
                className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200"
              >
                🔖 Bookmark
              </button>
            )}

            {showSharing && (
              <button
                type="button"
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
              >
                📤 Share
              </button>
            )}
          </div>
        )}

        {/* Validation error or helper text */}
        {(hasError || helperText) && (
          <div
            className={cn(
              "text-sm",
              hasError ? "text-red-600" : "text-gray-500",
            )}
          >
            {hasError || helperText}
          </div>
        )}
      </div>
    );
  },
);

UrlInput.displayName = "UrlInput";
