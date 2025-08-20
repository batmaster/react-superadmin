import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Alert } from "../../../components/ui/Alert";

describe("Alert Component", () => {
  const defaultProps = {
    children: "This is an alert message",
  };

  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<Alert {...defaultProps} />);

      expect(screen.getByText("This is an alert message")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("renders with title when provided", () => {
      render(<Alert {...defaultProps} title="Alert Title" />);

      expect(screen.getByText("Alert Title")).toBeInTheDocument();
      expect(screen.getByText("This is an alert message")).toBeInTheDocument();
    });

    it("renders without title when not provided", () => {
      render(<Alert {...defaultProps} />);

      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });

  describe("Alert Types", () => {
    it("renders success alert with correct styling", () => {
      render(<Alert {...defaultProps} type="success" />);

      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass(
        "bg-green-50",
        "border-green-200",
        "text-green-800",
      );
    });

    it("renders warning alert with correct styling", () => {
      render(<Alert {...defaultProps} type="warning" />);

      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass(
        "bg-yellow-50",
        "border-yellow-200",
        "text-yellow-800",
      );
    });

    it("renders error alert with correct styling", () => {
      render(<Alert {...defaultProps} type="error" />);

      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("bg-red-50", "border-red-200", "text-red-800");
    });

    it("renders info alert with correct styling (default)", () => {
      render(<Alert {...defaultProps} type="info" />);

      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass(
        "bg-blue-50",
        "border-blue-200",
        "text-blue-800",
      );
    });

    it("defaults to info type when no type is specified", () => {
      render(<Alert {...defaultProps} />);

      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass(
        "bg-blue-50",
        "border-blue-200",
        "text-blue-800",
      );
    });
  });

  describe("Close Button", () => {
    it("shows close button when onClose is provided", () => {
      const onClose = jest.fn();
      render(<Alert {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByRole("button", { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    it("does not show close button when onClose is not provided", () => {
      render(<Alert {...defaultProps} />);

      const closeButton = screen.queryByRole("button", { name: /close/i });
      expect(closeButton).not.toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", () => {
      const onClose = jest.fn();
      render(<Alert {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByRole("button", { name: /close/i });
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("applies correct focus ring color for each alert type", () => {
      const onClose = jest.fn();

      const { rerender } = render(
        <Alert {...defaultProps} type="success" onClose={onClose} />,
      );
      let closeButton = screen.getByRole("button", { name: /close/i });
      expect(closeButton).toHaveClass("focus:ring-green-500");

      rerender(<Alert {...defaultProps} type="warning" onClose={onClose} />);
      closeButton = screen.getByRole("button", { name: /close/i });
      expect(closeButton).toHaveClass("focus:ring-yellow-500");

      rerender(<Alert {...defaultProps} type="error" onClose={onClose} />);
      closeButton = screen.getByRole("button", { name: /close/i });
      expect(closeButton).toHaveClass("focus:ring-red-500");

      rerender(<Alert {...defaultProps} type="info" onClose={onClose} />);
      closeButton = screen.getByRole("button", { name: /close/i });
      expect(closeButton).toHaveClass("focus:ring-blue-500");
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className when provided", () => {
      render(<Alert {...defaultProps} className="custom-class" />);

      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("custom-class");
    });

    it("merges custom className with default classes", () => {
      render(<Alert {...defaultProps} className="custom-class" />);

      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("border", "rounded-md", "p-4", "custom-class");
    });
  });

  describe("Accessibility", () => {
    it("has correct ARIA role", () => {
      render(<Alert {...defaultProps} />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("close button has accessible name", () => {
      const onClose = jest.fn();
      render(<Alert {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByRole("button", { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    it("maintains proper heading structure when title is present", () => {
      render(<Alert {...defaultProps} title="Alert Title" />);

      const title = screen.getByText("Alert Title");
      expect(title.tagName).toBe("H3");
    });
  });

  describe("Content Rendering", () => {
    it("renders complex children content", () => {
      const complexContent = (
        <div>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      );

      render(<Alert>{complexContent}</Alert>);

      expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
      expect(screen.getByText("Paragraph 2")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });

    it("renders text content correctly", () => {
      render(<Alert>Simple text message</Alert>);

      expect(screen.getByText("Simple text message")).toBeInTheDocument();
    });
  });
});
