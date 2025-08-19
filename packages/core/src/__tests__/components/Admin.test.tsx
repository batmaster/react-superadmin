import React from "react";
import { render, screen } from "@testing-library/react";
import { Admin } from "../../components/Admin";
import { AdminConfig } from "../../types";

// Mock the SuperAdminProvider to avoid context issues in tests
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
  const mockConfig: AdminConfig = {
    title: "Test Admin",
    resources: [
      {
        name: "users",
        label: "Users",
        fields: [
          {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
          },
        ],
      },
    ],
  };

  it("renders without crashing", () => {
    render(
      <Admin config={mockConfig}>
        <div>Test Content</div>
      </Admin>,
    );

    expect(screen.getByTestId("admin-container")).toBeInTheDocument();
    expect(screen.getByTestId("super-admin-provider")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Admin config={mockConfig} className="custom-class">
        <div>Test Content</div>
      </Admin>,
    );

    const adminContainer = screen.getByTestId("admin-container");
    expect(adminContainer).toHaveClass("react-superadmin", "custom-class");
  });

  it("applies custom styles", () => {
    const customStyle = { backgroundColor: "red" };
    render(
      <Admin config={mockConfig} style={customStyle}>
        <div>Test Content</div>
      </Admin>,
    );

    const adminContainer = screen.getByTestId("admin-container");
    expect(adminContainer).toHaveStyle("background-color: red");
  });

  it("passes config to SuperAdminProvider", () => {
    render(
      <Admin config={mockConfig}>
        <div>Test Content</div>
      </Admin>,
    );

    const provider = screen.getByTestId("super-admin-provider");
    const configData = provider.getAttribute("data-config");
    expect(configData).toBe(JSON.stringify(mockConfig));
  });

  it("renders children correctly", () => {
    render(
      <Admin config={mockConfig}>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </Admin>,
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  it("has correct default className", () => {
    render(
      <Admin config={mockConfig}>
        <div>Test Content</div>
      </Admin>,
    );

    const adminContainer = screen.getByTestId("admin-container");
    expect(adminContainer).toHaveClass("react-superadmin");
  });
});
