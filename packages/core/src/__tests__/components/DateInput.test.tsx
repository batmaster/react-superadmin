import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DateInput } from "../../components/DateInput";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";

const mockConfig = {
  title: "Test Admin",
  theme: { primary: "#1976d2" },
  layout: { sidebarWidth: 240 },
  auth: { enabled: true },
  resources: [],
};

describe("DateInput", () => {
  const renderWithProvider = (props: any) => {
    return render(
      <SuperAdminProvider config={mockConfig}>
        <DateInput {...props} />
      </SuperAdminProvider>,
    );
  };

  beforeEach(() => {
    // Mock current date to ensure consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-15"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders without crashing", () => {
    renderWithProvider({});
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with label", () => {
    renderWithProvider({ label: "Birth Date" });
    expect(screen.getByText("Birth Date")).toBeInTheDocument();
  });

  it("renders with required indicator", () => {
    renderWithProvider({ label: "Birth Date", required: true });
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders with helper text", () => {
    renderWithProvider({ helperText: "Please enter your birth date" });
    expect(
      screen.getByText("Please enter your birth date"),
    ).toBeInTheDocument();
  });

  it("renders with error message", () => {
    renderWithProvider({ error: "Invalid date format" });
    expect(screen.getByText("Invalid date format")).toBeInTheDocument();
  });

  it("renders with custom size", () => {
    renderWithProvider({ size: "lg" });
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("px-4", "py-3", "text-lg");
  });

  it("renders with full width", () => {
    renderWithProvider({ fullWidth: true });
    const wrapper = screen.getByRole("textbox").closest("div");
    expect(wrapper).toHaveClass("w-full");
  });

  it("renders with left icon", () => {
    renderWithProvider({ leftIcon: "📅" });
    expect(screen.getByText("📅")).toBeInTheDocument();
  });

  it("renders with right icon", () => {
    renderWithProvider({ rightIcon: "📅" });
    expect(screen.getByText("📅")).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    renderWithProvider({ placeholder: "Choose a date" });
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "Choose a date",
    );
  });

  it("shows today button when showTodayButton is true", () => {
    renderWithProvider({ showTodayButton: true });
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("shows clear button when showClearButton is true and has value", () => {
    renderWithProvider({ showClearButton: true, value: "2024-01-15" });
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("does not show clear button when no value", () => {
    renderWithProvider({ showClearButton: true });
    expect(screen.queryByText("Clear")).not.toBeInTheDocument();
  });

  it("handles input change", () => {
    const handleChange = jest.fn();
    renderWithProvider({ onChange: handleChange });

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "2024-01-20" } });

    expect(handleChange).toHaveBeenCalled();
  });

  it("handles input blur", () => {
    const handleBlur = jest.fn();
    renderWithProvider({ onBlur: handleBlur });

    const input = screen.getByRole("textbox");
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalled();
  });

  it("handles input focus", () => {
    renderWithProvider({});

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    expect(input).toHaveClass("border-blue-500");
  });

  it("handles today button click", () => {
    const handleChange = jest.fn();
    renderWithProvider({ showTodayButton: true, onChange: handleChange });

    const todayButton = screen.getByText("Today");
    fireEvent.click(todayButton);

    expect(handleChange).toHaveBeenCalled();
  });

  it("handles clear button click", () => {
    const handleChange = jest.fn();
    renderWithProvider({
      showClearButton: true,
      value: "2024-01-15",
      onChange: handleChange,
    });

    const clearButton = screen.getByText("Clear");
    fireEvent.click(clearButton);

    expect(handleChange).toHaveBeenCalled();
  });

  it("applies min date constraint", () => {
    const minDate = new Date("2024-01-01");
    renderWithProvider({ minDate });

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("min", "2024-01-01");
  });

  it("applies max date constraint", () => {
    const maxDate = new Date("2024-12-31");
    renderWithProvider({ maxDate });

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("max", "2024-12-31");
  });

  it("applies error styling when error is present", () => {
    renderWithProvider({ error: "Invalid date" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(
      "border-red-300",
      "focus:ring-red-500",
      "focus:border-red-500",
    );
  });

  it("applies focused styling when focused", () => {
    renderWithProvider({});

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    expect(input).toHaveClass("border-blue-500");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    renderWithProvider({ ref });

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("applies custom className", () => {
    renderWithProvider({ className: "custom-date-input" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-date-input");
  });

  it("applies custom wrapper className", () => {
    renderWithProvider({ wrapperClassName: "custom-wrapper" });

    const wrapper = screen.getByRole("textbox").closest("div");
    expect(wrapper).toHaveClass("custom-wrapper");
  });

  it("handles disabled state", () => {
    renderWithProvider({ disabled: true });

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    expect(input).toHaveClass(
      "disabled:bg-gray-50",
      "disabled:text-gray-500",
      "disabled:cursor-not-allowed",
    );
  });

  it("handles value prop correctly", () => {
    renderWithProvider({ value: "2024-01-15" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("2024-01-15");
  });

  it("handles Date object value correctly", () => {
    const dateValue = new Date("2024-01-15");
    renderWithProvider({ value: dateValue });

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("2024-01-15");
  });

  it("handles empty value correctly", () => {
    renderWithProvider({ value: "" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("handles null value correctly", () => {
    renderWithProvider({ value: null as any });

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("handles undefined value correctly", () => {
    renderWithProvider({ value: undefined });

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("applies correct padding when left icon is present", () => {
    renderWithProvider({ leftIcon: "📅" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("pl-10");
  });

  it("applies correct padding when right icon is present", () => {
    renderWithProvider({ rightIcon: "📅" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("pr-10");
  });

  it("applies correct padding when both icons are present", () => {
    renderWithProvider({ leftIcon: "📅", rightIcon: "📅" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("pl-10", "pr-10");
  });

  it("handles custom date format", () => {
    const customFormatDate = (date: Date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    renderWithProvider({
      formatDate: customFormatDate,
      value: new Date("2024-01-15"),
    });

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("15/1/2024");
  });

  it("handles custom date parser", () => {
    const customParseDate = (value: string) => {
      if (!value) return null;
      const [day, month, year] = value.split("/");
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };

    const handleChange = jest.fn();
    renderWithProvider({
      parseDate: customParseDate,
      onChange: handleChange,
    });

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "15/1/2024" } });

    expect(handleChange).toHaveBeenCalled();
  });

  it("handles UTC dates when useUTC is true", () => {
    renderWithProvider({
      useUTC: true,
      value: new Date("2024-01-15T12:00:00Z"),
    });

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("2024-01-15");
  });

  it("applies correct size classes for small size", () => {
    renderWithProvider({ size: "sm" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("px-3", "py-1.5", "text-sm");
  });

  it("applies correct size classes for large size", () => {
    renderWithProvider({ size: "lg" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("px-4", "py-3", "text-lg");
  });

  it("applies correct icon size classes for small size", () => {
    renderWithProvider({ size: "sm", leftIcon: "📅" });

    const icon = screen.getByText("📅");
    expect(icon.parentElement).toHaveClass("w-4", "h-4");
  });

  it("applies correct icon size classes for large size", () => {
    renderWithProvider({ size: "lg", leftIcon: "📅" });

    const icon = screen.getByText("📅");
    expect(icon.parentElement).toHaveClass("w-6", "h-6");
  });

  it("handles invalid date input gracefully", () => {
    const handleChange = jest.fn();
    renderWithProvider({ onChange: handleChange });

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "invalid-date" } });

    expect(handleChange).toHaveBeenCalled();
  });

  it("maintains input value state correctly", () => {
    const { rerender } = renderWithProvider({ value: "2024-01-15" });

    let input = screen.getByRole("textbox");
    expect(input).toHaveValue("2024-01-15");

    rerender(
      <SuperAdminProvider config={mockConfig}>
        <DateInput value="2024-01-20" />
      </SuperAdminProvider>,
    );

    input = screen.getByRole("textbox");
    expect(input).toHaveValue("2024-01-20");
  });
});
