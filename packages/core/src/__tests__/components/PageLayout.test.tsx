import React from "react";
import { render, screen } from "@testing-library/react";
import { PageLayout } from "../../components/PageLayout";
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

describe("PageLayout", () => {
  it("renders children correctly", () => {
    render(
      <TestWrapper>
        <PageLayout>
          <div>Test Content</div>
        </PageLayout>
      </TestWrapper>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <TestWrapper>
        <PageLayout className="custom-class">
          <div>Test Content</div>
        </PageLayout>
      </TestWrapper>,
    );

    const pageLayout = screen.getByTestId("page-layout");
    expect(pageLayout).toHaveClass("custom-class");
  });

  it("applies custom styles", () => {
    const customStyle = { backgroundColor: "red" };
    render(
      <TestWrapper>
        <PageLayout style={customStyle}>
          <div>Test Content</div>
        </PageLayout>
      </TestWrapper>,
    );

    const pageLayout = screen.getByTestId("page-layout");
    expect(pageLayout).toHaveStyle(customStyle);
  });

  it("renders title correctly", () => {
    render(
      <TestWrapper>
        <PageLayout title="Test Page">
          <div>Test Content</div>
        </PageLayout>
      </TestWrapper>,
    );

    expect(screen.getByText("Test Page")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Page",
    );
  });

  it("renders subtitle correctly", () => {
    render(
      <TestWrapper>
        <PageLayout title="Test Page" subtitle="Test Description">
          <div>Test Content</div>
        </PageLayout>
      </TestWrapper>,
    );

    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("renders actions correctly", () => {
    const actions = <button>Action Button</button>;
    render(
      <TestWrapper>
        <PageLayout title="Test Page" actions={actions}>
          <div>Test Content</div>
        </PageLayout>
      </TestWrapper>,
    );

    expect(screen.getByText("Action Button")).toBeInTheDocument();
  });

  it("renders breadcrumbs correctly", () => {
    const breadcrumbs = [
      { label: "Home", href: "/" },
      { label: "Users", href: "/users" },
      { label: "Current Page" },
    ];

    render(
      <TestWrapper>
        <PageLayout title="Test Page" showBreadcrumbs breadcrumbs={breadcrumbs}>
          <div>Test Content</div>
        </PageLayout>
      </TestWrapper>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Current Page")).toBeInTheDocument();
    expect(screen.getByLabelText("Breadcrumb")).toBeInTheDocument();
  });

  it("has correct default props", () => {
    render(
      <TestWrapper>
        <PageLayout>
          <div>Test Content</div>
        </PageLayout>
      </TestWrapper>,
    );

    const pageLayout = screen.getByTestId("page-layout");
    expect(pageLayout).toHaveAttribute("data-show-header", "true");
    expect(pageLayout).toHaveAttribute("data-show-breadcrumbs", "false");
    expect(pageLayout).toHaveAttribute("data-with-background", "true");
    expect(pageLayout).toHaveAttribute("data-padded", "true");
  });

  it("hides header when showHeader is false", () => {
    render(
      <TestWrapper>
        <PageLayout title="Test Page" showHeader={false}>
          <div>Test Content</div>
        </PageLayout>
      </TestWrapper>,
    );

    expect(screen.queryByText("Test Page")).not.toBeInTheDocument();
  });

  it("hides breadcrumbs when showBreadcrumbs is false", () => {
    const breadcrumbs = [{ label: "Home", href: "/" }];
    render(
      <TestWrapper>
        <PageLayout
          title="Test Page"
          showBreadcrumbs={false}
          breadcrumbs={breadcrumbs}
        >
          <div>Test Content</div>
        </PageLayout>
      </TestWrapper>,
    );

    expect(screen.queryByLabelText("Breadcrumb")).not.toBeInTheDocument();
  });

  it("applies withBackground prop correctly", () => {
    render(
      <TestWrapper>
        <PageLayout withBackground={false}>
          <div>Test Content</div>
        </PageLayout>
      </TestWrapper>,
    );

    const pageLayout = screen.getByTestId("page-layout");
    expect(pageLayout).toHaveAttribute("data-with-background", "false");
  });

  it("applies padded prop correctly", () => {
    render(
      <TestWrapper>
        <PageLayout padded={false}>
          <div>Test Content</div>
        </PageLayout>
      </TestWrapper>,
    );

    const pageLayout = screen.getByTestId("page-layout");
    expect(pageLayout).toHaveAttribute("data-padded", "false");
  });

  it("has correct default className", () => {
    render(
      <TestWrapper>
        <PageLayout>
          <div>Test Content</div>
        </PageLayout>
      </TestWrapper>,
    );

    const pageLayout = screen.getByTestId("page-layout");
    expect(pageLayout).toHaveClass("react-superadmin-page-layout");
  });
});
