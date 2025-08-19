import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../../components/Button";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";

// Mock the SuperAdminContext
const mockConfig = {
  title: "Test Admin",
  resources: {},
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#6b7280",
    darkMode: false,
  },
  layout: {
    sidebar: true,
    header: true,
    footer: true,
    sidebarWidth: 250,
  },
  auth: {
    enabled: true,
    loginUrl: "/login",
    logoutUrl: "/logout",
  },
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SuperAdminProvider config={mockConfig}>{children}</SuperAdminProvider>
);

describe("Button", () => {
  it("renders children correctly", () => {
    render(
      <TestWrapper>
        <Button>Click me</Button>
      </TestWrapper>,
    );

    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <TestWrapper>
        <Button className="custom-class">Click me</Button>
      </TestWrapper>,
    );

    const button = screen.getByTestId("button");
    expect(button).toHaveClass("custom-class");
  });

  it("has correct default props", () => {
    render(
      <TestWrapper>
        <Button>Click me</Button>
      </TestWrapper>,
    );

    const button = screen.getByTestId("button");
    expect(button).toHaveAttribute("data-variant", "primary");
    expect(button).toHaveAttribute("data-size", "md");
    expect(button).toHaveAttribute("data-loading", "false");
    expect(button).toHaveAttribute("data-full-width", "false");
  });

  it("applies variant prop correctly", () => {
    const variants = [
      "primary",
      "secondary",
      "success",
      "warning",
      "danger",
      "ghost",
      "outline",
    ] as const;

    variants.forEach((variant) => {
      render(
        <TestWrapper>
          <Button variant={variant}>Click me</Button>
        </TestWrapper>,
      );

      const button = screen.getByTestId("button");
      expect(button).toHaveAttribute("data-variant", variant);
    });
  });

  it("applies size prop correctly", () => {
    const sizes = ["sm", "md", "lg", "xl"] as const;

    sizes.forEach((size) => {
      render(
        <TestWrapper>
          <Button size={size}>Click me</Button>
        </TestWrapper>,
      );

      const button = screen.getByTestId("button");
      expect(button).toHaveAttribute("data-size", size);
    });
  });

  it("applies loading prop correctly", () => {
    render(
      <TestWrapper>
        <Button loading>Click me</Button>
      </TestWrapper>,
    );

    const button = screen.getByTestId("button");
    expect(button).toHaveAttribute("data-loading", "true");
    expect(button).toBeDisabled();
  });

  it("shows loading spinner when loading", () => {
    render(
      <TestWrapper>
        <Button loading>Click me</Button>
      </TestWrapper>,
    );

    const spinner = screen.getByRole("img", { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  it("shows loading text when provided", () => {
    render(
      <TestWrapper>
        <Button loading loadingText="Processing...">
          Click me
        </Button>
      </TestWrapper>,
    );

    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });

  it("applies fullWidth prop correctly", () => {
    render(
      <TestWrapper>
        <Button fullWidth>Click me</Button>
      </TestWrapper>,
    );

    const button = screen.getByTestId("button");
    expect(button).toHaveAttribute("data-full-width", "true");
    expect(button).toHaveClass("w-full");
  });

  it("renders left icon correctly", () => {
    const leftIcon = <span data-testid="left-icon">🔍</span>;
    render(
      <TestWrapper>
        <Button leftIcon={leftIcon}>Search</Button>
      </TestWrapper>,
    );

    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders right icon correctly", () => {
    const rightIcon = <span data-testid="right-icon">→</span>;
    render(
      <TestWrapper>
        <Button rightIcon={rightIcon}>Next</Button>
      </TestWrapper>,
    );

    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(
      <TestWrapper>
        <Button onClick={handleClick}>Click me</Button>
      </TestWrapper>,
    );

    const button = screen.getByTestId("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when loading", () => {
    render(
      <TestWrapper>
        <Button loading>Click me</Button>
      </TestWrapper>,
    );

    const button = screen.getByTestId("button");
    expect(button).toBeDisabled();
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <TestWrapper>
        <Button disabled>Click me</Button>
      </TestWrapper>,
    );

    const button = screen.getByTestId("button");
    expect(button).toBeDisabled();
  });

  it("has correct default className", () => {
    render(
      <TestWrapper>
        <Button>Click me</Button>
      </TestWrapper>,
    );

    const button = screen.getByTestId("button");
    expect(button).toHaveClass("inline-flex", "items-center", "justify-center");
  });

  it("applies variant classes correctly", () => {
    render(
      <TestWrapper>
        <Button variant="success">Click me</Button>
      </TestWrapper>,
    );

    const button = screen.getByTestId("button");
    expect(button).toHaveClass("bg-green-600", "text-white");
  });

  it("applies size classes correctly", () => {
    render(
      <TestWrapper>
        <Button size="lg">Click me</Button>
      </TestWrapper>,
    );

    const button = screen.getByTestId("button");
    expect(button).toHaveClass("px-6", "py-3", "text-base");
  });

  it("forwards additional props", () => {
    render(
      <TestWrapper>
        <Button data-testid="custom-button" aria-label="Custom button">
          Click me
        </Button>
      </TestWrapper>,
    );

    const button = screen.getByTestId("custom-button");
    expect(button).toHaveAttribute("aria-label", "Custom button");
  });
});
