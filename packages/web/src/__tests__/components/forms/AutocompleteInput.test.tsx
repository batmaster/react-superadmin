import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  AutocompleteInput,
  AutocompleteOption,
} from "../../../components/forms/AutocompleteInput";

describe("AutocompleteInput Component", () => {
  const defaultOptions: AutocompleteOption[] = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
    { value: "option4", label: "Option 4" },
    { value: "option5", label: "Option 5" },
  ];

  const defaultProps = {
    value: "",
    onChange: jest.fn(),
    options: defaultOptions,
    placeholder: "Select an option...",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders with basic props", () => {
      render(<AutocompleteInput {...defaultProps} />);

      expect(
        screen.getByPlaceholderText("Select an option..."),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Toggle dropdown" }),
      ).toBeInTheDocument();
    });

    it("renders with label", () => {
      render(<AutocompleteInput {...defaultProps} label="Test Label" />);

      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it("renders with helper text", () => {
      render(<AutocompleteInput {...defaultProps} helperText="Helper text" />);

      expect(screen.getByText("Helper text")).toBeInTheDocument();
    });

    it("renders with error", () => {
      render(<AutocompleteInput {...defaultProps} error="Error message" />);

      expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    it("renders with required indicator", () => {
      render(
        <AutocompleteInput {...defaultProps} label="Test Label" required />,
      );

      const label = screen.getByText("Test Label");
      const requiredIndicator = label.querySelector("span");
      expect(requiredIndicator).toHaveTextContent("*");
    });

    it("renders with selected value", () => {
      render(<AutocompleteInput {...defaultProps} value="option1" />);

      expect(screen.getByDisplayValue("Option 1")).toBeInTheDocument();
    });

    it("renders with disabled state", () => {
      render(<AutocompleteInput {...defaultProps} disabled />);

      const input = screen.getByPlaceholderText("Select an option...");
      expect(input).toBeDisabled();
    });

    it("renders with loading state", () => {
      render(<AutocompleteInput {...defaultProps} loading />);

      const input = screen.getByPlaceholderText("Select an option...");
      expect(input).toBeInTheDocument();
    });

    it("renders with custom placeholder", () => {
      render(
        <AutocompleteInput
          {...defaultProps}
          placeholder="Custom placeholder"
        />,
      );

      expect(
        screen.getByPlaceholderText("Custom placeholder"),
      ).toBeInTheDocument();
    });
  });

  describe("Dropdown Functionality", () => {
    it("opens dropdown on focus", async () => {
      const user = userEvent.setup();
      render(<AutocompleteInput {...defaultProps} />);

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });

    it("opens dropdown on toggle button click", async () => {
      const user = userEvent.setup();
      render(<AutocompleteInput {...defaultProps} />);

      const toggleButton = screen.getByRole("button", {
        name: "Toggle dropdown",
      });
      await user.click(toggleButton);

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("closes dropdown when clicking outside", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <AutocompleteInput {...defaultProps} />
          <div>Outside element</div>
        </div>,
      );

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);
      expect(screen.getByText("Option 1")).toBeInTheDocument();

      await user.click(screen.getByText("Outside element"));
      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });

    it("closes dropdown on escape key", async () => {
      const user = userEvent.setup();
      render(<AutocompleteInput {...defaultProps} />);

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);
      expect(screen.getByText("Option 1")).toBeInTheDocument();

      await user.keyboard("{Escape}");
      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });

    it("closes dropdown on tab key", async () => {
      const user = userEvent.setup();
      render(<AutocompleteInput {...defaultProps} />);

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);
      expect(screen.getByText("Option 1")).toBeInTheDocument();

      await user.tab();
      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });
  });

  describe("Option Selection", () => {
    it("selects option on click", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<AutocompleteInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);

      const option = screen.getByText("Option 1");
      await user.click(option);

      expect(onChange).toHaveBeenCalledWith("option1");
      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });

    it("updates input value when option is selected", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<AutocompleteInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);

      const option = screen.getByText("Option 1");
      await user.click(option);

      expect(screen.getByDisplayValue("Option 1")).toBeInTheDocument();
    });

    it("closes dropdown after option selection", async () => {
      const user = userEvent.setup();
      render(<AutocompleteInput {...defaultProps} />);

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);

      const option = screen.getByText("Option 1");
      await user.click(option);

      expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
    });

    it("does not select disabled options", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      const optionsWithDisabled = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2", disabled: true },
      ];
      render(
        <AutocompleteInput
          {...defaultProps}
          options={optionsWithDisabled}
          onChange={onChange}
        />,
      );

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);

      const disabledOption = screen.getByText("Option 2");
      await user.click(disabledOption);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Search Functionality", () => {
    it("filters options based on search query", async () => {
      const user = userEvent.setup();
      render(<AutocompleteInput {...defaultProps} />);

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);

      const searchInput = screen.getByPlaceholderText("Search options...");
      await user.type(searchInput, "Option 1");

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
    });

    it("shows no options message when search has no results", async () => {
      const user = userEvent.setup();
      render(<AutocompleteInput {...defaultProps} />);

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);

      const searchInput = screen.getByPlaceholderText("Search options...");
      await user.type(searchInput, "Nonexistent");

      expect(screen.getByText("No options found")).toBeInTheDocument();
    });

    it("respects maxSuggestions limit", async () => {
      const user = userEvent.setup();
      render(<AutocompleteInput {...defaultProps} maxSuggestions={2} />);

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.queryByText("Option 3")).not.toBeInTheDocument();
    });

    it("updates search query when typing in main input", async () => {
      const user = userEvent.setup();
      render(<AutocompleteInput {...defaultProps} />);

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);
      await user.type(input, "test");

      const searchInput = screen.getByPlaceholderText("Search options...");
      expect(searchInput).toHaveValue("test");
    });
  });

  describe("Keyboard Navigation", () => {
    it("navigates down with arrow down key", async () => {
      const user = userEvent.setup();
      render(<AutocompleteInput {...defaultProps} />);

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);

      await user.keyboard("{ArrowDown}");
      const option1 = screen.getByText("Option 1");
      expect(option1).toHaveClass("bg-primary-50", "text-primary-700");

      await user.keyboard("{ArrowDown}");
      const option2 = screen.getByText("Option 2");
      expect(option2).toHaveClass("bg-primary-50", "text-primary-700");
    });

    it("navigates up with arrow up key", async () => {
      const user = userEvent.setup();
      render(<AutocompleteInput {...defaultProps} />);

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);

      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowUp}");

      const option1 = screen.getByText("Option 1");
      expect(option1).toHaveClass("bg-primary-50", "text-primary-700");
    });

    it("selects highlighted option with enter key", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<AutocompleteInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);

      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(onChange).toHaveBeenCalledWith("option1");
    });

    it("does not navigate when disabled", async () => {
      const user = userEvent.setup();
      render(<AutocompleteInput {...defaultProps} disabled />);

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);

      await user.keyboard("{ArrowDown}");
      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });
  });

  describe("Clear Functionality", () => {
    it("shows clear button when value is selected", async () => {
      render(<AutocompleteInput {...defaultProps} value="option1" />);

      expect(
        screen.getByRole("button", { name: "Clear selection" }),
      ).toBeInTheDocument();
    });

    it("does not show clear button when no value is selected", () => {
      render(<AutocompleteInput {...defaultProps} />);

      expect(
        screen.queryByRole("button", { name: "Clear selection" }),
      ).not.toBeInTheDocument();
    });

    it("clears selection when clear button is clicked", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <AutocompleteInput
          {...defaultProps}
          value="option1"
          onChange={onChange}
        />,
      );

      const clearButton = screen.getByRole("button", {
        name: "Clear selection",
      });
      await user.click(clearButton);

      expect(onChange).toHaveBeenCalledWith("");
      expect(screen.getByDisplayValue("")).toBeInTheDocument();
    });

    it("focuses input after clearing", async () => {
      const user = userEvent.setup();
      render(<AutocompleteInput {...defaultProps} value="option1" />);

      const clearButton = screen.getByRole("button", {
        name: "Clear selection",
      });
      await user.click(clearButton);

      const input = screen.getByPlaceholderText("Select an option...");
      expect(input).toHaveFocus();
    });
  });

  describe("Custom Value Support", () => {
    it("allows custom values when allowCustomValue is true", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <AutocompleteInput
          {...defaultProps}
          allowCustomValue
          onChange={onChange}
        />,
      );

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);
      await user.type(input, "Custom Value");
      await user.keyboard("{Enter}");

      expect(onChange).toHaveBeenCalledWith("Custom Value");
    });

    it("does not allow custom values when allowCustomValue is false", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <AutocompleteInput
          {...defaultProps}
          allowCustomValue={false}
          onChange={onChange}
        />,
      );

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);
      await user.type(input, "Custom Value");
      await user.keyboard("{Enter}");

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Size Variants", () => {
    it("applies small size classes", () => {
      render(<AutocompleteInput {...defaultProps} size="sm" />);

      const input = screen.getByPlaceholderText("Select an option...");
      expect(input).toHaveClass("text-sm", "px-3", "py-1.5");
    });

    it("applies medium size classes", () => {
      render(<AutocompleteInput {...defaultProps} size="md" />);

      const input = screen.getByPlaceholderText("Select an option...");
      expect(input).toHaveClass("text-base", "px-3", "py-2");
    });

    it("applies large size classes", () => {
      render(<AutocompleteInput {...defaultProps} size="lg" />);

      const input = screen.getByPlaceholderText("Select an option...");
      expect(input).toHaveClass("text-lg", "px-4", "py-2.5");
    });
  });

  describe("Variant Styles", () => {
    it("applies outline variant classes", () => {
      render(<AutocompleteInput {...defaultProps} variant="outline" />);

      const input = screen.getByPlaceholderText("Select an option...");
      expect(input).toHaveClass("border", "border-gray-300");
    });

    it("applies filled variant classes", () => {
      render(<AutocompleteInput {...defaultProps} variant="filled" />);

      const input = screen.getByPlaceholderText("Select an option...");
      expect(input).toHaveClass("bg-gray-50", "border", "border-gray-300");
    });
  });

  describe("Error States", () => {
    it("applies error styling when error is present", () => {
      render(<AutocompleteInput {...defaultProps} error="Error message" />);

      const input = screen.getByPlaceholderText("Select an option...");
      expect(input).toHaveClass(
        "border-red-500",
        "focus:border-red-500",
        "focus:ring-red-200",
      );
    });

    it("prioritizes error over helper text", () => {
      render(
        <AutocompleteInput
          {...defaultProps}
          helperText="Helper text"
          error="Error message"
        />,
      );

      expect(screen.getByText("Error message")).toBeInTheDocument();
      expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("shows loading message when loading is true", async () => {
      const user = userEvent.setup();
      render(<AutocompleteInput {...defaultProps} loading />);

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("does not show options when loading", async () => {
      const user = userEvent.setup();
      render(<AutocompleteInput {...defaultProps} loading />);

      const input = screen.getByPlaceholderText("Select an option...");
      await user.click(input);

      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(<AutocompleteInput {...defaultProps} label="Test Label" />);

      const input = screen.getByPlaceholderText("Select an option...");
      expect(input).toBeInTheDocument();
    });

    it("associates label with input", () => {
      render(<AutocompleteInput {...defaultProps} label="Test Label" />);

      const label = screen.getByText("Test Label");
      expect(label).toBeInTheDocument();
    });

    it("has proper button roles", () => {
      render(<AutocompleteInput {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: "Toggle dropdown" }),
      ).toBeInTheDocument();
    });

    it("has proper clear button aria-label", () => {
      render(<AutocompleteInput {...defaultProps} value="option1" />);

      expect(
        screen.getByRole("button", { name: "Clear selection" }),
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty options array", () => {
      render(<AutocompleteInput {...defaultProps} options={[]} />);

      const input = screen.getByPlaceholderText("Select an option...");
      expect(input).toBeInTheDocument();
    });

    it("handles undefined value", () => {
      render(<AutocompleteInput {...defaultProps} value={undefined} />);

      const input = screen.getByPlaceholderText("Select an option...");
      expect(input).toHaveValue("");
    });

    it("handles null value", () => {
      render(<AutocompleteInput {...defaultProps} value={null} />);

      const input = screen.getByPlaceholderText("Select an option...");
      expect(input).toHaveValue("");
    });

    it("handles custom noOptionsMessage", () => {
      render(
        <AutocompleteInput
          {...defaultProps}
          noOptionsMessage="Custom no options message"
        />,
      );

      const input = screen.getByPlaceholderText("Select an option...");
      expect(input).toBeInTheDocument();
    });

    it("handles custom searchPlaceholder", () => {
      render(
        <AutocompleteInput
          {...defaultProps}
          searchPlaceholder="Custom search placeholder"
        />,
      );

      const input = screen.getByPlaceholderText("Select an option...");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    it("works with form validation", () => {
      render(
        <AutocompleteInput
          {...defaultProps}
          label="Test Label"
          required
          error="This field is required"
        />,
      );

      expect(screen.getByText("This field is required")).toBeInTheDocument();
      const label = screen.getByText("Test Label");
      const requiredIndicator = label.querySelector("span");
      expect(requiredIndicator).toHaveTextContent("*");
    });

    it("handles controlled to uncontrolled transition", () => {
      const { rerender } = render(
        <AutocompleteInput {...defaultProps} value="option1" />,
      );
      let input = screen.getByPlaceholderText("Select an option...");
      expect(input).toHaveValue("Option 1");

      rerender(<AutocompleteInput {...defaultProps} />);
      input = screen.getByPlaceholderText("Select an option...");
      expect(input).toHaveValue("");
    });

    it("maintains internal state when not controlled", () => {
      const { rerender } = render(<AutocompleteInput {...defaultProps} />);
      let input = screen.getByPlaceholderText("Select an option...");
      expect(input).toHaveValue("");

      rerender(<AutocompleteInput {...defaultProps} />);
      input = screen.getByPlaceholderText("Select an option...");
      expect(input).toHaveValue("");
    });
  });
});
