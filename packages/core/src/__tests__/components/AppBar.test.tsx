import React from "react";
import { render, screen } from "@testing-library/react";
import { AppBar } from "../../components/AppBar";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";

const mockConfig = {
  title: "Test Admin",
  theme: { primary: "#1976d2" },
  layout: { sidebarWidth: 240 },
  auth: { enabled: true },
  resources: [],
};

describe("AppBar", () => {
  const renderWithProvider = (props: any) => {
    return render(
      <SuperAdminProvider config={mockConfig}>
        <AppBar {...props} />
      </SuperAdminProvider>,
    );
  };

  it("renders without crashing", () => {
    renderWithProvider({});
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders with custom title", () => {
    renderWithProvider({ title: "Custom Title" });
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    renderWithProvider({ className: "custom-class" });
    const appBar = screen.getByRole("banner");
    expect(appBar).toHaveClass("custom-class");
  });

  it("renders with custom style", () => {
    const customStyle = { backgroundColor: "red" };
    renderWithProvider({ style: customStyle });
    const appBar = screen.getByRole("banner");
    expect(appBar).toHaveStyle(customStyle);
  });

  it("renders children content", () => {
    renderWithProvider({
      children: <div data-testid="child">Child Content</div>,
    });
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("applies default styling", () => {
    renderWithProvider({});
    const appBar = screen.getByRole("banner");
    expect(appBar).toHaveClass("bg-white", "border-b", "border-gray-200");
  });

  it("renders with elevation when specified", () => {
    renderWithProvider({ elevation: true });
    const appBar = screen.getByRole("banner");
    expect(appBar).toHaveClass("shadow-md");
  });

  it("renders without elevation by default", () => {
    renderWithProvider({});
    const appBar = screen.getByRole("banner");
    expect(appBar).not.toHaveClass("shadow-md");
  });

  it("renders with custom height", () => {
    renderWithProvider({ height: "80px" });
    const appBar = screen.getByRole("banner");
    expect(appBar).toHaveStyle({ height: "80px" });
  });

  it("renders with default height when not specified", () => {
    renderWithProvider({});
    const appBar = screen.getByRole("banner");
    expect(appBar).toHaveClass("h-16");
  });
});
