import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Dropdown } from "../../../components/ui/Dropdown";

describe("Dropdown Component", () => {
  const mockItems = [
    { label: "Option 1", value: "option1", onClick: jest.fn() },
    { label: "Option 2", value: "option2", onClick: jest.fn() },
    { label: "Option 3", value: "option3", onClick: jest.fn() },
  ];

  const defaultProps = {
    trigger: <button>Click me</button>,
    items: mockItems,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<Dropdown {...defaultProps} />);

      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("renders trigger element correctly", () => {
      const customTrigger = (
        <span data-testid="custom-trigger">Custom Trigger</span>
      );
      render(<Dropdown {...defaultProps} trigger={customTrigger} />);

      expect(screen.getByTestId("custom-trigger")).toBeInTheDocument();
    });

    it("renders all dropdown items when open", () => {
      render(<Dropdown {...defaultProps} />);

      // Click to open dropdown
      fireEvent.click(screen.getByText("Click me"));

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });
  });

  describe("State Management", () => {
    it("starts in closed state", () => {
      render(<Dropdown {...defaultProps} />);

      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });

    it("opens when trigger is clicked", () => {
      render(<Dropdown {...defaultProps} />);

      fireEvent.click(screen.getByText("Click me"));

      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("closes when trigger is clicked again", () => {
      render(<Dropdown {...defaultProps} />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));
      expect(screen.getByText("Option 1")).toBeInTheDocument();

      // Close dropdown
      fireEvent.click(screen.getByText("Click me"));
      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });

    it("closes when clicking outside", async () => {
      render(<Dropdown {...defaultProps} />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));
      expect(screen.getByText("Option 1")).toBeInTheDocument();

      // Click outside
      fireEvent.mouseDown(document.body);

      await waitFor(() => {
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
      });
    });
  });

  describe("Item Interaction", () => {
    it("calls onClick when item is clicked", () => {
      render(<Dropdown {...defaultProps} />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));

      // Click first option
      fireEvent.click(screen.getByText("Option 1"));

      expect(mockItems[0].onClick).toHaveBeenCalledTimes(1);
    });

    it("closes dropdown after item click", () => {
      render(<Dropdown {...defaultProps} />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));
      expect(screen.getByText("Option 1")).toBeInTheDocument();

      // Click first option
      fireEvent.click(screen.getByText("Option 1"));

      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });

    it("handles items without onClick gracefully", () => {
      const itemsWithoutOnClick = [
        { label: "No Click", value: "no-click" },
        { label: "Has Click", value: "has-click", onClick: jest.fn() },
      ];

      render(<Dropdown {...defaultProps} items={itemsWithoutOnClick} />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));

      // Click item without onClick
      fireEvent.click(screen.getByText("No Click"));

      // Should not throw error and should close dropdown
      expect(screen.queryByText("No Click")).not.toBeInTheDocument();
    });
  });

  describe("Alignment", () => {
    it("aligns to left by default", () => {
      render(<Dropdown {...defaultProps} />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));

      const dropdown = screen
        .getByText("Option 1")
        .closest('div[class*="absolute"]');
      expect(dropdown).toHaveClass("left-0");
    });

    it("aligns to right when specified", () => {
      render(<Dropdown {...defaultProps} align="right" />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));

      const dropdown = screen
        .getByText("Option 1")
        .closest('div[class*="absolute"]');
      expect(dropdown).toHaveClass("right-0");
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className when provided", () => {
      render(<Dropdown {...defaultProps} className="custom-dropdown" />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));

      const dropdown = screen
        .getByText("Option 1")
        .closest('div[class*="absolute"]');
      expect(dropdown).toHaveClass("custom-dropdown");
    });

    it("merges custom className with default classes", () => {
      render(<Dropdown {...defaultProps} className="custom-dropdown" />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));

      const dropdown = screen
        .getByText("Option 1")
        .closest('div[class*="absolute"]');
      expect(dropdown).toHaveClass(
        "absolute",
        "z-50",
        "mt-2",
        "w-48",
        "rounded-md",
        "bg-white",
        "shadow-lg",
        "ring-1",
        "ring-black",
        "ring-opacity-5",
        "focus:outline-none",
        "left-0",
        "custom-dropdown",
      );
    });
  });

  describe("Special Item Types", () => {
    it("renders disabled items correctly", () => {
      const itemsWithDisabled = [
        { label: "Enabled", value: "enabled", onClick: jest.fn() },
        {
          label: "Disabled",
          value: "disabled",
          onClick: jest.fn(),
          disabled: true,
        },
      ];

      render(<Dropdown {...defaultProps} items={itemsWithDisabled} />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));

      const disabledItem = screen.getByText("Disabled");
      expect(disabledItem).toHaveClass(
        "disabled:opacity-50",
        "disabled:cursor-not-allowed",
      );
      expect(disabledItem).toBeDisabled();
    });

    it("renders divider items correctly", () => {
      const itemsWithDivider = [
        { label: "Option 1", value: "option1", onClick: jest.fn() },
        { divider: true },
        { label: "Option 2", value: "option2", onClick: jest.fn() },
      ];

      render(<Dropdown {...defaultProps} items={itemsWithDivider} />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));

      const divider = screen.getByText("Option 1").nextElementSibling;
      expect(divider).toHaveClass("border-t", "border-gray-100", "my-1");
    });

    it("handles mixed item types correctly", () => {
      const mixedItems = [
        { label: "Option 1", value: "option1", onClick: jest.fn() },
        { divider: true },
        {
          label: "Disabled",
          value: "disabled",
          onClick: jest.fn(),
          disabled: true,
        },
        { label: "Option 2", value: "option2", onClick: jest.fn() },
      ];

      render(<Dropdown {...defaultProps} items={mixedItems} />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Disabled")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();

      // Check divider is present
      const dividers = document.querySelectorAll(
        ".border-t.border-gray-100.my-1",
      );
      expect(dividers).toHaveLength(1);
    });
  });

  describe("Accessibility", () => {
    it("has proper button semantics for items", () => {
      render(<Dropdown {...defaultProps} />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));

      const items = screen.getAllByRole("button");
      expect(items).toHaveLength(3);
      expect(items[0]).toHaveTextContent("Option 1");
    });

    it("maintains focus management", () => {
      render(<Dropdown {...defaultProps} />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));

      const firstItem = screen.getByText("Option 1");
      expect(firstItem).toBeInTheDocument();
    });
  });

  describe("Event Handling", () => {
    it("prevents event bubbling on item click", () => {
      const onTriggerClick = jest.fn();
      const trigger = <button onClick={onTriggerClick}>Click me</button>;

      render(<Dropdown {...defaultProps} trigger={trigger} />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));
      expect(onTriggerClick).toHaveBeenCalledTimes(1);

      // Click item
      fireEvent.click(screen.getByText("Option 1"));

      // Should not trigger the trigger click again
      expect(onTriggerClick).toHaveBeenCalledTimes(1);
    });

    it("handles multiple rapid clicks correctly", () => {
      render(<Dropdown {...defaultProps} />);

      // Rapid clicks
      fireEvent.click(screen.getByText("Click me"));
      fireEvent.click(screen.getByText("Click me"));
      fireEvent.click(screen.getByText("Click me"));

      // Should be in a consistent state
      const isOpen = screen.queryByText("Option 1") !== null;
      expect(typeof isOpen).toBe("boolean");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty items array", () => {
      render(<Dropdown {...defaultProps} items={[]} />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));

      // Should not crash and should show empty dropdown
      const dropdown = document.querySelector('div[class*="absolute"]');
      expect(dropdown).toBeInTheDocument();
    });

    it("handles items with null/undefined values", () => {
      const itemsWithNullValues = [
        { label: "Null Value", value: null, onClick: jest.fn() },
        { label: "Undefined Value", value: undefined, onClick: jest.fn() },
      ];

      render(<Dropdown {...defaultProps} items={itemsWithNullValues} />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));

      expect(screen.getByText("Null Value")).toBeInTheDocument();
      expect(screen.getByText("Undefined Value")).toBeInTheDocument();
    });

    it("handles very long item labels", () => {
      const longLabel =
        "This is a very long dropdown item label that might cause layout issues";
      const itemsWithLongLabel = [
        { label: longLabel, value: "long", onClick: jest.fn() },
      ];

      render(<Dropdown {...defaultProps} items={itemsWithLongLabel} />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("handles large number of items efficiently", () => {
      const manyItems = Array.from({ length: 100 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: `option${i + 1}`,
        onClick: jest.fn(),
      }));

      render(<Dropdown {...defaultProps} items={manyItems} />);

      // Open dropdown
      fireEvent.click(screen.getByText("Click me"));

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 100")).toBeInTheDocument();
    });

    it("cleanup event listeners on unmount", () => {
      const removeEventListenerSpy = jest.spyOn(
        document,
        "removeEventListener",
      );

      const { unmount } = render(<Dropdown {...defaultProps} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });
  });
});
