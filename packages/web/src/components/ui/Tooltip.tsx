import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "../../utils/cn";

export interface TooltipProps {
  /** The content to display in the tooltip */
  content: React.ReactNode;

  /** The element that triggers the tooltip */
  children: React.ReactElement;

  /** Position of the tooltip relative to the trigger */
  position?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";

  /** How the tooltip is triggered */
  trigger?: "hover" | "click" | "focus" | "manual";

  /** Whether the tooltip is visible (for manual trigger) */
  isOpen?: boolean;

  /** Callback when tooltip visibility changes */
  onOpenChange?: (isOpen: boolean) => void;

  /** Delay before showing the tooltip (ms) */
  delay?: number;

  /** Whether to show an arrow pointing to the trigger */
  showArrow?: boolean;

  /** Maximum width of the tooltip */
  maxWidth?: number;

  /** Custom CSS classes */
  className?: string;

  /** Whether the tooltip is disabled */
  disabled?: boolean;

  /** Z-index for the tooltip */
  zIndex?: number;

  /** Whether to animate the tooltip */
  animate?: boolean;

  /** Custom offset from the trigger */
  offset?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  trigger = "hover",
  isOpen: controlledIsOpen,
  onOpenChange,
  delay = 200,
  showArrow = true,
  maxWidth = 300,
  className,
  disabled = false,
  zIndex = 1000,
  animate = true,
  offset = 8,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Use controlled state if provided, otherwise use internal state
  const isTooltipOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : isOpen;

  // Calculate tooltip position
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = triggerRect.top + scrollTop - tooltipRect.height - offset;
        left =
          triggerRect.left +
          scrollLeft +
          (triggerRect.width - tooltipRect.width) / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + scrollTop + offset;
        left =
          triggerRect.left +
          scrollLeft +
          (triggerRect.width - tooltipRect.width) / 2;
        break;
      case "left":
        top =
          triggerRect.top +
          scrollTop +
          (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left + scrollLeft - tooltipRect.width - offset;
        break;
      case "right":
        top =
          triggerRect.top +
          scrollTop +
          (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + scrollLeft + offset;
        break;
      case "top-start":
        top = triggerRect.top + scrollTop - tooltipRect.height - offset;
        left = triggerRect.left + scrollLeft;
        break;
      case "top-end":
        top = triggerRect.top + scrollTop - tooltipRect.height - offset;
        left = triggerRect.right + scrollLeft - tooltipRect.width;
        break;
      case "bottom-start":
        top = triggerRect.bottom + scrollTop + offset;
        left = triggerRect.left + scrollLeft;
        break;
      case "bottom-end":
        top = triggerRect.bottom + scrollTop + offset;
        left = triggerRect.right + scrollLeft - tooltipRect.width;
        break;
      case "left-start":
        top = triggerRect.top + scrollTop;
        left = triggerRect.left + scrollLeft - tooltipRect.width - offset;
        break;
      case "left-end":
        top = triggerRect.bottom + scrollTop - tooltipRect.height;
        left = triggerRect.left + scrollLeft - tooltipRect.width - offset;
        break;
      case "right-start":
        top = triggerRect.top + scrollTop;
        left = triggerRect.right + scrollLeft + offset;
        break;
      case "right-end":
        top = triggerRect.bottom + scrollTop - tooltipRect.height;
        left = triggerRect.right + scrollLeft + offset;
        break;
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 0) left = 0;
    if (left + tooltipRect.width > viewportWidth)
      left = viewportWidth - tooltipRect.width;
    if (top < 0) top = 0;
    if (top + tooltipRect.height > viewportHeight)
      top = viewportHeight - tooltipRect.height;

    setTooltipPosition({ top, left });
  }, [position, offset]);

  // Handle show/hide with delay
  const handleShow = useCallback(() => {
    if (disabled) return;

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(true);
        onOpenChange?.(true);
      }, delay);
    } else {
      setIsOpen(true);
      onOpenChange?.(true);
    }
  }, [disabled, delay, onOpenChange]);

  const handleHide = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  // Event handlers
  const handleMouseEnter = useCallback(() => {
    if (trigger === "hover") {
      handleShow();
    }
  }, [trigger, handleShow]);

  const handleMouseLeave = useCallback(() => {
    if (trigger === "hover") {
      handleHide();
    }
  }, [trigger, handleHide]);

  const handleClick = useCallback(() => {
    if (trigger === "click") {
      if (isTooltipOpen) {
        handleHide();
      } else {
        handleShow();
      }
    }
  }, [trigger, isTooltipOpen, handleShow, handleHide]);

  const handleFocus = useCallback(() => {
    if (trigger === "focus") {
      handleShow();
    }
  }, [trigger, handleShow]);

  const handleBlur = useCallback(() => {
    if (trigger === "focus") {
      handleHide();
    }
  }, [trigger, handleHide]);

  // Update position when tooltip opens or position changes
  useEffect(() => {
    if (isTooltipOpen) {
      calculatePosition();
    }
  }, [isTooltipOpen, calculatePosition]);

  // Update position on scroll and resize
  useEffect(() => {
    if (isTooltipOpen) {
      const handleScroll = () => calculatePosition();
      const handleResize = () => calculatePosition();

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isTooltipOpen, calculatePosition]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Clone child element and add event handlers
  const triggerElement = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    onFocus: handleFocus,
    onBlur: handleBlur,
    "aria-describedby": isTooltipOpen ? "tooltip" : undefined,
  });

  // Arrow positioning
  const getArrowPosition = () => {
    switch (position) {
      case "top":
      case "top-start":
      case "top-end":
        return "bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full";
      case "bottom":
      case "bottom-start":
      case "bottom-end":
        return "top-0 left-1/2 transform -translate-x-1/2 -translate-y-full";
      case "left":
      case "left-start":
      case "left-end":
        return "right-0 top-1/2 transform translate-x-full -translate-y-1/2";
      case "right":
      case "right-start":
      case "right-end":
        return "left-0 top-1/2 transform -translate-x-full -translate-y-1/2";
      default:
        return "";
    }
  };

  if (disabled) {
    return children;
  }

  return (
    <>
      {triggerElement}
      {isTooltipOpen && (
        <div
          ref={tooltipRef}
          id="tooltip"
          role="tooltip"
          className={cn(
            "fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg",
            "max-w-[300px] break-words",
            animate && "animate-in fade-in-0 zoom-in-95",
            className,
          )}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            maxWidth: maxWidth,
            zIndex: zIndex,
          }}
          onMouseEnter={trigger === "hover" ? handleShow : undefined}
          onMouseLeave={trigger === "hover" ? handleHide : undefined}
        >
          {content}
          {showArrow && (
            <div
              className={cn(
                "absolute w-2 h-2 bg-gray-900 transform rotate-45",
                getArrowPosition(),
              )}
            />
          )}
        </div>
      )}
    </>
  );
};

Tooltip.displayName = "Tooltip";
