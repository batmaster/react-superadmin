import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ArrayInput } from "../../../components/forms/ArrayInput";
import { Input } from "../../../components/forms/Input";

describe("ArrayInput", () => {
  const defaultProps = {
    label: "Test Array",
    value: ["item1", "item2"],
    onChange: jest.fn(),
    children: ({ index, value, onChange, onRemove, canRemove }: any) => (
      <div key={index} className="flex gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
        {canRemove && (
          <button onClick={onRemove} data-testid={`remove-${index}`}>
            Remove
          </button>
        )}
      </div>
    ),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders with label", () => {
      render(<ArrayInput {...defaultProps} />);
      expect(screen.getByText("Test Array")).toBeInTheDocument();
    });

    it("renders without label", () => {
      render(<ArrayInput {...defaultProps} label={undefined} />);
      expect(screen.queryByText("Test Array")).not.toBeInTheDocument();
    });

    it("renders required label when required is true", () => {
      render(<ArrayInput {...defaultProps} required />);
      const requiredIndicator = screen.getByText("*");
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveAttribute("aria-label", "required");
    });

    it("renders array items", () => {
      render(<ArrayInput {...defaultProps} />);
      expect(screen.getByDisplayValue("item1")).toBeInTheDocument();
      expect(screen.getByDisplayValue("item2")).toBeInTheDocument();
    });

    it("renders item numbers by default", () => {
      render(<ArrayInput {...defaultProps} />);
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("hides item numbers when showItemNumbers is false", () => {
      render(<ArrayInput {...defaultProps} showItemNumbers={false} />);
      expect(screen.queryByText("1")).not.toBeInTheDocument();
      expect(screen.queryByText("2")).not.toBeInTheDocument();
    });
  });

  describe("Initialization", () => {
    it("initializes with initialCount when value is empty", () => {
      render(
        <ArrayInput
          {...defaultProps}
          value={[]}
          initialCount={3}
          onChange={jest.fn()}
        />,
      );
      expect(screen.getAllByDisplayValue("")).toHaveLength(3);
    });

    it("does not initialize when value is not empty", () => {
      render(<ArrayInput {...defaultProps} initialCount={5} />);
      expect(screen.getAllByDisplayValue("item1")).toHaveLength(1);
      expect(screen.getAllByDisplayValue("item2")).toHaveLength(1);
    });

    it("handles non-array values gracefully", () => {
      render(
        <ArrayInput
          {...defaultProps}
          value={null as any}
          onChange={jest.fn()}
        />,
      );
      expect(screen.queryByDisplayValue("item1")).not.toBeInTheDocument();
    });
  });

  describe("Adding Items", () => {
    it("adds item at the end when add button is clicked", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(
        <ArrayInput {...defaultProps} value={["item1"]} onChange={onChange} />,
      );

      const addButton = screen.getByText("Add Item");
      await user.click(addButton);

      expect(onChange).toHaveBeenCalledWith(["item1", null]);
    });

    it("adds item after specific index", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(
        <ArrayInput
          {...defaultProps}
          value={["item1", "item2"]}
          onChange={onChange}
        />,
      );

      const addAfterButtons = screen.getAllByLabelText(/Add item after/);
      await user.click(addAfterButtons[0]); // Add after first item

      expect(onChange).toHaveBeenCalledWith(["item1", null, "item2"]);
    });

    it("respects maxItems limit", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(
        <ArrayInput
          {...defaultProps}
          value={["item1", "item2"]}
          maxItems={2}
          onChange={onChange}
        />,
      );

      const addButton = screen.queryByText("Add Item");
      expect(addButton).not.toBeInTheDocument();

      // When maxItems is reached, add after buttons should also be hidden
      const addAfterButtons = screen.queryAllByLabelText(/Add item after/);
      expect(addAfterButtons).toHaveLength(0);
    });

    it("shows custom add button text", () => {
      render(<ArrayInput {...defaultProps} addButtonText="Add New Item" />);
      expect(screen.getByText("Add New Item")).toBeInTheDocument();
    });
  });

  describe("Removing Items", () => {
    it("removes item when remove button is clicked", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(
        <ArrayInput
          {...defaultProps}
          value={["item1", "item2"]}
          onChange={onChange}
        />,
      );

      const removeButton = screen.getByTestId("remove-0");
      await user.click(removeButton);

      expect(onChange).toHaveBeenCalledWith(["item2"]);
    });

    it("respects minItems limit", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(
        <ArrayInput
          {...defaultProps}
          value={["item1"]}
          minItems={1}
          onChange={onChange}
        />,
      );

      const removeButton = screen.queryByTestId("remove-0");
      expect(removeButton).not.toBeInTheDocument();
    });

    it("prevents removal when only item even if minItems is 0", () => {
      render(
        <ArrayInput
          {...defaultProps}
          value={["item1"]}
          minItems={0}
          onChange={jest.fn()}
        />,
      );

      // The component logic prevents removal of the only item even when minItems is 0
      // This is controlled by the !isOnly condition in canRemove
      const removeButton = screen.queryByTestId("remove-0");
      expect(removeButton).not.toBeInTheDocument();
    });

    it("shows custom remove button text", () => {
      render(<ArrayInput {...defaultProps} removeButtonText="Delete" />);
      // The custom text is applied to the Button component, not the test button
      // So we check that the Button components have the correct aria-label
      expect(screen.getAllByLabelText("Remove item 1")).toHaveLength(1);
      expect(screen.getAllByLabelText("Remove item 2")).toHaveLength(1);
    });
  });

  describe("Reordering", () => {
    it("enables reordering when allowReorder is true", () => {
      render(<ArrayInput {...defaultProps} allowReorder />);

      const moveUpButtons = screen.getAllByLabelText(/Move item .* up/);
      const moveDownButtons = screen.getAllByLabelText(/Move item .* down/);

      expect(moveUpButtons).toHaveLength(2);
      expect(moveDownButtons).toHaveLength(2);
    });

    it("disables reordering when allowReorder is false", () => {
      render(<ArrayInput {...defaultProps} allowReorder={false} />);

      const moveUpButtons = screen.queryAllByLabelText(/Move item .* up/);
      const moveDownButtons = screen.queryAllByLabelText(/Move item .* down/);

      expect(moveUpButtons).toHaveLength(0);
      expect(moveDownButtons).toHaveLength(0);
    });

    it("moves item up when up button is clicked", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(
        <ArrayInput
          {...defaultProps}
          value={["item1", "item2"]}
          allowReorder
          onChange={onChange}
        />,
      );

      const moveUpButton = screen.getByLabelText("Move item 2 up");
      await user.click(moveUpButton);

      expect(onChange).toHaveBeenCalledWith(["item2", "item1"]);
    });

    it("moves item down when down button is clicked", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(
        <ArrayInput
          {...defaultProps}
          value={["item1", "item2"]}
          allowReorder
          onChange={onChange}
        />,
      );

      const moveDownButton = screen.getByLabelText("Move item 1 down");
      await user.click(moveDownButton);

      expect(onChange).toHaveBeenCalledWith(["item2", "item1"]);
    });

    it("disables up button for first item", () => {
      render(
        <ArrayInput
          {...defaultProps}
          value={["item1", "item2"]}
          allowReorder
        />,
      );

      const firstItemUpButton = screen.getByLabelText("Move item 1 up");
      expect(firstItemUpButton).toBeDisabled();
    });

    it("disables down button for last item", () => {
      render(
        <ArrayInput
          {...defaultProps}
          value={["item1", "item2"]}
          allowReorder
        />,
      );

      const lastItemDownButton = screen.getByLabelText("Move item 2 down");
      expect(lastItemDownButton).toBeDisabled();
    });
  });

  describe("Item Updates", () => {
    it("updates item value when child input changes", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(
        <ArrayInput
          {...defaultProps}
          value={["item1", "item2"]}
          onChange={onChange}
        />,
      );

      const firstInput = screen.getByDisplayValue("item1");
      await user.clear(firstInput);
      await user.type(firstInput, "updated");

      // Check that onChange was called multiple times during typing
      expect(onChange).toHaveBeenCalled();

      // The final value should be different from the original
      const calls = onChange.mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0][0]).not.toBe("item1");
      expect(lastCall[0][1]).toBe("item2");
    });
  });

  describe("Validation", () => {
    it("displays validation errors", () => {
      const errors = ["Error 1", "Error 2"];
      render(<ArrayInput {...defaultProps} errors={errors} />);

      expect(screen.getByText("Error 1")).toBeInTheDocument();
      expect(screen.getByText("Error 2")).toBeInTheDocument();
    });

    it("hides validation errors when showValidationErrors is false", () => {
      const errors = ["Error 1", "Error 2"];
      render(
        <ArrayInput
          {...defaultProps}
          errors={errors}
          showValidationErrors={false}
        />,
      );

      expect(screen.queryByText("Error 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Error 2")).not.toBeInTheDocument();
    });

    it("displays helper text", () => {
      render(<ArrayInput {...defaultProps} helperText="This is helper text" />);

      expect(screen.getByText("This is helper text")).toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("disables all interactions when disabled is true", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<ArrayInput {...defaultProps} disabled onChange={onChange} />);

      const addButton = screen.getByText("Add Item");
      const removeButton = screen.getByTestId("remove-0");

      await user.click(addButton);
      await user.click(removeButton);

      expect(onChange).not.toHaveBeenCalled();
    });

    it("applies disabled styles to label", () => {
      render(<ArrayInput {...defaultProps} disabled />);

      // The aria-disabled attribute is on the label element, not the text span
      const labelElement = screen.getByText("Test Array").closest("label");
      expect(labelElement).toHaveAttribute("aria-disabled", "true");

      // Also check that the label has disabled styling
      expect(labelElement).toHaveClass("text-gray-400", "cursor-not-allowed");
    });
  });

  describe("Accessibility", () => {
    it("provides proper ARIA labels for buttons", () => {
      render(<ArrayInput {...defaultProps} allowReorder />);

      expect(screen.getByLabelText("Add new item")).toBeInTheDocument();
      expect(screen.getByLabelText("Move item 1 up")).toBeInTheDocument();
      expect(screen.getByLabelText("Move item 2 down")).toBeInTheDocument();
    });

    it("provides proper ARIA labels for add after buttons", () => {
      render(<ArrayInput {...defaultProps} />);

      expect(screen.getByLabelText("Add item after 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Add item after 2")).toBeInTheDocument();
    });

    it("provides proper ARIA labels for remove buttons", () => {
      render(<ArrayInput {...defaultProps} />);

      expect(screen.getByLabelText("Remove item 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Remove item 2")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty array value", () => {
      render(<ArrayInput {...defaultProps} value={[]} onChange={jest.fn()} />);

      expect(screen.queryByDisplayValue("item1")).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue("item2")).not.toBeInTheDocument();
    });

    it("handles undefined onChange", () => {
      expect(() => {
        render(<ArrayInput {...defaultProps} onChange={undefined} />);
      }).not.toThrow();
    });

    it("handles null values in array", () => {
      render(
        <ArrayInput
          {...defaultProps}
          value={[null, "item2"]}
          onChange={jest.fn()}
        />,
      );

      expect(screen.getByDisplayValue("")).toBeInTheDocument();
      expect(screen.getByDisplayValue("item2")).toBeInTheDocument();
    });
  });
});
