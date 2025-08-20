import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";

interface DropdownItem {
  label?: string;
  value?: any;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
  icon?: React.ReactNode;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right" | "center";
  size?: "sm" | "md" | "lg";
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  closeOnSelect?: boolean;
  closeOnClickOutside?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = "left",
  size = "md",
  className,
  triggerClassName,
  menuClassName,
  closeOnSelect = true,
  closeOnClickOutside = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnClickOutside &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeOnClickOutside]);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen(!isOpen);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.onClick && !item.disabled) {
      item.onClick();
      if (closeOnSelect) {
        setIsOpen(false);
      }
    }
  };

  const handleItemKeyDown = (
    event: React.KeyboardEvent,
    item: DropdownItem,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleItemClick(item);
    }
  };

  const sizeClasses = {
    sm: "w-40",
    md: "w-48",
    lg: "w-56",
  };

  const alignClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 transform -translate-x-1/2",
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Toggle dropdown menu"
        className={cn(
          "cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded",
          triggerClassName,
        )}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 rounded-md bg-white border border-gray-200 shadow-lg focus:outline-none",
            sizeClasses[size],
            alignClasses[align],
            menuClassName,
          )}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="dropdown-trigger"
        >
          <div className="py-1">
            {items.map((item, index) => (
              <div key={index}>
                {item.divider ? (
                  <div className="border-t border-gray-200 my-1" />
                ) : (
                  <button
                    onClick={() => handleItemClick(item)}
                    onKeyDown={(e) => handleItemKeyDown(e, item)}
                    disabled={item.disabled}
                    role="menuitem"
                    tabIndex={-1}
                    className={cn(
                      "flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150",
                      item.disabled && "cursor-not-allowed",
                    )}
                  >
                    {item.icon && (
                      <span className="mr-2 flex-shrink-0 text-gray-400">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
