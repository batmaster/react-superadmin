import { render, screen } from "@testing-library/react";
import React from "react";
import { Layout } from "../../components/Layout";

describe("Layout Component", () => {
  const mockHeader = <div data-testid="mock-header">Header Content</div>;
  const mockSidebar = <div data-testid="mock-sidebar">Sidebar Content</div>;
  const mockFooter = <div data-testid="mock-footer">Footer Content</div>;
  const mockChildren = <div data-testid="mock-children">Main Content</div>;

  it("renders without crashing", () => {
    render(<Layout>{mockChildren}</Layout>);

    expect(screen.getByTestId("mock-children")).toBeInTheDocument();
  });

  it("renders header when provided and showHeader is true", () => {
    render(
      <Layout header={mockHeader} showHeader={true}>
        {mockChildren}
      </Layout>,
    );

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  });

  it("does not render header when showHeader is false", () => {
    render(
      <Layout header={mockHeader} showHeader={false}>
        {mockChildren}
      </Layout>,
    );

    expect(screen.queryByTestId("mock-header")).not.toBeInTheDocument();
  });

  it("renders sidebar when provided and showSidebar is true", () => {
    render(
      <Layout sidebar={mockSidebar} showSidebar={true}>
        {mockChildren}
      </Layout>,
    );

    expect(screen.getByTestId("mock-sidebar")).toBeInTheDocument();
  });

  it("does not render sidebar when showSidebar is false", () => {
    render(
      <Layout sidebar={mockSidebar} showSidebar={false}>
        {mockChildren}
      </Layout>,
    );

    expect(screen.queryByTestId("mock-sidebar")).not.toBeInTheDocument();
  });

  it("renders footer when provided and showFooter is true", () => {
    render(
      <Layout footer={mockFooter} showFooter={true}>
        {mockChildren}
      </Layout>,
    );

    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });

  it("does not render footer when showFooter is false", () => {
    render(
      <Layout footer={mockFooter} showFooter={false}>
        {mockChildren}
      </Layout>,
    );

    expect(screen.queryByTestId("mock-footer")).not.toBeInTheDocument();
  });

  it("applies custom className to layout container", () => {
    render(<Layout className="custom-layout">{mockChildren}</Layout>);

    const layoutElement = screen
      .getByTestId("mock-children")
      .closest(".rs-layout");
    expect(layoutElement).toHaveClass("custom-layout");
  });

  it("applies custom className to header", () => {
    render(
      <Layout header={mockHeader} headerClassName="custom-header">
        {mockChildren}
      </Layout>,
    );

    const headerElement = screen
      .getByTestId("mock-header")
      .closest(".rs-layout__header");
    expect(headerElement).toHaveClass("custom-header");
  });

  it("applies custom className to sidebar", () => {
    render(
      <Layout sidebar={mockSidebar} sidebarClassName="custom-sidebar">
        {mockChildren}
      </Layout>,
    );

    const sidebarElement = screen
      .getByTestId("mock-sidebar")
      .closest(".rs-layout__sidebar");
    expect(sidebarElement).toHaveClass("custom-sidebar");
  });

  it("applies custom className to main content", () => {
    render(<Layout mainClassName="custom-main">{mockChildren}</Layout>);

    const mainElement = screen
      .getByTestId("mock-children")
      .closest(".rs-layout__main");
    expect(mainElement).toHaveClass("custom-main");
  });

  it("applies custom className to footer", () => {
    render(
      <Layout footer={mockFooter} footerClassName="custom-footer">
        {mockChildren}
      </Layout>,
    );

    const footerElement = screen
      .getByTestId("mock-footer")
      .closest(".rs-layout__footer");
    expect(footerElement).toHaveClass("custom-footer");
  });

  it("applies custom sidebar width", () => {
    const customWidth = 300;
    render(
      <Layout sidebar={mockSidebar} sidebarWidth={customWidth}>
        {mockChildren}
      </Layout>,
    );

    const sidebarElement = screen
      .getByTestId("mock-sidebar")
      .closest(".rs-layout__sidebar");
    expect(sidebarElement).toHaveStyle({ width: `${customWidth}px` });
  });

  it("renders all sections when all props are provided", () => {
    render(
      <Layout
        header={mockHeader}
        sidebar={mockSidebar}
        footer={mockFooter}
        showHeader={true}
        showSidebar={true}
        showFooter={true}
      >
        {mockChildren}
      </Layout>,
    );

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-children")).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });

  it("renders only main content when no optional sections are provided", () => {
    render(<Layout>{mockChildren}</Layout>);

    expect(screen.queryByTestId("mock-header")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-sidebar")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-footer")).not.toBeInTheDocument();
    expect(screen.getByTestId("mock-children")).toBeInTheDocument();
  });

  it("has correct CSS class structure", () => {
    render(
      <Layout header={mockHeader} sidebar={mockSidebar} footer={mockFooter}>
        {mockChildren}
      </Layout>,
    );

    expect(
      screen.getByTestId("mock-children").closest(".rs-layout"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-header").closest(".rs-layout__header"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-sidebar").closest(".rs-layout__sidebar"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-children").closest(".rs-layout__main"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-footer").closest(".rs-layout__footer"),
    ).toBeInTheDocument();
  });
});
