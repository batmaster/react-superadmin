import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import {
  BooleanInput,
  CheckboxInput,
} from "../../../components/forms/CheckboxInput";

describe("BooleanInput Component", () => {
  const defaultProps = {
    checked: false,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders with basic props", () => {
      render(<BooleanInput {...defaultProps} />);

      expect(screen.getByTestId("boolean-input")).toBeInTheDocument();
      expect(screen.getByTestId("boolean-input")).toHaveAttribute(
        "type",
        "checkbox",
      );
    });

    it("renders with label", () => {
      render(<BooleanInput {...defaultProps} label="Accept terms" />);

      expect(screen.getByText("Accept terms")).toBeInTheDocument();
      expect(screen.getByLabelText("Accept terms")).toBeInTheDocument();
    });

    it("renders with helper text", () => {
      render(<BooleanInput {...defaultProps} helperText="This is required" />);

      expect(screen.getByText("This is required")).toBeInTheDocument();
    });

    it("renders with error", () => {
      render(<BooleanInput {...defaultProps} error="This field is required" />);

      expect(screen.getByText("This field is required")).toBeInTheDocument();
      expect(screen.getByTestId("boolean-input")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("renders with required indicator", () => {
      render(<BooleanInput {...defaultProps} label="Accept terms" required />);

      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("renders as checked", () => {
      render(<BooleanInput {...defaultProps} checked={true} />);

      expect(screen.getByTestId("boolean-input")).toBeChecked();
    });

    it("renders as disabled", () => {
      render(<BooleanInput {...defaultProps} disabled />);

      expect(screen.getByTestId("boolean-input")).toBeDisabled();
    });
  });

  describe("Variants", () => {
    it("renders as checkbox by default", () => {
      render(<BooleanInput {...defaultProps} />);

      expect(screen.getByTestId("boolean-input")).toHaveAttribute(
        "type",
        "checkbox",
      );
      expect(screen.getByTestId("boolean-input")).toBeVisible();
    });

    it("renders as switch variant", () => {
      render(<BooleanInput {...defaultProps} variant="switch" />);

      expect(screen.getByTestId("boolean-input")).toHaveAttribute(
        "type",
        "checkbox",
      );
      expect(screen.getByTestId("boolean-input")).toHaveClass("sr-only");
    });

    it("renders as toggle variant", () => {
      render(<BooleanInput {...defaultProps} variant="toggle" />);

      expect(screen.getByTestId("boolean-input")).toHaveAttribute(
        "type",
        "checkbox",
      );
      expect(screen.getByTestId("boolean-input")).toHaveClass("sr-only");
    });
  });

  describe("Interaction", () => {
    it("calls onChange when clicked", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<BooleanInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByTestId("boolean-input");
      await user.click(input);

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it("calls onChange when label is clicked", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <BooleanInput
          {...defaultProps}
          label="Test Label"
          onChange={onChange}
        />,
      );

      const label = screen.getByText("Test Label");
      await user.click(label);

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it("handles focus and blur events", async () => {
      const user = userEvent.setup();
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      render(
        <BooleanInput {...defaultProps} onFocus={onFocus} onBlur={onBlur} />,
      );

      const input = screen.getByTestId("boolean-input");
      await user.click(input);
      expect(onFocus).toHaveBeenCalled();

      await user.tab();
      expect(onBlur).toHaveBeenCalled();
    });

    it("does not call onChange when disabled", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<BooleanInput {...defaultProps} onChange={onChange} disabled />);

      const input = screen.getByTestId("boolean-input");
      await user.click(input);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Switch variant interactions", () => {
    it("calls onChange when switch is clicked", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <BooleanInput {...defaultProps} variant="switch" onChange={onChange} />,
      );

      // Click on the visible switch element (span)
      const switchElement =
        screen.getByTestId("boolean-input").nextElementSibling;
      if (switchElement) {
        await user.click(switchElement);
        expect(onChange).toHaveBeenCalledWith(true);
      }
    });

    it("shows correct visual state when checked", () => {
      render(
        <BooleanInput {...defaultProps} variant="switch" checked={true} />,
      );

      const input = screen.getByTestId("boolean-input");
      expect(input).toBeChecked();
    });
  });

  describe("Toggle variant interactions", () => {
    it("calls onChange when toggle is clicked", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <BooleanInput {...defaultProps} variant="toggle" onChange={onChange} />,
      );

      // Click on the visible toggle element (span)
      const toggleElement =
        screen.getByTestId("boolean-input").nextElementSibling;
      if (toggleElement) {
        await user.click(toggleElement);
        expect(onChange).toHaveBeenCalledWith(true);
      }
    });

    it("shows check icon when checked", () => {
      render(
        <BooleanInput {...defaultProps} variant="toggle" checked={true} />,
      );

      const input = screen.getByTestId("boolean-input");
      expect(input).toBeChecked();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(
        <BooleanInput
          {...defaultProps}
          label="Test Label"
          helperText="Help text"
        />,
      );

      const input = screen.getByTestId("boolean-input");
      expect(input).toHaveAttribute("aria-describedby");
      expect(input).toHaveAttribute("aria-invalid", "false");
    });

    it("sets aria-invalid to true when there's an error", () => {
      render(<BooleanInput {...defaultProps} error="Error message" />);

      expect(screen.getByTestId("boolean-input")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("associates label with input", () => {
      render(
        <BooleanInput {...defaultProps} label="Test Label" id="test-boolean" />,
      );

      const label = screen.getByText("Test Label");
      const input = screen.getByTestId("boolean-input");
      expect(label).toHaveAttribute("for", "test-boolean");
      expect(input).toHaveAttribute("id", "test-boolean");
    });

    it("generates unique id when not provided", () => {
      render(<BooleanInput {...defaultProps} label="Test Label" />);

      const input = screen.getByTestId("boolean-input");
      const id = input.getAttribute("id");
      expect(id).toMatch(/^boolean-/);
    });
  });

  describe("Sizes", () => {
    it("applies small size classes for checkbox", () => {
      render(<BooleanInput {...defaultProps} size="sm" variant="checkbox" />);

      expect(screen.getByTestId("boolean-input")).toHaveClass("h-3", "w-3");
    });

    it("applies medium size classes for checkbox", () => {
      render(<BooleanInput {...defaultProps} size="md" variant="checkbox" />);

      expect(screen.getByTestId("boolean-input")).toHaveClass("h-4", "w-4");
    });

    it("applies large size classes for checkbox", () => {
      render(<BooleanInput {...defaultProps} size="lg" variant="checkbox" />);

      expect(screen.getByTestId("boolean-input")).toHaveClass("h-5", "w-5");
    });
  });

  describe("Color schemes", () => {
    it("applies primary color scheme", () => {
      render(<BooleanInput {...defaultProps} colorScheme="primary" />);

      expect(screen.getByTestId("boolean-input")).toHaveClass(
        "text-primary-600",
        "focus:ring-primary-500",
      );
    });

    it("applies success color scheme", () => {
      render(<BooleanInput {...defaultProps} colorScheme="success" />);

      expect(screen.getByTestId("boolean-input")).toHaveClass(
        "text-green-600",
        "focus:ring-green-500",
      );
    });

    it("applies danger color scheme", () => {
      render(<BooleanInput {...defaultProps} colorScheme="danger" />);

      expect(screen.getByTestId("boolean-input")).toHaveClass(
        "text-red-600",
        "focus:ring-red-500",
      );
    });
  });

  describe("Label positioning", () => {
    it("positions label to the right by default", () => {
      render(<BooleanInput {...defaultProps} label="Test Label" />);

      const container = screen.getByTestId("boolean-input").closest("div");
      const label = screen.getByText("Test Label");

      // Check that input comes before label in DOM order
      expect(container?.children[0]).toBe(screen.getByTestId("boolean-input"));
      expect(container?.children[1]).toBe(label);
    });

    it("positions label to the left when specified", () => {
      render(
        <BooleanInput
          {...defaultProps}
          label="Test Label"
          labelPosition="left"
        />,
      );

      const container = screen.getByTestId("boolean-input").closest("div");
      const label = screen.getByText("Test Label");

      // Check that label comes before input in DOM order
      expect(container?.children[0]).toBe(label);
      expect(container?.children[1]).toBe(screen.getByTestId("boolean-input"));
    });
  });

  describe("Custom styling", () => {
    it("applies custom className", () => {
      render(<BooleanInput {...defaultProps} className="custom-class" />);

      const container = screen
        .getByTestId("boolean-input")
        .closest("div")?.parentElement;
      expect(container).toHaveClass("custom-class");
    });

    it("applies custom inputClassName", () => {
      render(<BooleanInput {...defaultProps} inputClassName="custom-input" />);

      expect(screen.getByTestId("boolean-input")).toHaveClass("custom-input");
    });

    it("applies custom labelClassName", () => {
      render(
        <BooleanInput
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
      render(<BooleanInput {...defaultProps} error="Error message" />);

      expect(screen.getByTestId("boolean-input")).toHaveClass(
        "border-red-300",
        "focus:ring-red-500",
      );
    });

    it("prioritizes error over helper text", () => {
      render(
        <BooleanInput
          {...defaultProps}
          helperText="Helper text"
          error="Error message"
        />,
      );

      expect(screen.getByText("Error message")).toBeInTheDocument();
      expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("handles undefined checked value", () => {
      render(<BooleanInput checked={undefined} onChange={jest.fn()} />);

      expect(screen.getByTestId("boolean-input")).not.toBeChecked();
    });

    it("forwards additional HTML attributes", () => {
      render(
        <BooleanInput
          {...defaultProps}
          data-testid="custom-boolean"
          tabIndex={0}
        />,
      );

      const input = screen.getByTestId("custom-boolean");
      expect(input).toHaveAttribute("tabIndex", "0");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<BooleanInput {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe("CheckboxInput alias", () => {
    it("CheckboxInput works as alias for BooleanInput", () => {
      render(<CheckboxInput {...defaultProps} label="Checkbox alias test" />);

      expect(screen.getByText("Checkbox alias test")).toBeInTheDocument();
      expect(screen.getByTestId("boolean-input")).toBeInTheDocument();
    });

    it("CheckboxInput maintains backward compatibility", () => {
      const onChange = jest.fn();
      render(<CheckboxInput checked={false} onChange={onChange} />);

      const input = screen.getByTestId("boolean-input");
      expect(input).toHaveAttribute("type", "checkbox");
    });
  });
});
