import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Input } from "../../../components/forms/Input";

describe("Input Component", () => {
  const defaultProps = {
    label: "Test Input",
    placeholder: "Enter text here",
  };

  describe("Rendering", () => {
    it("renders with basic props", () => {
      render(<Input {...defaultProps} />);

      expect(screen.getByLabelText("Test Input")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter text here"),
      ).toBeInTheDocument();
    });

    it("renders without label", () => {
      render(<Input placeholder="Enter text here" />);

      expect(
        screen.getByPlaceholderText("Enter text here"),
      ).toBeInTheDocument();
      expect(screen.queryByText("Test Input")).not.toBeInTheDocument();
    });

    it("renders with different input types", () => {
      const { rerender } = render(<Input {...defaultProps} type="email" />);
      expect(screen.getByLabelText("Test Input")).toHaveAttribute(
        "type",
        "email",
      );

      rerender(<Input {...defaultProps} type="password" />);
      expect(screen.getByLabelText("Test Input")).toHaveAttribute(
        "type",
        "password",
      );

      rerender(<Input {...defaultProps} type="number" />);
      expect(screen.getByLabelText("Test Input")).toHaveAttribute(
        "type",
        "number",
      );
    });

    it("renders with different sizes", () => {
      const { rerender } = render(<Input {...defaultProps} size="sm" />);
      expect(screen.getByLabelText("Test Input")).toHaveClass(
        "px-2",
        "py-1",
        "text-sm",
      );

      rerender(<Input {...defaultProps} size="lg" />);
      expect(screen.getByLabelText("Test Input")).toHaveClass(
        "px-4",
        "py-3",
        "text-lg",
      );
    });

    it("renders with required indicator", () => {
      render(<Input {...defaultProps} required />);

      expect(screen.getByText("*")).toBeInTheDocument();
      expect(screen.getByText("*")).toHaveClass("text-red-500");
    });

    it("renders with helper text", () => {
      render(<Input {...defaultProps} helperText="This is helper text" />);

      expect(screen.getByText("This is helper text")).toBeInTheDocument();
      expect(screen.getByText("This is helper text")).toHaveClass(
        "text-gray-500",
      );
    });

    it("renders with error message", () => {
      render(<Input {...defaultProps} error="This field is required" />);

      expect(screen.getByText("This field is required")).toBeInTheDocument();
      expect(screen.getByText("This field is required")).toHaveClass(
        "text-red-600",
      );
      expect(screen.getByLabelText("Test Input")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("renders with left and right icons", () => {
      const leftIcon = <span data-testid="left-icon">🔍</span>;
      const rightIcon = <span data-testid="right-icon">✓</span>;

      render(
        <Input {...defaultProps} leftIcon={leftIcon} rightIcon={rightIcon} />,
      );

      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("renders with loading state", () => {
      render(<Input {...defaultProps} loading />);

      // Check for loading spinner by its classes instead of role
      const loadingSpinner = screen.getByTestId("loading-spinner");
      expect(loadingSpinner).toBeInTheDocument();
      expect(loadingSpinner).toHaveClass("animate-spin");
    });

    it("renders with character count", () => {
      render(<Input {...defaultProps} showCharacterCount maxLength={100} />);

      expect(screen.getByText("0/100")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("handles text input changes", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      let currentValue = "";

      const { rerender } = render(
        <Input
          {...defaultProps}
          value={currentValue}
          onChange={(e) => {
            currentValue = e.target.value;
            onChange(e);
          }}
        />,
      );

      const input = screen.getByLabelText("Test Input");

      // Type each character and update the component
      for (const char of "Hello World") {
        await user.type(input, char);
        rerender(
          <Input
            {...defaultProps}
            value={currentValue}
            onChange={(e) => {
              currentValue = e.target.value;
              onChange(e);
            }}
          />,
        );
      }

      expect(input).toHaveValue("Hello World");
      expect(onChange).toHaveBeenCalledTimes(11); // Each character triggers onChange
    });

    it("handles focus and blur events", async () => {
      const user = userEvent.setup();
      const onFocus = jest.fn();
      const onBlur = jest.fn();

      render(<Input {...defaultProps} onFocus={onFocus} onBlur={onBlur} />);

      const input = screen.getByLabelText("Test Input");

      await user.click(input);
      expect(onFocus).toHaveBeenCalledTimes(1);

      await user.tab();
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it("updates character count when typing", async () => {
      const user = userEvent.setup();

      render(<Input {...defaultProps} showCharacterCount maxLength={100} />);

      const input = screen.getByLabelText("Test Input");
      await user.type(input, "Hello");

      expect(screen.getByText("5/100")).toBeInTheDocument();
    });

    it("handles controlled value updates", () => {
      const { rerender } = render(<Input {...defaultProps} value="Initial" />);

      expect(screen.getByLabelText("Test Input")).toHaveValue("Initial");

      rerender(<Input {...defaultProps} value="Updated" />);
      expect(screen.getByLabelText("Test Input")).toHaveValue("Updated");
    });
  });

  describe("Accessibility", () => {
    it("associates label with input using id", () => {
      render(<Input {...defaultProps} id="test-input" />);

      const input = screen.getByLabelText("Test Input");
      expect(input).toHaveAttribute("id", "test-input");
    });

    it("generates unique id when not provided", () => {
      render(<Input {...defaultProps} />);

      const input = screen.getByLabelText("Test Input");
      expect(input).toHaveAttribute("id");
      expect(input.id).toMatch(/^input-/);
    });

    it("provides proper ARIA attributes for errors", () => {
      render(
        <Input
          {...defaultProps}
          error="Error message"
          helperText="Helper text"
        />,
      );

      const input = screen.getByLabelText("Test Input");
      const errorElement = screen.getByText("Error message");

      expect(input).toHaveAttribute("aria-invalid", "true");
      // Check that aria-describedby contains the error id
      const ariaDescribedBy = input.getAttribute("aria-describedby");
      expect(ariaDescribedBy).toContain(errorElement.id);
    });

    it("provides proper ARIA attributes for helper text", () => {
      render(<Input {...defaultProps} helperText="Helper text" />);

      const input = screen.getByLabelText("Test Input");
      const helperElement = screen.getByText("Helper text");

      expect(input).toHaveAttribute("aria-describedby", helperElement.id);
    });

    it("provides proper ARIA attributes for character count", () => {
      render(<Input {...defaultProps} showCharacterCount maxLength={100} />);

      const input = screen.getByLabelText("Test Input");
      const countElement = screen.getByText("0/100");

      expect(input).toHaveAttribute("aria-describedby", countElement.id);
    });

    it("handles multiple aria-describedby attributes", () => {
      render(
        <Input
          {...defaultProps}
          helperText="Helper text"
          error="Error message"
          showCharacterCount
          maxLength={100}
        />,
      );

      const input = screen.getByLabelText("Test Input");
      const ariaDescribedBy = input.getAttribute("aria-describedby");

      expect(ariaDescribedBy).toContain("helper");
      expect(ariaDescribedBy).toContain("error");
      expect(ariaDescribedBy).toContain("count");
    });
  });

  describe("States and Variants", () => {
    it("applies disabled state correctly", () => {
      render(<Input {...defaultProps} disabled />);

      const input = screen.getByLabelText("Test Input");
      expect(input).toBeDisabled();
      expect(input).toHaveClass("opacity-60");
    });

    it("applies read-only state correctly", () => {
      render(<Input {...defaultProps} readOnly />);

      const input = screen.getByLabelText("Test Input");
      expect(input).toHaveAttribute("readonly");
      // Check for read-only classes in the className string
      expect(input.className).toContain("read-only:bg-gray-50");
      expect(input.className).toContain("read-only:text-gray-700");
    });

    it("applies error state styling correctly", () => {
      render(<Input {...defaultProps} error="Error message" />);

      const input = screen.getByLabelText("Test Input");
      expect(input).toHaveClass(
        "border-red-300",
        "focus:ring-red-500",
        "focus:border-red-500",
      );
    });

    it("applies focus state styling correctly", async () => {
      const user = userEvent.setup();

      render(<Input {...defaultProps} />);

      const input = screen.getByLabelText("Test Input");
      await user.click(input);

      expect(input).toHaveClass("focus:ring-2", "focus:ring-primary-500");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string value", () => {
      render(<Input {...defaultProps} value="" />);

      const input = screen.getByLabelText("Test Input");
      expect(input).toHaveValue("");
    });

    it("handles null and undefined values gracefully", () => {
      const { rerender } = render(
        <Input {...defaultProps} value={null as any} />,
      );
      expect(screen.getByLabelText("Test Input")).toHaveValue("");

      rerender(<Input {...defaultProps} value={undefined as any} />);
      expect(screen.getByLabelText("Test Input")).toHaveValue("");
    });

    it("handles very long input values", async () => {
      const user = userEvent.setup();
      const longText = "a".repeat(1000);

      render(<Input {...defaultProps} showCharacterCount maxLength={2000} />);

      const input = screen.getByLabelText("Test Input");
      await user.type(input, longText);

      expect(input).toHaveValue(longText);
      expect(screen.getByText("1000/2000")).toBeInTheDocument();
    });

    it("handles special characters in input", async () => {
      const user = userEvent.setup();
      // Use simpler special characters that won't conflict with userEvent
      const specialChars = "!@#$%^&*()_+-=";

      render(<Input {...defaultProps} />);

      const input = screen.getByLabelText("Test Input");
      await user.type(input, specialChars);

      expect(input).toHaveValue(specialChars);
    });
  });

  describe("Integration", () => {
    it("works with form validation libraries", () => {
      const mockValidation = {
        isValid: false,
        error: "Validation failed",
      };

      render(<Input {...defaultProps} error={mockValidation.error} />);

      expect(screen.getByText("Validation failed")).toBeInTheDocument();
      expect(screen.getByLabelText("Test Input")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLInputElement>();

      render(<Input {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current).toHaveAttribute("type", "text");
    });

    it("forwards additional HTML attributes", () => {
      render(
        <Input
          {...defaultProps}
          data-testid="custom-input"
          aria-label="Custom label"
          tabIndex={0}
        />,
      );

      const input = screen.getByTestId("custom-input");
      expect(input).toHaveAttribute("aria-label", "Custom label");
      expect(input).toHaveAttribute("tabIndex", "0");
    });
  });
});
