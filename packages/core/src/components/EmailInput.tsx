import React, { forwardRef, useState } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { cn } from "../utils/cn";

export interface EmailInputProps
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
  /** Whether to show email validation */
  showValidation?: boolean;
  /** Whether to allow multiple emails (comma-separated) */
  allowMultiple?: boolean;
  /** Custom email validation function */
  validateEmail?: (email: string) => boolean | string;
  /** Whether to show email suggestions */
  showSuggestions?: boolean;
  /** Common email domains for suggestions */
  commonDomains?: string[];
  /** Whether to show email format hint */
  showFormatHint?: boolean;
  /** Whether to auto-complete email domains */
  autoCompleteDomains?: boolean;
  /** Whether to show email strength indicator */
  showStrengthIndicator?: boolean;
  /** Whether to allow international email addresses */
  allowInternational?: boolean;
  /** Whether to show email preview */
  showPreview?: boolean;
  /** Whether to show email verification status */
  showVerificationStatus?: boolean;
  /** Whether the email is verified */
  isVerified?: boolean;
  /** Whether to show resend verification button */
  showResendVerification?: boolean;
  /** Callback for resending verification */
  onResendVerification?: () => void;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
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
      allowMultiple = false,
      validateEmail,
      showSuggestions = false,
      commonDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"],
      showFormatHint = false,
      autoCompleteDomains = false,
      showStrengthIndicator = false,
      allowInternational = true,
      showPreview = false,
      showVerificationStatus = false,
      isVerified = false,
      showResendVerification = false,
      onResendVerification,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const { theme } = useSuperAdmin();
    const [focused, setFocused] = useState(false);
    const [showDomainSuggestions, setShowDomainSuggestions] = useState(false);
    const [suggestedDomains, setSuggestedDomains] = useState<string[]>([]);
    const [emailStrength, setEmailStrength] = useState<
      "weak" | "medium" | "strong"
    >("weak");

    // Default email validation
    const defaultValidateEmail = (email: string): boolean | string => {
      if (!email) return "Email is required";

      const emailRegex = allowInternational
        ? /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(email)) {
        return "Please enter a valid email address";
      }

      if (allowMultiple && email.includes(",")) {
        const emails = email.split(",").map((e) => e.trim());
        for (const singleEmail of emails) {
          if (!emailRegex.test(singleEmail)) {
            return "One or more email addresses are invalid";
          }
        }
      }

      return true;
    };

    const validateEmailFn = validateEmail || defaultValidateEmail;
    const validationResult =
      showValidation && value ? validateEmailFn(value as string) : true;
    const hasError =
      error ||
      (typeof validationResult === "string" && validationResult !== "true");

    // Email strength calculation
    const calculateEmailStrength = (
      email: string,
    ): "weak" | "medium" | "strong" => {
      if (!email) return "weak";

      let score = 0;

      // Length score
      if (email.length > 8) score += 1;
      if (email.length > 15) score += 1;

      // Complexity score
      if (/[A-Z]/.test(email)) score += 1;
      if (/[0-9]/.test(email)) score += 1;
      if (/[^A-Za-z0-9@.]/.test(email)) score += 1;

      // Domain score
      if (email.includes("@")) {
        const domain = email.split("@")[1];
        if (domain && domain.length > 3) score += 1;
        if (domain && domain.includes(".")) score += 1;
      }

      if (score <= 2) return "weak";
      if (score <= 4) return "medium";
      return "strong";
    };

    // Domain suggestions
    const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const email = e.target.value;

      if (autoCompleteDomains && email.includes("@") && !email.endsWith("@")) {
        const [localPart, domainPart] = email.split("@");
        if (domainPart && domainPart.length > 0) {
          const suggestions = commonDomains.filter((domain) =>
            domain.startsWith(domainPart.toLowerCase()),
          );
          setSuggestedDomains(suggestions);
          setShowDomainSuggestions(suggestions.length > 0);
        } else {
          setShowDomainSuggestions(false);
        }
      }

      if (showStrengthIndicator) {
        setEmailStrength(calculateEmailStrength(email));
      }

      if (onChange) {
        onChange(e);
      }
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setShowDomainSuggestions(false);
      if (onBlur) {
        onBlur(e);
      }
    };

    const handleInputFocus = () => {
      setFocused(true);
    };

    const handleDomainSuggestionClick = (domain: string) => {
      const currentValue = (value as string) || "";
      const [localPart] = currentValue.split("@");
      const newValue = `${localPart}@${domain}`;

      if (onChange) {
        const syntheticEvent = {
          target: { value: newValue },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }

      setShowDomainSuggestions(false);
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

    const getStrengthColor = () => {
      switch (emailStrength) {
        case "weak":
          return "bg-red-500";
        case "medium":
          return "bg-yellow-500";
        case "strong":
          return "bg-green-500";
        default:
          return "bg-gray-300";
      }
    };

    const getStrengthText = () => {
      switch (emailStrength) {
        case "weak":
          return "Weak";
        case "medium":
          return "Medium";
        case "strong":
          return "Strong";
        default:
          return "";
      }
    };

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
            type="email"
            value={value}
            onChange={handleEmailInput}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            className={cn(
              "block w-full border border-gray-300 rounded-md shadow-sm",
              "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
              "transition-colors duration-200",
              getSizeClasses(),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              hasError &&
                "border-red-300 focus:ring-red-500 focus:border-red-500",
              focused && "border-blue-500",
              fullWidth && "w-full",
              className,
            )}
            placeholder={props.placeholder || "Enter email address"}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <div className={getIconSizeClasses()}>{rightIcon}</div>
            </div>
          )}

          {/* Domain suggestions */}
          {showDomainSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {suggestedDomains.map((domain, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDomainSuggestionClick(domain)}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                >
                  {domain}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Email strength indicator */}
        {showStrengthIndicator && value && (
          <div className="flex items-center space-x-2 mt-1">
            <div
              className={cn("w-2 h-2 rounded-full", getStrengthColor())}
            ></div>
            <span className="text-xs text-gray-600">{getStrengthText()}</span>
          </div>
        )}

        {/* Email format hint */}
        {showFormatHint && (
          <div className="text-xs text-gray-500 mt-1">
            Format: user@domain.com
            {allowMultiple && " (multiple emails separated by commas)"}
          </div>
        )}

        {/* Email preview */}
        {showPreview && value && (
          <div className="text-xs text-gray-600 mt-1">Preview: {value}</div>
        )}

        {/* Verification status */}
        {showVerificationStatus && (
          <div className="flex items-center space-x-2 mt-1">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isVerified ? "bg-green-500" : "bg-yellow-500",
              )}
            ></div>
            <span className="text-xs text-gray-600">
              {isVerified ? "Verified" : "Not verified"}
            </span>
            {showResendVerification && !isVerified && (
              <button
                type="button"
                onClick={onResendVerification}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Resend verification
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

EmailInput.displayName = "EmailInput";
