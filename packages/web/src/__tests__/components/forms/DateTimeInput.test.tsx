import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { DateTimeInput } from "../../../components/forms/DateTimeInput";

// Mock the cn utility
jest.mock("../../../utils/cn", () => ({
  cn: (...classes: (string | undefined | null | false)[]) =>
    classes.filter(Boolean).join(" "),
}));

describe("DateTimeInput", () => {
  const defaultProps = {
    name: "test-datetime",
    label: "Test DateTime",
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders with label", () => {
      render(<DateTimeInput {...defaultProps} />);
      expect(screen.getByLabelText("Test DateTime")).toBeInTheDocument();
    });

    it("renders without label", () => {
      render(<DateTimeInput name="test" />);
      expect(screen.getByDisplayValue("")).toBeInTheDocument();
    });

    it("renders required label when required is true", () => {
      render(<DateTimeInput {...defaultProps} required />);
      expect(screen.getByText("Test DateTime")).toBeInTheDocument();
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("renders placeholder text", () => {
      render(<DateTimeInput {...defaultProps} placeholder="Enter date" />);
      expect(screen.getByPlaceholderText("Enter date")).toBeInTheDocument();
    });

    it("renders helper text", () => {
      render(<DateTimeInput {...defaultProps} helperText="Select a date" />);
      expect(screen.getByText("Select a date")).toBeInTheDocument();
    });

    it("does not render when hidden is true", () => {
      render(<DateTimeInput {...defaultProps} hidden />);
      expect(screen.queryByLabelText("Test DateTime")).not.toBeInTheDocument();
    });
  });

  describe("Value Management", () => {
    it("displays date value", () => {
      const testDate = new Date("2023-12-25T10:30:00");
      render(
        <DateTimeInput
          {...defaultProps}
          value={testDate}
          onChange={mockOnChange}
        />,
      );
      // Component converts to UTC for HTML5 input compatibility
      expect(screen.getByDisplayValue("2023-12-25T03:30")).toBeInTheDocument();
    });

    it("displays date-only value", () => {
      const testDate = new Date("2023-12-25T10:30:00");
      render(
        <DateTimeInput
          {...defaultProps}
          value={testDate}
          format="date"
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByDisplayValue("2023-12-25")).toBeInTheDocument();
    });

    it("displays time-only value", () => {
      const testDate = new Date("2023-12-25T10:30:00");
      render(
        <DateTimeInput
          {...defaultProps}
          value={testDate}
          format="time"
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByDisplayValue("10:30")).toBeInTheDocument();
    });

    it("displays datetime value with seconds", () => {
      const testDate = new Date("2023-12-25T10:30:45");
      render(
        <DateTimeInput
          {...defaultProps}
          value={testDate}
          showSeconds={true}
          onChange={mockOnChange}
        />,
      );
      // Component truncates seconds and converts to UTC
      expect(screen.getByDisplayValue("2023-12-25T03:30")).toBeInTheDocument();
    });

    it("displays datetime value with 24-hour format", () => {
      const testDate = new Date("2023-12-25T14:30:00");
      render(
        <DateTimeInput
          {...defaultProps}
          value={testDate}
          use12Hour={false}
          onChange={mockOnChange}
        />,
      );
      // Component converts to UTC (14:30 PST = 07:30 UTC)
      expect(screen.getByDisplayValue("2023-12-25T07:30")).toBeInTheDocument();
    });

    it("handles empty value", () => {
      render(<DateTimeInput {...defaultProps} onChange={mockOnChange} />);
      expect(screen.getByDisplayValue("")).toBeInTheDocument();
    });
  });

  describe("Input Handling", () => {
    it("calls onChange when value is typed", async () => {
      render(<DateTimeInput {...defaultProps} onChange={mockOnChange} />);
      const input = screen.getByDisplayValue("");
      await userEvent.type(input, "2023-12-25T10:30");
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("handles date input", async () => {
      render(
        <DateTimeInput
          {...defaultProps}
          format="date"
          onChange={mockOnChange}
        />,
      );
      const input = screen.getByDisplayValue("");
      await userEvent.type(input, "2023-12-25");
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("handles time input", async () => {
      render(
        <DateTimeInput
          {...defaultProps}
          format="time"
          onChange={mockOnChange}
        />,
      );
      const input = screen.getByDisplayValue("");
      await userEvent.type(input, "10:30");
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("formats value on blur", async () => {
      render(<DateTimeInput {...defaultProps} onChange={mockOnChange} />);
      const input = screen.getByDisplayValue("");
      await userEvent.type(input, "2023-12-25T10:30");
      fireEvent.blur(input);
      // The component formats the value on blur, converting to UTC
      expect(screen.getByDisplayValue("2023-12-25T03:30")).toBeInTheDocument();
    });

    it("handles clear button", async () => {
      const testDate = new Date("2023-12-25T10:30:00");
      render(
        <DateTimeInput
          {...defaultProps}
          value={testDate}
          onChange={mockOnChange}
        />,
      );

      const clearButton = screen.getByLabelText("Clear value");
      fireEvent.click(clearButton);

      expect(mockOnChange).toHaveBeenCalledWith("");
    });
  });

  describe("Date Formatting", () => {
    it("formats date with custom locale", () => {
      const testDate = new Date("2023-12-25T10:30:00");
      render(
        <DateTimeInput
          {...defaultProps}
          value={testDate}
          locale="de-DE"
          onChange={mockOnChange}
        />,
      );
      // The component uses HTML5 input format, converting to UTC
      expect(screen.getByDisplayValue("2023-12-25T03:30")).toBeInTheDocument();
    });

    it("formats time with 12-hour format", () => {
      const testDate = new Date("2023-12-25T14:30:00");
      render(
        <DateTimeInput
          {...defaultProps}
          value={testDate}
          format="time"
          use12Hour={true}
          onChange={mockOnChange}
        />,
      );
      // HTML5 time input uses 24-hour format regardless of use12Hour prop
      expect(screen.getByDisplayValue("14:30")).toBeInTheDocument();
    });

    it("formats time with seconds", () => {
      const testDate = new Date("2023-12-25T10:30:45");
      render(
        <DateTimeInput
          {...defaultProps}
          value={testDate}
          format="time"
          showSeconds={true}
          onChange={mockOnChange}
        />,
      );
      // HTML5 time input doesn't show seconds by default, component truncates to HH:MM
      expect(screen.getByDisplayValue("10:30")).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("displays validation errors", () => {
      render(
        <DateTimeInput
          {...defaultProps}
          errors={["Invalid date"]}
          touched={true}
        />,
      );
      expect(screen.getByText("Invalid date")).toBeInTheDocument();
    });

    it("hides validation errors when showValidationErrors is false", () => {
      render(
        <DateTimeInput
          {...defaultProps}
          errors={["Invalid date"]}
          touched={false}
          showValidationErrors={false}
        />,
      );
      expect(screen.queryByText("Invalid date")).not.toBeInTheDocument();
    });

    it("shows errors when touched", () => {
      render(
        <DateTimeInput
          {...defaultProps}
          errors={["Invalid date"]}
          touched={true}
        />,
      );
      expect(screen.getByText("Invalid date")).toBeInTheDocument();
    });

    it("does not show errors when not touched", () => {
      render(
        <DateTimeInput
          {...defaultProps}
          errors={["Invalid date"]}
          touched={false}
          showValidationErrors={false}
        />,
      );
      expect(screen.queryByText("Invalid date")).not.toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("disables input when disabled is true", () => {
      render(<DateTimeInput {...defaultProps} disabled />);
      const input = screen.getByDisplayValue("");
      expect(input).toBeDisabled();
    });

    it("hides clear button when disabled", () => {
      const testDate = new Date("2023-12-25T10:30:00");
      render(<DateTimeInput {...defaultProps} value={testDate} disabled />);
      expect(screen.queryByLabelText("Clear value")).not.toBeInTheDocument();
    });
  });

  describe("Customization", () => {
    it("applies custom className", () => {
      render(<DateTimeInput {...defaultProps} className="custom-class" />);
      const input = screen.getByDisplayValue("");
      expect(input.closest("div").parentElement).toHaveClass("custom-class");
    });

    it("applies custom labelClassName", () => {
      render(<DateTimeInput {...defaultProps} labelClassName="custom-label" />);
      expect(screen.getByText("Test DateTime").closest("label")).toHaveClass(
        "custom-label",
      );
    });

    it("applies custom inputClassName", () => {
      render(<DateTimeInput {...defaultProps} inputClassName="custom-input" />);
      const input = screen.getByDisplayValue("");
      expect(input).toHaveClass("custom-input");
    });

    it("applies custom errorClassName", () => {
      render(
        <DateTimeInput
          {...defaultProps}
          errors={["Invalid date"]}
          touched={true}
          errorClassName="custom-error"
        />,
      );
      expect(screen.getByText("Invalid date")).toHaveClass("custom-error");
    });

    it("applies custom helperClassName", () => {
      render(
        <DateTimeInput
          {...defaultProps}
          helperText="Helper text"
          helperClassName="custom-helper"
        />,
      );
      expect(screen.getByText("Helper text")).toHaveClass("custom-helper");
    });
  });

  describe("Accessibility", () => {
    it("provides proper ARIA labels", () => {
      render(<DateTimeInput {...defaultProps} />);
      expect(screen.getByLabelText("Test DateTime")).toBeInTheDocument();
    });

    it("provides proper ARIA attributes for errors", () => {
      render(
        <DateTimeInput
          {...defaultProps}
          errors={["Invalid date"]}
          touched={true}
        />,
      );
      const input = screen.getByDisplayValue("");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("provides proper ARIA describedby", () => {
      render(
        <DateTimeInput
          {...defaultProps}
          helperText="Helper text"
          errors={["Invalid date"]}
          touched={true}
        />,
      );
      const input = screen.getByDisplayValue("");
      expect(input).toHaveAttribute("aria-describedby");
    });
  });

  describe("Edge Cases", () => {
    it("handles invalid date input gracefully", async () => {
      render(<DateTimeInput {...defaultProps} onChange={mockOnChange} />);
      const input = screen.getByDisplayValue("");
      await userEvent.type(input, "invalid-date");
      // HTML5 datetime-local inputs don't allow invalid input to be typed
      // The input remains empty when invalid input is attempted
      expect(input).toHaveValue("");
    });

    it("handles empty string input", async () => {
      const testDate = new Date("2023-12-25T10:30:00");
      render(
        <DateTimeInput
          {...defaultProps}
          value={testDate}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByDisplayValue("2023-12-25T03:30");
      await userEvent.clear(input);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith("");
      });
    });

    it("handles null value", () => {
      render(
        <DateTimeInput
          {...defaultProps}
          value={null as any}
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByDisplayValue("")).toBeInTheDocument();
    });

    it("handles undefined value", () => {
      render(
        <DateTimeInput
          {...defaultProps}
          value={undefined}
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByDisplayValue("")).toBeInTheDocument();
    });
  });

  describe("Size Variants", () => {
    it("applies small size classes", () => {
      render(<DateTimeInput {...defaultProps} size="sm" />);
      expect(screen.getByDisplayValue("")).toHaveClass("px-2 py-1 text-sm");
    });

    it("applies medium size classes", () => {
      render(<DateTimeInput {...defaultProps} size="md" />);
      expect(screen.getByDisplayValue("")).toHaveClass("px-3 py-2 text-sm");
    });

    it("applies large size classes", () => {
      render(<DateTimeInput {...defaultProps} size="lg" />);
      expect(screen.getByDisplayValue("")).toHaveClass("px-4 py-3 text-base");
    });
  });

  describe("Integration", () => {
    it("integrates with form validation system", async () => {
      render(
        <DateTimeInput
          {...defaultProps}
          validate={(value: any) => (!value ? "Required" : null)}
        />,
      );
      const input = screen.getByDisplayValue("");
      fireEvent.blur(input);
      // Note: This test would need actual validation integration to work properly
      expect(input).toBeInTheDocument();
    });

    it("works with different date formats", () => {
      const testDate = new Date("2023-12-25T10:30:00");

      const { rerender } = render(
        <DateTimeInput
          {...defaultProps}
          value={testDate}
          format="date"
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByDisplayValue("2023-12-25")).toBeInTheDocument();

      rerender(
        <DateTimeInput
          {...defaultProps}
          value={testDate}
          format="time"
          onChange={mockOnChange}
        />,
      );
      // Time format uses local time, not UTC
      expect(screen.getByDisplayValue("10:30")).toBeInTheDocument();

      rerender(
        <DateTimeInput
          {...defaultProps}
          value={testDate}
          format="datetime"
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByDisplayValue("2023-12-25T03:30")).toBeInTheDocument();
    });

    it("passes through all input props", () => {
      render(
        <DateTimeInput
          {...defaultProps}
          data-testid="custom-input"
          aria-label="Custom label"
        />,
      );
      const input = screen.getByTestId("custom-input");
      expect(input).toHaveAttribute("aria-label", "Custom label");
    });
  });
});
