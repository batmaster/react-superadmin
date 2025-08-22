import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { CheckboxGroupInput } from "../../../components/forms/CheckboxGroupInput";

const defaultOptions = [
  { value: "sports", label: "Sports" },
  { value: "music", label: "Music" },
  { value: "books", label: "Books" },
  { value: "travel", label: "Travel" },
];

const defaultProps = {
  options: defaultOptions,
  label: "Select your interests",
};

describe("CheckboxGroupInput", () => {
  describe("Basic Rendering", () => {
    it("renders with label", () => {
      render(<CheckboxGroupInput {...defaultProps} />);
      expect(screen.getByText("Select your interests")).toBeInTheDocument();
    });

    it("renders without label", () => {
      render(<CheckboxGroupInput options={defaultOptions} />);
      expect(
        screen.queryByText("Select your interests"),
      ).not.toBeInTheDocument();
    });

    it("renders all checkbox options", () => {
      render(<CheckboxGroupInput {...defaultProps} />);
      expect(screen.getByLabelText("Sports")).toBeInTheDocument();
      expect(screen.getByLabelText("Music")).toBeInTheDocument();
      expect(screen.getByLabelText("Books")).toBeInTheDocument();
      expect(screen.getByLabelText("Travel")).toBeInTheDocument();
    });

    it("renders with required indicator", () => {
      render(<CheckboxGroupInput {...defaultProps} required />);
      const requiredIndicator = screen.getByLabelText("required");
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveTextContent("*");
    });

    it("renders with helper text", () => {
      render(
        <CheckboxGroupInput
          {...defaultProps}
          helperText="This is helper text"
        />,
      );
      expect(screen.getByText("This is helper text")).toBeInTheDocument();
    });

    it("renders with error message", () => {
      render(<CheckboxGroupInput {...defaultProps} error="This is an error" />);
      expect(screen.getByText("This is an error")).toBeInTheDocument();
    });
  });

  describe("Size Variants", () => {
    it("renders with small size", () => {
      render(<CheckboxGroupInput {...defaultProps} size="sm" />);
      const group = screen.getByRole("group");
      expect(group).toHaveClass("text-sm");
    });

    it("renders with medium size (default)", () => {
      render(<CheckboxGroupInput {...defaultProps} />);
      const group = screen.getByRole("group");
      expect(group).toHaveClass("text-base");
    });

    it("renders with large size", () => {
      render(<CheckboxGroupInput {...defaultProps} size="lg" />);
      const group = screen.getByRole("group");
      expect(group).toHaveClass("text-lg");
    });
  });

  describe("Layout Direction", () => {
    it("renders with vertical layout by default", () => {
      render(<CheckboxGroupInput {...defaultProps} />);
      const group = screen.getByRole("group");
      expect(group).toHaveClass("flex flex-col gap-3");
    });

    it("renders with horizontal layout", () => {
      render(<CheckboxGroupInput {...defaultProps} direction="horizontal" />);
      const group = screen.getByRole("group");
      expect(group).toHaveClass("flex flex-wrap gap-4");
    });
  });

  describe("State Management", () => {
    it("manages internal state when not controlled", async () => {
      const user = userEvent.setup();
      render(<CheckboxGroupInput {...defaultProps} />);

      const sportsCheckbox = screen.getByLabelText("Sports");
      await user.click(sportsCheckbox);

      expect(sportsCheckbox).toBeChecked();
    });

    it("uses controlled value when provided", () => {
      render(
        <CheckboxGroupInput {...defaultProps} value={["sports", "music"]} />,
      );

      expect(screen.getByLabelText("Sports")).toBeChecked();
      expect(screen.getByLabelText("Music")).toBeChecked();
      expect(screen.getByLabelText("Books")).not.toBeChecked();
      expect(screen.getByLabelText("Travel")).not.toBeChecked();
    });

    it("calls onChange when value changes", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      render(<CheckboxGroupInput {...defaultProps} onChange={onChange} />);

      const sportsCheckbox = screen.getByLabelText("Sports");
      await user.click(sportsCheckbox);

      expect(onChange).toHaveBeenCalledWith(["sports"]);
    });

    it("handles multiple selections", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      render(<CheckboxGroupInput {...defaultProps} onChange={onChange} />);

      const sportsCheckbox = screen.getByLabelText("Sports");
      const musicCheckbox = screen.getByLabelText("Music");

      await user.click(sportsCheckbox);
      await user.click(musicCheckbox);

      expect(onChange).toHaveBeenLastCalledWith(["sports", "music"]);
    });

    it("handles deselection", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      render(
        <CheckboxGroupInput
          {...defaultProps}
          value={["sports", "music"]}
          onChange={onChange}
        />,
      );

      const sportsCheckbox = screen.getByLabelText("Sports");
      await user.click(sportsCheckbox);

      expect(onChange).toHaveBeenCalledWith(["music"]);
    });
  });

  describe("Select All / Clear All", () => {
    it("shows select all button when enabled", () => {
      render(<CheckboxGroupInput {...defaultProps} showSelectAll />);
      expect(screen.getByText("Select All")).toBeInTheDocument();
    });

    it("shows clear all button when enabled and options are selected", () => {
      render(
        <CheckboxGroupInput
          {...defaultProps}
          showClearAll
          value={["sports"]}
        />,
      );
      expect(screen.getByText("Clear All")).toBeInTheDocument();
    });

    it("does not show clear all when no options are selected", () => {
      render(<CheckboxGroupInput {...defaultProps} showClearAll />);
      expect(screen.queryByText("Clear All")).not.toBeInTheDocument();
    });

    it("selects all options when select all is clicked", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      render(
        <CheckboxGroupInput
          {...defaultProps}
          showSelectAll
          onChange={onChange}
        />,
      );

      const selectAllButton = screen.getByText("Select All");
      await user.click(selectAllButton);

      expect(onChange).toHaveBeenCalledWith([
        "sports",
        "music",
        "books",
        "travel",
      ]);
    });

    it("deselects all options when select all is clicked again", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      render(
        <CheckboxGroupInput
          {...defaultProps}
          showSelectAll
          value={["sports", "music", "books", "travel"]}
          onChange={onChange}
        />,
      );

      const deselectAllButton = screen.getByText("Deselect All");
      await user.click(deselectAllButton);

      expect(onChange).toHaveBeenCalledWith([]);
    });

    it("clears all selections when clear all is clicked", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      render(
        <CheckboxGroupInput
          {...defaultProps}
          showClearAll
          value={["sports", "music"]}
          onChange={onChange}
        />,
      );

      const clearAllButton = screen.getByText("Clear All");
      await user.click(clearAllButton);

      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe("Selection Limits", () => {
    it("enforces maximum selection limit", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();
      render(
        <CheckboxGroupInput
          {...defaultProps}
          maxSelections={2}
          onChange={onChange}
        />,
      );

      const sportsCheckbox = screen.getByLabelText("Sports");
      const musicCheckbox = screen.getByLabelText("Music");
      const booksCheckbox = screen.getByLabelText("Books");

      await user.click(sportsCheckbox);
      await user.click(musicCheckbox);
      await user.click(booksCheckbox);

      // Should not call onChange for the third selection
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenLastCalledWith(["sports", "music"]);
    });

    it("shows selection count when limit is set", () => {
      render(
        <CheckboxGroupInput
          {...defaultProps}
          maxSelections={3}
          value={["sports", "music"]}
        />,
      );
      expect(screen.getByText("2 of 3 selected")).toBeInTheDocument();
    });

    it("disables options when limit is reached", () => {
      render(
        <CheckboxGroupInput
          {...defaultProps}
          maxSelections={2}
          value={["sports", "music"]}
        />,
      );

      const booksCheckbox = screen.getByLabelText("Books");
      expect(booksCheckbox).toBeDisabled();
    });
  });

  describe("Disabled and Readonly States", () => {
    it("disables all checkboxes when disabled", () => {
      render(<CheckboxGroupInput {...defaultProps} disabled />);

      const sportsCheckbox = screen.getByLabelText("Sports");
      const musicCheckbox = screen.getByLabelText("Music");

      expect(sportsCheckbox).toBeDisabled();
      expect(musicCheckbox).toBeDisabled();
    });

    it("disables individual options when option is disabled", () => {
      const optionsWithDisabled = [
        { value: "sports", label: "Sports" },
        { value: "music", label: "Music", disabled: true },
        { value: "books", label: "Books" },
      ];

      render(<CheckboxGroupInput options={optionsWithDisabled} />);

      expect(screen.getByLabelText("Sports")).not.toBeDisabled();
      expect(screen.getByLabelText("Music")).toBeDisabled();
      expect(screen.getByLabelText("Books")).not.toBeDisabled();
    });

    it("disables select all and clear all when disabled", () => {
      render(
        <CheckboxGroupInput
          {...defaultProps}
          showSelectAll
          showClearAll
          value={["sports"]}
          disabled
        />,
      );

      expect(screen.getByText("Select All")).toBeDisabled();
      expect(screen.getByText("Clear All")).toBeDisabled();
    });

    it("sets readonly attribute when readOnly", () => {
      render(<CheckboxGroupInput {...defaultProps} readOnly />);

      const sportsCheckbox = screen.getByLabelText("Sports");
      expect(sportsCheckbox).toHaveAttribute("readonly");
    });
  });

  describe("Loading State", () => {
    it("shows loading indicator when loading", () => {
      render(<CheckboxGroupInput {...defaultProps} loading />);
      expect(screen.getByText("Loading options...")).toBeInTheDocument();
    });

    it("disables all interactions when loading", () => {
      render(<CheckboxGroupInput {...defaultProps} loading />);

      const sportsCheckbox = screen.getByLabelText("Sports");
      expect(sportsCheckbox).toBeDisabled();
    });
  });

  describe("Descriptions", () => {
    const optionsWithDescriptions = [
      {
        value: "sports",
        label: "Sports",
        data: { description: "Physical activities" },
      },
      {
        value: "music",
        label: "Music",
        data: { description: "Audio entertainment" },
      },
    ];

    it("shows descriptions when enabled", () => {
      render(
        <CheckboxGroupInput
          options={optionsWithDescriptions}
          showDescriptions
        />,
      );

      expect(screen.getByText("Physical activities")).toBeInTheDocument();
      expect(screen.getByText("Audio entertainment")).toBeInTheDocument();
    });

    it("uses custom renderer for descriptions", () => {
      const renderDescription = (option: {
        value: string;
        data: { description: string };
      }) => (
        <span data-testid={`desc-${option.value}`}>
          {option.data.description}
        </span>
      );

      render(
        <CheckboxGroupInput
          options={optionsWithDescriptions}
          showDescriptions
          renderDescription={renderDescription}
        />,
      );

      expect(screen.getByTestId("desc-sports")).toBeInTheDocument();
      expect(screen.getByTestId("desc-music")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("associates label with group", () => {
      render(<CheckboxGroupInput {...defaultProps} id="test-id" />);
      const group = screen.getByRole("group");
      const label = screen.getByText("Select your interests");

      expect(label).toHaveAttribute("for", "test-id");
      expect(group).toHaveAttribute("id", "test-id");
    });

    it("generates unique ID when not provided", () => {
      render(<CheckboxGroupInput {...defaultProps} />);
      const group = screen.getByRole("group");
      const label = screen.getByText("Select your interests");

      expect(group.id).toMatch(/^checkbox-group-/);
      expect(label).toHaveAttribute("for", group.id);
    });

    it("provides proper ARIA attributes", () => {
      render(
        <CheckboxGroupInput
          {...defaultProps}
          helperText="Helper text"
          error="Error message"
        />,
      );

      const group = screen.getByRole("group");
      expect(group).toHaveAttribute("aria-describedby");

      const describedBy = group.getAttribute("aria-describedby");
      expect(describedBy).toContain("helper");
      expect(describedBy).toContain("error");
    });

    it("associates individual checkboxes with their labels", () => {
      render(<CheckboxGroupInput {...defaultProps} />);

      const sportsCheckbox = screen.getByLabelText("Sports");
      const musicCheckbox = screen.getByLabelText("Music");

      expect(sportsCheckbox).toHaveAttribute("id");
      expect(musicCheckbox).toHaveAttribute("id");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty options array", () => {
      render(<CheckboxGroupInput options={[]} />);
      const group = screen.getByRole("group");
      expect(group).toBeInTheDocument();
    });

    it("handles options with duplicate values", () => {
      const duplicateOptions = [
        { value: "sports", label: "Sports" },
        { value: "sports", label: "Sports Duplicate" },
      ];

      render(<CheckboxGroupInput options={duplicateOptions} />);
      expect(screen.getByLabelText("Sports")).toBeInTheDocument();
      expect(screen.getByLabelText("Sports Duplicate")).toBeInTheDocument();
    });

    it("handles very long option labels", () => {
      const longLabel = "A".repeat(100);
      const optionsWithLongLabel = [{ value: "long", label: longLabel }];

      render(<CheckboxGroupInput options={optionsWithLongLabel} />);
      expect(screen.getByLabelText(longLabel)).toBeInTheDocument();
    });

    it("handles special characters in option values", () => {
      const specialOptions = [
        { value: "special!@#$%", label: "Special Characters" },
      ];

      render(<CheckboxGroupInput options={specialOptions} />);
      expect(screen.getByLabelText("Special Characters")).toBeInTheDocument();
    });
  });

  describe("Integration Features", () => {
    it("supports custom className", () => {
      render(<CheckboxGroupInput {...defaultProps} className="custom-class" />);
      const container = screen
        .getByText("Select your interests")
        .closest("div");
      expect(container).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = jest.fn();
      render(<CheckboxGroupInput {...defaultProps} ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it("spreads additional props to container element", () => {
      render(
        <CheckboxGroupInput
          {...defaultProps}
          data-testid="custom-container"
          aria-label="Custom label"
        />,
      );

      const container = screen.getByTestId("custom-container");
      expect(container).toHaveAttribute("aria-label", "Custom label");
    });

    it("supports custom checkbox and label class names", () => {
      render(
        <CheckboxGroupInput
          {...defaultProps}
          checkboxClassName="custom-checkbox"
          labelClassName="custom-label"
        />,
      );

      const sportsCheckbox = screen.getByLabelText("Sports");
      const label = screen.getByText("Select your interests");

      expect(sportsCheckbox).toHaveClass("custom-checkbox");
      expect(label).toHaveClass("custom-label");
    });
  });
});
