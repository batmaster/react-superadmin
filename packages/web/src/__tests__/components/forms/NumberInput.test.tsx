import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { NumberInput } from "../../../components/forms/NumberInput";

// Mock the cn utility
jest.mock("../../../utils/cn", () => ({
  cn: (...classes: (string | undefined | null | false)[]) =>
    classes.filter(Boolean).join(" "),
}));

describe("NumberInput", () => {
  const defaultProps = {
    name: "test-number",
    label: "Test Number",
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders with label", () => {
      render(<NumberInput {...defaultProps} />);
      expect(screen.getByLabelText("Test Number")).toBeInTheDocument();
    });

    it("renders without label", () => {
      render(<NumberInput name="test" />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders required label when required is true", () => {
      render(<NumberInput {...defaultProps} required />);
      expect(screen.getByText("Test Number")).toBeInTheDocument();
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("renders placeholder text", () => {
      render(<NumberInput {...defaultProps} placeholder="Enter number" />);
      expect(screen.getByPlaceholderText("Enter number")).toBeInTheDocument();
    });

    it("renders helper text", () => {
      render(<NumberInput {...defaultProps} helperText="Helper text" />);
      expect(screen.getByText("Helper text")).toBeInTheDocument();
    });

    it("does not render when hidden is true", () => {
      const { container } = render(<NumberInput {...defaultProps} hidden />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Value Management", () => {
    it("displays numeric value", () => {
      render(
        <NumberInput {...defaultProps} value={42} onChange={mockOnChange} />,
      );
      expect(screen.getByDisplayValue("42.00")).toBeInTheDocument();
    });

    it("displays formatted currency value", () => {
      render(
        <NumberInput
          {...defaultProps}
          value={1234.56}
          format="currency"
          currency="USD"
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByDisplayValue("$1,234.56")).toBeInTheDocument();
    });

    it("displays formatted integer value", () => {
      render(
        <NumberInput
          {...defaultProps}
          value={1234567}
          format="integer"
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByDisplayValue("1,234,567")).toBeInTheDocument();
    });

    it("displays formatted decimal value", () => {
      render(
        <NumberInput
          {...defaultProps}
          value={123.456}
          format="decimal"
          decimals={3}
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByDisplayValue("123.456")).toBeInTheDocument();
    });

    it("handles empty value", () => {
      render(
        <NumberInput {...defaultProps} value="" onChange={mockOnChange} />,
      );
      expect(screen.getByRole("textbox")).toHaveValue("");
    });
  });

  describe("Step Controls", () => {
    it("shows step controls by default", () => {
      render(<NumberInput {...defaultProps} onChange={mockOnChange} />);
      expect(screen.getByLabelText("Increase value")).toBeInTheDocument();
      expect(screen.getByLabelText("Decrease value")).toBeInTheDocument();
    });

    it("hides step controls when showStepControls is false", () => {
      render(
        <NumberInput
          {...defaultProps}
          showStepControls={false}
          onChange={mockOnChange}
        />,
      );
      expect(screen.queryByLabelText("Increase value")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Decrease value")).not.toBeInTheDocument();
    });

    it("increments value when step up button is clicked", async () => {
      render(
        <NumberInput
          {...defaultProps}
          value={10}
          step={5}
          onChange={mockOnChange}
        />,
      );

      const stepUpButton = screen.getByLabelText("Increase value");
      fireEvent.click(stepUpButton);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(15);
      });
    });

    it("decrements value when step down button is clicked", async () => {
      render(
        <NumberInput
          {...defaultProps}
          value={10}
          step={5}
          onChange={mockOnChange}
        />,
      );

      const stepDownButton = screen.getByLabelText("Decrease value");
      fireEvent.click(stepDownButton);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(5);
      });
    });

    it("respects min value when stepping down", async () => {
      render(
        <NumberInput
          {...defaultProps}
          value={5}
          min={5}
          step={5}
          onChange={mockOnChange}
        />,
      );

      const stepDownButton = screen.getByLabelText("Decrease value");
      fireEvent.click(stepDownButton);

      // Should not call onChange since min is reached
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("respects max value when stepping up", async () => {
      render(
        <NumberInput
          {...defaultProps}
          value={15}
          max={15}
          step={5}
          onChange={mockOnChange}
        />,
      );

      const stepUpButton = screen.getByLabelText("Increase value");
      fireEvent.click(stepUpButton);

      // Should not call onChange since max is reached
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("handles step controls with keyboard", async () => {
      render(
        <NumberInput
          {...defaultProps}
          value={10}
          step={5}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { key: "ArrowUp" });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(15);
      });
    });

    it("handles step down with keyboard", async () => {
      render(
        <NumberInput
          {...defaultProps}
          value={10}
          step={5}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { key: "ArrowDown" });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(5);
      });
    });
  });

  describe("Input Handling", () => {
    it("calls onChange when value is typed", async () => {
      render(<NumberInput {...defaultProps} onChange={mockOnChange} />);

      const input = screen.getByRole("textbox");
      await userEvent.type(input, "123");

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(123);
      });
    });

    it("handles decimal input", async () => {
      render(<NumberInput {...defaultProps} onChange={mockOnChange} />);

      const input = screen.getByRole("textbox");
      await userEvent.type(input, "123.45");

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(123.45);
      });
    });

    it("handles negative input", async () => {
      render(<NumberInput {...defaultProps} onChange={mockOnChange} />);

      const input = screen.getByRole("textbox");
      await userEvent.type(input, "-123");

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(-123);
      });
    });

    it("formats value on blur", async () => {
      render(
        <NumberInput
          {...defaultProps}
          value={1234.56}
          format="currency"
          currency="USD"
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByDisplayValue("$1,234.56")).toBeInTheDocument();
      });
    });

    it("handles clear button", async () => {
      render(
        <NumberInput
          {...defaultProps}
          value={123}
          clearable={true}
          onChange={mockOnChange}
        />,
      );

      const clearButton = screen.getByLabelText("Clear value");
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith("");
      });
    });
  });

  describe("Number Formatting", () => {
    it("formats currency with custom locale", () => {
      render(
        <NumberInput
          {...defaultProps}
          value={1234.56}
          format="currency"
          currency="EUR"
          locale="de-DE"
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByDisplayValue("1.234,56 €")).toBeInTheDocument();
    });

    it("formats decimal with custom decimals", () => {
      render(
        <NumberInput
          {...defaultProps}
          value={123.456}
          format="decimal"
          decimals={4}
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByDisplayValue("123.4560")).toBeInTheDocument();
    });

    it("formats integer without thousand separators", () => {
      render(
        <NumberInput
          {...defaultProps}
          value={1234567}
          format="integer"
          showThousandSeparator={false}
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByDisplayValue("1234567")).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("displays validation errors", () => {
      render(
        <NumberInput
          {...defaultProps}
          errors={["Invalid number"]}
          touched={true}
        />,
      );
      expect(screen.getByText("Invalid number")).toBeInTheDocument();
    });

    it("hides validation errors when showValidationErrors is false", () => {
      render(
        <NumberInput
          {...defaultProps}
          errors={["Invalid number"]}
          touched={false}
          showValidationErrors={false}
        />,
      );
      expect(screen.queryByText("Invalid number")).not.toBeInTheDocument();
    });

    it("shows errors when touched", () => {
      render(
        <NumberInput
          {...defaultProps}
          errors={["Invalid number"]}
          touched={true}
        />,
      );
      expect(screen.getByText("Invalid number")).toBeInTheDocument();
    });

    it("does not show errors when not touched", () => {
      render(
        <NumberInput
          {...defaultProps}
          errors={["Invalid number"]}
          touched={false}
          showValidationErrors={false}
        />,
      );
      expect(screen.queryByText("Invalid number")).not.toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("disables input when disabled is true", () => {
      render(<NumberInput {...defaultProps} disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("hides step controls when disabled", () => {
      render(<NumberInput {...defaultProps} disabled />);
      expect(screen.queryByLabelText("Increase value")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Decrease value")).not.toBeInTheDocument();
    });

    it("hides clear button when disabled", () => {
      render(
        <NumberInput {...defaultProps} value={123} disabled clearable={true} />,
      );
      expect(screen.queryByLabelText("Clear value")).not.toBeInTheDocument();
    });
  });

  describe("Customization", () => {
    it("applies custom className", () => {
      render(<NumberInput {...defaultProps} className="custom-class" />);
      expect(
        screen.getByRole("textbox").closest("div").parentElement,
      ).toHaveClass("custom-class");
    });

    it("applies custom labelClassName", () => {
      render(<NumberInput {...defaultProps} labelClassName="custom-label" />);
      expect(screen.getByText("Test Number")).toHaveClass("custom-label");
    });

    it("applies custom inputClassName", () => {
      render(<NumberInput {...defaultProps} inputClassName="custom-input" />);
      expect(screen.getByRole("textbox")).toHaveClass("custom-input");
    });

    it("applies custom errorClassName", () => {
      render(
        <NumberInput
          {...defaultProps}
          errors={["Error"]}
          touched={true}
          errorClassName="custom-error"
        />,
      );
      expect(screen.getByText("Error")).toHaveClass("custom-error");
    });

    it("applies custom helperClassName", () => {
      render(
        <NumberInput
          {...defaultProps}
          helperText="Helper"
          helperClassName="custom-helper"
        />,
      );
      expect(screen.getByText("Helper")).toHaveClass("custom-helper");
    });
  });

  describe("Accessibility", () => {
    it("provides proper ARIA labels", () => {
      render(<NumberInput {...defaultProps} />);
      expect(screen.getByLabelText("Increase value")).toBeInTheDocument();
      expect(screen.getByLabelText("Decrease value")).toBeInTheDocument();
    });

    it("provides proper ARIA attributes for errors", () => {
      render(
        <NumberInput {...defaultProps} errors={["Error"]} touched={true} />,
      );
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("provides proper ARIA describedby", () => {
      render(
        <NumberInput
          {...defaultProps}
          helperText="Helper"
          errors={["Error"]}
          touched={true}
        />,
      );
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby");
    });
  });

  describe("Edge Cases", () => {
    it("handles invalid input gracefully", async () => {
      render(<NumberInput {...defaultProps} onChange={mockOnChange} />);

      const input = screen.getByRole("textbox");
      await userEvent.type(input, "abc");

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith("");
      });
    });

    it("handles empty string input", async () => {
      render(
        <NumberInput {...defaultProps} value="123" onChange={mockOnChange} />,
      );

      const input = screen.getByRole("textbox");
      await userEvent.clear(input);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith("");
      });
    });

    it("handles step with empty value", async () => {
      render(
        <NumberInput
          {...defaultProps}
          value=""
          step={5}
          onChange={mockOnChange}
        />,
      );

      const stepUpButton = screen.getByLabelText("Increase value");
      fireEvent.click(stepUpButton);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(5);
      });
    });

    it("handles step down with empty value", async () => {
      render(
        <NumberInput
          {...defaultProps}
          value=""
          step={5}
          onChange={mockOnChange}
        />,
      );

      const stepDownButton = screen.getByLabelText("Decrease value");
      fireEvent.click(stepDownButton);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(-5);
      });
    });
  });

  describe("Size Variants", () => {
    it("applies small size classes", () => {
      render(<NumberInput {...defaultProps} size="sm" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("px-2 py-1 text-sm");
    });

    it("applies medium size classes", () => {
      render(<NumberInput {...defaultProps} size="md" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("px-3 py-2 text-sm");
    });

    it("applies large size classes", () => {
      render(<NumberInput {...defaultProps} size="lg" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("px-4 py-3 text-base");
    });
  });

  describe("Integration", () => {
    it("integrates with form validation system", async () => {
      render(
        <NumberInput
          {...defaultProps}
          validate={(value: any) => (value < 0 ? "Must be positive" : null)}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole("textbox");
      await userEvent.type(input, "-123");

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(-123);
      });
    });

    it("works with different number formats", async () => {
      render(
        <NumberInput
          {...defaultProps}
          format="currency"
          currency="USD"
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole("textbox");
      await userEvent.type(input, "1234.56");

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(1234.56);
      });
    });

    it("passes through all input props", () => {
      render(
        <NumberInput
          {...defaultProps}
          data-testid="number-input"
          aria-label="Custom label"
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("data-testid", "number-input");
      expect(input).toHaveAttribute("aria-label", "Custom label");
    });
  });
});
