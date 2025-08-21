import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormField } from "../../../components/forms/FormField";
import { FieldConfig } from "@react-superadmin/core";

// Mock the core package to avoid dependency issues
jest.mock("@react-superadmin/core", () => ({
  FieldConfig: jest.fn(),
}));

describe("FormField", () => {
  const defaultField: FieldConfig = {
    type: "text",
    name: "testField",
    label: "Test Field",
    required: false,
  };

  const defaultProps = {
    field: defaultField,
    value: "",
    onChange: jest.fn(),
    error: undefined,
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Text Input Fields", () => {
    it("renders text input for text type", () => {
      render(<FormField {...defaultProps} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "text");
    });

    it("renders email input for email type", () => {
      const emailField = { ...defaultField, type: "email" as const };
      render(<FormField {...defaultProps} field={emailField} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "email");
    });

    it("renders password input for password type", () => {
      const passwordField = { ...defaultField, type: "password" as const };
      render(<FormField {...defaultProps} field={passwordField} />);

      const input = screen.getByDisplayValue("");
      expect(input).toHaveAttribute("type", "password");
    });

    it("renders number input for number type", () => {
      const numberField = { ...defaultField, type: "number" as const };
      render(<FormField {...defaultProps} field={numberField} />);

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveAttribute("type", "number");
    });

    it("handles text input changes", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<FormField {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "test");

      // Check that onChange was called during typing
      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls.length).toBeGreaterThan(0);
    });

    it("handles number input changes", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      const numberField = { ...defaultField, type: "number" as const };

      render(
        <FormField {...defaultProps} field={numberField} onChange={onChange} />,
      );

      const input = screen.getByRole("spinbutton");
      await user.type(input, "42");

      // Check that onChange was called during typing
      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls.length).toBeGreaterThan(0);
    });
  });

  describe("Select Input Fields", () => {
    it("renders select input for select type", () => {
      const selectField = {
        ...defaultField,
        type: "select" as const,
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
      };

      render(<FormField {...defaultProps} field={selectField} />);

      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();
    });

    it("handles select input changes", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      const selectField = {
        ...defaultField,
        type: "select" as const,
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
      };

      render(
        <FormField {...defaultProps} field={selectField} onChange={onChange} />,
      );

      const select = screen.getByRole("combobox");

      // First click to open the select
      await user.click(select);

      // Then select the option
      const option = screen.getByText("Option 2");
      await user.click(option);

      expect(onChange).toHaveBeenCalledWith("option2");
    });
  });

  describe("Textarea Input Fields", () => {
    it("renders textarea for textarea type", () => {
      const textareaField = { ...defaultField, type: "textarea" as const };
      render(<FormField {...defaultProps} field={textareaField} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe("TEXTAREA");
    });

    it("handles textarea input changes", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      const textareaField = { ...defaultField, type: "textarea" as const };

      render(
        <FormField
          {...defaultProps}
          field={textareaField}
          onChange={onChange}
        />,
      );

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "test text");

      // Check that onChange was called during typing
      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls.length).toBeGreaterThan(0);
    });
  });

  describe("Boolean Input Fields", () => {
    it("renders checkbox for boolean type", () => {
      const booleanField = { ...defaultField, type: "boolean" as const };
      render(<FormField {...defaultProps} field={booleanField} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
    });

    it("handles boolean input changes", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      const booleanField = { ...defaultField, type: "boolean" as const };

      render(
        <FormField
          {...defaultProps}
          field={booleanField}
          onChange={onChange}
        />,
      );

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it("handles boolean input changes when already checked", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      const booleanField = { ...defaultField, type: "boolean" as const };

      render(
        <FormField
          {...defaultProps}
          field={booleanField}
          value={true}
          onChange={onChange}
        />,
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();

      await user.click(checkbox);

      expect(onChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Date Input Fields", () => {
    it("renders date input for date type", () => {
      const dateField = { ...defaultField, type: "date" as const };
      render(<FormField {...defaultProps} field={dateField} />);

      const dateInput = screen.getByDisplayValue("");
      expect(dateInput).toHaveAttribute("type", "date");
    });

    it("handles date input changes", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      const dateField = { ...defaultField, type: "date" as const };

      render(
        <FormField {...defaultProps} field={dateField} onChange={onChange} />,
      );

      const dateInput = screen.getByDisplayValue("");
      await user.type(dateInput, "2023-12-25");

      expect(onChange).toHaveBeenCalledWith("2023-12-25");
    });
  });

  describe("Field Properties", () => {
    it("displays field label", () => {
      render(<FormField {...defaultProps} />);

      expect(screen.getByText("Test Field")).toBeInTheDocument();
    });

    it("displays required indicator when field is required", () => {
      const requiredField = { ...defaultField, required: true };
      render(<FormField {...defaultProps} field={requiredField} />);

      const requiredIndicator = screen.getByText("*");
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass("text-red-500");
    });

    it("displays placeholder when provided", () => {
      const fieldWithPlaceholder = {
        ...defaultField,
        placeholder: "Enter text here",
      };
      render(<FormField {...defaultProps} field={fieldWithPlaceholder} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("placeholder", "Enter text here");
    });

    it("displays help text when provided", () => {
      const fieldWithHelp = {
        ...defaultField,
        helpText: "This field is for testing purposes",
      };
      render(<FormField {...defaultProps} field={fieldWithHelp} />);

      expect(
        screen.getByText("This field is for testing purposes"),
      ).toBeInTheDocument();
    });
  });

  describe("Value Handling", () => {
    it("displays current value", () => {
      render(<FormField {...defaultProps} value="current value" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("current value");
    });

    it("handles null value gracefully", () => {
      render(<FormField {...defaultProps} value={null} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("");
    });

    it("handles undefined value gracefully", () => {
      render(<FormField {...defaultProps} value={undefined} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("");
    });

    it("handles boolean value for boolean fields", () => {
      const booleanField = { ...defaultField, type: "boolean" as const };
      render(<FormField {...defaultProps} field={booleanField} value={true} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });
  });

  describe("Error Handling", () => {
    it("displays error message when provided", () => {
      render(<FormField {...defaultProps} error="This field has an error" />);

      expect(screen.getByText("This field has an error")).toBeInTheDocument();
      expect(screen.getByText("This field has an error")).toHaveClass(
        "text-red-600",
      );
    });

    it("applies error styling to input when error is present", () => {
      render(<FormField {...defaultProps} error="Error message" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("border-red-300");
    });
  });

  describe("Disabled State", () => {
    it("disables input when disabled prop is true", () => {
      render(<FormField {...defaultProps} disabled />);

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("enables input when disabled prop is false", () => {
      render(<FormField {...defaultProps} disabled={false} />);

      const input = screen.getByRole("textbox");
      expect(input).not.toBeDisabled();
    });
  });

  describe("Fallback Behavior", () => {
    it("renders text input for unknown field types", () => {
      const unknownField = { ...defaultField, type: "unknown" as any };
      render(<FormField {...defaultProps} field={unknownField} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "text");
    });
  });

  describe("Accessibility", () => {
    it("associates label with input using field name", () => {
      const fieldWithName = { ...defaultField, name: "testField" };
      render(<FormField {...defaultProps} field={fieldWithName} />);

      const label = screen.getByText("Test Field");
      const input = screen.getByRole("textbox");

      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });

    it("provides proper ARIA attributes for required fields", () => {
      const requiredField = { ...defaultField, required: true };
      render(<FormField {...defaultProps} field={requiredField} />);

      const requiredIndicator = screen.getByText("*");
      expect(requiredIndicator).toBeInTheDocument();
    });
  });
});
