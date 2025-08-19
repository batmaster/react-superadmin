import React, { forwardRef, useState } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { cn } from "../utils/cn";

export interface PasswordInputProps
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
  /** Whether to show password strength indicator */
  showStrengthIndicator?: boolean;
  /** Whether to show password requirements */
  showRequirements?: boolean;
  /** Custom password requirements */
  requirements?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
    customRules?: Array<{
      test: (password: string) => boolean;
      message: string;
    }>;
  };
  /** Whether to show toggle password visibility button */
  showToggleVisibility?: boolean;
  /** Whether to show generate password button */
  showGeneratePassword?: boolean;
  /** Whether to show confirm password field */
  showConfirmPassword?: boolean;
  /** Whether to show password history */
  showPasswordHistory?: boolean;
  /** Whether to allow password reuse */
  allowPasswordReuse?: boolean;
  /** Whether to show password expiration warning */
  showExpirationWarning?: boolean;
  /** Password expiration date */
  expirationDate?: Date;
  /** Whether to show password hints */
  showPasswordHints?: boolean;
  /** Custom password validation function */
  validatePassword?: (password: string) => boolean | string;
  /** Whether to show password score */
  showPasswordScore?: boolean;
  /** Whether to enforce password policy */
  enforcePolicy?: boolean;
  /** Whether to show password meter */
  showPasswordMeter?: boolean;
  /** Whether to show password suggestions */
  showPasswordSuggestions?: boolean;
  /** Whether to show password complexity breakdown */
  showComplexityBreakdown?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
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
      showStrengthIndicator = true,
      showRequirements = false,
      requirements = {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
      },
      showToggleVisibility = true,
      showGeneratePassword = false,
      showConfirmPassword = false,
      showPasswordHistory = false,
      allowPasswordReuse = true,
      showExpirationWarning = false,
      expirationDate,
      showPasswordHints = false,
      validatePassword,
      showPasswordScore = false,
      enforcePolicy = false,
      showPasswordMeter = false,
      showPasswordSuggestions = false,
      showComplexityBreakdown = false,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const { theme } = useSuperAdmin();
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordHistory] = useState<string[]>([
      "OldPassword123!",
      "PreviousPass456!",
    ]);

    // Default password validation
    const defaultValidatePassword = (password: string): boolean | string => {
      if (!password) return "Password is required";

      if (requirements.minLength && password.length < requirements.minLength) {
        return `Password must be at least ${requirements.minLength} characters long`;
      }

      if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter";
      }

      if (requirements.requireLowercase && !/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter";
      }

      if (requirements.requireNumbers && !/[0-9]/.test(password)) {
        return "Password must contain at least one number";
      }

      if (requirements.requireSpecialChars && !/[^A-Za-z0-9]/.test(password)) {
        return "Password must contain at least one special character";
      }

      if (requirements.customRules) {
        for (const rule of requirements.customRules) {
          if (!rule.test(password)) {
            return rule.message;
          }
        }
      }

      return true;
    };

    const validatePasswordFn = validatePassword || defaultValidatePassword;
    const validationResult = value ? validatePasswordFn(value as string) : true;
    const hasError =
      error ||
      (typeof validationResult === "string" && validationResult !== "true");

    // Password strength calculation
    const calculatePasswordStrength = (
      password: string,
    ): "weak" | "medium" | "strong" | "very-strong" => {
      if (!password) return "weak";

      let score = 0;

      // Length score
      if (password.length >= 8) score += 1;
      if (password.length >= 12) score += 1;
      if (password.length >= 16) score += 1;

      // Character variety score
      if (/[a-z]/.test(password)) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;

      // Complexity score
      if (
        password.length > 8 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password)
      )
        score += 1;
      if (password.length > 8 && /[0-9]/.test(password)) score += 1;
      if (password.length > 8 && /[^A-Za-z0-9]/.test(password)) score += 1;

      if (score <= 3) return "weak";
      if (score <= 5) return "medium";
      if (score <= 7) return "strong";
      return "very-strong";
    };

    // Password score (0-100)
    const calculatePasswordScore = (password: string): number => {
      if (!password) return 0;

      let score = 0;

      // Base score for length
      score += Math.min(password.length * 4, 25);

      // Character variety bonus
      if (/[a-z]/.test(password)) score += 10;
      if (/[A-Z]/.test(password)) score += 10;
      if (/[0-9]/.test(password)) score += 10;
      if (/[^A-Za-z0-9]/.test(password)) score += 15;

      // Complexity bonus
      if (password.length > 8) score += 10;
      if (password.length > 12) score += 10;
      if (password.length > 16) score += 10;

      return Math.min(score, 100);
    };

    // Check password requirements
    const checkRequirements = (password: string) => {
      const checks = {
        minLength: requirements.minLength
          ? password.length >= requirements.minLength
          : true,
        uppercase: requirements.requireUppercase
          ? /[A-Z]/.test(password)
          : true,
        lowercase: requirements.requireLowercase
          ? /[a-z]/.test(password)
          : true,
        numbers: requirements.requireNumbers ? /[0-9]/.test(password) : true,
        specialChars: requirements.requireSpecialChars
          ? /[^A-Za-z0-9]/.test(password)
          : true,
      };

      return checks;
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
    };

    const handleConfirmPasswordChange = (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setConfirmPassword(e.target.value);
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      if (onBlur) {
        onBlur(e);
      }
    };

    const handleInputFocus = () => {
      setFocused(true);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const generatePassword = () => {
      const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      let password = "";

      // Ensure requirements are met
      if (requirements.requireUppercase)
        password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[
          Math.floor(Math.random() * 26)
        ];
      if (requirements.requireLowercase)
        password += "abcdefghijklmnopqrstuvwxyz"[
          Math.floor(Math.random() * 26)
        ];
      if (requirements.requireNumbers)
        password += "0123456789"[Math.floor(Math.random() * 10)];
      if (requirements.requireSpecialChars)
        password += "!@#$%^&*"[Math.floor(Math.random() * 8)];

      // Fill remaining length
      const remainingLength = Math.max(
        requirements.minLength || 8,
        password.length,
      );
      for (let i = password.length; i < remainingLength; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
      }

      // Shuffle the password
      password = password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");

      if (onChange) {
        const syntheticEvent = {
          target: { value: password },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
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
      const strength = calculatePasswordStrength(value as string);
      switch (strength) {
        case "weak":
          return "bg-red-500";
        case "medium":
          return "bg-yellow-500";
        case "strong":
          return "bg-blue-500";
        case "very-strong":
          return "bg-green-500";
        default:
          return "bg-gray-300";
      }
    };

    const getStrengthText = () => {
      const strength = calculatePasswordStrength(value as string);
      switch (strength) {
        case "weak":
          return "Weak";
        case "medium":
          return "Medium";
        case "strong":
          return "Strong";
        case "very-strong":
          return "Very Strong";
        default:
          return "";
      }
    };

    const getPasswordScore = () => {
      return calculatePasswordScore(value as string);
    };

    const getRequirementsStatus = () => {
      if (!value) return null;
      return checkRequirements(value as string);
    };

    const isConfirmPasswordValid = () => {
      if (!showConfirmPassword || !value) return true;
      return value === confirmPassword;
    };

    const isPasswordExpired = () => {
      if (!expirationDate) return false;
      return new Date() > expirationDate;
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
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={handlePasswordChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            className={cn(
              "block w-full border border-gray-300 rounded-md shadow-sm",
              "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
              "transition-colors duration-200",
              getSizeClasses(),
              leftIcon && "pl-10",
              (rightIcon || showToggleVisibility || showGeneratePassword) &&
                "pr-24",
              hasError &&
                "border-red-300 focus:ring-red-500 focus:border-red-500",
              focused && "border-blue-500",
              fullWidth && "w-full",
              className,
            )}
            placeholder={props.placeholder || "Enter password"}
            {...props}
          />

          {/* Right side buttons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {showGeneratePassword && (
              <button
                type="button"
                onClick={generatePassword}
                className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                title="Generate password"
              >
                🔑
              </button>
            )}

            {showToggleVisibility && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-50"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            )}

            {rightIcon && (
              <div className="text-gray-400">
                <div className={getIconSizeClasses()}>{rightIcon}</div>
              </div>
            )}
          </div>
        </div>

        {/* Confirm password field */}
        {showConfirmPassword && (
          <div className="mt-2">
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm password"
              className={cn(
                "block w-full border rounded-md shadow-sm px-3 py-2 text-sm",
                isConfirmPasswordValid() ? "border-gray-300" : "border-red-300",
                "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              )}
            />
            {confirmPassword && !isConfirmPasswordValid() && (
              <div className="text-sm text-red-600 mt-1">
                Passwords do not match
              </div>
            )}
          </div>
        )}

        {/* Password strength indicator */}
        {showStrengthIndicator && value && (
          <div className="flex items-center space-x-2 mt-1">
            <div
              className={cn("w-2 h-2 rounded-full", getStrengthColor())}
            ></div>
            <span className="text-xs text-gray-600">{getStrengthText()}</span>
          </div>
        )}

        {/* Password meter */}
        {showPasswordMeter && value && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  getStrengthColor(),
                )}
                style={{ width: `${getPasswordScore()}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Score: {getPasswordScore()}/100
            </div>
          </div>
        )}

        {/* Password requirements */}
        {showRequirements && value && (
          <div className="mt-2 space-y-1">
            <div className="text-xs font-medium text-gray-700">
              Requirements:
            </div>
            {getRequirementsStatus() && (
              <div className="space-y-1 text-xs">
                <div
                  className={cn(
                    "flex items-center space-x-2",
                    getRequirementsStatus()?.minLength
                      ? "text-green-600"
                      : "text-red-600",
                  )}
                >
                  <span>{getRequirementsStatus()?.minLength ? "✓" : "✗"}</span>
                  <span>At least {requirements.minLength} characters</span>
                </div>
                {requirements.requireUppercase && (
                  <div
                    className={cn(
                      "flex items-center space-x-2",
                      getRequirementsStatus()?.uppercase
                        ? "text-green-600"
                        : "text-red-600",
                    )}
                  >
                    <span>
                      {getRequirementsStatus()?.uppercase ? "✓" : "✗"}
                    </span>
                    <span>One uppercase letter</span>
                  </div>
                )}
                {requirements.requireLowercase && (
                  <div
                    className={cn(
                      "flex items-center space-x-2",
                      getRequirementsStatus()?.lowercase
                        ? "text-green-600"
                        : "text-red-600",
                    )}
                  >
                    <span>
                      {getRequirementsStatus()?.lowercase ? "✓" : "✗"}
                    </span>
                    <span>One lowercase letter</span>
                  </div>
                )}
                {requirements.requireNumbers && (
                  <div
                    className={cn(
                      "flex items-center space-x-2",
                      getRequirementsStatus()?.numbers
                        ? "text-green-600"
                        : "text-red-600",
                    )}
                  >
                    <span>{getRequirementsStatus()?.numbers ? "✓" : "✗"}</span>
                    <span>One number</span>
                  </div>
                )}
                {requirements.requireSpecialChars && (
                  <div
                    className={cn(
                      "flex items-center space-x-2",
                      getRequirementsStatus()?.specialChars
                        ? "text-green-600"
                        : "text-red-600",
                    )}
                  >
                    <span>
                      {getRequirementsStatus()?.specialChars ? "✓" : "✗"}
                    </span>
                    <span>One special character</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Password complexity breakdown */}
        {showComplexityBreakdown && value && (
          <div className="mt-2 space-y-1">
            <div className="text-xs font-medium text-gray-700">Complexity:</div>
            <div className="text-xs text-gray-600">
              Length: {(value as string).length} characters
              {/[A-Z]/.test(value as string) && " • Uppercase"}
              {/[a-z]/.test(value as string) && " • Lowercase"}
              {/[0-9]/.test(value as string) && " • Numbers"}
              {/[^A-Za-z0-9]/.test(value as string) && " • Special characters"}
            </div>
          </div>
        )}

        {/* Password hints */}
        {showPasswordHints && (
          <div className="text-xs text-gray-500 mt-1">
            💡 Use a mix of letters, numbers, and symbols for better security
          </div>
        )}

        {/* Password expiration warning */}
        {showExpirationWarning && expirationDate && (
          <div
            className={cn(
              "text-xs mt-1",
              isPasswordExpired() ? "text-red-600" : "text-yellow-600",
            )}
          >
            {isPasswordExpired()
              ? "⚠️ Password has expired"
              : `⚠️ Password expires on ${expirationDate.toLocaleDateString()}`}
          </div>
        )}

        {/* Password history */}
        {showPasswordHistory && !allowPasswordReuse && (
          <div className="text-xs text-gray-500 mt-1">
            📚 Cannot reuse recent passwords
          </div>
        )}

        {/* Password suggestions */}
        {showPasswordSuggestions && (
          <div className="text-xs text-gray-500 mt-1">
            💡 Try: Generate a new password
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

PasswordInput.displayName = "PasswordInput";
