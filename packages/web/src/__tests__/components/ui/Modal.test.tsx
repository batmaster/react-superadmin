import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Modal } from "../../../components/ui/Modal";

// Mock the lucide-react icon
jest.mock("lucide-react", () => ({
  X: ({ className }: { className?: string }) => (
    <span data-testid="close-icon" className={className}>
      ×
    </span>
  ),
}));

describe("Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: "Modal content",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock document.body.style.overflow
    Object.defineProperty(document.body, "style", {
      value: { overflow: "" },
      writable: true,
    });
  });

  afterEach(() => {
    // Clean up body overflow
    document.body.style.overflow = "";
  });

  it("should render when open", () => {
    render(<Modal {...defaultProps} />);

    expect(screen.getByText("Modal content")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should not render when closed", () => {
    render(<Modal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should render with title", () => {
    render(<Modal {...defaultProps} title="Test Modal" />);

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toHaveAttribute(
      "aria-labelledby",
      "modal-title",
    );
  });

  it("should render without title", () => {
    render(<Modal {...defaultProps} />);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-labelledby");
  });

  it("should call onClose when close button is clicked", () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} title="Test Modal" />);

    const closeButton = screen.getByLabelText("Close modal");
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not show close button when showCloseButton is false", () => {
    render(
      <Modal {...defaultProps} showCloseButton={false} title="Test Modal" />,
    );

    expect(screen.queryByLabelText("Close modal")).not.toBeInTheDocument();
  });

  it("should call onClose when backdrop is clicked", () => {
    const onClose = jest.fn();
    render(
      <Modal {...defaultProps} onClose={onClose} closeOnBackdrop={true} />,
    );

    // Find the backdrop by looking for the fixed inset-0 element
    const backdrop = document.querySelector(".fixed.inset-0.bg-gray-500");
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it("should not call onClose when backdrop is clicked and closeOnBackdrop is false", () => {
    const onClose = jest.fn();
    render(
      <Modal {...defaultProps} onClose={onClose} closeOnBackdrop={false} />,
    );

    const backdrop = document.querySelector(".fixed.inset-0.bg-gray-500");
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).not.toHaveBeenCalled();
    }
  });

  it("should call onClose when Escape key is pressed", async () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} closeOnEscape={true} />);

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("should not call onClose when Escape key is pressed and closeOnEscape is false", async () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} closeOnEscape={false} />);

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it("should apply correct size classes", () => {
    const { rerender } = render(<Modal {...defaultProps} size="xs" />);
    expect(screen.getByRole("dialog")).toHaveClass("max-w-xs");

    rerender(<Modal {...defaultProps} size="sm" />);
    expect(screen.getByRole("dialog")).toHaveClass("max-w-md");

    rerender(<Modal {...defaultProps} size="md" />);
    expect(screen.getByRole("dialog")).toHaveClass("max-w-lg");

    rerender(<Modal {...defaultProps} size="lg" />);
    expect(screen.getByRole("dialog")).toHaveClass("max-w-2xl");

    rerender(<Modal {...defaultProps} size="xl" />);
    expect(screen.getByRole("dialog")).toHaveClass("max-w-4xl");

    rerender(<Modal {...defaultProps} size="full" />);
    expect(screen.getByRole("dialog")).toHaveClass("max-w-full", "mx-4");
  });

  it("should apply correct variant classes", () => {
    const { rerender } = render(<Modal {...defaultProps} variant="default" />);
    // Find the flex container that wraps the modal
    const flexContainer = screen.getByRole("dialog").parentElement;
    expect(flexContainer).toHaveClass("sm:my-8");

    rerender(<Modal {...defaultProps} variant="centered" />);
    expect(flexContainer).toHaveClass("sm:my-8");

    rerender(<Modal {...defaultProps} variant="bottom-sheet" />);
    expect(flexContainer).toHaveClass("sm:items-end", "sm:my-0");
    expect(screen.getByRole("dialog")).toHaveClass(
      "rounded-t-lg",
      "sm:rounded-b-none",
    );

    rerender(<Modal {...defaultProps} variant="side-panel" />);
    expect(flexContainer).toHaveClass(
      "sm:items-start",
      "sm:justify-end",
      "sm:my-0",
    );
    expect(screen.getByRole("dialog")).toHaveClass(
      "rounded-l-lg",
      "h-full",
      "w-full",
      "sm:w-96",
    );
  });

  it("should apply custom className", () => {
    render(<Modal {...defaultProps} className="custom-modal" />);

    expect(screen.getByRole("dialog")).toHaveClass("custom-modal");
  });

  it("should apply custom contentClassName", () => {
    render(<Modal {...defaultProps} contentClassName="custom-content" />);

    const content = screen.getByText("Modal content").closest("div");
    expect(content).toHaveClass("custom-content");
  });

  it("should apply custom headerClassName", () => {
    render(
      <Modal
        {...defaultProps}
        title="Test Modal"
        headerClassName="custom-header"
      />,
    );

    const header = screen.getByText("Test Modal").closest("div");
    expect(header).toHaveClass("custom-header");
  });

  it("should apply custom backdropClassName", () => {
    render(<Modal {...defaultProps} backdropClassName="custom-backdrop" />);

    // Find the backdrop by looking for the fixed inset-0 element
    const backdrop = document.querySelector(".fixed.inset-0.bg-gray-500");
    expect(backdrop).toHaveClass("custom-backdrop");
  });

  it("should have proper accessibility attributes", () => {
    render(<Modal {...defaultProps} title="Test Modal" />);

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveAttribute("aria-modal", "true");
    expect(modal).toHaveAttribute("aria-labelledby", "modal-title");
    expect(modal).toHaveAttribute("tabIndex", "-1");
  });

  it("should have proper accessibility attributes without title", () => {
    render(<Modal {...defaultProps} />);

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveAttribute("aria-modal", "true");
    expect(modal).not.toHaveAttribute("aria-labelledby");
    expect(modal).toHaveAttribute("tabIndex", "-1");
  });

  it("should handle body overflow correctly", () => {
    const { rerender } = render(<Modal {...defaultProps} />);

    // Modal is open, body overflow should be hidden
    expect(document.body.style.overflow).toBe("hidden");

    // Close modal
    rerender(<Modal {...defaultProps} isOpen={false} />);

    // Body overflow should be restored
    expect(document.body.style.overflow).toBe("unset");
  });

  it("should handle complex content", () => {
    const complexContent = (
      <div>
        <h2>Complex Title</h2>
        <p>Some content</p>
        <button>Action Button</button>
      </div>
    );

    render(<Modal {...defaultProps} children={complexContent} />);

    expect(screen.getByText("Complex Title")).toBeInTheDocument();
    expect(screen.getByText("Some content")).toBeInTheDocument();
    expect(screen.getByText("Action Button")).toBeInTheDocument();
  });

  it("should handle different padding for side panel variant", () => {
    render(<Modal {...defaultProps} variant="side-panel" title="Test Modal" />);

    const header = screen.getByText("Test Modal").closest("div");
    const content = screen.getByText("Modal content").closest("div");

    expect(header).toHaveClass("px-4", "py-3");
    expect(content).toHaveClass("px-4", "py-3");
  });

  it("should handle different padding for default variant", () => {
    render(<Modal {...defaultProps} variant="default" title="Test Modal" />);

    const header = screen.getByText("Test Modal").closest("div");
    const content = screen.getByText("Modal content").closest("div");

    expect(header).toHaveClass("px-6", "py-4");
    expect(content).toHaveClass("px-6", "py-4");
  });

  it("should handle bottom sheet variant correctly", () => {
    render(<Modal {...defaultProps} variant="bottom-sheet" />);

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveClass("w-full");
  });

  it("should handle side panel variant correctly", () => {
    render(<Modal {...defaultProps} variant="side-panel" />);

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveClass("h-full", "w-full", "sm:w-96");
  });

  it("should handle backdrop click correctly", () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    // Find the backdrop by looking for the fixed inset-0 element
    const backdrop = document.querySelector(".fixed.inset-0.bg-gray-500");
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it("should handle close button click correctly", () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} title="Test Modal" />);

    const closeButton = screen.getByLabelText("Close modal");
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should handle escape key correctly", async () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("should handle escape key when disabled", async () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} closeOnEscape={false} />);

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it("should handle backdrop click when disabled", () => {
    const onClose = jest.fn();
    render(
      <Modal {...defaultProps} onClose={onClose} closeOnBackdrop={false} />,
    );

    const backdrop = document.querySelector(".fixed.inset-0.bg-gray-500");
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).not.toHaveBeenCalled();
    }
  });

  it("should handle showCloseButton prop correctly", () => {
    const { rerender } = render(
      <Modal {...defaultProps} title="Test Modal" showCloseButton={true} />,
    );
    expect(screen.getByLabelText("Close modal")).toBeInTheDocument();

    rerender(
      <Modal {...defaultProps} title="Test Modal" showCloseButton={false} />,
    );
    expect(screen.queryByLabelText("Close modal")).not.toBeInTheDocument();
  });

  it("should handle all size variants correctly", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl", "full"];
    const sizeClasses = {
      xs: "max-w-xs",
      sm: "max-w-md",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
      full: "max-w-full",
    };

    sizes.forEach((size) => {
      const { unmount } = render(
        <Modal {...defaultProps} size={size as any} />,
      );
      const modal = screen.getByRole("dialog");

      if (size === "full") {
        expect(modal).toHaveClass("max-w-full", "mx-4");
      } else {
        expect(modal).toHaveClass(
          sizeClasses[size as keyof typeof sizeClasses],
        );
      }

      unmount();
    });
  });

  it("should handle all variant types correctly", () => {
    const variants = ["default", "centered", "bottom-sheet", "side-panel"];

    variants.forEach((variant) => {
      const { unmount } = render(
        <Modal {...defaultProps} variant={variant as any} />,
      );
      const modal = screen.getByRole("dialog");

      if (variant === "bottom-sheet") {
        expect(modal).toHaveClass("rounded-t-lg", "sm:rounded-b-none");
      } else if (variant === "side-panel") {
        expect(modal).toHaveClass(
          "rounded-l-lg",
          "h-full",
          "w-full",
          "sm:w-96",
        );
      } else {
        expect(modal).toHaveClass("rounded-lg");
      }

      unmount();
    });
  });
});
