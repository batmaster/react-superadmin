import React from "react";
import { render, screen } from "@testing-library/react";
import { Card } from "../../../components/ui/Card";

describe("Card Component", () => {
  const defaultProps = {
    children: "Card Content",
  };

  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<Card {...defaultProps} />);

      expect(screen.getByText("Card Content")).toBeInTheDocument();
    });

    it("renders with custom children", () => {
      render(<Card>Custom Card Content</Card>);

      expect(screen.getByText("Custom Card Content")).toBeInTheDocument();
    });

    it("renders with complex children", () => {
      const complexContent = (
        <div>
          <h2>Card Title</h2>
          <p>Card description</p>
          <button>Action Button</button>
        </div>
      );

      render(<Card>{complexContent}</Card>);

      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByText("Card description")).toBeInTheDocument();
      expect(screen.getByText("Action Button")).toBeInTheDocument();
    });
  });

  describe("Default Styling", () => {
    it("applies default card styling classes", () => {
      render(<Card {...defaultProps} />);

      const card = screen.getByText("Card Content").closest("div");
      expect(card).toHaveClass(
        "bg-white",
        "rounded-lg",
        "border",
        "border-gray-200",
        "shadow-sm",
      );
    });

    it("renders as a div element", () => {
      render(<Card {...defaultProps} />);

      const card = screen.getByText("Card Content").closest("div");
      expect(card?.tagName).toBe("DIV");
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className when provided", () => {
      render(<Card {...defaultProps} className="custom-class" />);

      const card = screen.getByText("Card Content").closest("div");
      expect(card).toHaveClass("custom-class");
    });

    it("merges custom className with default classes", () => {
      render(<Card {...defaultProps} className="custom-class" />);

      const card = screen.getByText("Card Content").closest("div");
      expect(card).toHaveClass(
        "bg-white",
        "rounded-lg",
        "border",
        "border-gray-200",
        "shadow-sm",
        "custom-class",
      );
    });

    it("allows custom className to override default styles", () => {
      render(
        <Card {...defaultProps} className="bg-blue-500 border-blue-300" />,
      );

      const card = screen.getByText("Card Content").closest("div");
      expect(card).toHaveClass("bg-blue-500", "border-blue-300");
    });
  });

  describe("HTML Attributes", () => {
    it("passes through HTML attributes", () => {
      render(
        <Card
          {...defaultProps}
          id="test-card"
          data-testid="card-element"
          aria-label="Test Card"
        />,
      );

      const card = screen.getByText("Card Content").closest("div");
      expect(card).toHaveAttribute("id", "test-card");
      expect(card).toHaveAttribute("data-testid", "card-element");
      expect(card).toHaveAttribute("aria-label", "Test Card");
    });

    it("passes through event handlers", () => {
      const handleClick = jest.fn();
      const handleMouseEnter = jest.fn();

      render(
        <Card
          {...defaultProps}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
        />,
      );

      const card = screen.getByText("Card Content").closest("div");
      expect(card).toHaveAttribute("onclick");
      expect(card).toHaveAttribute("onmouseenter");
    });

    it("passes through style attribute", () => {
      const customStyle = { backgroundColor: "red", padding: "20px" };

      render(<Card {...defaultProps} style={customStyle} />);

      const card = screen.getByText("Card Content").closest("div");
      expect(card).toHaveStyle("background-color: red");
      expect(card).toHaveStyle("padding: 20px");
    });
  });

  describe("Accessibility", () => {
    it("maintains proper semantic structure", () => {
      render(<Card {...defaultProps} />);

      const card = screen.getByText("Card Content").closest("div");
      expect(card).toBeInTheDocument();
    });

    it("supports ARIA attributes", () => {
      render(
        <Card
          {...defaultProps}
          role="article"
          aria-describedby="card-description"
        />,
      );

      const card = screen.getByText("Card Content").closest("div");
      expect(card).toHaveAttribute("role", "article");
      expect(card).toHaveAttribute("aria-describedby", "card-description");
    });
  });

  describe("Content Rendering", () => {
    it("renders text content correctly", () => {
      render(<Card>Simple text content</Card>);

      expect(screen.getByText("Simple text content")).toBeInTheDocument();
    });

    it("renders multiple children correctly", () => {
      render(
        <Card>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </Card>,
      );

      expect(screen.getByText("Child 1")).toBeInTheDocument();
      expect(screen.getByText("Child 2")).toBeInTheDocument();
      expect(screen.getByText("Child 3")).toBeInTheDocument();
    });

    it("renders nested components correctly", () => {
      const NestedComponent = () => <span>Nested Component</span>;

      render(
        <Card>
          <NestedComponent />
        </Card>,
      );

      expect(screen.getByText("Nested Component")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty children gracefully", () => {
      render(<Card></Card>);

      const card = screen.getByRole("generic");
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass(
        "bg-white",
        "rounded-lg",
        "border",
        "border-gray-200",
        "shadow-sm",
      );
    });

    it("handles null children gracefully", () => {
      render(<Card>{null}</Card>);

      const card = screen.getByRole("generic");
      expect(card).toBeInTheDocument();
    });

    it("handles undefined children gracefully", () => {
      render(<Card>{undefined}</Card>);

      const card = screen.getByRole("generic");
      expect(card).toBeInTheDocument();
    });

    it("handles boolean children gracefully", () => {
      render(<Card>{true}</Card>);

      const card = screen.getByRole("generic");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Integration with Other Components", () => {
    it("works well with form components", () => {
      render(
        <Card>
          <form>
            <input type="text" placeholder="Enter text" />
            <button type="submit">Submit</button>
          </form>
        </Card>,
      );

      expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
      expect(screen.getByText("Submit")).toBeInTheDocument();
    });

    it("works well with list components", () => {
      render(
        <Card>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </Card>,
      );

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });
  });

  describe("Performance and Optimization", () => {
    it("renders efficiently with large content", () => {
      const largeContent = Array.from({ length: 100 }, (_, i) => (
        <div key={i}>Content item {i + 1}</div>
      ));

      render(<Card>{largeContent}</Card>);

      expect(screen.getByText("Content item 1")).toBeInTheDocument();
      expect(screen.getByText("Content item 100")).toBeInTheDocument();
    });

    it("handles dynamic content updates", () => {
      const { rerender } = render(<Card>Initial content</Card>);

      expect(screen.getByText("Initial content")).toBeInTheDocument();

      rerender(<Card>Updated content</Card>);

      expect(screen.getByText("Updated content")).toBeInTheDocument();
      expect(screen.queryByText("Initial content")).not.toBeInTheDocument();
    });
  });
});
