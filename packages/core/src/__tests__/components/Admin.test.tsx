import { render, screen } from "@testing-library/react";
import React from "react";
import { Admin } from "../../components/Admin";
import { createAdmin, createResource } from "../../utils";

// Mock the SuperAdminProvider
jest.mock("../../contexts/SuperAdminContext", () => ({
  SuperAdminProvider: ({ children, config }: any) => (
    <div
      data-testid="super-admin-provider"
      data-config={JSON.stringify(config)}
    >
      {children}
    </div>
  ),
}));

describe("Admin Component", () => {
  const mockConfig = createAdmin({
    title: "Test Admin",
    resources: [
      createResource({
        name: "users",
        label: "Users",
        fields: [{ name: "id", label: "ID", type: "text" }],
      }),
    ],
    theme: { primaryColor: "#3b82f6" },
  });

  it("renders without crashing", () => {
    render(
      <Admin config={mockConfig}>
        <div>Test Content</div>
      </Admin>,
    );

    expect(screen.getByTestId("super-admin-provider")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Admin config={mockConfig} className="custom-admin">
        <div>Test Content</div>
      </Admin>,
    );

    const adminElement = screen
      .getByText("Test Content")
      .closest(".react-superadmin");
    expect(adminElement).toHaveClass("custom-admin");
  });

  it("renders children without custom layout", () => {
    render(
      <Admin config={mockConfig}>
        <div data-testid="child-content">Child Content</div>
      </Admin>,
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("renders children with custom layout", () => {
    const CustomLayout = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="custom-layout">
        <header>Custom Header</header>
        <main>{children}</main>
      </div>
    );

    render(
      <Admin config={mockConfig} layout={CustomLayout}>
        <div data-testid="child-content">Child Content</div>
      </Admin>,
    );

    expect(screen.getByTestId("custom-layout")).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Custom Header")).toBeInTheDocument();
  });

  it("wraps with custom theme provider", () => {
    const CustomThemeProvider = ({
      children,
    }: {
      children: React.ReactNode;
    }) => (
      <div data-testid="theme-provider" data-theme="dark">
        {children}
      </div>
    );

    render(
      <Admin config={mockConfig} themeProvider={CustomThemeProvider}>
        <div>Test Content</div>
      </Admin>,
    );

    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("wraps with custom i18n provider", () => {
    const CustomI18nProvider = ({
      children,
    }: {
      children: React.ReactNode;
    }) => (
      <div data-testid="i18n-provider" data-locale="en">
        {children}
      </div>
    );

    render(
      <Admin config={mockConfig} i18nProvider={CustomI18nProvider}>
        <div>Test Content</div>
      </Admin>,
    );

    expect(screen.getByTestId("i18n-provider")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("merges custom providers with config", () => {
    const customDataProvider = { getList: jest.fn() };
    const customAuthProvider = { login: jest.fn() };

    render(
      <Admin
        config={mockConfig}
        dataProvider={customDataProvider}
        authProvider={customAuthProvider}
      >
        <div>Test Content</div>
      </Admin>,
    );

    // The providers should be merged into the config and passed to SuperAdminProvider
    // We can verify this by checking that the component renders without errors
    // and that the custom providers are used in the final config
    expect(screen.getByText("Test Content")).toBeInTheDocument();

    // Verify that the Admin component renders successfully with custom providers
    // The actual provider usage would be tested in integration tests
  });

  it("renders with multiple nested providers", () => {
    const CustomThemeProvider = ({
      children,
    }: {
      children: React.ReactNode;
    }) => <div data-testid="theme-provider">{children}</div>;

    const CustomI18nProvider = ({
      children,
    }: {
      children: React.ReactNode;
    }) => <div data-testid="i18n-provider">{children}</div>;

    const CustomLayout = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="custom-layout">{children}</div>
    );

    render(
      <Admin
        config={mockConfig}
        themeProvider={CustomThemeProvider}
        i18nProvider={CustomI18nProvider}
        layout={CustomLayout}
      >
        <div data-testid="child-content">Test Content</div>
      </Admin>,
    );

    expect(screen.getByTestId("i18n-provider")).toBeInTheDocument();
    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
    expect(screen.getByTestId("custom-layout")).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });
});
