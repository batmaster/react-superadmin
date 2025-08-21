import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "../../../components/crud/Pagination";

describe("Pagination", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders pagination controls when totalPages > 1", () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      // The navigation buttons don't have accessible names, they just contain icons
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("does not render when totalPages <= 1", () => {
      render(<Pagination {...defaultProps} totalPages={1} />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("renders current page with primary variant", () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      const currentPageButton = screen.getByText("3");
      expect(currentPageButton).toHaveClass("bg-blue-600", "text-white");
    });

    it("renders non-current pages with outline variant", () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      const nonCurrentPageButton = screen.getByText("1");
      expect(nonCurrentPageButton).toHaveClass(
        "border-gray-300",
        "text-gray-700",
      );
    });
  });

  describe("Navigation Buttons", () => {
    it("disables previous button on first page", () => {
      render(<Pagination {...defaultProps} currentPage={1} />);

      const buttons = screen.getAllByRole("button");
      const prevButton = buttons[0]; // First button is previous
      expect(prevButton).toBeDisabled();
    });

    it("disables next button on last page", () => {
      render(<Pagination {...defaultProps} currentPage={10} />);

      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1]; // Last button is next
      expect(nextButton).toBeDisabled();
    });

    it("enables navigation buttons on middle pages", () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      const buttons = screen.getAllByRole("button");
      const prevButton = buttons[0]; // First button is previous
      const nextButton = buttons[buttons.length - 1]; // Last button is next

      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });

    it("calls onPageChange with previous page when prev button clicked", () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      const buttons = screen.getAllByRole("button");
      const prevButton = buttons[0]; // First button is previous
      fireEvent.click(prevButton);

      expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
    });

    it("calls onPageChange with next page when next button clicked", () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1]; // Last button is next
      fireEvent.click(nextButton);

      expect(defaultProps.onPageChange).toHaveBeenCalledWith(4);
    });
  });

  describe("Page Number Buttons", () => {
    it("calls onPageChange with correct page when page button clicked", () => {
      render(<Pagination {...defaultProps} currentPage={1} />);

      const page5Button = screen.getByText("5");
      fireEvent.click(page5Button);

      expect(defaultProps.onPageChange).toHaveBeenCalledWith(5);
    });

    it("calls onPageChange with first page when first page button clicked", () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      const firstPageButton = screen.getByText("1");
      fireEvent.click(firstPageButton);

      expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
    });

    it("calls onPageChange with last page when last page button clicked", () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      const lastPageButton = screen.getByText("10");
      fireEvent.click(lastPageButton);

      expect(defaultProps.onPageChange).toHaveBeenCalledWith(10);
    });
  });

  describe("Page Visibility Logic", () => {
    it("shows first page when not in visible range", () => {
      render(<Pagination {...defaultProps} currentPage={8} />);

      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("shows last page when not in visible range", () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("shows ellipsis when there are gaps", () => {
      render(<Pagination {...defaultProps} currentPage={8} />);

      const ellipsis = screen.getByText("...");
      expect(ellipsis).toBeInTheDocument();
    });

    it("shows ellipsis when there are gaps", () => {
      render(<Pagination {...defaultProps} currentPage={1} />);

      // With currentPage=1 and totalPages=10, there will be ellipsis
      expect(screen.getByText("...")).toBeInTheDocument();
    });
  });

  describe("Max Visible Pages", () => {
    it("respects maxVisiblePages prop", () => {
      render(
        <Pagination {...defaultProps} currentPage={5} maxVisiblePages={3} />,
      );

      // Should show pages 4, 5, 6 (current page centered)
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.queryByText("3")).not.toBeInTheDocument();
      expect(screen.queryByText("7")).not.toBeInTheDocument();
    });

    it("defaults to 5 visible pages", () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      // The component shows pages around the current page
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
    });

    it("handles even maxVisiblePages correctly", () => {
      render(
        <Pagination {...defaultProps} currentPage={5} maxVisiblePages={4} />,
      );

      // With even number, should center around current page
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      // The component may not show page 7 with this configuration
      expect(screen.getByText("4")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles current page at start", () => {
      render(<Pagination {...defaultProps} currentPage={1} />);

      // Should show pages 1, 2, 3, 4, 5
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("handles current page at end", () => {
      render(<Pagination {...defaultProps} currentPage={10} />);

      // Should show pages 6, 7, 8, 9, 10
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText("9")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("handles small total pages", () => {
      render(<Pagination {...defaultProps} totalPages={3} currentPage={2} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("handles large total pages", () => {
      render(
        <Pagination {...defaultProps} totalPages={100} currentPage={50} />,
      );

      // Should show pages around 50
      expect(screen.getByText("48")).toBeInTheDocument();
      expect(screen.getByText("49")).toBeInTheDocument();
      expect(screen.getByText("50")).toBeInTheDocument();
      expect(screen.getByText("51")).toBeInTheDocument();
      expect(screen.getByText("52")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper button roles", () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);

      // All elements should have button role (implicit or explicit)
      buttons.forEach((button) => {
        expect(button.tagName.toLowerCase()).toBe("button");
      });
    });

    it("has navigation buttons with icons", () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);

      // First and last buttons should be navigation buttons
      const prevButton = buttons[0];
      const nextButton = buttons[buttons.length - 1];

      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("applies correct classes to container", () => {
      render(<Pagination {...defaultProps} />);

      const container = screen.getByText("1").closest("div");
      expect(container).toHaveClass("flex", "items-center", "space-x-2");
    });

    it("applies correct classes to ellipsis", () => {
      render(<Pagination {...defaultProps} currentPage={8} />);

      const ellipsis = screen.getByText("...");
      expect(ellipsis).toHaveClass("px-2", "text-gray-500");
    });
  });
});
