import React from "react";
import { cn } from "../../utils/cn";

export interface EmailFieldProps {
  /** The email value to display */
  value?: string | null;

  /** The source record containing the field data */
  record?: Record<string, any>;

  /** The source field name in the record */
  source?: string;

  /** Custom CSS classes for the field container */
  className?: string;

  /** Custom CSS classes for the field label */
  labelClassName?: string;

  /** Custom CSS classes for the email value */
  valueClassName?: string;

  /** Whether to show the field label */
  showLabel?: boolean;

  /** Custom label text */
  label?: string;

  /** Display style for the email */
  style?: "text" | "link" | "badge" | "icon" | "button";

  /** Whether to make the email clickable (mailto: link) */
  clickable?: boolean;

  /** Whether to show email validation status */
  showValidation?: boolean;

  /** Whether to validate email format */
  validateEmail?: boolean;

  /** Custom validation error message */
  validationErrorMessage?: string;

  /** Whether to show email metadata (domain, etc.) */
  showMetadata?: boolean;

  /** Whether to truncate long emails */
  truncate?: boolean;

  /** Maximum length before truncation */
  maxLength?: number;

  /** Custom text for truncated emails */
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

  /** Custom icon for the email */
  icon?: React.ReactNode;

  /** Whether to show email preview on hover */
  showPreview?: boolean;

  /** Custom preview content */
  previewContent?: React.ReactNode;

  /** Click handler for the email */
  onClick?: (value: string | null, record: Record<string, any>) => void;

  /** Whether to show a tooltip */
  showTooltip?: boolean;

  /** Custom tooltip content */
  tooltipContent?: string;

  /** Whether to animate email changes */
  animate?: boolean;

  /** Custom CSS classes for valid emails */
  validEmailClassName?: string;

  /** Custom CSS classes for invalid emails */
  invalidEmailClassName?: string;

  /** Whether to show email security indicators */
  showSecurity?: boolean;

  /** Whether to show email accessibility features */
  showAccessibility?: boolean;

  /** Whether to mask sensitive parts of the email */
  maskEmail?: boolean;

  /** Custom mask character */
  maskChar?: string;

  /** Whether to show email verification status */
  showVerificationStatus?: boolean;

  /** Whether the email is verified */
  isVerified?: boolean;
}

export const EmailField: React.FC<EmailFieldProps> = ({
  value,
  record,
  source,
  className,
  labelClassName,
  valueClassName,
  showLabel = true,
  label,
  style = "text",
  clickable = false,
  showValidation = false,
  validateEmail = true,
  validationErrorMessage = "Invalid email format",
  showMetadata = false,
  truncate = false,
  maxLength = 50,
  truncateText = "...",
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  emptyText = "No email",
  showEmpty = true,
  icon,
  showPreview = false,
  previewContent,
  onClick,
  showTooltip = false,
  tooltipContent,
  animate = false,
  validEmailClassName,
  invalidEmailClassName,
  showSecurity = false,
  showAccessibility = false,
  maskEmail = false,
  maskChar = "*",
  showVerificationStatus = false,
  isVerified = false,
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

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    if (!validateEmail) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Get email metadata
  const getEmailMetadata = (email: string) => {
    try {
      const [localPart, domain] = email.split("@");
      return {
        localPart,
        domain,
        isCommonDomain: [
          "gmail.com",
          "yahoo.com",
          "outlook.com",
          "hotmail.com",
        ].includes(domain.toLowerCase()),
        isCorporateDomain: ![
          "gmail.com",
          "yahoo.com",
          "outlook.com",
          "hotmail.com",
        ].includes(domain.toLowerCase()),
        hasSubdomain: domain.includes("."),
      };
    } catch {
      return null;
    }
  };

  // Truncate email if needed
  const truncateEmail = (email: string): string => {
    if (!truncate || email.length <= maxLength) return email;
    return `${email.substring(0, maxLength)}${truncateText}`;
  };

  // Mask email for privacy
  const maskEmailForPrivacy = (email: string): string => {
    if (!maskEmail) return email;
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) return email;

    const maskedLocal =
      localPart.charAt(0) +
      maskChar.repeat(localPart.length - 2) +
      localPart.charAt(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
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

    const isValid = isValidEmail(actualValue);
    const displayEmail = maskEmailForPrivacy(actualValue);
    const truncatedEmail = truncate
      ? truncateEmail(displayEmail)
      : displayEmail;
    const metadata = getEmailMetadata(actualValue);

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
              isValid ? validEmailClassName : invalidEmailClassName,
            )}
            onClick={handleClick}
            disabled={disabled || loading}
            title={showTooltip ? tooltipContent || actualValue : undefined}
          >
            {icon && <span className="mr-2">{icon}</span>}
            {truncatedEmail}
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
              isValid ? validEmailClassName : invalidEmailClassName,
            )}
          >
            {icon && <span className="mr-1">{icon}</span>}
            {truncatedEmail}
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
              isValid ? validEmailClassName : invalidEmailClassName,
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
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>
        );

      case "link":
        return (
          <a
            href={`mailto:${actualValue}`}
            className={cn(
              "text-blue-600 hover:text-blue-800 underline transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded",
              disabled
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : "",
              animate && "animate-in fade-in-0",
              isValid ? validEmailClassName : invalidEmailClassName,
              valueClassName,
            )}
            onClick={handleClick}
            title={showTooltip ? tooltipContent || actualValue : undefined}
          >
            {icon && <span className="mr-2">{icon}</span>}
            {truncatedEmail}
          </a>
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
              isValid ? validEmailClassName : invalidEmailClassName,
              valueClassName,
            )}
            onClick={handleClick}
          >
            {icon && <span className="mr-2">{icon}</span>}
            {truncatedEmail}
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

  // Invalid email state
  if (actualValue && validateEmail && !isValidEmail(actualValue)) {
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
          <span className={cn("text-sm text-red-600", invalidEmailClassName)}>
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

        {/* Email Validation Status */}
        {showValidation && actualValue && (
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ml-2",
              isValidEmail(actualValue)
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800",
            )}
          >
            {isValidEmail(actualValue) ? "Valid" : "Invalid"}
          </span>
        )}

        {/* Verification Status */}
        {showVerificationStatus && actualValue && (
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ml-2",
              isVerified
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800",
            )}
          >
            <svg
              className={cn(
                "w-3 h-3 mr-1",
                isVerified ? "text-green-600" : "text-yellow-600",
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              {isVerified ? (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              )}
            </svg>
            {isVerified ? "Verified" : "Unverified"}
          </span>
        )}

        {/* Security Indicators */}
        {showSecurity &&
          actualValue &&
          getEmailMetadata(actualValue)?.isCorporateDomain && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ml-2 bg-blue-100 text-blue-800">
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
              Corporate
            </span>
          )}

        {/* Email Preview */}
        {showPreview && actualValue && (
          <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 max-w-xs">
            {previewContent || (
              <div>
                <div className="font-medium mb-1">Email Details</div>
                <div className="text-gray-300 break-all">{actualValue}</div>
                {showMetadata && getEmailMetadata(actualValue) && (
                  <div className="mt-2 text-xs text-gray-400">
                    <div>Domain: {getEmailMetadata(actualValue)?.domain}</div>
                    <div>
                      Type:{" "}
                      {getEmailMetadata(actualValue)?.isCorporateDomain
                        ? "Corporate"
                        : "Personal"}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      {/* Additional metadata below email */}
      {showMetadata && actualValue && getEmailMetadata(actualValue) && (
        <div className="text-xs text-gray-500 space-y-1 ml-4">
          <div>Domain: {getEmailMetadata(actualValue)?.domain}</div>
          <div>
            Type:{" "}
            {getEmailMetadata(actualValue)?.isCorporateDomain
              ? "Corporate"
              : "Personal"}
          </div>
          {getEmailMetadata(actualValue)?.hasSubdomain && (
            <div>Subdomain: Yes</div>
          )}
        </div>
      )}
    </div>
  );
};

EmailField.displayName = "EmailField";
