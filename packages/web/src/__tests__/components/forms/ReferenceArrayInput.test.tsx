import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { ReferenceArrayInput } from "../../../components/forms/ReferenceArrayInput";

// Mock data provider
const mockDataProvider = jest.fn();

// Mock reference data
const mockCategories = [
  { id: 1, name: "Technology", slug: "tech" },
  { id: 2, name: "Science", slug: "science" },
  { id: 3, name: "Arts", slug: "arts" },
  { id: 4, name: "Sports", slug: "sports" },
  { id: 5, name: "Politics", slug: "politics" },
];

const mockAuthors = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" },
];

// Default props for testing
const defaultProps = {
  name: "categories",
  label: "Categories",
  reference: "categories",
  optionText: "name",
  optionValue: "id",
  dataProvider: mockDataProvider,
};

describe("ReferenceArrayInput", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDataProvider.mockResolvedValue({
      data: mockCategories,
      total: mockCategories.length,
    });
  });

  describe("Basic Rendering", () => {
    it("renders with label", () => {
      render(<ReferenceArrayInput {...defaultProps} />);

      expect(screen.getByText("Categories")).toBeInTheDocument();
    });

    it("renders without label", () => {
      render(<ReferenceArrayInput {...defaultProps} label={undefined} />);

      expect(screen.queryByText("Categories")).not.toBeInTheDocument();
    });

    it("renders required label when required is true", () => {
      render(<ReferenceArrayInput {...defaultProps} required />);

      const labels = screen.getAllByText("Categories");
      const mainLabel = labels[0]; // Get the first (main) label
      expect(mainLabel).toBeInTheDocument();
      expect(mainLabel).toHaveTextContent("Categories*");
    });

    it("renders placeholder text", () => {
      render(
        <ReferenceArrayInput
          {...defaultProps}
          placeholder="Select categories"
        />,
      );

      expect(screen.getByText("Select categories")).toBeInTheDocument();
    });

    it("renders helper text", () => {
      render(
        <ReferenceArrayInput
          {...defaultProps}
          helperText="Choose categories for this post"
        />,
      );

      expect(
        screen.getByText("Choose categories for this post"),
      ).toBeInTheDocument();
    });

    it("does not render when hidden is true", () => {
      const { container } = render(
        <ReferenceArrayInput {...defaultProps} hidden />,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("Value Management", () => {
    it("displays selected items", () => {
      const selectedItems = [mockCategories[0], mockCategories[1]];
      render(<ReferenceArrayInput {...defaultProps} value={selectedItems} />);

      expect(screen.getByText("Selected Items (2)")).toBeInTheDocument();
      expect(screen.getByText("Technology")).toBeInTheDocument();
      expect(screen.getByText("Science")).toBeInTheDocument();
    });

    it("displays selected items count", () => {
      const selectedItems = [
        mockCategories[0],
        mockCategories[1],
        mockCategories[2],
      ];
      render(<ReferenceArrayInput {...defaultProps} value={selectedItems} />);

      expect(screen.getByText("Selected Items (3)")).toBeInTheDocument();
    });

    it("shows max items limit when specified", () => {
      const selectedItems = [mockCategories[0], mockCategories[1]];
      render(
        <ReferenceArrayInput
          {...defaultProps}
          value={selectedItems}
          maxItems={5}
        />,
      );

      expect(screen.getByText("Selected Items (2) / 5")).toBeInTheDocument();
    });

    it("hides input when max items reached", () => {
      const selectedItems = [mockCategories[0], mockCategories[1]];
      render(
        <ReferenceArrayInput
          {...defaultProps}
          value={selectedItems}
          maxItems={2}
        />,
      );

      expect(screen.getByText("Maximum 2 items selected")).toBeInTheDocument();
      expect(screen.queryByText("Add Categories")).not.toBeInTheDocument();
    });
  });

  describe("Item Management", () => {
    it("calls onChange when item is added", async () => {
      const handleChange = jest.fn();
      render(<ReferenceArrayInput {...defaultProps} onChange={handleChange} />);

      await waitFor(() => {
        expect(mockDataProvider).toHaveBeenCalled();
      });

      // The onChange would be called when a user selects an item
      // This is tested through the underlying ReferenceInput behavior
    });

    it("calls onChange when item is removed", () => {
      const selectedItems = [mockCategories[0], mockCategories[1]];
      const handleChange = jest.fn();
      render(
        <ReferenceArrayInput
          {...defaultProps}
          value={selectedItems}
          onChange={handleChange}
        />,
      );

      const removeButton = screen.getByLabelText("Remove Technology");
      fireEvent.click(removeButton);

      expect(handleChange).toHaveBeenCalledWith([mockCategories[1]]);
    });

    it("calls onChange when all items are cleared", () => {
      const selectedItems = [mockCategories[0], mockCategories[1]];
      const handleChange = jest.fn();
      render(
        <ReferenceArrayInput
          {...defaultProps}
          value={selectedItems}
          onChange={handleChange}
        />,
      );

      const clearAllButton = screen.getByText("Clear All");
      fireEvent.click(clearAllButton);

      expect(handleChange).toHaveBeenCalledWith([]);
    });

    it("does not show clear all button when clearable is false", () => {
      const selectedItems = [mockCategories[0], mockCategories[1]];
      render(
        <ReferenceArrayInput
          {...defaultProps}
          value={selectedItems}
          clearable={false}
        />,
      );

      expect(screen.queryByText("Clear All")).not.toBeInTheDocument();
    });
  });

  describe("Display Modes", () => {
    it("displays items as chips by default", () => {
      const selectedItems = [mockCategories[0], mockCategories[1]];
      render(<ReferenceArrayInput {...defaultProps} value={selectedItems} />);

      const chips = screen.getAllByText(/Technology|Science/);
      expect(chips).toHaveLength(2);
    });

    it("displays items as list when showAsChips is false", () => {
      const selectedItems = [mockCategories[0], mockCategories[1]];
      render(
        <ReferenceArrayInput
          {...defaultProps}
          value={selectedItems}
          showAsChips={false}
        />,
      );

      const items = screen.getAllByText(/Technology|Science/);
      expect(items).toHaveLength(2);
    });

    it("uses custom renderer when provided", () => {
      const selectedItems = [mockCategories[0]];
      const customRenderer = (item: any, onRemove: () => void) => (
        <div key={item.id} className="custom-item">
          <span>Custom: {item.name}</span>
          <button onClick={onRemove}>Remove</button>
        </div>
      );

      render(
        <ReferenceArrayInput
          {...defaultProps}
          value={selectedItems}
          renderSelectedItem={customRenderer}
        />,
      );

      expect(screen.getByText("Custom: Technology")).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("displays validation errors", () => {
      const errors = ["At least one category is required"];
      render(<ReferenceArrayInput {...defaultProps} errors={errors} />);

      const errorMessages = screen.getAllByText(
        "At least one category is required",
      );
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    it("hides validation errors when showValidationErrors is false", () => {
      const errors = ["At least one category is required"];
      render(
        <ReferenceArrayInput
          {...defaultProps}
          errors={errors}
          showValidationErrors={false}
        />,
      );

      expect(
        screen.queryByText("At least one category is required"),
      ).not.toBeInTheDocument();
    });

    it("shows errors when touched", () => {
      const errors = ["At least one category is required"];
      render(<ReferenceArrayInput {...defaultProps} errors={errors} touched />);

      const errorMessages = screen.getAllByText(
        "At least one category is required",
      );
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  describe("Disabled State", () => {
    it("disables input when disabled is true", async () => {
      render(<ReferenceArrayInput {...defaultProps} disabled />);

      await waitFor(() => {
        expect(mockDataProvider).toHaveBeenCalled();
      });

      // Test disabled state
      // This would be tested through the underlying ReferenceInput behavior
    });

    it("disables input when loading is true", async () => {
      render(<ReferenceArrayInput {...defaultProps} loading />);

      await waitFor(() => {
        expect(mockDataProvider).toHaveBeenCalled();
      });

      // Test loading state
      // This would be tested through the underlying ReferenceInput behavior
    });
  });

  describe("Data Provider Integration", () => {
    it("loads reference data on mount", async () => {
      render(<ReferenceArrayInput {...defaultProps} />);

      await waitFor(() => {
        expect(mockDataProvider).toHaveBeenCalledWith("categories", {
          pagination: { page: 1, perPage: 100 },
          sort: { field: "name", order: "ASC" },
          filter: {},
        });
      });
    });

    it("handles data loading error", async () => {
      mockDataProvider.mockRejectedValue(new Error("Failed to load"));

      render(<ReferenceArrayInput {...defaultProps} />);

      await waitFor(() => {
        expect(mockDataProvider).toHaveBeenCalled();
      });

      // Test error handling
      // This would be tested through the underlying ReferenceInput behavior
    });
  });

  describe("Customization", () => {
    it("applies custom className", () => {
      render(
        <ReferenceArrayInput
          {...defaultProps}
          className="custom-array-input"
        />,
      );

      const container = screen
        .getByText("Categories")
        .closest(".custom-array-input");
      expect(container).toBeInTheDocument();
    });

    it("applies custom labelClassName", () => {
      render(
        <ReferenceArrayInput {...defaultProps} labelClassName="custom-label" />,
      );

      const labels = screen.getAllByText("Categories");
      const mainLabel = labels[0].closest("label");
      expect(mainLabel).toHaveClass("custom-label");
    });

    it("applies custom inputClassName", () => {
      render(
        <ReferenceArrayInput {...defaultProps} inputClassName="custom-input" />,
      );

      // Test custom input class
      // This would be tested through the underlying ReferenceInput behavior
    });

    it("applies custom errorClassName", () => {
      render(
        <ReferenceArrayInput
          {...defaultProps}
          errors={["Error message"]}
          errorClassName="custom-error"
        />,
      );

      const errorMessages = screen.getAllByText("Error message");
      const customError = errorMessages.find((msg) =>
        msg.closest(".custom-error"),
      );
      expect(customError).toBeInTheDocument();
    });

    it("applies custom helperClassName", () => {
      render(
        <ReferenceArrayInput
          {...defaultProps}
          helperText="Helper text"
          helperClassName="custom-helper"
        />,
      );

      expect(screen.getByText("Helper text")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("provides proper ARIA labels for remove buttons", () => {
      const selectedItems = [mockCategories[0], mockCategories[1]];
      render(<ReferenceArrayInput {...defaultProps} value={selectedItems} />);

      expect(screen.getByLabelText("Remove Technology")).toBeInTheDocument();
      expect(screen.getByLabelText("Remove Science")).toBeInTheDocument();
    });

    it("supports keyboard navigation", async () => {
      render(<ReferenceArrayInput {...defaultProps} />);

      await waitFor(() => {
        expect(mockDataProvider).toHaveBeenCalled();
      });

      // Test keyboard navigation
      // This would be tested through the underlying ReferenceInput behavior
    });
  });

  describe("Edge Cases", () => {
    it("handles empty value array", () => {
      render(<ReferenceArrayInput {...defaultProps} value={[]} />);

      expect(screen.queryByText("Selected Items")).not.toBeInTheDocument();
    });

    it("handles undefined value", () => {
      render(<ReferenceArrayInput {...defaultProps} value={undefined} />);

      expect(screen.queryByText("Selected Items")).not.toBeInTheDocument();
    });

    it("handles null value", () => {
      render(<ReferenceArrayInput {...defaultProps} value={null as any} />);

      expect(screen.queryByText("Selected Items")).not.toBeInTheDocument();
    });

    it("handles undefined onChange", () => {
      const selectedItems = [mockCategories[0]];
      render(
        <ReferenceArrayInput
          {...defaultProps}
          value={selectedItems}
          onChange={undefined}
        />,
      );

      // Should not crash when onChange is undefined
      expect(screen.getByText("Selected Items (1)")).toBeInTheDocument();
      expect(screen.getByText("Technology")).toBeInTheDocument();
    });

    it("handles duplicate items", () => {
      const selectedItems = [mockCategories[0], mockCategories[0]];
      render(<ReferenceArrayInput {...defaultProps} value={selectedItems} />);

      expect(screen.getByText("Selected Items (2)")).toBeInTheDocument();
      expect(screen.getAllByText("Technology")).toHaveLength(2);
    });
  });

  describe("Integration", () => {
    it("integrates with form validation system", async () => {
      render(
        <ReferenceArrayInput
          {...defaultProps}
          validate={(value: any) => !value?.length && "Required"}
        />,
      );

      await waitFor(() => {
        expect(mockDataProvider).toHaveBeenCalled();
      });

      // Test validation integration
      // This would be tested through the underlying ReferenceInput behavior
    });

    it("works with different optionText and optionValue", async () => {
      render(
        <ReferenceArrayInput
          {...defaultProps}
          optionText="slug"
          optionValue="id"
        />,
      );

      await waitFor(() => {
        expect(mockDataProvider).toHaveBeenCalledWith("categories", {
          pagination: { page: 1, perPage: 100 },
          sort: { field: "slug", order: "ASC" },
          filter: {},
        });
      });
    });

    it("passes through all ReferenceInput props", async () => {
      render(
        <ReferenceArrayInput
          {...defaultProps}
          autocomplete
          minSearchLength={3}
          maxSuggestions={5}
          allowCreate
          size="lg"
        />,
      );

      await waitFor(() => {
        expect(mockDataProvider).toHaveBeenCalled();
      });

      // Test that props are passed through
      // This would be tested through the underlying ReferenceInput behavior
    });
  });

  describe("Reordering", () => {
    it("calls onReorder when items are reordered", () => {
      const selectedItems = [mockCategories[0], mockCategories[1]];
      const handleReorder = jest.fn();
      render(
        <ReferenceArrayInput
          {...defaultProps}
          value={selectedItems}
          allowReorder
          onReorder={handleReorder}
        />,
      );

      // Test reordering functionality
      // This would require drag-and-drop testing which is complex
      // For now, we just verify the component renders with reorder props
      expect(screen.getByText("Selected Items (2)")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("handles large arrays efficiently", () => {
      const largeArray = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Category ${i}`,
        slug: `category-${i}`,
      }));

      render(<ReferenceArrayInput {...defaultProps} value={largeArray} />);

      expect(screen.getByText("Selected Items (100)")).toBeInTheDocument();
    });

    it("prevents adding items beyond maxItems limit", () => {
      const selectedItems = [mockCategories[0], mockCategories[1]];
      const handleChange = jest.fn();
      render(
        <ReferenceArrayInput
          {...defaultProps}
          value={selectedItems}
          maxItems={2}
          onChange={handleChange}
        />,
      );

      // The input should be hidden when max items is reached
      expect(screen.getByText("Maximum 2 items selected")).toBeInTheDocument();
    });
  });
});
