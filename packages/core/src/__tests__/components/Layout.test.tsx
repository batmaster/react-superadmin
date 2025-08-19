import React from "react";
import { render, screen } from "@testing-library/react";
import { Layout } from "../../components/Layout";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";

const mockConfig = {
  title: "Test Admin",
  theme: { primary: "#1976d2" },
  layout: { sidebarWidth: 240 },
  auth: { enabled: true },
  resources: [],
};

describe("Layout", () => {
  const renderWithProvider = (props: any) => {
    return render(
      <SuperAdminProvider config={mockConfig}>
        <Layout {...props} />
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

  it("renders with custom max width when specified", () => {
    renderWithProvider({ maxWidth: "max-w-4xl" });
    const layout = screen.getByRole("main");
    expect(layout).toHaveClass("max-w-4xl");
  });

  it("renders without max width by default", () => {
    renderWithProvider({});
    const layout = screen.getByRole("main");
    expect(layout).not.toHaveClass("max-w-7xl");
  });

  it("renders with custom margin when specified", () => {
    renderWithProvider({ margin: "mx-auto" });
    const layout = screen.getByRole("main");
    expect(layout).toHaveClass("mx-auto");
  });

  it("renders without margin by default", () => {
    renderWithProvider({});
    const layout = screen.getByRole("main");
    expect(layout).not.toHaveClass("mx-auto");
  });

  it("renders with custom border radius when specified", () => {
    renderWithProvider({ borderRadius: "rounded-lg" });
    const layout = screen.getByRole("main");
    expect(layout).toHaveClass("rounded-lg");
  });

  it("renders without border radius by default", () => {
    renderWithProvider({});
    const layout = screen.getByRole("main");
    expect(layout).not.toHaveClass("rounded-lg");
  });

  it("renders with custom shadow when specified", () => {
    renderWithProvider({ shadow: "shadow-lg" });
    const layout = screen.getByRole("main");
    expect(layout).toHaveClass("shadow-lg");
  });

  it("renders without shadow by default", () => {
    renderWithProvider({});
    const layout = screen.getByRole("main");
    expect(layout).not.toHaveClass("shadow-lg");
  });
});
