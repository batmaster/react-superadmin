import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Dropdown } from "../../../components/ui/Dropdown";

// Mock icon component
const MockIcon = () => <span data-testid="icon">🔽</span>;

const mockItems = [
  { label: "Edit", value: "edit", onClick: jest.fn() },
  { label: "Delete", value: "delete", onClick: jest.fn() },
  { label: "View", value: "view", onClick: jest.fn() },
];

const mockItemsWithIcons = [
  { label: "Edit", value: "edit", onClick: jest.fn(), icon: <MockIcon /> },
  { label: "Delete", value: "delete", onClick: jest.fn(), icon: <MockIcon /> },
  { label: "View", value: "view", onClick: jest.fn(), icon: <MockIcon /> },
];

const mockItemsWithDivider = [
  { label: "Edit", value: "edit", onClick: jest.fn() },
  { divider: true },
  { label: "Delete", value: "delete", onClick: jest.fn() },
];

const mockItemsWithDisabled = [
  { label: "Edit", value: "edit", onClick: jest.fn() },
  { label: "Delete", value: "delete", onClick: jest.fn(), disabled: true },
  { label: "View", value: "view", onClick: jest.fn() },
];

describe("Dropdown", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders trigger without opening menu", () => {
    render(<Dropdown trigger={<button>Click me</button>} items={mockItems} />);

    expect(screen.getByText("Click me")).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens menu when trigger is clicked", () => {
    render(<Dropdown trigger={<button>Click me</button>} items={mockItems} />);

    fireEvent.click(screen.getByText("Click me"));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("View")).toBeInTheDocument();
  });

  it("closes menu when item is clicked", async () => {
    render(<Dropdown trigger={<button>Click me</button>} items={mockItems} />);

    fireEvent.click(screen.getByText("Click me"));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("calls onClick when item is clicked", () => {
    render(<Dropdown trigger={<button>Click me</button>} items={mockItems} />);

    fireEvent.click(screen.getByText("Click me"));
    fireEvent.click(screen.getByText("Edit"));

    expect(mockItems[0].onClick).toHaveBeenCalledTimes(1);
  });

  it("does not close menu when closeOnSelect is false", () => {
    render(
      <Dropdown
        trigger={<button>Click me</button>}
        items={mockItems}
        closeOnSelect={false}
      />,
    );

    fireEvent.click(screen.getByText("Click me"));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Edit"));

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("closes menu when clicking outside", async () => {
    render(<Dropdown trigger={<button>Click me</button>} items={mockItems} />);

    fireEvent.click(screen.getByText("Click me"));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("does not close menu when closeOnClickOutside is false", () => {
    render(
      <Dropdown
        trigger={<button>Click me</button>}
        items={mockItems}
        closeOnClickOutside={false}
      />,
    );

    fireEvent.click(screen.getByText("Click me"));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("closes menu when Escape key is pressed", async () => {
    render(<Dropdown trigger={<button>Click me</button>} items={mockItems} />);

    fireEvent.click(screen.getByText("Click me"));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("opens menu when ArrowDown key is pressed on trigger", () => {
    render(<Dropdown trigger={<button>Click me</button>} items={mockItems} />);

    const trigger = screen.getByText("Click me");
    fireEvent.keyDown(trigger, { key: "ArrowDown" });

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("opens menu when Enter key is pressed on trigger", () => {
    render(<Dropdown trigger={<button>Click me</button>} items={mockItems} />);

    const trigger = screen.getByText("Click me");
    fireEvent.keyDown(trigger, { key: "Enter" });

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("opens menu when Space key is pressed on trigger", () => {
    render(<Dropdown trigger={<button>Click me</button>} items={mockItems} />);

    const trigger = screen.getByText("Click me");
    fireEvent.keyDown(trigger, { key: " " });

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("handles disabled items correctly", () => {
    render(
      <Dropdown
        trigger={<button>Click me</button>}
        items={mockItemsWithDisabled}
      />,
    );

    fireEvent.click(screen.getByText("Click me"));

    const disabledItem = screen.getByText("Delete");
    expect(disabledItem).toBeDisabled();

    fireEvent.click(disabledItem);
    expect(mockItemsWithDisabled[1].onClick).not.toHaveBeenCalled();
  });

  it("renders dividers correctly", () => {
    render(
      <Dropdown
        trigger={<button>Click me</button>}
        items={mockItemsWithDivider}
      />,
    );

    fireEvent.click(screen.getByText("Click me"));

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();

    // Check for divider (border element)
    const menu = screen.getByRole("menu");
    const dividers = menu.querySelectorAll(".border-t");
    expect(dividers).toHaveLength(1);
  });

  it("renders icons when provided", () => {
    render(
      <Dropdown
        trigger={<button>Click me</button>}
        items={mockItemsWithIcons}
      />,
    );

    fireEvent.click(screen.getByText("Click me"));

    const icons = screen.getAllByTestId("icon");
    expect(icons).toHaveLength(3);
  });

  it("applies correct alignment classes", () => {
    const { rerender } = render(
      <Dropdown
        trigger={<button>Click me</button>}
        items={mockItems}
        align="left"
      />,
    );

    fireEvent.click(screen.getByText("Click me"));
    let menu = screen.getByRole("menu");
    expect(menu).toHaveClass("left-0");

    // Close menu before rerendering
    fireEvent.click(screen.getByText("Click me"));

    rerender(
      <Dropdown
        trigger={<button>Click me</button>}
        items={mockItems}
        align="right"
      />,
    );
    fireEvent.click(screen.getByText("Click me"));
    menu = screen.getByRole("menu");
    expect(menu).toHaveClass("right-0");

    // Close menu before rerendering
    fireEvent.click(screen.getByText("Click me"));

    rerender(
      <Dropdown
        trigger={<button>Click me</button>}
        items={mockItems}
        align="center"
      />,
    );
    fireEvent.click(screen.getByText("Click me"));
    menu = screen.getByRole("menu");
    expect(menu).toHaveClass("left-1/2", "transform", "-translate-x-1/2");
  });

  it("applies correct size classes", () => {
    const { rerender } = render(
      <Dropdown
        trigger={<button>Click me</button>}
        items={mockItems}
        size="sm"
      />,
    );

    fireEvent.click(screen.getByText("Click me"));
    let menu = screen.getByRole("menu");
    expect(menu).toHaveClass("w-40");

    // Close menu before rerendering
    fireEvent.click(screen.getByText("Click me"));

    rerender(
      <Dropdown
        trigger={<button>Click me</button>}
        items={mockItems}
        size="md"
      />,
    );
    fireEvent.click(screen.getByText("Click me"));
    menu = screen.getByRole("menu");
    expect(menu).toHaveClass("w-48");

    // Close menu before rerendering
    fireEvent.click(screen.getByText("Click me"));

    rerender(
      <Dropdown
        trigger={<button>Click me</button>}
        items={mockItems}
        size="lg"
      />,
    );
    fireEvent.click(screen.getByText("Click me"));
    menu = screen.getByRole("menu");
    expect(menu).toHaveClass("w-56");
  });

  it("applies custom classes correctly", () => {
    render(
      <Dropdown
        trigger={<button>Click me</button>}
        items={mockItems}
        className="custom-dropdown"
        triggerClassName="custom-trigger"
        menuClassName="custom-menu"
      />,
    );

    const dropdown = screen.getByText("Click me").closest(".relative");
    expect(dropdown).toHaveClass("custom-dropdown");

    const trigger = screen.getByRole("button", {
      name: "Toggle dropdown menu",
    });
    expect(trigger).toHaveClass("custom-trigger");

    fireEvent.click(screen.getByText("Click me"));
    const menu = screen.getByRole("menu");
    expect(menu).toHaveClass("custom-menu");
  });

  it("has proper accessibility attributes", () => {
    render(<Dropdown trigger={<button>Click me</button>} items={mockItems} />);

    const trigger = screen.getByRole("button", {
      name: "Toggle dropdown menu",
    });
    expect(trigger).toHaveAttribute("role", "button");
    expect(trigger).toHaveAttribute("aria-haspopup", "true");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-label", "Toggle dropdown menu");
    expect(trigger).toHaveAttribute("tabIndex", "0");

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("role", "menu");
    expect(menu).toHaveAttribute("aria-orientation", "vertical");

    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems).toHaveLength(3);
    menuItems.forEach((item) => {
      expect(item).toHaveAttribute("tabIndex", "-1");
    });
  });

  it("handles keyboard navigation for menu items", () => {
    render(<Dropdown trigger={<button>Click me</button>} items={mockItems} />);

    fireEvent.click(screen.getByText("Click me"));

    const editItem = screen.getByText("Edit");
    fireEvent.keyDown(editItem, { key: "Enter" });

    expect(mockItems[0].onClick).toHaveBeenCalledTimes(1);
  });
});
