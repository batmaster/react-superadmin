import React from "react";
import { cn } from "../../utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated" | "flat";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  alignment?: "left" | "center" | "right";
  align?: "left" | "center" | "right"; // Support both prop names for compatibility
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
  padding = "md",
  hover = false,
  ...props
}) => {
  const variantClasses = {
    default: "bg-white border border-gray-200 shadow-sm",
    outlined: "bg-white border border-gray-300 shadow-none",
    elevated: "bg-white border border-transparent shadow-lg",
    flat: "bg-gray-50 border border-gray-100 shadow-none",
  };

  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={cn(
        "rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2",
        variantClasses[variant],
        paddingClasses[padding],
        hover && "hover:shadow-md hover:-translate-y-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  action,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-gray-100 pb-3 mb-3",
        className,
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("flex-1", className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  alignment,
  align,
  className,
  ...props
}) => {
  // Support both prop names for compatibility
  const finalAlignment = align || alignment || "left";
  
  const alignmentClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <div
      className={cn(
        "flex items-center border-t border-gray-100 pt-3 mt-3",
        alignmentClasses[finalAlignment],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
