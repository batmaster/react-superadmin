import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../../../components/ui/Button";

describe("Button", () => {
  const defaultProps = {
    children: "Click me",
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with default variant", () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
    expect(button).toHaveClass("bg-primary-600");
  });

  it("should render with different variants", () => {
    render(<Button {...defaultProps} variant="outline" />);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("border", "border-gray-300", "bg-white");
  });

  it("should render with different sizes", () => {
    render(<Button {...defaultProps} size="sm" />);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("px-3", "py-1.5", "text-sm");
  });

  it("should handle click events", () => {
    const onClick = jest.fn();
    render(<Button {...defaultProps} onClick={onClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should show loading state", () => {
    render(<Button loading>Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("should be disabled when loading", () => {
    render(<Button loading>Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should render with primary variant", () => {
    render(<Button variant="primary">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary-600", "hover:bg-primary-700");
  });

  it("should render with secondary variant", () => {
    render(<Button variant="secondary">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-600", "hover:bg-gray-700");
  });

  it("should render with outline variant", () => {
    render(<Button variant="outline">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("border", "bg-white", "text-gray-700");
  });

  it("should render with ghost variant", () => {
    render(<Button variant="ghost">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-gray-700", "hover:bg-gray-100");
  });

  it("should render with danger variant", () => {
    render(<Button variant="danger">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-red-600", "hover:bg-red-700");
  });

  it("should render with success variant", () => {
    render(<Button variant="success">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-green-600", "hover:bg-green-700");
  });

  it("should render with warning variant", () => {
    render(<Button variant="warning">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-yellow-600", "hover:bg-yellow-700");
  });

  it("should render with xs size", () => {
    render(<Button size="xs">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-2", "py-1", "text-xs");
  });

  it("should render with xl size", () => {
    render(<Button size="xl">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-8", "py-4", "text-lg");
  });

  it("should render with left icon", () => {
    const icon = <span data-testid="left-icon">🚀</span>;
    render(<Button leftIcon={icon}>Click me</Button>);

    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("should render with right icon", () => {
    const icon = <span data-testid="right-icon">🎯</span>;
    render(<Button rightIcon={icon}>Click me</Button>);

    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("should render with both icons", () => {
    const leftIcon = <span data-testid="left-icon">🚀</span>;
    const rightIcon = <span data-testid="right-icon">🎯</span>;
    render(
      <Button leftIcon={leftIcon} rightIcon={rightIcon}>
        Click me
      </Button>,
    );

    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("should not render icons when loading", () => {
    const leftIcon = <span data-testid="left-icon">🚀</span>;
    const rightIcon = <span data-testid="right-icon">🎯</span>;
    render(
      <Button leftIcon={leftIcon} rightIcon={rightIcon} loading>
        Click me
      </Button>,
    );

    expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();
  });

  it("should render with full width", () => {
    render(<Button fullWidth>Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-full");
  });

  it("should render with rounded style", () => {
    render(<Button rounded>Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-full");
  });

  it("should have proper ARIA attributes when disabled", () => {
    render(<Button disabled>Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("should have proper ARIA attributes when loading", () => {
    render(<Button loading>Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("should apply custom className", () => {
    render(<Button className="custom-class">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("should handle all button HTML attributes", () => {
    render(
      <Button
        type="submit"
        form="test-form"
        name="test-button"
        value="test-value"
      >
        Click me
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("form", "test-form");
    expect(button).toHaveAttribute("name", "test-button");
    expect(button).toHaveAttribute("value", "test-value");
  });

  it("should have proper focus and hover states", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "focus:ring-2",
      "focus:ring-offset-2",
      "hover:bg-primary-700",
    );
  });

  it("should have proper transition effects", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "transition-all",
      "duration-200",
      "active:scale-95",
    );
  });

  it("should have proper shadow effects", () => {
    render(<Button variant="primary">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("shadow-sm", "hover:shadow-md");
  });
});
