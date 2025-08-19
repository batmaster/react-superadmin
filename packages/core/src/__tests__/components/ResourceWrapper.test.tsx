import React from "react";
import { render, screen } from "@testing-library/react";
import { ResourceWrapper } from "../../components/Resource";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";

const mockConfig = {
  title: "Test Admin",
  theme: { primary: "#1976d2" },
  layout: { sidebarWidth: 240 },
  auth: { enabled: true },
  resources: [],
};

describe("ResourceWrapper", () => {
  const renderWithProvider = (props: any) => {
    return render(
      <SuperAdminProvider config={mockConfig}>
        <ResourceWrapper {...props} />
      </SuperAdminProvider>,
    );
  };

  it("renders without crashing", () => {
    renderWithProvider({ name: "users" });
    expect(screen.getByTestId("resource-wrapper")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    renderWithProvider({ name: "users", className: "custom-resource" });
    const resource = screen.getByTestId("resource-wrapper");
    expect(resource).toHaveClass("custom-resource");
  });

  it("renders with custom style", () => {
    const customStyle = { backgroundColor: "red" };
    renderWithProvider({ name: "users", style: customStyle });
    const resource = screen.getByTestId("resource-wrapper");
    expect(resource).toHaveStyle(customStyle);
  });

  it("renders children content", () => {
    renderWithProvider({
      name: "users",
      children: <div data-testid="child">Resource Content</div>,
    });
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Resource Content")).toBeInTheDocument();
  });

  it("applies default styling", () => {
    renderWithProvider({ name: "users" });
    const resource = screen.getByTestId("resource-wrapper");
    expect(resource).toHaveClass("resource-wrapper");
  });

  it("renders with custom resource name", () => {
    renderWithProvider({ name: "custom-resource" });
    const resource = screen.getByTestId("resource-wrapper");
    expect(resource).toHaveAttribute("data-resource", "custom-resource");
  });

  it("renders with custom resource label when specified", () => {
    renderWithProvider({ name: "users", label: "Custom Users" });
    const resource = screen.getByTestId("resource-wrapper");
    expect(resource).toHaveAttribute("data-label", "Custom Users");
  });

  it("renders with default label when not specified", () => {
    renderWithProvider({ name: "users" });
    const resource = screen.getByTestId("resource-wrapper");
    expect(resource).toHaveAttribute("data-label", "users");
  });

  it("renders with custom icon when specified", () => {
    renderWithProvider({ name: "users", icon: "👥" });
    const resource = screen.getByTestId("resource-wrapper");
    expect(resource).toHaveAttribute("data-icon", "👥");
  });

  it("renders without icon when not specified", () => {
    renderWithProvider({ name: "users" });
    const resource = screen.getByTestId("resource-wrapper");
    expect(resource).not.toHaveAttribute("data-icon");
  });

  it("renders with custom options when specified", () => {
    const customOptions = { create: true, edit: false, delete: true };
    renderWithProvider({ name: "users", options: customOptions });
    const resource = screen.getByTestId("resource-wrapper");
    expect(resource).toHaveAttribute(
      "data-options",
      JSON.stringify(customOptions),
    );
  });

  it("renders without options when not specified", () => {
    renderWithProvider({ name: "users" });
    const resource = screen.getByTestId("resource-wrapper");
    expect(resource).not.toHaveAttribute("data-options");
  });

  it("renders with custom permissions when specified", () => {
    const customPermissions = ["read", "write", "delete"];
    renderWithProvider({ name: "users", permissions: customPermissions });
    const resource = screen.getByTestId("resource-wrapper");
    expect(resource).toHaveAttribute(
      "data-permissions",
      JSON.stringify(customPermissions),
    );
  });

  it("renders without permissions when not specified", () => {
    renderWithProvider({ name: "users" });
    const resource = screen.getByTestId("resource-wrapper");
    expect(resource).not.toHaveAttribute("data-permissions");
  });

  it("renders with custom metadata when specified", () => {
    const customMetadata = { version: "1.0", category: "user-management" };
    renderWithProvider({ name: "users", metadata: customMetadata });
    const resource = screen.getByTestId("resource-wrapper");
    expect(resource).toHaveAttribute(
      "data-metadata",
      JSON.stringify(customMetadata),
    );
  });

  it("renders without metadata when not specified", () => {
    renderWithProvider({ name: "users" });
    const resource = screen.getByTestId("resource-wrapper");
    expect(resource).not.toHaveAttribute("data-metadata");
  });

  it("renders with custom wrapper class when specified", () => {
    renderWithProvider({ name: "users", wrapperClassName: "custom-wrapper" });
    const resource = screen.getByTestId("resource-wrapper");
    expect(resource).toHaveClass("custom-wrapper");
  });

  it("renders without wrapper class when not specified", () => {
    renderWithProvider({ name: "users" });
    const resource = screen.getByTestId("resource-wrapper");
    expect(resource).not.toHaveClass("custom-wrapper");
  });
});
