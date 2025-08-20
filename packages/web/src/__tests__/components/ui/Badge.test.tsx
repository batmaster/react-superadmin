import React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "../../../components/ui/Badge";

describe("Badge", () => {
  it("renders with default props", () => {
    render(<Badge>Test Badge</Badge>);
    const badge = screen.getByText("Test Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "bg-gray-100",
      "text-gray-800",
      "border-gray-200",
    );
  });

  it("renders with different variants", () => {
    const { rerender } = render(<Badge variant="primary">Primary</Badge>);
    expect(screen.getByText("Primary")).toHaveClass(
      "bg-blue-100",
      "text-blue-800",
    );

    rerender(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText("Secondary")).toHaveClass(
      "bg-gray-100",
      "text-gray-800",
    );

    rerender(<Badge variant="success">Success</Badge>);
    expect(screen.getByText("Success")).toHaveClass(
      "bg-green-100",
      "text-green-800",
    );

    rerender(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText("Warning")).toHaveClass(
      "bg-yellow-100",
      "text-yellow-800",
    );

    rerender(<Badge variant="danger">Danger</Badge>);
    expect(screen.getByText("Danger")).toHaveClass(
      "bg-red-100",
      "text-red-800",
    );

    rerender(<Badge variant="info">Info</Badge>);
    expect(screen.getByText("Info")).toHaveClass("bg-sky-100", "text-sky-800");

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText("Outline")).toHaveClass(
      "bg-white",
      "text-gray-700",
    );
  });

  it("renders with different sizes", () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText("Small")).toHaveClass("px-2", "py-0.5", "text-xs");

    rerender(<Badge size="md">Medium</Badge>);
    expect(screen.getByText("Medium")).toHaveClass("px-2.5", "py-1", "text-sm");

    rerender(<Badge size="lg">Large</Badge>);
    expect(screen.getByText("Large")).toHaveClass(
      "px-3",
      "py-1.5",
      "text-base",
    );
  });

  it("renders with rounded variant", () => {
    render(<Badge rounded>Rounded</Badge>);
    expect(screen.getByText("Rounded")).toHaveClass("rounded-full");
  });

  it("renders without rounded variant", () => {
    render(<Badge>Not Rounded</Badge>);
    expect(screen.getByText("Not Rounded")).toHaveClass("rounded-md");
  });

  it("applies custom className", () => {
    render(<Badge className="custom-class">Custom</Badge>);
    expect(screen.getByText("Custom")).toHaveClass("custom-class");
  });

  it("passes through HTML attributes", () => {
    render(
      <Badge data-testid="badge" title="Tooltip">
        Test
      </Badge>,
    );
    const badge = screen.getByTestId("badge");
    expect(badge).toHaveAttribute("title", "Tooltip");
  });

  it("renders with all variants and sizes", () => {
    const variants = [
      "default",
      "primary",
      "secondary",
      "success",
      "warning",
      "danger",
      "info",
      "outline",
    ] as const;
    const sizes = ["sm", "md", "lg"] as const;

    variants.forEach((variant) => {
      sizes.forEach((size) => {
        const { unmount } = render(
          <Badge variant={variant} size={size}>
            {variant}-{size}
          </Badge>,
        );

        const badge = screen.getByText(`${variant}-${size}`);
        expect(badge).toBeInTheDocument();
        unmount();
      });
    });
  });
});
