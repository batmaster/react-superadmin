import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { SearchBar } from "../../../components/crud/SearchBar";

describe("SearchBar", () => {
  const defaultProps = {
    onSearch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Basic Rendering", () => {
    it("renders search input with default placeholder", () => {
      render(<SearchBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      expect(searchInput).toBeInTheDocument();
    });

    it("renders search input with custom placeholder", () => {
      render(<SearchBar {...defaultProps} placeholder="Search users..." />);

      const searchInput = screen.getByPlaceholderText("Search users...");
      expect(searchInput).toBeInTheDocument();
    });

    it("renders search icon", () => {
      render(<SearchBar {...defaultProps} />);

      const searchIcon = screen.getByTestId("search-icon");
      expect(searchIcon).toBeInTheDocument();
    });

    it("does not render clear button initially", () => {
      render(<SearchBar {...defaultProps} />);

      const clearButton = screen.queryByTestId("clear-button");
      expect(clearButton).not.toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("calls onSearch after 300ms delay when typing", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SearchBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      await user.type(searchInput, "test");

      expect(defaultProps.onSearch).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(defaultProps.onSearch).toHaveBeenCalledWith("test");
      });
    });

    it("debounces search calls", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SearchBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search...");

      // Type multiple characters quickly
      await user.type(searchInput, "t");
      jest.advanceTimersByTime(100);

      await user.type(searchInput, "e");
      jest.advanceTimersByTime(100);

      await user.type(searchInput, "s");
      jest.advanceTimersByTime(100);

      await user.type(searchInput, "t");

      // Should not have called onSearch yet
      expect(defaultProps.onSearch).not.toHaveBeenCalled();

      // Advance to trigger the final search
      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(defaultProps.onSearch).toHaveBeenCalledWith("test");
        expect(defaultProps.onSearch).toHaveBeenCalledTimes(1);
      });
    });

    it("calls onSearch with empty string when input is cleared", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SearchBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      await user.type(searchInput, "test");

      // Clear the input
      await user.clear(searchInput);

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(defaultProps.onSearch).toHaveBeenCalledWith("");
      });
    });
  });

  describe("Clear Button", () => {
    it("shows clear button when there is text", () => {
      render(<SearchBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.change(searchInput, { target: { value: "test" } });

      const clearButton = screen.getByTestId("clear-button");
      expect(clearButton).toBeInTheDocument();
    });

    it("clears input and calls onSearch when clear button is clicked", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SearchBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      await user.type(searchInput, "test");

      const clearButton = screen.getByTestId("clear-button");
      await user.click(clearButton);

      expect(searchInput).toHaveValue("");

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(defaultProps.onSearch).toHaveBeenCalledWith("");
      });
    });

    it("hides clear button after clearing", () => {
      render(<SearchBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.change(searchInput, { target: { value: "test" } });

      const clearButton = screen.getByTestId("clear-button");
      fireEvent.click(clearButton);

      expect(screen.queryByTestId("clear-button")).not.toBeInTheDocument();
    });
  });

  describe("Styling and Classes", () => {
    it("applies custom className", () => {
      render(<SearchBar {...defaultProps} className="custom-class" />);

      const container = screen.getByPlaceholderText("Search...").closest("div");
      expect(container).toHaveClass("custom-class");
    });

    it("applies default styling classes", () => {
      render(<SearchBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      expect(searchInput).toHaveClass(
        "block",
        "w-full",
        "pl-10",
        "pr-10",
        "py-2",
        "border",
        "border-gray-300",
        "rounded-md",
        "leading-5",
        "bg-white",
        "placeholder-gray-500",
        "focus:outline-none",
        "focus:placeholder-gray-400",
        "focus:ring-1",
        "focus:ring-primary-500",
        "focus:border-primary-500",
        "sm:text-sm",
      );
    });

    it("applies icon positioning classes", () => {
      render(<SearchBar {...defaultProps} />);

      const searchIcon = screen.getByTestId("search-icon");
      expect(searchIcon).toHaveClass("h-5", "w-5", "text-gray-400");

      // The positioning classes are on the container divs
      const searchIconContainer = searchIcon.closest("div");
      expect(searchIconContainer).toHaveClass(
        "absolute",
        "inset-y-0",
        "left-0",
        "pl-3",
      );
    });
  });

  describe("Accessibility", () => {
    it("has proper input attributes", () => {
      render(<SearchBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      expect(searchInput).toHaveAttribute("type", "text");
      expect(searchInput).toHaveAttribute("placeholder", "Search...");
    });

    it("has proper button attributes", () => {
      render(<SearchBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.change(searchInput, { target: { value: "test" } });

      const clearButton = screen.getByTestId("clear-button");
      expect(clearButton.tagName.toLowerCase()).toBe("button");
    });

    it("has proper icon accessibility", () => {
      render(<SearchBar {...defaultProps} />);

      const searchIcon = screen.getByTestId("search-icon");
      expect(searchIcon).toBeInTheDocument();

      // Icons should be present for visual users
      expect(searchIcon).toHaveClass("h-5", "w-5");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string input", async () => {
      render(<SearchBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.change(searchInput, { target: { value: "" } });

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(defaultProps.onSearch).toHaveBeenCalledWith("");
      });
    });

    it("handles special characters in search", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SearchBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      await user.type(searchInput, "test@123!");

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(defaultProps.onSearch).toHaveBeenCalledWith("test@123!");
      });
    });

    it("handles very long search queries", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const longQuery = "a".repeat(1000);

      render(<SearchBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      await user.type(searchInput, longQuery);

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(defaultProps.onSearch).toHaveBeenCalledWith(longQuery);
      });
    });
  });

  describe("Performance", () => {
    it("cleans up timer on unmount", () => {
      const { unmount } = render(<SearchBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.change(searchInput, { target: { value: "test" } });

      // Should not throw error when unmounting with active timer
      expect(() => unmount()).not.toThrow();
    });

    it("resets timer when input changes", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SearchBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search...");

      // Type first character
      await user.type(searchInput, "t");
      jest.advanceTimersByTime(200); // Not enough time to trigger search

      // Type second character (should reset timer)
      await user.type(searchInput, "e");
      jest.advanceTimersByTime(200); // Still not enough time

      expect(defaultProps.onSearch).not.toHaveBeenCalled();

      // Wait for the full delay
      jest.advanceTimersByTime(100);

      await waitFor(() => {
        expect(defaultProps.onSearch).toHaveBeenCalledWith("te");
      });
    });
  });
});
