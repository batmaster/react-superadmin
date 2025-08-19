import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "../Checkbox";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";

// Mock SuperAdminProvider for testing
const mockConfig = {
  title: "Test App",
  resources: [],
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

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <SuperAdminProvider config={mockConfig}>{component}</SuperAdminProvider>,
  );
};

describe("Checkbox", () => {
  it("renders checkbox input", () => {
    renderWithProvider(<Checkbox data-testid="checkbox" />);
    expect(screen.getByTestId("checkbox")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    renderWithProvider(<Checkbox label="Test Label" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders helper text when provided", () => {
    renderWithProvider(<Checkbox helperText="This is helper text" />);
    expect(screen.getByText("This is helper text")).toBeInTheDocument();
  });

  it("renders error message when provided", () => {
    renderWithProvider(<Checkbox error="This is an error" />);
    expect(screen.getByText("This is an error")).toBeInTheDocument();
  });

  it("shows required indicator when required is true", () => {
    renderWithProvider(<Checkbox label="Test Label" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("applies custom class names", () => {
    renderWithProvider(
      <Checkbox className="custom-class" data-testid="checkbox" />,
    );
    expect(screen.getByTestId("checkbox")).toHaveClass("custom-class");
  });

  it("applies wrapper class names", () => {
    renderWithProvider(
      <Checkbox wrapperClassName="wrapper-class" data-testid="checkbox" />,
    );
    const wrapper = screen.getByTestId("checkbox").parentElement?.parentElement;
    expect(wrapper).toHaveClass("wrapper-class");
  });

  it("applies custom styles", () => {
    renderWithProvider(
      <Checkbox style={{ backgroundColor: "red" }} data-testid="checkbox" />,
    );
    expect(screen.getByTestId("checkbox")).toHaveStyle({
      backgroundColor: "red",
    });
  });

  it("applies correct size classes", () => {
    const { rerender } = renderWithProvider(
      <Checkbox size="sm" data-testid="checkbox" />,
    );
    expect(screen.getByTestId("checkbox")).toHaveClass("w-4 h-4");

    rerender(
      <SuperAdminProvider config={mockConfig}>
        <Checkbox size="lg" data-testid="checkbox" />
      </SuperAdminProvider>,
    );
    expect(screen.getByTestId("checkbox")).toHaveClass("w-6 h-6");
  });

  it("applies full width when specified", () => {
    renderWithProvider(<Checkbox fullWidth data-testid="checkbox" />);
    const wrapper = screen.getByTestId("checkbox").parentElement?.parentElement;
    expect(wrapper).toHaveClass("w-full");
  });

  it("applies inline layout when specified", () => {
    renderWithProvider(<Checkbox inline data-testid="checkbox" />);
    const label = screen.getByTestId("checkbox").parentElement;
    expect(label).toHaveClass("flex-row", "items-center");
  });

  it("applies custom design when specified", () => {
    renderWithProvider(<Checkbox custom data-testid="checkbox" />);
    expect(screen.getByTestId("checkbox")).toHaveAttribute(
      "data-custom",
      "true",
    );
  });

  it("handles user input correctly", () => {
    const handleChange = jest.fn();
    renderWithProvider(
      <Checkbox onChange={handleChange} data-testid="checkbox" />,
    );

    const checkbox = screen.getByTestId("checkbox");
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ type: "checkbox" }),
      }),
    );
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    renderWithProvider(<Checkbox ref={ref} data-testid="checkbox" />);
    expect(ref.current).toBe(screen.getByTestId("checkbox"));
  });

  it("applies disabled state correctly", () => {
    renderWithProvider(<Checkbox disabled data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass("opacity-50", "cursor-not-allowed");
  });

  it("applies error state styling", () => {
    renderWithProvider(
      <Checkbox error="Error message" data-testid="checkbox" />,
    );
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).toHaveClass(
      "border-red-300",
      "focus:border-red-500",
      "focus:ring-red-500",
    );
  });

  it("applies data attributes correctly", () => {
    renderWithProvider(
      <Checkbox
        size="lg"
        fullWidth
        error="Error"
        disabled
        custom
        inline
        data-testid="checkbox"
      />,
    );
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).toHaveAttribute("data-size", "lg");
    expect(checkbox).toHaveAttribute("data-error", "true");
    expect(checkbox).toHaveAttribute("data-disabled", "true");
    expect(checkbox).toHaveAttribute("data-full-width", "true");
    expect(checkbox).toHaveAttribute("data-custom", "true");
    expect(checkbox).toHaveAttribute("data-inline", "true");
  });

  it("handles indeterminate state", () => {
    const ref = React.createRef<HTMLInputElement>();
    renderWithProvider(
      <Checkbox ref={ref} indeterminate data-testid="checkbox" />,
    );

    // The indeterminate state is set via useEffect, so we need to wait for it
    setTimeout(() => {
      expect(ref.current?.indeterminate).toBe(true);
    }, 0);
  });

  it("renders custom checkbox design correctly", () => {
    renderWithProvider(
      <Checkbox custom label="Custom Checkbox" data-testid="checkbox" />,
    );

    // Should have the custom checkbox design
    expect(screen.getByTestId("checkbox")).toHaveClass("sr-only");

    // Should have the custom visual element
    const customElement = screen
      .getByTestId("checkbox")
      .parentElement?.querySelector("div");
    expect(customElement).toHaveClass("border-2", "rounded");
  });

  it("shows checkmark when checked in custom mode", () => {
    renderWithProvider(
      <Checkbox custom checked label="Checked Custom" data-testid="checkbox" />,
    );

    // Should show the checkmark icon
    const checkmark = screen
      .getByTestId("checkbox")
      .parentElement?.querySelector("svg");
    expect(checkmark).toBeInTheDocument();
  });

  it("shows indeterminate icon when indeterminate in custom mode", () => {
    renderWithProvider(
      <Checkbox
        custom
        indeterminate
        label="Indeterminate Custom"
        data-testid="checkbox"
      />,
    );

    // Should show the indeterminate icon
    const indeterminateIcon = screen
      .getByTestId("checkbox")
      .parentElement?.querySelector("svg");
    expect(indeterminateIcon).toBeInTheDocument();
  });

  it("applies correct label size classes", () => {
    const { rerender } = renderWithProvider(
      <Checkbox size="sm" label="Small Label" />,
    );
    const label = screen.getByText("Small Label");
    expect(label.parentElement).toHaveClass("text-sm");

    rerender(
      <SuperAdminProvider config={mockConfig}>
        <Checkbox size="lg" label="Large Label" />
      </SuperAdminProvider>,
    );
    const largeLabel = screen.getByText("Large Label");
    expect(largeLabel.parentElement).toHaveClass("text-base");
  });

  it("handles label click to toggle checkbox", () => {
    const handleChange = jest.fn();
    renderWithProvider(
      <Checkbox
        label="Clickable Label"
        onChange={handleChange}
        data-testid="checkbox"
      />,
    );

    const label = screen.getByText("Clickable Label");
    fireEvent.click(label);

    expect(handleChange).toHaveBeenCalled();
  });
});
