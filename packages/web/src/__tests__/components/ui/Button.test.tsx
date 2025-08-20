import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../../../components/ui/Button";

describe("Button", () => {
  const defaultProps = {
    children: "Click me",
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with default variant", () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
    expect(button).toHaveClass("bg-primary-600");
  });

  it("should render with different variants", () => {
    render(<Button {...defaultProps} variant="outline" />);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("border", "border-gray-300", "bg-white");
  });

  it("should render with different sizes", () => {
    render(<Button {...defaultProps} size="sm" />);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("px-3", "py-1.5", "text-sm");
  });

  it("should handle click events", () => {
    const onClick = jest.fn();
    render(<Button {...defaultProps} onClick={onClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should show loading state", () => {
    render(<Button loading>Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("should be disabled when loading", () => {
    render(<Button loading>Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should render with primary variant", () => {
    render(<Button variant="primary">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary-600", "hover:bg-primary-700");
  });

  it("should render with secondary variant", () => {
    render(<Button variant="secondary">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-600", "hover:bg-gray-700");
  });

  it("should render with outline variant", () => {
    render(<Button variant="outline">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("border", "bg-white", "text-gray-700");
  });

  it("should render with ghost variant", () => {
    render(<Button variant="ghost">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-gray-700", "hover:bg-gray-100");
  });

  it("should render with danger variant", () => {
    render(<Button variant="danger">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-red-600", "hover:bg-red-700");
  });
});
