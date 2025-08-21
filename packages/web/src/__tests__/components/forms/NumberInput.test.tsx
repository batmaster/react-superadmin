import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumberInput } from "../../../components/forms/NumberInput";

describe("NumberInput", () => {
  const defaultProps = {
    label: "Test Number",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders with label", () => {
      render(<NumberInput {...defaultProps} />);
      expect(screen.getByLabelText("Test Number")).toBeInTheDocument();
    });

    it("renders without label", () => {
      render(<NumberInput onChange={jest.fn()} />);
      expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    });

    it("renders with helper text", () => {
      render(
        <NumberInput {...defaultProps} helperText="This is helper text" />,
      );
      expect(screen.getByText("This is helper text")).toBeInTheDocument();
    });

    it("renders with error message", () => {
      render(<NumberInput {...defaultProps} error="This is an error" />);
      expect(screen.getByText("This is an error")).toBeInTheDocument();
      expect(screen.getByRole("spinbutton")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("renders with required indicator", () => {
      render(<NumberInput {...defaultProps} required />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });
  });

  describe("Size Variants", () => {
    it("renders with small size", () => {
      render(<NumberInput {...defaultProps} size="sm" />);
      const input = screen.getByRole("spinbutton");
      expect(input).toHaveClass("px-2 py-1 text-sm");
    });

    it("renders with medium size (default)", () => {
      render(<NumberInput {...defaultProps} />);
      const input = screen.getByRole("spinbutton");
      expect(input).toHaveClass("px-3 py-2 text-base");
    });

    it("renders with large size", () => {
      render(<NumberInput {...defaultProps} size="lg" />);
      const input = screen.getByRole("spinbutton");
      expect(input).toHaveClass("px-4 py-3 text-lg");
    });
  });

  describe("Step Controls", () => {
    it("renders step controls when showStepControls is true", () => {
      render(<NumberInput {...defaultProps} showStepControls />);
      expect(screen.getByLabelText("Increase value")).toBeInTheDocument();
      expect(screen.getByLabelText("Decrease value")).toBeInTheDocument();
    });

    it("does not render step controls by default", () => {
      render(<NumberInput {...defaultProps} />);
      expect(screen.queryByLabelText("Increase value")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Decrease value")).not.toBeInTheDocument();
    });

    it("increments value when step up button is clicked", async () => {
      const onChange = jest.fn();
      render(
        <NumberInput
          {...defaultProps}
          onChange={onChange}
          showStepControls
          step={5}
        />,
      );

      const stepUpButton = screen.getByLabelText("Increase value");
      await userEvent.click(stepUpButton);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "5",
            type: "number",
          }),
        }),
      );
    });

    it("decrements value when step down button is clicked", async () => {
      const onChange = jest.fn();
      render(
        <NumberInput
          {...defaultProps}
          onChange={onChange}
          showStepControls
          step={3}
        />,
      );

      const stepDownButton = screen.getByLabelText("Decrease value");
      await userEvent.click(stepDownButton);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "-3",
            type: "number",
          }),
        }),
      );
    });

    it("respects min constraint when stepping down", async () => {
      const onChange = jest.fn();
      render(
        <NumberInput
          {...defaultProps}
          onChange={onChange}
          showStepControls
          step={5}
          min={0}
        />,
      );

      const stepDownButton = screen.getByLabelText("Decrease value");
      await userEvent.click(stepDownButton);

      // Should not go below min value
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "0",
            type: "number",
          }),
        }),
      );
    });

    it("respects max constraint when stepping up", async () => {
      const onChange = jest.fn();
      render(
        <NumberInput
          {...defaultProps}
          onChange={onChange}
          showStepControls
          step={5}
          max={10}
        />,
      );

      const stepUpButton = screen.getByLabelText("Increase value");
      await userEvent.click(stepUpButton);
      await userEvent.click(stepUpButton);
      await userEvent.click(stepUpButton);

      // Should not exceed max value
      expect(onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "10",
            type: "number",
          }),
        }),
      );
    });
  });

  describe("Validation and Constraints", () => {
    it("enforces min value constraint", async () => {
      const onChange = jest.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} min={0} />);

      const input = screen.getByRole("spinbutton");
      await userEvent.type(input, "-5");

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "0",
          }),
        }),
      );
    });

    it("enforces max value constraint", async () => {
      const onChange = jest.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} max={100} />);

      const input = screen.getByRole("spinbutton");
      await userEvent.type(input, "150");

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "100",
          }),
        }),
      );
    });

    it("handles decimal places correctly", async () => {
      const onChange = jest.fn();
      render(
        <NumberInput {...defaultProps} onChange={onChange} decimalPlaces={2} />,
      );

      const input = screen.getByRole("spinbutton");
      await userEvent.type(input, "3.14159");

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "3.14",
          }),
        }),
      );
    });

    it("prevents decimals when allowDecimals is false", async () => {
      const onChange = jest.fn();
      render(
        <NumberInput
          {...defaultProps}
          onChange={onChange}
          allowDecimals={false}
        />,
      );

      const input = screen.getByRole("spinbutton");
      await userEvent.type(input, "3.14");

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "3",
          }),
        }),
      );
    });
  });

  describe("Custom Step Handlers", () => {
    it("calls custom onStepUp handler", async () => {
      const onStepUp = jest.fn((current, step) => current + step * 2);
      const onChange = jest.fn();

      render(
        <NumberInput
          {...defaultProps}
          onChange={onChange}
          showStepControls
          step={5}
          onStepUp={onStepUp}
        />,
      );

      const stepUpButton = screen.getByLabelText("Increase value");
      await userEvent.click(stepUpButton);

      expect(onStepUp).toHaveBeenCalledWith(0, 5);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "10",
          }),
        }),
      );
    });

    it("calls custom onStepDown handler", async () => {
      const onStepDown = jest.fn((current, step) => current - step * 2);
      const onChange = jest.fn();

      render(
        <NumberInput
          {...defaultProps}
          onChange={onChange}
          showStepControls
          step={3}
          onStepDown={onStepDown}
        />,
      );

      const stepDownButton = screen.getByLabelText("Decrease value");
      await userEvent.click(stepDownButton);

      expect(onStepDown).toHaveBeenCalledWith(0, 3);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "-6",
          }),
        }),
      );
    });
  });

  describe("State Management", () => {
    it("handles controlled value", () => {
      render(<NumberInput {...defaultProps} value={42} />);
      const input = screen.getByRole("spinbutton");
      expect(input).toHaveValue(42);
    });

    it("handles uncontrolled value with defaultValue", () => {
      render(<NumberInput {...defaultProps} defaultValue={99} />);
      const input = screen.getByRole("spinbutton");
      expect(input).toHaveValue(99);
    });

    it("updates internal state when not controlled", async () => {
      const onChange = jest.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole("spinbutton");
      await userEvent.type(input, "123");

      expect(input).toHaveValue(123);
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("associates label with input", () => {
      render(<NumberInput {...defaultProps} id="test-id" />);
      const input = screen.getByRole("spinbutton");
      const label = screen.getByText("Test Number");

      expect(label).toHaveAttribute("for", "test-id");
      expect(input).toHaveAttribute("id", "test-id");
    });

    it("generates unique ID when none provided", () => {
      render(<NumberInput {...defaultProps} />);
      const input = screen.getByRole("spinbutton");
      const label = screen.getByText("Test Number");

      expect(input.id).toMatch(/^number-input-/);
      expect(label).toHaveAttribute("for", input.id);
    });

    it("provides proper ARIA attributes", () => {
      render(
        <NumberInput
          {...defaultProps}
          helperText="Helper text"
          error="Error message"
        />,
      );

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveAttribute("aria-describedby");

      const describedBy = input.getAttribute("aria-describedby");
      expect(describedBy).toContain("helper");
      expect(describedBy).toContain("error");
    });

    it("handles focus and blur events", async () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();

      render(
        <NumberInput {...defaultProps} onFocus={onFocus} onBlur={onBlur} />,
      );

      const input = screen.getByRole("spinbutton");

      await userEvent.click(input);
      expect(onFocus).toHaveBeenCalled();

      await userEvent.tab();
      expect(onBlur).toHaveBeenCalled();
    });
  });

  describe("Disabled and Readonly States", () => {
    it("disables step controls when disabled", async () => {
      render(<NumberInput {...defaultProps} disabled showStepControls />);

      const stepUpButton = screen.getByLabelText("Increase value");
      const stepDownButton = screen.getByLabelText("Decrease value");

      expect(stepUpButton).toBeDisabled();
      expect(stepDownButton).toBeDisabled();
    });

    it("disables step controls when readonly", async () => {
      render(<NumberInput {...defaultProps} readOnly showStepControls />);

      const stepUpButton = screen.getByLabelText("Increase value");
      const stepDownButton = screen.getByLabelText("Decrease value");

      expect(stepUpButton).toBeDisabled();
      expect(stepDownButton).toBeDisabled();
    });

    it("disables input when loading", () => {
      render(<NumberInput {...defaultProps} loading />);
      const input = screen.getByRole("spinbutton");
      expect(input).toBeDisabled();
    });
  });

  describe("Icons and Loading", () => {
    it("renders left icon", () => {
      const leftIcon = <span data-testid="left-icon">💰</span>;
      render(<NumberInput {...defaultProps} leftIcon={leftIcon} />);
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    });

    it("renders right icon when no step controls", () => {
      const rightIcon = <span data-testid="right-icon">💡</span>;
      render(<NumberInput {...defaultProps} rightIcon={rightIcon} />);
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("does not render right icon when step controls are shown", () => {
      const rightIcon = <span data-testid="right-icon">💡</span>;
      render(
        <NumberInput
          {...defaultProps}
          rightIcon={rightIcon}
          showStepControls
        />,
      );
      expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();
    });

    it("renders loading spinner", () => {
      render(<NumberInput {...defaultProps} loading />);
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string input", async () => {
      const onChange = jest.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole("spinbutton");
      await userEvent.clear(input);

      // The input should be cleared - test the visual state
      expect(input).toHaveValue(null);
      // Note: userEvent.clear() behavior can vary in test environments
    });

    it("handles invalid number input", async () => {
      const onChange = jest.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole("spinbutton");
      await userEvent.type(input, "abc");

      // Should handle invalid input gracefully
      // The component filters invalid characters, so we test the final state
      expect(input).toHaveValue(null);
      // Note: The component handles invalid input by filtering it out
    });

    it("handles negative numbers", async () => {
      const onChange = jest.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole("spinbutton");
      await userEvent.type(input, "-42");

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "-42",
          }),
        }),
      );
    });
  });
});
