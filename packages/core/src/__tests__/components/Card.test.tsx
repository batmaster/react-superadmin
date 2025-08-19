import React from "react";
import { render, screen } from "@testing-library/react";
import { Card } from "../../components/Card";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";

// Mock the SuperAdminContext
const mockConfig = {
  title: "Test Admin",
  resources: {},
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#6b7280",
    darkMode: false,
  },
  layout: {
    sidebar: true,
    header: true,
    footer: true,
    sidebarWidth: 250,
  },
  auth: {
    enabled: true,
    loginUrl: "/login",
    logoutUrl: "/logout",
  },
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SuperAdminProvider config={mockConfig}>{children}</SuperAdminProvider>
);

describe("Card", () => {
  it("renders children correctly", () => {
    render(
      <TestWrapper>
        <Card>
          <div>Test Content</div>
        </Card>
      </TestWrapper>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <TestWrapper>
        <Card className="custom-class">
          <div>Test Content</div>
        </Card>
      </TestWrapper>,
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveClass("custom-class");
  });

  it("applies custom styles", () => {
    const customStyle = { backgroundColor: "red" };
    render(
      <TestWrapper>
        <Card style={customStyle}>
          <div>Test Content</div>
        </Card>
      </TestWrapper>,
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveStyle(customStyle);
  });

  it("renders header correctly", () => {
    const header = <h3>Card Header</h3>;
    render(
      <TestWrapper>
        <Card header={header}>
          <div>Test Content</div>
        </Card>
      </TestWrapper>,
    );

    expect(screen.getByText("Card Header")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Card Header",
    );
  });

  it("renders footer correctly", () => {
    const footer = <button>Card Footer</button>;
    render(
      <TestWrapper>
        <Card footer={footer}>
          <div>Test Content</div>
        </Card>
      </TestWrapper>,
    );

    expect(screen.getByText("Card Footer")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Card Footer");
  });

  it("has correct default props", () => {
    render(
      <TestWrapper>
        <Card>
          <div>Test Content</div>
        </Card>
      </TestWrapper>,
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("data-elevated", "true");
    expect(card).toHaveAttribute("data-interactive", "false");
    expect(card).toHaveAttribute("data-selected", "false");
    expect(card).toHaveAttribute("data-disabled", "false");
    expect(card).toHaveAttribute("data-padded", "true");
    expect(card).toHaveAttribute("data-bordered", "true");
  });

  it("applies elevated prop correctly", () => {
    render(
      <TestWrapper>
        <Card elevated={false}>
          <div>Test Content</div>
        </Card>
      </TestWrapper>,
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("data-elevated", "false");
  });

  it("applies interactive prop correctly", () => {
    render(
      <TestWrapper>
        <Card interactive>
          <div>Test Content</div>
        </Card>
      </TestWrapper>,
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("data-interactive", "true");
  });

  it("applies selected prop correctly", () => {
    render(
      <TestWrapper>
        <Card selected>
          <div>Test Content</div>
        </Card>
      </TestWrapper>,
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("data-selected", "true");
  });

  it("applies disabled prop correctly", () => {
    render(
      <TestWrapper>
        <Card disabled>
          <div>Test Content</div>
        </Card>
      </TestWrapper>,
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("data-disabled", "true");
  });

  it("applies padded prop correctly", () => {
    render(
      <TestWrapper>
        <Card padded={false}>
          <div>Test Content</div>
        </Card>
      </TestWrapper>,
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("data-padded", "false");
  });

  it("applies bordered prop correctly", () => {
    render(
      <TestWrapper>
        <Card bordered={false}>
          <div>Test Content</div>
        </Card>
      </TestWrapper>,
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("data-bordered", "false");
  });

  it("has correct default className", () => {
    render(
      <TestWrapper>
        <Card>
          <div>Test Content</div>
        </Card>
      </TestWrapper>,
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveClass("react-superadmin-card");
  });

  it("applies interactive styles when interactive is true", () => {
    render(
      <TestWrapper>
        <Card interactive>
          <div>Test Content</div>
        </Card>
      </TestWrapper>,
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveClass(
      "cursor-pointer",
      "transition-all",
      "duration-200",
    );
  });

  it("applies selected styles when selected is true", () => {
    render(
      <TestWrapper>
        <Card selected>
          <div>Test Content</div>
        </Card>
      </TestWrapper>,
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveClass("ring-2", "ring-blue-500");
  });

  it("applies disabled styles when disabled is true", () => {
    render(
      <TestWrapper>
        <Card disabled>
          <div>Test Content</div>
        </Card>
      </TestWrapper>,
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveClass("opacity-50", "cursor-not-allowed");
  });
});
