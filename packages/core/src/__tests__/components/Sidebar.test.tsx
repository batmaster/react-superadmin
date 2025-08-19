import React from "react";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "../../components/Sidebar";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";

const mockConfig = {
  title: "Test Admin",
  theme: { primary: "#1976d2" },
  layout: { sidebarWidth: 240 },
  auth: { enabled: true },
  resources: [],
};

describe("Sidebar", () => {
  const renderWithProvider = (props: any) => {
    return render(
      <SuperAdminProvider config={mockConfig}>
        <Sidebar {...props} />
      </SuperAdminProvider>,
    );
  };

  it("renders without crashing", () => {
    renderWithProvider({});
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    renderWithProvider({ className: "custom-sidebar" });
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("custom-sidebar");
  });

  it("renders with custom style", () => {
    const customStyle = { backgroundColor: "red" };
    renderWithProvider({ style: customStyle });
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveStyle(customStyle);
  });

  it("renders children content", () => {
    renderWithProvider({
      children: <div data-testid="child">Sidebar Content</div>,
    });
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Sidebar Content")).toBeInTheDocument();
  });

  it("applies default styling", () => {
    renderWithProvider({});
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("bg-white", "border-r", "border-gray-200");
  });

  it("renders with custom width when specified", () => {
    renderWithProvider({ width: "300px" });
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveStyle({ width: "300px" });
  });

  it("renders with default width when not specified", () => {
    renderWithProvider({});
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("w-60");
  });

  it("renders with custom position", () => {
    renderWithProvider({ position: "right" });
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("border-l", "border-r-0");
  });

  it("renders with left position by default", () => {
    renderWithProvider({});
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("border-r", "border-l-0");
  });

  it("renders with fixed positioning when specified", () => {
    renderWithProvider({ fixed: true });
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("fixed");
  });

  it("renders without fixed positioning by default", () => {
    renderWithProvider({});
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).not.toHaveClass("fixed");
  });

  it("renders with custom z-index when specified", () => {
    renderWithProvider({ zIndex: 1000 });
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveStyle({ zIndex: 1000 });
  });

  it("renders with default z-index when not specified", () => {
    renderWithProvider({});
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("z-40");
  });
});
