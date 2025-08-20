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
    default: "bg-white border border-gray-200",
    outlined: "bg-white border border-gray-300",
    elevated: "bg-white border border-gray-200 shadow-md",
    flat: "bg-gray-50 border border-gray-200",
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
        "rounded-lg",
        variantClasses[variant],
        paddingClasses[padding],
        hover && "transition-shadow duration-200 hover:shadow-md",
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
        "flex items-center justify-between border-b border-gray-200 pb-3 mb-3",
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
  alignment = "left",
  className,
  ...props
}) => {
  const alignmentClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <div
      className={cn(
        "flex items-center border-t border-gray-200 pt-3 mt-3",
        alignmentClasses[alignment],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
