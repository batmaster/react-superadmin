import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BooleanInput } from "../../../components/forms/BooleanInput";

describe("BooleanInput", () => {
  const defaultProps = {
    label: "Test Boolean Input",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders with label", () => {
      render(<BooleanInput {...defaultProps} />);
      expect(screen.getByText("Test Boolean Input")).toBeInTheDocument();
    });

    it("renders without label", () => {
      render(<BooleanInput onChange={jest.fn()} />);
      expect(screen.queryByText("Test Boolean Input")).not.toBeInTheDocument();
    });

    it("renders required indicator when required", () => {
      render(<BooleanInput {...defaultProps} required />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("renders helper text", () => {
      render(
        <BooleanInput {...defaultProps} helperText="This is helper text" />,
      );
      expect(screen.getByText("This is helper text")).toBeInTheDocument();
    });

    it("renders error message", () => {
      render(<BooleanInput {...defaultProps} error="This is an error" />);
      expect(screen.getByText("This is an error")).toBeInTheDocument();
    });
  });

  describe("Checkbox Variant (Default)", () => {
    it("renders checkbox by default", () => {
      render(<BooleanInput {...defaultProps} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
    });

    it("handles controlled value", () => {
      render(<BooleanInput {...defaultProps} value={true} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    it("handles uncontrolled value with defaultValue", () => {
      render(<BooleanInput {...defaultProps} defaultValue={false} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
    });

    it("calls onChange when checkbox is clicked", async () => {
      const user = userEvent.setup();
      render(<BooleanInput {...defaultProps} />);
      const checkbox = screen.getByRole("checkbox");

      await user.click(checkbox);
      expect(defaultProps.onChange).toHaveBeenCalledWith(true);
    });

    it("toggles value on click", async () => {
      const user = userEvent.setup();
      render(<BooleanInput {...defaultProps} defaultValue={false} />);
      const checkbox = screen.getByRole("checkbox");

      await user.click(checkbox);
      expect(defaultProps.onChange).toHaveBeenCalledWith(true);

      await user.click(checkbox);
      expect(defaultProps.onChange).toHaveBeenCalledWith(false);
    });

    it("shows labels when showLabels is true", () => {
      render(
        <BooleanInput
          {...defaultProps}
          showLabels
          trueLabel="Enabled"
          falseLabel="Disabled"
        />,
      );
      expect(screen.getByText("Disabled")).toBeInTheDocument();
    });
  });

  describe("Radio Variant", () => {
    it("renders radio buttons when variant is radio", () => {
      render(<BooleanInput {...defaultProps} variant="radio" />);
      const radioButtons = screen.getAllByRole("radio");
      expect(radioButtons).toHaveLength(2);
    });

    it("renders three radio buttons when nullable", () => {
      render(<BooleanInput {...defaultProps} variant="radio" nullable />);
      const radioButtons = screen.getAllByRole("radio");
      expect(radioButtons).toHaveLength(3);
    });

    it("handles horizontal layout", () => {
      render(
        <BooleanInput
          {...defaultProps}
          variant="radio"
          direction="horizontal"
        />,
      );
      const container = screen.getByRole("group");
      expect(container).toHaveClass("flex", "flex-row");
    });

    it("handles vertical layout", () => {
      render(
        <BooleanInput {...defaultProps} variant="radio" direction="vertical" />,
      );
      const container = screen.getByRole("group");
      expect(container).toHaveClass("space-y-2");
    });

    it("calls onChange when radio is selected", async () => {
      const user = userEvent.setup();
      render(<BooleanInput {...defaultProps} variant="radio" />);
      const radioButtons = screen.getAllByRole("radio");

      await user.click(radioButtons[0]);
      expect(defaultProps.onChange).toHaveBeenCalledWith(true);

      await user.click(radioButtons[1]);
      expect(defaultProps.onChange).toHaveBeenCalledWith(false);
    });

    it("handles nullable radio selection", async () => {
      const user = userEvent.setup();
      render(<BooleanInput {...defaultProps} variant="radio" nullable />);
      const radioButtons = screen.getAllByRole("radio");

      await user.click(radioButtons[2]); // null option
      expect(defaultProps.onChange).toHaveBeenCalledWith(null);
    });

    it("shows custom labels for radio buttons", () => {
      render(
        <BooleanInput
          {...defaultProps}
          variant="radio"
          trueLabel="Active"
          falseLabel="Inactive"
          nullLabel="Pending"
          nullable
        />,
      );
      expect(screen.getByText("Active")).toBeInTheDocument();
      expect(screen.getByText("Inactive")).toBeInTheDocument();
      expect(screen.getByText("Pending")).toBeInTheDocument();
    });
  });

  describe("Toggle Variant", () => {
    it("renders toggle switch when variant is toggle", () => {
      render(<BooleanInput {...defaultProps} variant="toggle" />);
      const toggle = screen.getByRole("button");
      expect(toggle).toBeInTheDocument();
    });

    it("handles toggle state changes", async () => {
      const user = userEvent.setup();
      render(
        <BooleanInput
          {...defaultProps}
          variant="toggle"
          defaultValue={false}
        />,
      );
      const toggle = screen.getByRole("button");

      await user.click(toggle);
      expect(defaultProps.onChange).toHaveBeenCalledWith(true);

      await user.click(toggle);
      expect(defaultProps.onChange).toHaveBeenCalledWith(false);
    });

    it("handles nullable toggle", async () => {
      const user = userEvent.setup();
      render(<BooleanInput {...defaultProps} variant="toggle" nullable />);
      const toggle = screen.getByRole("button");

      // false -> true -> null -> false
      await user.click(toggle); // false -> true
      expect(defaultProps.onChange).toHaveBeenCalledWith(true);

      await user.click(toggle); // true -> null
      expect(defaultProps.onChange).toHaveBeenCalledWith(null);

      await user.click(toggle); // null -> false
      expect(defaultProps.onChange).toHaveBeenCalledWith(false);
    });

    it("shows labels when showLabels is true", () => {
      render(
        <BooleanInput
          {...defaultProps}
          variant="toggle"
          showLabels
          trueLabel="On"
          falseLabel="Off"
        />,
      );
      expect(screen.getByText("Off")).toBeInTheDocument();
    });

    it("handles keyboard navigation", async () => {
      const user = userEvent.setup();
      render(
        <BooleanInput
          {...defaultProps}
          variant="toggle"
          defaultValue={false}
        />,
      );
      const toggle = screen.getByRole("button");

      toggle.focus();
      await user.keyboard("{Enter}");
      expect(defaultProps.onChange).toHaveBeenCalledWith(true);

      await user.keyboard(" ");
      expect(defaultProps.onChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Size Variants", () => {
    it("applies small size classes", () => {
      render(<BooleanInput {...defaultProps} size="sm" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("text-sm");
    });

    it("applies medium size classes", () => {
      render(<BooleanInput {...defaultProps} size="md" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("text-base");
    });

    it("applies large size classes", () => {
      render(<BooleanInput {...defaultProps} size="lg" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("text-lg");
    });
  });

  describe("State Management", () => {
    it("handles disabled state", () => {
      render(<BooleanInput {...defaultProps} disabled />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeDisabled();
    });

    it("handles read-only state", () => {
      render(<BooleanInput {...defaultProps} readOnly />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("readonly");
    });

    it("handles loading state", () => {
      render(<BooleanInput {...defaultProps} loading />);
      const spinner = screen.getByTestId("loading-spinner");
      expect(spinner).toBeInTheDocument();
    });

    it("combines disabled and loading states", () => {
      render(<BooleanInput {...defaultProps} disabled loading />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeDisabled();
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(
        <BooleanInput
          {...defaultProps}
          error="Error message"
          helperText="Helper text"
        />,
      );
      const checkbox = screen.getByRole("checkbox");

      expect(checkbox).toHaveAttribute("aria-invalid", "true");
      expect(checkbox).toHaveAttribute("aria-describedby");
    });

    it("has proper labels", () => {
      render(<BooleanInput {...defaultProps} label="Test Label" />);
      const label = screen.getByText("Test Label");
      const checkbox = screen.getByRole("checkbox");

      expect(label).toHaveAttribute("for", checkbox.id);
    });

    it("has proper button role for toggle", () => {
      render(<BooleanInput {...defaultProps} variant="toggle" />);
      const toggle = screen.getByRole("button");
      expect(toggle).toHaveAttribute("aria-label");
    });

    it("has proper loading indicator", () => {
      render(<BooleanInput {...defaultProps} loading />);
      const spinner = screen.getByTestId("loading-spinner");
      expect(spinner).toHaveAttribute("role", "status");
      expect(spinner).toHaveAttribute("aria-label", "Loading");
    });
  });

  describe("Edge Cases", () => {
    it("handles null value correctly", () => {
      render(<BooleanInput {...defaultProps} value={null} nullable />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
    });

    it("handles undefined value correctly", () => {
      render(<BooleanInput {...defaultProps} value={undefined} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
    });

    it("handles empty string value as false", () => {
      render(<BooleanInput {...defaultProps} value={"" as any} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
    });

    it("handles zero value as false", () => {
      render(<BooleanInput {...defaultProps} value={0 as any} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("Integration", () => {
    it("works with form validation", () => {
      render(
        <BooleanInput
          {...defaultProps}
          required
          error="This field is required"
        />,
      );

      expect(screen.getByText("This field is required")).toBeInTheDocument();
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("handles controlled to uncontrolled transition", () => {
      const { rerender } = render(
        <BooleanInput {...defaultProps} value={true} />,
      );
      let checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();

      rerender(<BooleanInput {...defaultProps} />);
      checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
    });

    it("maintains internal state when not controlled", () => {
      const { rerender } = render(
        <BooleanInput {...defaultProps} defaultValue={true} />,
      );
      let checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();

      rerender(<BooleanInput {...defaultProps} />);
      checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });
  });
});
