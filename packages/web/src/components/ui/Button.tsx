import React from "react";
import { cn } from "../../utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success"
    | "warning";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  fullWidth = false,
  rounded = false,
  ...props
}) => {
  const baseClasses = cn(
    "inline-flex items-center justify-center font-medium transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "active:scale-95",
    fullWidth && "w-full",
    rounded ? "rounded-full" : "rounded-md",
  );

  const variantClasses = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm hover:shadow-md",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500 hover:border-gray-400",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md",
    warning:
      "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 shadow-sm hover:shadow-md",
  };

  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  const iconSizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  const iconSpacingClasses = {
    xs: "mr-1",
    sm: "mr-1.5",
    md: "mr-2",
    lg: "mr-2.5",
    xl: "mr-3",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-current border-t-transparent",
            iconSizeClasses[size],
            iconSpacingClasses[size],
          )}
        />
      )}

      {!loading && leftIcon && (
        <span
          className={cn(
            "flex-shrink-0",
            iconSizeClasses[size],
            iconSpacingClasses[size],
          )}
        >
          {leftIcon}
        </span>
      )}

      <span className="flex-shrink-0">{children}</span>

      {!loading && rightIcon && (
        <span
          className={cn(
            "flex-shrink-0",
            iconSizeClasses[size],
            iconSpacingClasses[size],
          )}
        >
          {rightIcon}
        </span>
      )}
    </button>
  );
};
