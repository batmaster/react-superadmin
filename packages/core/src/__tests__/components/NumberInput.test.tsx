import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NumberInput } from "../../components/NumberInput";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";

const mockConfig = {
  title: "Test Admin",
  theme: { primary: "#1976d2" },
  layout: { sidebarWidth: 240 },
  auth: { enabled: true },
  resources: [],
};

describe("NumberInput", () => {
  const renderWithProvider = (props: any) => {
    return render(
      <SuperAdminProvider config={mockConfig}>
        <NumberInput {...props} />
      </SuperAdminProvider>,
    );
  };

  it("renders without crashing", () => {
    renderWithProvider({});
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("renders with label", () => {
    renderWithProvider({ label: "Age" });
    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("renders with required indicator", () => {
    renderWithProvider({ label: "Age", required: true });
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders with helper text", () => {
    renderWithProvider({ helperText: "Please enter your age" });
    expect(screen.getByText("Please enter your age")).toBeInTheDocument();
  });

  it("renders with error message", () => {
    renderWithProvider({ error: "Invalid age" });
    expect(screen.getByText("Invalid age")).toBeInTheDocument();
  });

  it("renders with custom size", () => {
    renderWithProvider({ size: "lg" });
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveClass("px-4", "py-3", "text-lg");
  });

  it("renders with full width", () => {
    renderWithProvider({ fullWidth: true });
    const wrapper = screen.getByRole("spinbutton").closest("div");
    expect(wrapper).toHaveClass("w-full");
  });

  it("renders with left icon", () => {
    renderWithProvider({ leftIcon: "🔢" });
    expect(screen.getByText("🔢")).toBeInTheDocument();
  });

  it("renders with right icon", () => {
    renderWithProvider({ rightIcon: "🔢" });
    expect(screen.getByText("🔢")).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    renderWithProvider({ placeholder: "Enter your age" });
    expect(screen.getByRole("spinbutton")).toHaveAttribute(
      "placeholder",
      "Enter your age",
    );
  });

  it("shows increment/decrement controls when showControls is true", () => {
    renderWithProvider({ showControls: true });
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("applies min and max attributes", () => {
    renderWithProvider({ min: 0, max: 100 });
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "100");
  });

  it("applies step attribute", () => {
    renderWithProvider({ step: 0.5 });
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("step", "0.5");
  });

  it("handles input change", () => {
    const handleChange = jest.fn();
    renderWithProvider({ onChange: handleChange });

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "25" } });

    expect(handleChange).toHaveBeenCalled();
  });

  it("handles input blur", () => {
    const handleBlur = jest.fn();
    renderWithProvider({ onBlur: handleBlur });

    const input = screen.getByRole("spinbutton");
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalled();
  });

  it("handles input focus", () => {
    renderWithProvider({});

    const input = screen.getByRole("spinbutton");
    fireEvent.focus(input);

    expect(input).toHaveClass("border-blue-500");
  });

  it("increments value when + button is clicked", () => {
    const handleChange = jest.fn();
    renderWithProvider({
      showControls: true,
      value: "10",
      onChange: handleChange,
    });

    const incrementButton = screen.getByText("+");
    fireEvent.click(incrementButton);

    expect(handleChange).toHaveBeenCalled();
  });

  it("decrements value when - button is clicked", () => {
    const handleChange = jest.fn();
    renderWithProvider({
      showControls: true,
      value: "10",
      onChange: handleChange,
    });

    const decrementButton = screen.getByText("-");
    fireEvent.click(decrementButton);

    expect(handleChange).toHaveBeenCalled();
  });

  it("respects min value when decrementing", () => {
    const handleChange = jest.fn();
    renderWithProvider({
      showControls: true,
      min: 0,
      value: "0",
      onChange: handleChange,
    });

    const decrementButton = screen.getByText("-");
    fireEvent.click(decrementButton);

    // Should not call onChange when trying to go below min
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("respects max value when incrementing", () => {
    const handleChange = jest.fn();
    renderWithProvider({
      showControls: true,
      max: 100,
      value: "100",
      onChange: handleChange,
    });

    const incrementButton = screen.getByText("+");
    fireEvent.click(incrementButton);

    // Should not call onChange when trying to go above max
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("applies error styling when error is present", () => {
    renderWithProvider({ error: "Invalid number" });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveClass(
      "border-red-300",
      "focus:ring-red-500",
      "focus:border-red-500",
    );
  });

  it("applies focused styling when focused", () => {
    renderWithProvider({});

    const input = screen.getByRole("spinbutton");
    fireEvent.focus(input);

    expect(input).toHaveClass("border-blue-500");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    renderWithProvider({ ref });

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("applies custom className", () => {
    renderWithProvider({ className: "custom-number-input" });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveClass("custom-number-input");
  });

  it("applies custom wrapper className", () => {
    renderWithProvider({ wrapperClassName: "custom-wrapper" });

    const wrapper = screen.getByRole("spinbutton").closest("div");
    expect(wrapper).toHaveClass("custom-wrapper");
  });

  it("handles disabled state", () => {
    renderWithProvider({ disabled: true });

    const input = screen.getByRole("spinbutton");
    expect(input).toBeDisabled();
    expect(input).toHaveClass(
      "disabled:bg-gray-50",
      "disabled:text-gray-500",
      "disabled:cursor-not-allowed",
    );
  });

  it("handles value prop correctly", () => {
    renderWithProvider({ value: "25" });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue("25");
  });

  it("applies correct padding when left icon is present", () => {
    renderWithProvider({ leftIcon: "🔢" });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveClass("pl-10");
  });

  it("applies correct padding when right icon is present", () => {
    renderWithProvider({ rightIcon: "🔢" });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveClass("pr-24");
  });

  it("applies correct padding when controls are present", () => {
    renderWithProvider({ showControls: true });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveClass("pr-24");
  });

  it("applies correct size classes for small size", () => {
    renderWithProvider({ size: "sm" });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveClass("px-3", "py-1.5", "text-sm");
  });

  it("applies correct size classes for large size", () => {
    renderWithProvider({ size: "lg" });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveClass("px-4", "py-3", "text-lg");
  });

  it("applies correct icon size classes for small size", () => {
    renderWithProvider({ size: "sm", leftIcon: "🔢" });

    const icon = screen.getByText("🔢");
    expect(icon.parentElement).toHaveClass("w-4", "h-4");
  });

  it("applies correct icon size classes for large size", () => {
    renderWithProvider({ size: "lg", leftIcon: "🔢" });

    const icon = screen.getByText("🔢");
    expect(icon.parentElement).toHaveClass("w-6", "h-6");
  });

  it("shows range indicator when min or max is set", () => {
    renderWithProvider({
      showRangeIndicator: true,
      min: 0,
      max: 100,
      value: "50",
    });

    expect(screen.getByText("Min: 0 - Max: 100")).toBeInTheDocument();
  });

  it("shows number statistics when showStatistics is true", () => {
    renderWithProvider({ showStatistics: true, value: "25" });

    expect(screen.getByText("Statistics:")).toBeInTheDocument();
    expect(screen.getByText("Even: No")).toBeInTheDocument();
    expect(screen.getByText("Positive: Yes")).toBeInTheDocument();
    expect(screen.getByText("Integer: Yes")).toBeInTheDocument();
  });

  it("shows number suggestions when showSuggestions is true", () => {
    const suggestions = [10, 20, 30];
    renderWithProvider({ showSuggestions: true, suggestions });

    expect(screen.getByText("Suggestions:")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("handles suggestion click", () => {
    const handleChange = jest.fn();
    const suggestions = [10, 20, 30];
    renderWithProvider({
      showSuggestions: true,
      suggestions,
      onChange: handleChange,
    });

    const suggestion = screen.getByText("20");
    fireEvent.click(suggestion);

    expect(handleChange).toHaveBeenCalled();
  });

  it("shows number preview when showPreview is true", () => {
    renderWithProvider({ showPreview: true, value: "25" });

    expect(screen.getByText("Preview: 25")).toBeInTheDocument();
  });

  it("validates number format correctly", () => {
    renderWithProvider({ showValidation: true, min: 0, max: 100 });

    const input = screen.getByRole("spinbutton");

    // Valid number
    fireEvent.change(input, { target: { value: "50" } });
    fireEvent.blur(input);

    expect(
      screen.queryByText(/Value must be at least/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Value must be at most/)).not.toBeInTheDocument();

    // Below min
    fireEvent.change(input, { target: { value: "-10" } });
    fireEvent.blur(input);

    expect(screen.getByText("Value must be at least 0")).toBeInTheDocument();

    // Above max
    fireEvent.change(input, { target: { value: "150" } });
    fireEvent.blur(input);

    expect(screen.getByText("Value must be at most 100")).toBeInTheDocument();
  });

  it("uses custom validation function when provided", () => {
    const customValidator = jest.fn().mockReturnValue("Custom error message");
    renderWithProvider({
      showValidation: true,
      validateNumber: customValidator,
      value: "25",
    });

    expect(customValidator).toHaveBeenCalledWith(25);
    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });

  it("prevents negative numbers when allowNegative is false", () => {
    renderWithProvider({ showValidation: true, allowNegative: false });

    const input = screen.getByRole("spinbutton");

    // Try to enter negative number
    fireEvent.change(input, { target: { value: "-10" } });
    fireEvent.blur(input);

    expect(
      screen.getByText("Negative numbers are not allowed"),
    ).toBeInTheDocument();
  });

  it("prevents decimal numbers when allowDecimals is false", () => {
    renderWithProvider({ showValidation: true, allowDecimals: false });

    const input = screen.getByRole("spinbutton");

    // Try to enter decimal number
    fireEvent.change(input, { target: { value: "10.5" } });
    fireEvent.blur(input);

    expect(
      screen.getByText("Decimal values are not allowed"),
    ).toBeInTheDocument();
  });

  it("maintains input value state correctly", () => {
    const { rerender } = renderWithProvider({ value: "25" });

    let input = screen.getByRole("spinbutton");
    expect(input).toHaveValue("25");

    rerender(
      <SuperAdminProvider config={mockConfig}>
        <NumberInput value="50" />
      </SuperAdminProvider>,
    );

    input = screen.getByRole("spinbutton");
    expect(input).toHaveValue("50");
  });

  it("handles empty value correctly", () => {
    renderWithProvider({ value: "" });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue("");
  });

  it("handles null value correctly", () => {
    renderWithProvider({ value: null as any });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue("");
  });

  it("handles undefined value correctly", () => {
    renderWithProvider({ value: undefined });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue("");
  });

  it("formats currency correctly", () => {
    renderWithProvider({ currency: true, value: "25.50" });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue("$25.50");
  });

  it("formats percentage correctly", () => {
    renderWithProvider({ percentage: true, value: "25" });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue("25%");
  });

  it("formats with thousands separator", () => {
    renderWithProvider({ showThousandsSeparator: true, value: "1000" });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue("1,000");
  });

  it("formats with custom prefix and suffix", () => {
    renderWithProvider({ prefix: "Age: ", suffix: " years", value: "25" });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue("Age: 25 years");
  });

  it("formats scientific notation", () => {
    renderWithProvider({ scientific: true, value: "1000" });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue("1.00e+3");
  });

  it("formats compact notation", () => {
    renderWithProvider({ compact: true, value: "1000" });

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue("1.0K");
  });
});
