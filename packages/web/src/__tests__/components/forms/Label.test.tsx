import { render, screen } from "@testing-library/react";
import React from "react";
import { Label } from "../../../components/forms/Label";
import { AlertTriangle } from "lucide-react";

describe("Label Component", () => {
  describe("Basic Rendering", () => {
    it("renders with basic props", () => {
      render(<Label htmlFor="test-input">Test Label</Label>);

      const label = screen.getByText("Test Label");
      expect(label).toBeInTheDocument();
      expect(label.closest("label")).toHaveAttribute("for", "test-input");
    });

    it("renders without htmlFor attribute", () => {
      render(<Label>Test Label</Label>);

      const label = screen.getByText("Test Label");
      expect(label).toBeInTheDocument();
      expect(label.closest("label")).not.toHaveAttribute("for");
    });

    it("renders children content correctly", () => {
      render(
        <Label htmlFor="test">
          <span>Custom</span> Label <strong>Content</strong>
        </Label>,
      );

      expect(screen.getByText("Custom")).toBeInTheDocument();
      expect(screen.getByText("Label")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("Required Field Indicator", () => {
    it("shows required indicator when required is true", () => {
      render(
        <Label htmlFor="test" required>
          Required Field
        </Label>,
      );

      const requiredIndicator = screen.getByText("*");
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveAttribute("aria-label", "required");
    });

    it("does not show required indicator when required is false", () => {
      render(
        <Label htmlFor="test" required={false}>
          Optional Field
        </Label>,
      );

      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });

    it("does not show required indicator by default", () => {
      render(<Label htmlFor="test">Default Field</Label>);

      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });
  });

  describe("Size Variants", () => {
    it("applies small size classes", () => {
      render(
        <Label htmlFor="test" size="sm">
          Small Label
        </Label>,
      );

      const label = screen.getByText("Small Label").closest("label");
      expect(label).toHaveClass("text-sm");
    });

    it("applies medium size classes by default", () => {
      render(<Label htmlFor="test">Medium Label</Label>);

      const label = screen.getByText("Medium Label").closest("label");
      expect(label).toHaveClass("text-base");
    });

    it("applies large size classes", () => {
      render(
        <Label htmlFor="test" size="lg">
          Large Label
        </Label>,
      );

      const label = screen.getByText("Large Label").closest("label");
      expect(label).toHaveClass("text-lg");
    });
  });

  describe("Style Variants", () => {
    it("applies default variant classes", () => {
      render(<Label htmlFor="test">Default Label</Label>);

      const label = screen.getByText("Default Label").closest("label");
      expect(label).toHaveClass("text-gray-700");
    });

    it("applies bold variant classes", () => {
      render(
        <Label htmlFor="test" variant="bold">
          Bold Label
        </Label>,
      );

      const label = screen.getByText("Bold Label").closest("label");
      expect(label).toHaveClass("text-gray-900", "font-semibold");
    });

    it("applies subtle variant classes", () => {
      render(
        <Label htmlFor="test" variant="subtle">
          Subtle Label
        </Label>,
      );

      const label = screen.getByText("Subtle Label").closest("label");
      expect(label).toHaveClass("text-gray-500");
    });

    it("applies error variant classes", () => {
      render(
        <Label htmlFor="test" variant="error">
          Error Label
        </Label>,
      );

      const label = screen.getByText("Error Label").closest("label");
      expect(label).toHaveClass("text-red-700");
    });
  });

  describe("Helper Text", () => {
    it("shows helper text when provided", () => {
      render(
        <Label htmlFor="test" helperText="This is helper text">
          Test Label
        </Label>,
      );

      expect(screen.getByText("This is helper text")).toBeInTheDocument();
      expect(screen.getByText("This is helper text")).toHaveAttribute(
        "id",
        "test-helper",
      );
    });

    it("does not show helper text when not provided", () => {
      render(<Label htmlFor="test">Test Label</Label>);

      expect(screen.queryByText("This is helper text")).not.toBeInTheDocument();
    });

    it("hides helper text when error is present", () => {
      render(
        <Label htmlFor="test" helperText="Helper text" error="Error message">
          Test Label
        </Label>,
      );

      expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("shows error message when provided", () => {
      render(
        <Label htmlFor="test" error="This field is required">
          Test Label
        </Label>,
      );

      const errorMessage = screen.getByText("This field is required");
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute("id", "test-error");
      expect(errorMessage).toHaveAttribute("role", "alert");
    });

    it("applies error styling to label when error is present", () => {
      render(
        <Label htmlFor="test" error="Error message">
          Test Label
        </Label>,
      );

      const label = screen.getByText("Test Label").closest("label");
      expect(label).toHaveClass("text-red-700");
    });

    it("does not show error message when not provided", () => {
      render(<Label htmlFor="test">Test Label</Label>);

      expect(screen.queryByText("Error message")).not.toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("applies disabled styling when disabled is true", () => {
      render(
        <Label htmlFor="test" disabled>
          Disabled Label
        </Label>,
      );

      const label = screen.getByText("Disabled Label").closest("label");
      expect(label).toHaveClass("text-gray-400", "cursor-not-allowed");
      expect(label).toHaveAttribute("aria-disabled", "true");
    });

    it("applies disabled styling to helper text when disabled", () => {
      render(
        <Label htmlFor="test" disabled helperText="Helper text">
          Disabled Label
        </Label>,
      );

      const helperText = screen.getByText("Helper text");
      expect(helperText).toHaveClass("text-gray-400");
    });

    it("does not apply disabled styling by default", () => {
      render(<Label htmlFor="test">Normal Label</Label>);

      const label = screen.getByText("Normal Label").closest("label");
      expect(label).not.toHaveClass("text-gray-400", "cursor-not-allowed");
      expect(label).not.toHaveAttribute("aria-disabled");
    });
  });

  describe("Icon Support", () => {
    it("shows default error icon when showIcon is true and error is present", () => {
      render(
        <Label htmlFor="test" showIcon error="Error message">
          Test Label
        </Label>,
      );

      const errorMessage = screen.getByText("Error message");
      expect(errorMessage).toBeInTheDocument();
      // The default AlertCircle icon should be present
      expect(errorMessage.querySelector("svg")).toBeInTheDocument();
    });

    it("shows custom icon when provided", () => {
      render(
        <Label
          htmlFor="test"
          showIcon
          error="Error message"
          icon={AlertTriangle}
        >
          Test Label
        </Label>,
      );

      const errorMessage = screen.getByText("Error message");
      expect(errorMessage).toBeInTheDocument();
      // The custom AlertTriangle icon should be present
      expect(errorMessage.querySelector("svg")).toBeInTheDocument();
    });

    it("does not show icon when showIcon is false", () => {
      render(
        <Label htmlFor="test" error="Error message">
          Test Label
        </Label>,
      );

      const errorMessage = screen.getByText("Error message");
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.querySelector("svg")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("associates label with form control via htmlFor", () => {
      render(<Label htmlFor="email-input">Email Address</Label>);

      const label = screen.getByText("Email Address").closest("label");
      expect(label).toHaveAttribute("for", "email-input");
    });

    it("sets aria-disabled when disabled", () => {
      render(
        <Label htmlFor="test" disabled>
          Disabled Label
        </Label>,
      );

      const label = screen.getByText("Disabled Label").closest("label");
      expect(label).toHaveAttribute("aria-disabled", "true");
    });

    it("sets role alert on error message", () => {
      render(
        <Label htmlFor="test" error="Error message">
          Test Label
        </Label>,
      );

      const errorMessage = screen.getByText("Error message");
      expect(errorMessage).toHaveAttribute("role", "alert");
    });

    it("sets aria-label on required indicator", () => {
      render(
        <Label htmlFor="test" required>
          Required Label
        </Label>,
      );

      const requiredIndicator = screen.getByText("*");
      expect(requiredIndicator).toHaveAttribute("aria-label", "required");
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className", () => {
      render(
        <Label htmlFor="test" className="custom-label-class">
          Test Label
        </Label>,
      );

      const label = screen.getByText("Test Label").closest("label");
      expect(label).toHaveClass("custom-label-class");
    });

    it("applies custom textClassName", () => {
      render(
        <Label htmlFor="test" textClassName="custom-text-class">
          Test Label
        </Label>,
      );

      const textSpan = screen.getByText("Test Label");
      expect(textSpan).toHaveClass("custom-text-class");
    });

    it("applies custom requiredClassName", () => {
      render(
        <Label
          htmlFor="test"
          required
          requiredClassName="custom-required-class"
        >
          Test Label
        </Label>,
      );

      const requiredIndicator = screen.getByText("*");
      expect(requiredIndicator).toHaveClass("custom-required-class");
    });

    it("applies custom helperClassName", () => {
      render(
        <Label
          htmlFor="test"
          helperText="Helper text"
          helperClassName="custom-helper-class"
        >
          Test Label
        </Label>,
      );

      const helperText = screen.getByText("Helper text");
      expect(helperText).toHaveClass("custom-helper-class");
    });

    it("applies custom errorClassName", () => {
      render(
        <Label
          htmlFor="test"
          error="Error message"
          errorClassName="custom-error-class"
        >
          Test Label
        </Label>,
      );

      const errorMessage = screen.getByText("Error message");
      expect(errorMessage).toHaveClass("custom-error-class");
    });
  });

  describe("Integration with Form Components", () => {
    it("works with input elements", () => {
      render(
        <div>
          <Label htmlFor="email">Email Address</Label>
          <input id="email" type="email" />
        </div>,
      );

      const label = screen.getByText("Email Address").closest("label");
      const input = screen.getByRole("textbox");

      expect(label).toHaveAttribute("for", "email");
      expect(input).toHaveAttribute("id", "email");
    });

    it("works with select elements", () => {
      render(
        <div>
          <Label htmlFor="country">Country</Label>
          <select id="country">
            <option value="us">United States</option>
          </select>
        </div>,
      );

      const label = screen.getByText("Country").closest("label");
      const select = screen.getByRole("combobox");

      expect(label).toHaveAttribute("for", "country");
      expect(select).toHaveAttribute("id", "country");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty children", () => {
      const { container } = render(<Label htmlFor="test"></Label>);

      const labelElement = container.querySelector('label[for="test"]');
      expect(labelElement).toBeInTheDocument();
    });

    it("handles null children", () => {
      const { container } = render(<Label htmlFor="test">{null}</Label>);

      const labelElement = container.querySelector('label[for="test"]');
      expect(labelElement).toBeInTheDocument();
    });

    it("handles undefined children", () => {
      const { container } = render(<Label htmlFor="test">{undefined}</Label>);

      const labelElement = container.querySelector('label[for="test"]');
      expect(labelElement).toBeInTheDocument();
    });

    it("forwards additional HTML attributes", () => {
      render(
        <Label
          htmlFor="test"
          data-testid="custom-label"
          aria-describedby="description"
        >
          Test Label
        </Label>,
      );

      const label = screen.getByText("Test Label").closest("label");
      expect(label).toHaveAttribute("data-testid", "custom-label");
      expect(label).toHaveAttribute("aria-describedby", "description");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLLabelElement>();

      render(
        <Label ref={ref} htmlFor="test">
          Test Label
        </Label>,
      );

      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
      expect(ref.current).toHaveTextContent("Test Label");
    });
  });
});
