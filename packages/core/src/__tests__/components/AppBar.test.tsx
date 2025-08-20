import { render, screen } from "@testing-library/react";
import React from "react";
import { AppBar } from "../../components/AppBar";

describe("AppBar Component", () => {
  const mockTitle = "Test App";
  const mockLogo = <img src="/logo.png" alt="Logo" data-testid="mock-logo" />;
  const mockLeftActions = <button data-testid="mock-left-actions">Menu</button>;
  const mockRightActions = (
    <button data-testid="mock-right-actions">User</button>
  );

  it("renders without crashing", () => {
    render(<AppBar title={mockTitle} />);

    expect(screen.getByText("Test App")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(<AppBar title={mockTitle} />);

    expect(screen.getByText("Test App")).toBeInTheDocument();
    expect(screen.getByText("Test App").tagName).toBe("H1");
  });

  it("renders logo when provided", () => {
    render(<AppBar logo={mockLogo} />);

    expect(screen.getByTestId("mock-logo")).toBeInTheDocument();
  });

  it("renders left actions when provided", () => {
    render(<AppBar leftActions={mockLeftActions} />);

    expect(screen.getByTestId("mock-left-actions")).toBeInTheDocument();
  });

  it("renders right actions when provided", () => {
    render(<AppBar rightActions={mockRightActions} />);

    expect(screen.getByTestId("mock-right-actions")).toBeInTheDocument();
  });

  it("applies custom className to app bar container", () => {
    render(<AppBar title={mockTitle} className="custom-appbar" />);

    const appBarElement = screen.getByText("Test App").closest(".rs-appbar");
    expect(appBarElement).toHaveClass("custom-appbar");
  });

  it("applies custom className to left section", () => {
    render(
      <AppBar leftActions={mockLeftActions} leftClassName="custom-left" />,
    );

    const leftElement = screen
      .getByTestId("mock-left-actions")
      .closest(".rs-appbar__left");
    expect(leftElement).toHaveClass("custom-left");
  });

  it("applies custom className to center section", () => {
    render(<AppBar title={mockTitle} centerClassName="custom-center" />);

    const centerElement = screen
      .getByText("Test App")
      .closest(".rs-appbar__center");
    expect(centerElement).toHaveClass("custom-center");
  });

  it("applies custom className to right section", () => {
    render(
      <AppBar rightActions={mockRightActions} rightClassName="custom-right" />,
    );

    const rightElement = screen
      .getByTestId("mock-right-actions")
      .closest(".rs-appbar__right");
    expect(rightElement).toHaveClass("custom-right");
  });

  it("applies elevated class when elevated is true", () => {
    render(<AppBar title={mockTitle} elevated={true} />);

    const appBarElement = screen.getByText("Test App").closest(".rs-appbar");
    expect(appBarElement).toHaveClass("rs-appbar--elevated");
  });

  it("does not apply elevated class when elevated is false", () => {
    render(<AppBar title={mockTitle} elevated={false} />);

    const appBarElement = screen.getByText("Test App").closest(".rs-appbar");
    expect(appBarElement).not.toHaveClass("rs-appbar--elevated");
  });

  it("applies transparent class when transparent is true", () => {
    render(<AppBar title={mockTitle} transparent={true} />);

    const appBarElement = screen.getByText("Test App").closest(".rs-appbar");
    expect(appBarElement).toHaveClass("rs-appbar--transparent");
  });

  it("applies variant class correctly", () => {
    render(<AppBar title={mockTitle} variant="primary" />);

    const appBarElement = screen.getByText("Test App").closest(".rs-appbar");
    expect(appBarElement).toHaveClass("rs-appbar--primary");
  });

  it("applies fixed class when fixed is true", () => {
    render(<AppBar title={mockTitle} fixed={true} />);

    const appBarElement = screen.getByText("Test App").closest(".rs-appbar");
    expect(appBarElement).toHaveClass("rs-appbar--fixed");
  });

  it("applies sticky class when sticky is true", () => {
    render(<AppBar title={mockTitle} sticky={true} />);

    const appBarElement = screen.getByText("Test App").closest(".rs-appbar");
    expect(appBarElement).toHaveClass("rs-appbar--sticky");
  });

  it("does not render when show is false", () => {
    render(<AppBar title={mockTitle} show={false} />);

    expect(screen.queryByText("Test App")).not.toBeInTheDocument();
  });

  it("renders all sections when all props are provided", () => {
    render(
      <AppBar
        title={mockTitle}
        logo={mockLogo}
        leftActions={mockLeftActions}
        rightActions={mockRightActions}
      />,
    );

    expect(screen.getByText("Test App")).toBeInTheDocument();
    expect(screen.getByTestId("mock-logo")).toBeInTheDocument();
    expect(screen.getByTestId("mock-left-actions")).toBeInTheDocument();
    expect(screen.getByTestId("mock-right-actions")).toBeInTheDocument();
  });

  it("renders only title when no other props are provided", () => {
    render(<AppBar title={mockTitle} />);

    expect(screen.getByText("Test App")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-logo")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-left-actions")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-right-actions")).not.toBeInTheDocument();
  });

  it("has correct CSS class structure", () => {
    render(
      <AppBar
        title={mockTitle}
        leftActions={mockLeftActions}
        rightActions={mockRightActions}
      />,
    );

    expect(
      screen.getByText("Test App").closest(".rs-appbar"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-left-actions").closest(".rs-appbar__left"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Test App").closest(".rs-appbar__center"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-right-actions").closest(".rs-appbar__right"),
    ).toBeInTheDocument();
  });

  it("renders logo and title in center section", () => {
    render(<AppBar title={mockTitle} logo={mockLogo} />);

    const centerElement = screen
      .getByText("Test App")
      .closest(".rs-appbar__center");
    expect(centerElement).toContainElement(screen.getByTestId("mock-logo"));
    expect(centerElement).toContainElement(screen.getByText("Test App"));
  });

  it("applies multiple variant classes correctly", () => {
    render(
      <AppBar
        title={mockTitle}
        variant="dark"
        elevated={true}
        transparent={false}
        fixed={true}
      />,
    );

    const appBarElement = screen.getByText("Test App").closest(".rs-appbar");
    expect(appBarElement).toHaveClass("rs-appbar--dark");
    expect(appBarElement).toHaveClass("rs-appbar--elevated");
    expect(appBarElement).toHaveClass("rs-appbar--fixed");
    expect(appBarElement).not.toHaveClass("rs-appbar--transparent");
  });
});
