import React from "react";
import { render, screen } from "@testing-library/react";
import { ContainerLayout } from "../../components/ContainerLayout";
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

describe("ContainerLayout", () => {
  it("renders children correctly", () => {
    render(
      <TestWrapper>
        <ContainerLayout>
          <div>Test Content</div>
        </ContainerLayout>
      </TestWrapper>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <TestWrapper>
        <ContainerLayout className="custom-class">
          <div>Test Content</div>
        </ContainerLayout>
      </TestWrapper>,
    );

    const container = screen.getByTestId("container-layout");
    expect(container).toHaveClass("custom-class");
  });

  it("applies custom styles", () => {
    const customStyle = { backgroundColor: "red" };
    render(
      <TestWrapper>
        <ContainerLayout style={customStyle}>
          <div>Test Content</div>
        </ContainerLayout>
      </TestWrapper>,
    );

    const container = screen.getByTestId("container-layout");
    expect(container).toHaveStyle(customStyle);
  });

  it("has correct default props", () => {
    render(
      <TestWrapper>
        <ContainerLayout>
          <div>Test Content</div>
        </ContainerLayout>
      </TestWrapper>,
    );

    const container = screen.getByTestId("container-layout");
    expect(container).toHaveAttribute("data-max-width", "lg");
    expect(container).toHaveAttribute("data-padded", "true");
    expect(container).toHaveAttribute("data-centered", "true");
    expect(container).toHaveAttribute("data-with-background", "false");
  });

  it("applies maxWidth prop correctly", () => {
    render(
      <TestWrapper>
        <ContainerLayout maxWidth="xl">
          <div>Test Content</div>
        </ContainerLayout>
      </TestWrapper>,
    );

    const container = screen.getByTestId("container-layout");
    expect(container).toHaveAttribute("data-max-width", "xl");
  });

  it("applies padded prop correctly", () => {
    render(
      <TestWrapper>
        <ContainerLayout padded={false}>
          <div>Test Content</div>
        </ContainerLayout>
      </TestWrapper>,
    );

    const container = screen.getByTestId("container-layout");
    expect(container).toHaveAttribute("data-padded", "false");
  });

  it("applies centered prop correctly", () => {
    render(
      <TestWrapper>
        <ContainerLayout centered={false}>
          <div>Test Content</div>
        </ContainerLayout>
      </TestWrapper>,
    );

    const container = screen.getByTestId("container-layout");
    expect(container).toHaveAttribute("data-centered", "false");
  });

  it("applies withBackground prop correctly", () => {
    render(
      <TestWrapper>
        <ContainerLayout withBackground>
          <div>Test Content</div>
        </ContainerLayout>
      </TestWrapper>,
    );

    const container = screen.getByTestId("container-layout");
    expect(container).toHaveAttribute("data-with-background", "true");
  });

  it("has correct default className", () => {
    render(
      <TestWrapper>
        <ContainerLayout>
          <div>Test Content</div>
        </ContainerLayout>
      </TestWrapper>,
    );

    const container = screen.getByTestId("container-layout");
    expect(container).toHaveClass("react-superadmin-container-layout");
  });
});
