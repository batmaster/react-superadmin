import React from "react";
import { render, screen } from "@testing-library/react";
import { Footer } from "../../components/Footer";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";

const mockConfig = {
  title: "Test Admin",
  theme: { primary: "#1976d2" },
  layout: { sidebarWidth: 240 },
  auth: { enabled: true },
  resources: [],
};

describe("Footer", () => {
  const renderWithProvider = (props: any) => {
    return render(
      <SuperAdminProvider config={mockConfig}>
        <Footer {...props} />
      </SuperAdminProvider>,
    );
  };

  it("renders without crashing", () => {
    renderWithProvider({});
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    renderWithProvider({ className: "custom-footer" });
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("custom-footer");
  });

  it("renders with custom style", () => {
    const customStyle = { backgroundColor: "red" };
    renderWithProvider({ style: customStyle });
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveStyle(customStyle);
  });

  it("renders children content", () => {
    renderWithProvider({
      children: <div data-testid="child">Footer Content</div>,
    });
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });

  it("applies default styling", () => {
    renderWithProvider({});
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("bg-white", "border-t", "border-gray-200");
  });

  it("renders with custom height when specified", () => {
    renderWithProvider({ height: "80px" });
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveStyle({ height: "80px" });
  });

  it("renders with default height when not specified", () => {
    renderWithProvider({});
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("h-16");
  });

  it("renders with custom padding when specified", () => {
    renderWithProvider({ padding: "p-8" });
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("p-8");
  });

  it("renders with default padding when not specified", () => {
    renderWithProvider({});
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("px-6", "py-4");
  });

  it("renders with custom alignment when specified", () => {
    renderWithProvider({ align: "center" });
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("text-center");
  });

  it("renders with left alignment by default", () => {
    renderWithProvider({});
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("text-left");
  });

  it("renders with right alignment when specified", () => {
    renderWithProvider({ align: "right" });
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("text-right");
  });

  it("renders with custom background color when specified", () => {
    renderWithProvider({ bgColor: "bg-gray-800" });
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("bg-gray-800");
  });

  it("renders with default background color when not specified", () => {
    renderWithProvider({});
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("bg-white");
  });

  it("renders with custom text color when specified", () => {
    renderWithProvider({ textColor: "text-white" });
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("text-white");
  });

  it("renders with default text color when not specified", () => {
    renderWithProvider({});
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("text-gray-600");
  });
});
