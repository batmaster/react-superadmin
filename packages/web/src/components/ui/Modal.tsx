import React, { useEffect, useRef } from "react";
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
  contentClassName,
  headerClassName,
  backdropClassName,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, closeOnEscape]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    xs: "max-w-sm",
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  const variantClasses = {
    default: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    centered: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    "bottom-sheet": "bottom-0 left-0 right-0 transform translate-y-0",
    "side-panel": "top-0 right-0 bottom-0 transform translate-x-0",
  };

  const variantSizeClasses = {
    default: sizeClasses[size],
    centered: sizeClasses[size],
    "bottom-sheet": "w-full max-h-[90vh]",
    "side-panel": "w-96 h-full",
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        variant === "bottom-sheet" && "items-end",
        variant === "side-panel" && "items-stretch justify-end",
        backdropClassName,
      )}
    >
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 transition-opacity",
        )}
        aria-hidden="true"
      />
      {closeOnBackdrop && (
        <button
          className="fixed inset-0 z-10 cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        />
      )}
      <div
        ref={modalRef}
        className={cn(
          "relative bg-white rounded-lg shadow-lg focus:outline-none z-20",
          variantClasses[variant],
          variantSizeClasses[variant],
          contentClassName,
        )}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {title && (
          <div
            className={cn(
              "flex items-center justify-between border-b border-gray-200 px-6 py-4",
              headerClassName,
            )}
          >
            <h2 id="modal-title" className="text-lg font-medium text-gray-900">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};
