import React from "react";
import { render, screen } from "@testing-library/react";
import { AdminLayout } from "../../components/AdminLayout";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";

const mockConfig = {
  title: "Test Admin",
  theme: { primary: "#1976d2" },
  layout: { sidebarWidth: 240 },
  auth: { enabled: true },
  resources: [],
};

describe("AdminLayout", () => {
  const renderWithProvider = (props: any) => {
    return render(
      <SuperAdminProvider config={mockConfig}>
        <AdminLayout {...props} />
      </SuperAdminProvider>,
    );
  };

  it("renders without crashing", () => {
    renderWithProvider({});
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    renderWithProvider({ className: "custom-layout" });
    const layout = screen.getByRole("main");
    expect(layout).toHaveClass("custom-layout");
  });

  it("renders with custom style", () => {
    const customStyle = { backgroundColor: "red" };
    renderWithProvider({ style: customStyle });
    const layout = screen.getByRole("main");
    expect(layout).toHaveStyle(customStyle);
  });

  it("renders children content", () => {
    renderWithProvider({
      children: <div data-testid="child">Layout Content</div>,
    });
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Layout Content")).toBeInTheDocument();
  });

  it("applies default styling", () => {
    renderWithProvider({});
    const layout = screen.getByRole("main");
    expect(layout).toHaveClass("min-h-screen", "bg-gray-50");
  });

  it("renders with custom sidebar width when specified", () => {
    renderWithProvider({ sidebarWidth: "300px" });
    const layout = screen.getByRole("main");
    expect(layout).toHaveClass("pl-80"); // This should be adjusted based on actual implementation
  });

  it("renders with default sidebar width when not specified", () => {
    renderWithProvider({});
    const layout = screen.getByRole("main");
    expect(layout).toHaveClass("pl-60");
  });

  it("renders with custom header height when specified", () => {
    renderWithProvider({ headerHeight: "80px" });
    const layout = screen.getByRole("main");
    expect(layout).toHaveClass("pt-20");
  });

  it("renders with default header height when not specified", () => {
    renderWithProvider({});
    const layout = screen.getByRole("main");
    expect(layout).toHaveClass("pt-16");
  });

  it("renders with custom footer height when specified", () => {
    renderWithProvider({ footerHeight: "80px" });
    const layout = screen.getByRole("main");
    expect(layout).toHaveClass("pb-20");
  });

  it("renders without footer padding by default", () => {
    renderWithProvider({});
    const layout = screen.getByRole("main");
    expect(layout).not.toHaveClass("pb-16");
  });

  it("renders with custom background color when specified", () => {
    renderWithProvider({ bgColor: "bg-blue-50" });
    const layout = screen.getByRole("main");
    expect(layout).toHaveClass("bg-blue-50");
  });

  it("renders with default background color when not specified", () => {
    renderWithProvider({});
    const layout = screen.getByRole("main");
    expect(layout).toHaveClass("bg-gray-50");
  });

  it("renders with custom padding when specified", () => {
    renderWithProvider({ padding: "p-8" });
    const layout = screen.getByRole("main");
    expect(layout).toHaveClass("p-8");
  });

  it("renders without custom padding by default", () => {
    renderWithProvider({});
    const layout = screen.getByRole("main");
    expect(layout).not.toHaveClass("p-6");
  });
});
