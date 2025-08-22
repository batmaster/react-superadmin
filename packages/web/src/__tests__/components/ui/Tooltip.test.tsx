import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Tooltip } from "../../../components/ui/Tooltip";

describe("Tooltip", () => {
  const defaultProps = {
    content: "Test tooltip content",
    children: <button>Hover me</button>,
  };

  beforeEach(() => {
    // Mock getBoundingClientRect for positioning calculations
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      top: 100,
      left: 100,
      width: 100,
      height: 40,
      bottom: 140,
      right: 200,
      x: 100,
      y: 100,
      toJSON: () => {},
    }));

    // Mock window dimensions
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 800,
    });

    // Mock scroll position
    Object.defineProperty(window, "pageYOffset", {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(window, "pageXOffset", {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders children without tooltip initially", () => {
      render(<Tooltip {...defaultProps} />);
      expect(screen.getByText("Hover me")).toBeInTheDocument();
      expect(
        screen.queryByText("Test tooltip content"),
      ).not.toBeInTheDocument();
    });

    it("renders tooltip content when provided", () => {
      render(<Tooltip {...defaultProps} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      waitFor(() => {
        expect(screen.getByText("Test tooltip content")).toBeInTheDocument();
      });
    });

    it("renders with custom className", async () => {
      render(<Tooltip {...defaultProps} className="custom-tooltip-class" />);

      const button = screen.getByText("Hover me");
      userEvent.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByText("Test tooltip content");
        expect(tooltip).toHaveClass("custom-tooltip-class");
      });
    });
  });

  describe("Trigger Modes", () => {
    it("shows tooltip on hover by default", async () => {
      render(<Tooltip {...defaultProps} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        expect(screen.getByText("Test tooltip content")).toBeInTheDocument();
      });
    });

    it("shows tooltip on click when trigger is click", async () => {
      render(<Tooltip {...defaultProps} trigger="click" />);
      const button = screen.getByText("Hover me");

      userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Test tooltip content")).toBeInTheDocument();
      });
    });

    it("toggles tooltip on click when trigger is click", async () => {
      render(<Tooltip {...defaultProps} trigger="click" />);
      const button = screen.getByText("Hover me");

      // First click shows tooltip
      userEvent.click(button);
      await waitFor(() => {
        expect(screen.getByText("Test tooltip content")).toBeInTheDocument();
      });

      // Second click hides tooltip
      userEvent.click(button);
      await waitFor(() => {
        expect(
          screen.queryByText("Test tooltip content"),
        ).not.toBeInTheDocument();
      });
    });

    it("shows tooltip on focus when trigger is focus", async () => {
      render(<Tooltip {...defaultProps} trigger="focus" />);
      const button = screen.getByText("Hover me");

      button.focus();

      await waitFor(() => {
        expect(screen.getByText("Test tooltip content")).toBeInTheDocument();
      });
    });

    it("hides tooltip on blur when trigger is focus", async () => {
      render(<Tooltip {...defaultProps} trigger="focus" />);
      const button = screen.getByText("Hover me");

      button.focus();
      await waitFor(() => {
        expect(screen.getByText("Test tooltip content")).toBeInTheDocument();
      });

      button.blur();
      await waitFor(() => {
        expect(
          screen.queryByText("Test tooltip content"),
        ).not.toBeInTheDocument();
      });
    });

    it("shows tooltip when isOpen is true for manual trigger", () => {
      render(<Tooltip {...defaultProps} trigger="manual" isOpen={true} />);

      expect(screen.getByText("Test tooltip content")).toBeInTheDocument();
    });

    it("hides tooltip when isOpen is false for manual trigger", () => {
      render(<Tooltip {...defaultProps} trigger="manual" isOpen={false} />);

      expect(
        screen.queryByText("Test tooltip content"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Positioning", () => {
    it("positions tooltip at top by default", async () => {
      render(<Tooltip {...defaultProps} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByText("Test tooltip content");
        expect(tooltip).toBeInTheDocument();
      });
    });

    it("positions tooltip at bottom when specified", async () => {
      render(<Tooltip {...defaultProps} position="bottom" />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByText("Test tooltip content");
        expect(tooltip).toBeInTheDocument();
      });
    });

    it("positions tooltip at left when specified", async () => {
      render(<Tooltip {...defaultProps} position="left" />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByText("Test tooltip content");
        expect(tooltip).toBeInTheDocument();
      });
    });

    it("positions tooltip at right when specified", async () => {
      render(<Tooltip {...defaultProps} position="right" />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByText("Test tooltip content");
        expect(tooltip).toBeInTheDocument();
      });
    });

    it("positions tooltip at top-start when specified", async () => {
      render(<Tooltip {...defaultProps} position="top-start" />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByText("Test tooltip content");
        expect(tooltip).toBeInTheDocument();
      });
    });

    it("positions tooltip at top-end when specified", async () => {
      render(<Tooltip {...defaultProps} position="top-end" />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByText("Test tooltip content");
        expect(tooltip).toBeInTheDocument();
      });
    });
  });

  describe("Delay and Timing", () => {
    it("shows tooltip immediately when delay is 0", async () => {
      render(<Tooltip {...defaultProps} delay={0} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(
        () => {
          expect(screen.getByText("Test tooltip content")).toBeInTheDocument();
        },
        { timeout: 100 },
      );
    });

    it("shows tooltip after delay when specified", async () => {
      jest.useFakeTimers();

      render(<Tooltip {...defaultProps} delay={500} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      // Tooltip should not be visible immediately
      expect(
        screen.queryByText("Test tooltip content"),
      ).not.toBeInTheDocument();

      // Fast-forward time
      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(screen.getByText("Test tooltip content")).toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it("cancels delay when hover ends before delay completes", async () => {
      jest.useFakeTimers();

      render(<Tooltip {...defaultProps} delay={500} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      // Fast-forward time partially
      jest.advanceTimersByTime(250);

      // End hover
      userEvent.unhover(button);

      // Fast-forward remaining time
      jest.advanceTimersByTime(250);

      // Tooltip should not appear
      expect(
        screen.queryByText("Test tooltip content"),
      ).not.toBeInTheDocument();

      jest.useRealTimers();
    });
  });

  describe("Arrow and Styling", () => {
    it("shows arrow by default", async () => {
      render(<Tooltip {...defaultProps} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByText("Test tooltip content");
        const arrow = tooltip.querySelector(".w-2.h-2.bg-gray-900");
        expect(arrow).toBeInTheDocument();
      });
    });

    it("hides arrow when showArrow is false", async () => {
      render(<Tooltip {...defaultProps} showArrow={false} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByText("Test tooltip content");
        const arrow = tooltip.querySelector(".w-2.h-2.bg-gray-900");
        expect(arrow).not.toBeInTheDocument();
      });
    });

    it("applies custom maxWidth", async () => {
      render(<Tooltip {...defaultProps} maxWidth={200} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByText("Test tooltip content");
        expect(tooltip).toHaveStyle({ maxWidth: "200px" });
      });
    });

    it("applies custom zIndex", async () => {
      render(<Tooltip {...defaultProps} zIndex={2000} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByText("Test tooltip content");
        expect(tooltip).toHaveStyle({ zIndex: 2000 });
      });
    });
  });

  describe("Accessibility", () => {
    it("adds aria-describedby when tooltip is visible", async () => {
      render(<Tooltip {...defaultProps} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-describedby", "tooltip");
      });
    });

    it("removes aria-describedby when tooltip is hidden", async () => {
      render(<Tooltip {...defaultProps} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);
      await waitFor(() => {
        expect(button).toHaveAttribute("aria-describedby", "tooltip");
      });

      userEvent.unhover(button);
      await waitFor(() => {
        expect(button).not.toHaveAttribute("aria-describedby");
      });
    });

    it("has proper role attribute", async () => {
      render(<Tooltip {...defaultProps} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toBeInTheDocument();
      });
    });
  });

  describe("Event Handling", () => {
    it("calls onOpenChange when tooltip opens", async () => {
      const onOpenChange = jest.fn();
      render(<Tooltip {...defaultProps} onOpenChange={onOpenChange} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      });
    });

    it("calls onOpenChange when tooltip closes", async () => {
      const onOpenChange = jest.fn();
      render(<Tooltip {...defaultProps} onOpenChange={onOpenChange} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      });

      userEvent.unhover(button);
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("handles rapid hover/unhover events", async () => {
      render(<Tooltip {...defaultProps} />);
      const button = screen.getByText("Hover me");

      // Rapid hover/unhover
      userEvent.hover(button);
      userEvent.unhover(button);
      userEvent.hover(button);

      await waitFor(() => {
        expect(screen.getByText("Test tooltip content")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles disabled state", () => {
      render(<Tooltip {...defaultProps} disabled={true} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      // Tooltip should not appear when disabled
      expect(
        screen.queryByText("Test tooltip content"),
      ).not.toBeInTheDocument();
    });

    it("handles empty content", async () => {
      render(<Tooltip content="" children={<button>Hover me</button>} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent("");
      });
    });

    it("handles rich content with JSX", async () => {
      const richContent = (
        <div>
          <h4>Title</h4>
          <p>Description</p>
        </div>
      );

      render(
        <Tooltip content={richContent} children={<button>Hover me</button>} />,
      );
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        expect(screen.getByText("Title")).toBeInTheDocument();
        expect(screen.getByText("Description")).toBeInTheDocument();
      });
    });

    it("handles custom offset", async () => {
      render(<Tooltip {...defaultProps} offset={20} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByText("Test tooltip content");
        expect(tooltip).toBeInTheDocument();
      });
    });

    it("handles animation disabled", async () => {
      render(<Tooltip {...defaultProps} animate={false} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByText("Test tooltip content");
        expect(tooltip).toBeInTheDocument();
        // Should not have animation classes
        expect(tooltip).not.toHaveClass(
          "animate-in",
          "fade-in-0",
          "zoom-in-95",
        );
      });
    });
  });

  describe("Cleanup", () => {
    it("cleans up timeouts on unmount", () => {
      jest.useFakeTimers();

      const { unmount } = render(<Tooltip {...defaultProps} delay={1000} />);
      const button = screen.getByText("Hover me");

      userEvent.hover(button);

      // Unmount before timeout completes
      unmount();

      // Fast-forward time
      jest.advanceTimersByTime(1000);

      // Should not throw errors
      expect(() => jest.runAllTimers()).not.toThrow();

      jest.useRealTimers();
    });

    it("cleans up event listeners on unmount", async () => {
      const addEventListenerSpy = jest.spyOn(window, "addEventListener");
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

      const { unmount } = render(<Tooltip {...defaultProps} />);

      // Trigger tooltip to open so event listeners are added
      const button = screen.getByText("Hover me");
      userEvent.hover(button);

      // Wait for tooltip to appear and event listeners to be added
      await waitFor(() => {
        expect(screen.getByText("Test tooltip content")).toBeInTheDocument();
      });

      unmount();

      // Check that event listeners were added and removed
      expect(addEventListenerSpy).toHaveBeenCalled();
      expect(removeEventListenerSpy).toHaveBeenCalled();

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });
});
