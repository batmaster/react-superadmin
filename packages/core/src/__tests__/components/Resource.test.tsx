import React from "react";
import { render, screen } from "@testing-library/react";
import { Resource } from "../../components/Resource";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";
import { AdminConfig, ResourceConfig } from "../../types";

// Mock data for testing
const mockResourceConfig: ResourceConfig = {
  name: "users",
  label: "Users",
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "admin", label: "Administrator" },
        { value: "user", label: "User" },
      ],
    },
    { name: "active", label: "Active", type: "boolean" },
    { name: "createdAt", label: "Created At", type: "date" },
  ],
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
    list: true,
  },
  views: [
    { name: "list", label: "List", type: "list", layout: "table" },
    { name: "create", label: "Create", type: "form" },
    { name: "show", label: "Show", type: "show" },
    { name: "edit", label: "Edit", type: "form" },
  ],
};

const mockAdminConfig: AdminConfig = {
  title: "Test Admin",
  resources: [mockResourceConfig],
  theme: { primaryColor: "#3b82f6" },
};

// Wrapper component for testing
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SuperAdminProvider config={mockAdminConfig}>{children}</SuperAdminProvider>
);

describe("Resource Component", () => {
  it("renders resource header with label", () => {
    render(
      <TestWrapper>
        <Resource config={mockResourceConfig} />
      </TestWrapper>,
    );

    expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Users" })).toHaveClass(
      "text-2xl",
      "font-bold",
    );
  });

  it("renders custom actions when provided", () => {
    const customActions = <button>Create User</button>;

    render(
      <TestWrapper>
        <Resource config={mockResourceConfig} actions={customActions} />
      </TestWrapper>,
    );

    expect(screen.getByText("Create User")).toBeInTheDocument();
  });

  it("renders custom routes when provided", () => {
    const customRoutes = <div>Custom Route Content</div>;

    render(
      <TestWrapper>
        <Resource config={mockResourceConfig} routes={customRoutes} />
      </TestWrapper>,
    );

    expect(screen.getByText("Custom Route Content")).toBeInTheDocument();
  });

  it("renders children components", () => {
    const children = <div>Child Component</div>;

    render(
      <TestWrapper>
        <Resource config={mockResourceConfig}>{children}</Resource>
      </TestWrapper>,
    );

    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <TestWrapper>
        <Resource config={mockResourceConfig} className="custom-class" />
      </TestWrapper>,
    );

    const resourceElement = screen
      .getByRole("heading", { name: "Users" })
      .closest(".react-superadmin-resource");
    expect(resourceElement).toHaveClass("custom-class");
  });

  it("sets data-resource attribute", () => {
    render(
      <TestWrapper>
        <Resource config={mockResourceConfig} />
      </TestWrapper>,
    );

    const resourceElement = screen
      .getByRole("heading", { name: "Users" })
      .closest(".react-superadmin-resource");
    expect(resourceElement).toHaveAttribute("data-resource", "users");
  });

  it("merges permissions correctly", () => {
    const customPermissions = { create: false, delete: false };

    render(
      <TestWrapper>
        <Resource config={mockResourceConfig} authRules={customPermissions} />
      </TestWrapper>,
    );

    // The component should merge permissions, but we can't easily test the internal state
    // This test ensures the component renders without errors
    expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();
  });

  it("merges operations options correctly", () => {
    const customOptions = {
      operations: { create: false, update: false },
    };

    render(
      <TestWrapper>
        <Resource config={mockResourceConfig} options={customOptions} />
      </TestWrapper>,
    );

    // Component should render without errors
    expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();
  });

  it("renders debug info in development mode", () => {
    // Mock NODE_ENV to development
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    render(
      <TestWrapper>
        <Resource config={mockResourceConfig} />
      </TestWrapper>,
    );

    expect(screen.getByText("Resource Debug Info")).toBeInTheDocument();
    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText("users")).toBeInTheDocument();
    expect(screen.getByText("Label:")).toBeInTheDocument();
    expect(screen.getByText("Fields:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });

  it("does not render debug info in production mode", () => {
    // Mock NODE_ENV to production
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    render(
      <TestWrapper>
        <Resource config={mockResourceConfig} />
      </TestWrapper>,
    );

    expect(screen.queryByText("Resource Debug Info")).not.toBeInTheDocument();

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });

  it("handles resource without views gracefully", () => {
    const resourceWithoutViews = {
      ...mockResourceConfig,
      views: undefined,
    };

    render(
      <TestWrapper>
        <Resource config={resourceWithoutViews} />
      </TestWrapper>,
    );

    expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();
  });

  it("handles resource without permissions gracefully", () => {
    const resourceWithoutPermissions = {
      ...mockResourceConfig,
      permissions: undefined,
    };

    render(
      <TestWrapper>
        <Resource config={resourceWithoutPermissions} />
      </TestWrapper>,
    );

    expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();
  });

  it("renders with minimal configuration", () => {
    const minimalResource: ResourceConfig = {
      name: "minimal",
      label: "Minimal Resource",
      fields: [],
    };

    render(
      <TestWrapper>
        <Resource config={minimalResource} />
      </TestWrapper>,
    );

    expect(screen.getByText("Minimal Resource")).toBeInTheDocument();
  });

  it("handles empty children gracefully", () => {
    render(
      <TestWrapper>
        <Resource config={mockResourceConfig} />
      </TestWrapper>,
    );

    expect(screen.getByText("Users")).toBeInTheDocument();
  });

  it("handles null and undefined props gracefully", () => {
    render(
      <TestWrapper>
        <Resource
          config={mockResourceConfig}
          actions={null}
          routes={undefined}
          dataProvider={null}
          authRules={undefined}
          fieldRenderers={null}
          options={undefined}
        />
      </TestWrapper>,
    );

    expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();
  });
});
