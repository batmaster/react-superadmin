import React from "react";
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { cn } from "../../utils/cn";

interface AlertProps {
  type?: "success" | "warning" | "error" | "info";
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = "info",
  title,
  children,
  onClose,
  className,
}) => {
  const typeConfig = {
    success: {
      icon: CheckCircle,
      classes: "bg-green-50 border-green-200 text-green-800",
      iconClasses: "text-green-400",
    },
    warning: {
      icon: AlertCircle,
      classes: "bg-yellow-50 border-yellow-200 text-yellow-800",
      iconClasses: "text-yellow-400",
    },
    error: {
      icon: XCircle,
      classes: "bg-red-50 border-red-200 text-red-800",
      iconClasses: "text-red-400",
    },
    info: {
      icon: Info,
      classes: "bg-blue-50 border-blue-200 text-blue-800",
      iconClasses: "text-blue-400",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={cn("border rounded-md p-4", config.classes, className)}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn("h-5 w-5", config.iconClasses)} />
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className="text-sm mt-1">{children}</div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={cn(
                "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2",
                type === "success" && "focus:ring-green-500",
                type === "warning" && "focus:ring-yellow-500",
                type === "error" && "focus:ring-red-500",
                type === "info" && "focus:ring-blue-500",
              )}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
