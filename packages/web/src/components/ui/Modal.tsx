import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  variant?: "default" | "centered" | "bottom-sheet" | "side-panel";
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  backdropClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  variant = "default",
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  contentClassName,
  headerClassName,
  backdropClassName,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Add event listeners
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      // Focus the modal for accessibility
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";

      // Restore focus to the previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose, closeOnEscape]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    xs: "max-w-xs",
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  const variantClasses = {
    default: "sm:my-8",
    centered: "sm:my-8",
    "bottom-sheet": "sm:items-end sm:my-0",
    "side-panel": "sm:items-start sm:justify-end sm:my-0",
  };

  const variantModalClasses = {
    default: "rounded-lg",
    centered: "rounded-lg",
    "bottom-sheet": "rounded-t-lg sm:rounded-b-none",
    "side-panel": "rounded-l-lg h-full",
  };

  const isSidePanel = variant === "side-panel";
  const isBottomSheet = variant === "bottom-sheet";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className={cn(
          "flex min-h-full items-center justify-center p-4 text-center",
          variantClasses[variant],
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity",
            backdropClassName,
          )}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          tabIndex={-1}
          className={cn(
            "relative transform overflow-hidden bg-white text-left shadow-xl transition-all sm:w-full",
            sizeClasses[size],
            variantModalClasses[variant],
            isSidePanel && "h-full w-full sm:w-96",
            isBottomSheet && "w-full",
            className,
          )}
        >
          {/* Header */}
          {title && (
            <div
              className={cn(
                "flex items-center justify-between border-b border-gray-200",
                isSidePanel ? "px-4 py-3" : "px-6 py-4",
                headerClassName,
              )}
            >
              <h3
                id="modal-title"
                className="text-lg font-medium text-gray-900"
              >
                {title}
              </h3>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div
            className={cn(
              isSidePanel ? "px-4 py-3" : "px-6 py-4",
              contentClassName,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
