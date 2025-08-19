import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../../components/Input";
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

describe("Input", () => {
  it("renders input correctly", () => {
    render(
      <TestWrapper>
        <Input placeholder="Enter text" />
      </TestWrapper>,
    );

    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders label correctly", () => {
    render(
      <TestWrapper>
        <Input label="Email Address" />
      </TestWrapper>,
    );

    expect(screen.getByText("Email Address")).toBeInTheDocument();
  });

  it("renders helper text correctly", () => {
    render(
      <TestWrapper>
        <Input helperText="This field is required" />
      </TestWrapper>,
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("renders error message correctly", () => {
    render(
      <TestWrapper>
        <Input error="Invalid email format" />
      </TestWrapper>,
    );

    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
  });

  it("shows required indicator when required is true", () => {
    render(
      <TestWrapper>
        <Input label="Email Address" required />
      </TestWrapper>,
    );

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <TestWrapper>
        <Input className="custom-class" />
      </TestWrapper>,
    );

    const input = screen.getByTestId("input");
    expect(input).toHaveClass("custom-class");
  });

  it("applies wrapper className", () => {
    render(
      <TestWrapper>
        <Input wrapperClassName="wrapper-class" />
      </TestWrapper>,
    );

    const wrapper = input.parentElement?.parentElement;
    expect(wrapper).toHaveClass("wrapper-class");
  });

  it("has correct default props", () => {
    render(
      <TestWrapper>
        <Input />
      </TestWrapper>,
    );

    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("data-size", "md");
    expect(input).toHaveAttribute("data-error", "false");
    expect(input).toHaveAttribute("data-disabled", "false");
    expect(input).toHaveAttribute("data-full-width", "false");
  });

  it("applies size prop correctly", () => {
    const sizes = ["sm", "md", "lg"] as const;

    sizes.forEach((size) => {
      render(
        <TestWrapper>
          <Input size={size} />
        </TestWrapper>,
      );

      const input = screen.getByTestId("input");
      expect(input).toHaveAttribute("data-size", size);
    });
  });

  it("applies fullWidth prop correctly", () => {
    render(
      <TestWrapper>
        <Input fullWidth />
      </TestWrapper>,
    );

    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("data-full-width", "true");
  });

  it("renders left icon correctly", () => {
    const leftIcon = <span data-testid="left-icon">🔍</span>;
    render(
      <TestWrapper>
        <Input leftIcon={leftIcon} />
      </TestWrapper>,
    );

    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders right icon correctly", () => {
    const rightIcon = <span data-testid="right-icon">→</span>;
    render(
      <TestWrapper>
        <Input rightIcon={rightIcon} />
      </TestWrapper>,
    );

    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("applies padding when icons are present", () => {
    const leftIcon = <span>🔍</span>;
    const rightIcon = <span>→</span>;

    render(
      <TestWrapper>
        <Input leftIcon={leftIcon} rightIcon={rightIcon} />
      </TestWrapper>,
    );

    const input = screen.getByTestId("input");
    expect(input).toHaveClass("pl-10", "pr-10");
  });

  it("handles user input correctly", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <Input placeholder="Enter text" />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText("Enter text");
    await user.type(input, "Hello World");

    expect(input).toHaveValue("Hello World");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(
      <TestWrapper>
        <Input ref={ref} />
      </TestWrapper>,
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("forwards additional props", () => {
    render(
      <TestWrapper>
        <Input
          data-testid="custom-input"
          aria-label="Custom input"
          maxLength={10}
        />
      </TestWrapper>,
    );

    const input = screen.getByTestId("custom-input");
    expect(input).toHaveAttribute("aria-label", "Custom input");
    expect(input).toHaveAttribute("maxLength", "10");
  });

  it("applies error styles when error is present", () => {
    render(
      <TestWrapper>
        <Input error="Error message" />
      </TestWrapper>,
    );

    const input = screen.getByTestId("input");
    expect(input).toHaveClass(
      "border-red-300",
      "focus:border-red-500",
      "focus:ring-red-500",
    );
  });

  it("applies disabled styles when disabled", () => {
    render(
      <TestWrapper>
        <Input disabled />
      </TestWrapper>,
    );

    const input = screen.getByTestId("input");
    expect(input).toHaveClass("opacity-50", "cursor-not-allowed");
    expect(input).toBeDisabled();
  });

  it("has correct default className", () => {
    render(
      <TestWrapper>
        <Input />
      </TestWrapper>,
    );

    const input = screen.getByTestId("input");
    expect(input).toHaveClass("block", "w-full", "rounded-md", "border");
  });

  it("applies size classes correctly", () => {
    render(
      <TestWrapper>
        <Input size="lg" />
      </TestWrapper>,
    );

    const input = screen.getByTestId("input");
    expect(input).toHaveClass("px-4", "py-3", "text-base");
  });

  it("prioritizes error over helper text", () => {
    render(
      <TestWrapper>
        <Input helperText="Helper text" error="Error message" />
      </TestWrapper>,
    );

    expect(screen.getByText("Error message")).toBeInTheDocument();
    expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
  });
});
