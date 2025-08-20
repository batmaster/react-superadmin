import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { DateInput } from "../../../components/forms/DateInput";

describe("DateInput Component", () => {
  const defaultProps = {
    value: "",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders with basic props", () => {
      render(<DateInput {...defaultProps} />);

      expect(screen.getByTestId("date-input")).toBeInTheDocument();
      expect(screen.getByTestId("date-input")).toHaveAttribute("type", "date");
    });

    it("renders with label", () => {
      render(<DateInput {...defaultProps} label="Test Date" />);

      expect(screen.getByText("Test Date")).toBeInTheDocument();
      expect(screen.getByLabelText("Test Date")).toBeInTheDocument();
    });

    it("renders with helper text", () => {
      render(<DateInput {...defaultProps} helperText="Select a date" />);

      expect(screen.getByText("Select a date")).toBeInTheDocument();
    });

    it("renders with error", () => {
      render(<DateInput {...defaultProps} error="Date is required" />);

      expect(screen.getByText("Date is required")).toBeInTheDocument();
      expect(screen.getByTestId("date-input")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("renders with required indicator", () => {
      render(<DateInput {...defaultProps} label="Test Date" required />);

      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("renders with selected value", () => {
      render(<DateInput {...defaultProps} value="2024-01-15" />);

      expect(screen.getByTestId("date-input")).toHaveValue("2024-01-15");
    });

    it("renders with disabled state", () => {
      render(<DateInput {...defaultProps} disabled />);

      expect(screen.getByTestId("date-input")).toBeDisabled();
    });

    it("renders with calendar icon by default", () => {
      render(<DateInput {...defaultProps} />);

      expect(
        screen.getByTestId("date-input").previousElementSibling,
      ).toContainHTML("svg");
    });

    it("renders with clock icon for time type", () => {
      render(<DateInput {...defaultProps} type="time" />);

      expect(screen.getByTestId("date-input")).toHaveAttribute("type", "time");
      expect(
        screen.getByTestId("date-input").previousElementSibling,
      ).toContainHTML("svg");
    });

    it("renders without icon when showIcon is false", () => {
      render(<DateInput {...defaultProps} showIcon={false} />);

      expect(
        screen.getByTestId("date-input").previousElementSibling,
      ).toBeNull();
    });
  });

  describe("Input Types", () => {
    it("renders as date input by default", () => {
      render(<DateInput {...defaultProps} />);

      expect(screen.getByTestId("date-input")).toHaveAttribute("type", "date");
    });

    it("renders as datetime-local input", () => {
      render(<DateInput {...defaultProps} type="datetime-local" />);

      expect(screen.getByTestId("date-input")).toHaveAttribute(
        "type",
        "datetime-local",
      );
    });

    it("renders as time input", () => {
      render(<DateInput {...defaultProps} type="time" />);

      expect(screen.getByTestId("date-input")).toHaveAttribute("type", "time");
    });
  });

  describe("Interaction", () => {
    it("calls onChange when date is selected", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<DateInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByTestId("date-input");
      await user.type(input, "2024-01-15");

      expect(onChange).toHaveBeenCalledWith("2024-01-15");
    });

    it("calls onChange with null when input is cleared", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <DateInput {...defaultProps} value="2024-01-15" onChange={onChange} />,
      );

      const input = screen.getByTestId("date-input");
      await user.clear(input);

      expect(onChange).toHaveBeenCalledWith(null);
    });

    it("handles focus and blur events", async () => {
      const user = userEvent.setup();
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      render(<DateInput {...defaultProps} onFocus={onFocus} onBlur={onBlur} />);

      const input = screen.getByTestId("date-input");
      await user.click(input);
      expect(onFocus).toHaveBeenCalled();

      await user.tab();
      expect(onBlur).toHaveBeenCalled();
    });

    it("does not call onChange when disabled", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<DateInput {...defaultProps} onChange={onChange} disabled />);

      const input = screen.getByTestId("date-input");
      await user.type(input, "2024-01-15");

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Validation", () => {
    it("sets min attribute", () => {
      render(<DateInput {...defaultProps} min="2024-01-01" />);

      expect(screen.getByTestId("date-input")).toHaveAttribute(
        "min",
        "2024-01-01",
      );
    });

    it("sets max attribute", () => {
      render(<DateInput {...defaultProps} max="2024-12-31" />);

      expect(screen.getByTestId("date-input")).toHaveAttribute(
        "max",
        "2024-12-31",
      );
    });

    it("sets required attribute", () => {
      render(<DateInput {...defaultProps} required />);

      expect(screen.getByTestId("date-input")).toBeRequired();
    });

    it("sets placeholder attribute", () => {
      render(<DateInput {...defaultProps} placeholder="Select date" />);

      expect(screen.getByTestId("date-input")).toHaveAttribute(
        "placeholder",
        "Select date",
      );
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(
        <DateInput
          {...defaultProps}
          label="Test Date"
          helperText="Help text"
        />,
      );

      const input = screen.getByTestId("date-input");
      expect(input).toHaveAttribute("aria-describedby");
      expect(input).toHaveAttribute("aria-invalid", "false");
    });

    it("sets aria-invalid to true when there's an error", () => {
      render(<DateInput {...defaultProps} error="Error message" />);

      expect(screen.getByTestId("date-input")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("associates label with input", () => {
      render(<DateInput {...defaultProps} label="Test Date" id="test-date" />);

      const label = screen.getByText("Test Date");
      const input = screen.getByTestId("date-input");
      expect(label).toHaveAttribute("for", "test-date");
      expect(input).toHaveAttribute("id", "test-date");
    });

    it("generates unique id when not provided", () => {
      render(<DateInput {...defaultProps} label="Test Date" />);

      const input = screen.getByTestId("date-input");
      const id = input.getAttribute("id");
      expect(id).toMatch(/^date-/);
    });
  });

  describe("Sizes", () => {
    it("applies small size classes", () => {
      render(<DateInput {...defaultProps} size="sm" />);

      expect(screen.getByTestId("date-input")).toHaveClass(
        "px-2",
        "py-1",
        "text-sm",
      );
    });

    it("applies medium size classes", () => {
      render(<DateInput {...defaultProps} size="md" />);

      expect(screen.getByTestId("date-input")).toHaveClass(
        "px-3",
        "py-2",
        "text-base",
      );
    });

    it("applies large size classes", () => {
      render(<DateInput {...defaultProps} size="lg" />);

      expect(screen.getByTestId("date-input")).toHaveClass(
        "px-4",
        "py-3",
        "text-lg",
      );
    });
  });

  describe("Custom styling", () => {
    it("applies custom className", () => {
      render(<DateInput {...defaultProps} className="custom-class" />);

      const container = screen
        .getByTestId("date-input")
        .closest("div")?.parentElement;
      expect(container).toHaveClass("custom-class");
    });

    it("applies custom inputClassName", () => {
      render(<DateInput {...defaultProps} inputClassName="custom-input" />);

      expect(screen.getByTestId("date-input")).toHaveClass("custom-input");
    });

    it("applies custom labelClassName", () => {
      render(
        <DateInput
          {...defaultProps}
          label="Test"
          labelClassName="custom-label"
        />,
      );

      expect(screen.getByText("Test")).toHaveClass("custom-label");
    });
  });

  describe("Error states", () => {
    it("shows error styling", () => {
      render(<DateInput {...defaultProps} error="Error message" />);

      expect(screen.getByTestId("date-input")).toHaveClass(
        "border-red-300",
        "focus:ring-red-500",
        "focus:border-red-500",
      );
    });

    it("prioritizes error over helper text", () => {
      render(
        <DateInput
          {...defaultProps}
          helperText="Helper text"
          error="Error message"
        />,
      );

      expect(screen.getByText("Error message")).toBeInTheDocument();
      expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
    });
  });

  describe("Icon behavior", () => {
    it("shows calendar icon for date type", () => {
      render(<DateInput {...defaultProps} type="date" />);

      const iconContainer =
        screen.getByTestId("date-input").previousElementSibling;
      expect(iconContainer).toBeInTheDocument();
    });

    it("shows clock icon for time type", () => {
      render(<DateInput {...defaultProps} type="time" />);

      const iconContainer =
        screen.getByTestId("date-input").previousElementSibling;
      expect(iconContainer).toBeInTheDocument();
    });

    it("shows calendar icon for datetime-local type", () => {
      render(<DateInput {...defaultProps} type="datetime-local" />);

      const iconContainer =
        screen.getByTestId("date-input").previousElementSibling;
      expect(iconContainer).toBeInTheDocument();
    });

    it("changes icon color on focus", async () => {
      const user = userEvent.setup();
      render(<DateInput {...defaultProps} />);

      const input = screen.getByTestId("date-input");
      await user.click(input);

      const icon = screen
        .getByTestId("date-input")
        .previousElementSibling?.querySelector("svg");
      expect(icon).toHaveClass("text-primary-500");
    });

    it("shows error color for icon when there's an error", () => {
      render(<DateInput {...defaultProps} error="Error message" />);

      const icon = screen
        .getByTestId("date-input")
        .previousElementSibling?.querySelector("svg");
      expect(icon).toHaveClass("text-red-400");
    });
  });

  describe("Edge cases", () => {
    it("handles null value", () => {
      render(<DateInput {...defaultProps} value={null} />);

      expect(screen.getByTestId("date-input")).toHaveValue("");
    });

    it("handles undefined value", () => {
      render(<DateInput {...defaultProps} value={undefined} />);

      expect(screen.getByTestId("date-input")).toHaveValue("");
    });

    it("forwards additional HTML attributes", () => {
      render(
        <DateInput {...defaultProps} data-testid="custom-date" tabIndex={0} />,
      );

      const input = screen.getByTestId("custom-date");
      expect(input).toHaveAttribute("tabIndex", "0");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<DateInput {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });
});
