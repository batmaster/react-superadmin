import { render, screen } from "@testing-library/react";
import React from "react";
import { Badge } from "../../../components/ui/Badge";

describe("Badge Component", () => {
  const defaultProps = {
    children: "Badge Text",
  };

  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<Badge {...defaultProps} />);

      expect(screen.getByText("Badge Text")).toBeInTheDocument();
    });

    it("renders with custom children", () => {
      render(<Badge>Custom Badge Content</Badge>);

      expect(screen.getByText("Custom Badge Content")).toBeInTheDocument();
    });

    it("renders with complex children", () => {
      const complexContent = (
        <div>
          <span>Icon</span>
          <span>Text</span>
        </div>
      );

      render(<Badge>{complexContent}</Badge>);

      expect(screen.getByText("Icon")).toBeInTheDocument();
      expect(screen.getByText("Text")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("renders default variant with correct styling", () => {
      render(<Badge {...defaultProps} variant="default" />);

      const badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass("bg-gray-100", "text-gray-800");
    });

    it("renders primary variant with correct styling", () => {
      render(<Badge {...defaultProps} variant="primary" />);

      const badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass("bg-primary-100", "text-primary-800");
    });

    it("renders secondary variant with correct styling", () => {
      render(<Badge {...defaultProps} variant="secondary" />);

      const badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass("bg-gray-100", "text-gray-800");
    });

    it("renders success variant with correct styling", () => {
      render(<Badge {...defaultProps} variant="success" />);

      const badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass("bg-green-100", "text-green-800");
    });

    it("renders warning variant with correct styling", () => {
      render(<Badge {...defaultProps} variant="warning" />);

      const badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass("bg-yellow-100", "text-yellow-800");
    });

    it("renders danger variant with correct styling", () => {
      render(<Badge {...defaultProps} variant="danger" />);

      const badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass("bg-red-100", "text-red-800");
    });

    it("renders outline variant with correct styling", () => {
      render(<Badge {...defaultProps} variant="outline" />);

      const badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass(
        "border",
        "border-gray-300",
        "bg-white",
        "text-gray-700",
      );
    });

    it("defaults to default variant when no variant is specified", () => {
      render(<Badge {...defaultProps} />);

      const badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass("bg-gray-100", "text-gray-800");
    });
  });

  describe("Sizes", () => {
    it("renders small size with correct styling", () => {
      render(<Badge {...defaultProps} size="sm" />);

      const badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass("px-2", "py-0.5", "text-xs");
    });

    it("renders medium size with correct styling (default)", () => {
      render(<Badge {...defaultProps} size="md" />);

      const badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass("px-2.5", "py-0.5", "text-sm");
    });

    it("renders large size with correct styling", () => {
      render(<Badge {...defaultProps} size="lg" />);

      const badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass("px-3", "py-1", "text-sm");
    });

    it("defaults to medium size when no size is specified", () => {
      render(<Badge {...defaultProps} />);

      const badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass("px-2.5", "py-0.5", "text-sm");
    });
  });

  describe("Base Classes", () => {
    it("always applies base classes regardless of variant or size", () => {
      render(<Badge {...defaultProps} variant="success" size="lg" />);

      const badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass(
        "inline-flex",
        "items-center",
        "font-medium",
        "rounded-full",
      );
    });

    it("maintains base classes with different variants", () => {
      const { rerender } = render(
        <Badge {...defaultProps} variant="primary" />,
      );
      let badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass(
        "inline-flex",
        "items-center",
        "font-medium",
        "rounded-full",
      );

      rerender(<Badge {...defaultProps} variant="outline" />);
      badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass(
        "inline-flex",
        "items-center",
        "font-medium",
        "rounded-full",
      );
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className when provided", () => {
      render(<Badge {...defaultProps} className="custom-class" />);

      const badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass("custom-class");
    });

    it("merges custom className with default classes", () => {
      render(<Badge {...defaultProps} className="custom-class" />);

      const badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass(
        "inline-flex",
        "items-center",
        "font-medium",
        "rounded-full",
        "bg-gray-100",
        "text-gray-800",
        "px-2.5",
        "py-0.5",
        "text-sm",
        "custom-class",
      );
    });

    it("allows custom className to override default styles", () => {
      render(<Badge {...defaultProps} className="bg-blue-500 text-white" />);

      const badge = screen.getByText("Badge Text");
      expect(badge).toHaveClass("bg-blue-500", "text-white");
    });
  });

  describe("Combination of Props", () => {
    it("combines variant, size, and custom className correctly", () => {
      render(
        <Badge variant="success" size="lg" className="custom-class">
          Success Badge
        </Badge>,
      );

      const badge = screen.getByText("Success Badge");
      expect(badge).toHaveClass(
        // Base classes
        "inline-flex",
        "items-center",
        "font-medium",
        "rounded-full",
        // Variant classes
        "bg-green-100",
        "text-green-800",
        // Size classes
        "px-3",
        "py-1",
        "text-sm",
        // Custom class
        "custom-class",
      );
    });

    it("works with all variant and size combinations", () => {
      const variants = [
        "default",
        "primary",
        "secondary",
        "success",
        "warning",
        "danger",
        "outline",
      ];
      const sizes = ["sm", "md", "lg"];

      variants.forEach((variant) => {
        sizes.forEach((size) => {
          const { unmount } = render(
            <Badge variant={variant as any} size={size as any}>
              {variant}-{size}
            </Badge>,
          );

          const badge = screen.getByText(`${variant}-${size}`);
          expect(badge).toBeInTheDocument();
          expect(badge).toHaveClass(
            "inline-flex",
            "items-center",
            "font-medium",
            "rounded-full",
          );

          unmount();
        });
      });
    });
  });

  describe("Accessibility", () => {
    it("renders as a span element for semantic correctness", () => {
      render(<Badge {...defaultProps} />);

      const badge = screen.getByText("Badge Text");
      expect(badge.tagName).toBe("SPAN");
    });

    it("maintains proper text content for screen readers", () => {
      render(<Badge>Accessibility Test</Badge>);

      const badge = screen.getByText("Accessibility Test");
      expect(badge).toHaveTextContent("Accessibility Test");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty children gracefully", () => {
      const { container } = render(<Badge></Badge>);

      const badge = container.querySelector('[class*="inline-flex"]');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass(
        "inline-flex",
        "items-center",
        "font-medium",
        "rounded-full",
      );
    });

    it("handles null children gracefully", () => {
      const { container } = render(<Badge>{null}</Badge>);

      const badge = container.querySelector('[class*="inline-flex"]');
      expect(badge).toBeInTheDocument();
    });

    it("handles undefined children gracefully", () => {
      const { container } = render(<Badge>{undefined}</Badge>);

      const badge = container.querySelector('[class*="inline-flex"]');
      expect(badge).toBeInTheDocument();
    });
  });
});
