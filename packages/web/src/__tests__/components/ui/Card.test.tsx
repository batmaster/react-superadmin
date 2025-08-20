import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../../../components/ui/Card";

describe("Card", () => {
  const defaultProps = {
    children: "Card content",
  };

  it("should render with default props", () => {
    render(<Card {...defaultProps} />);
    const card = screen.getByText("Card content").closest("div");

    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("bg-white", "rounded-lg", "border", "shadow-sm");
  });

  it("should render with outlined variant", () => {
    render(<Card variant="outlined">Card content</Card>);
    const card = screen.getByText("Card content").closest("div");

    expect(card).toHaveClass("border-gray-300", "shadow-none");
  });

  it("should render with elevated variant", () => {
    render(<Card variant="elevated">Card content</Card>);
    const card = screen.getByText("Card content").closest("div");

    expect(card).toHaveClass("border-transparent", "shadow-lg");
  });

  it("should render with flat variant", () => {
    render(<Card variant="flat">Card content</Card>);
    const card = screen.getByText("Card content").closest("div");

    expect(card).toHaveClass("border-gray-100", "shadow-none", "bg-gray-50");
  });

  it("should render with no padding", () => {
    render(<Card padding="none">Card content</Card>);
    const card = screen.getByText("Card content").closest("div");

    expect(card).not.toHaveClass("p-3", "p-4", "p-6");
  });

  it("should render with small padding", () => {
    render(<Card padding="sm">Card content</Card>);
    const card = screen.getByText("Card content").closest("div");

    expect(card).toHaveClass("p-3");
  });

  it("should render with large padding", () => {
    render(<Card padding="lg">Card content</Card>);
    const card = screen.getByText("Card content").closest("div");

    expect(card).toHaveClass("p-6");
  });

  it("should render with hover effects", () => {
    render(<Card hover>Card content</Card>);
    const card = screen.getByText("Card content").closest("div");

    expect(card).toHaveClass("hover:shadow-md", "hover:-translate-y-1");
  });

  it("should apply custom className", () => {
    render(<Card className="custom-class">Card content</Card>);
    const card = screen.getByText("Card content").closest("div");

    expect(card).toHaveClass("custom-class");
  });

  it("should have focus ring styles", () => {
    render(<Card>Card content</Card>);
    const card = screen.getByText("Card content").closest("div");

    expect(card).toHaveClass(
      "focus-within:ring-2",
      "focus-within:ring-primary-500",
      "focus-within:ring-offset-2",
    );
  });

  it("should have transition effects", () => {
    render(<Card>Card content</Card>);
    const card = screen.getByText("Card content").closest("div");

    expect(card).toHaveClass("transition-all", "duration-200");
  });
});

describe("CardHeader", () => {
  it("should render with children", () => {
    render(
      <Card>
        <CardHeader>Header content</CardHeader>
        <div>Card content</div>
      </Card>,
    );

    expect(screen.getByText("Header content")).toBeInTheDocument();
  });

  it("should render with action", () => {
    const action = <button>Action</button>;
    render(
      <Card>
        <CardHeader action={action}>Header content</CardHeader>
        <div>Card content</div>
      </Card>,
    );

    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Action").closest("button")).toBeInTheDocument();
  });

  it("should have proper styling", () => {
    render(
      <Card>
        <CardHeader>Header content</CardHeader>
        <div>Card content</div>
      </Card>,
    );

    // Find the CardHeader element by looking for the text and then finding the parent with the header styling
    const headerText = screen.getByText("Header content");
    const header = headerText.parentElement;
    expect(header).toHaveClass(
      "flex",
      "items-center",
      "justify-between",
      "border-b",
      "border-gray-100",
      "pb-3",
      "mb-3",
    );
  });

  it("should apply custom className", () => {
    render(
      <Card>
        <CardHeader className="custom-header">Header content</CardHeader>
        <div>Card content</div>
      </Card>,
    );

    // Find the CardHeader element by looking for the text and then finding the parent with the header styling
    const headerText = screen.getByText("Header content");
    const header = headerText.parentElement;
    expect(header).toHaveClass("custom-header");
  });
});

describe("CardContent", () => {
  it("should render with children", () => {
    render(
      <Card>
        <CardContent>Content here</CardContent>
      </Card>,
    );

    expect(screen.getByText("Content here")).toBeInTheDocument();
  });

  it("should have proper styling", () => {
    render(
      <Card>
        <CardContent>Content here</CardContent>
      </Card>,
    );

    const content = screen.getByText("Content here").closest("div");
    expect(content).toHaveClass("flex-1");
  });

  it("should apply custom className", () => {
    render(
      <Card>
        <CardContent className="custom-content">Content here</CardContent>
      </Card>,
    );

    const content = screen.getByText("Content here").closest("div");
    expect(content).toHaveClass("custom-content");
  });
});

describe("CardFooter", () => {
  it("should render with children", () => {
    render(
      <Card>
        <div>Card content</div>
        <CardFooter>Footer content</CardFooter>
      </Card>,
    );

    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("should align content to left by default", () => {
    render(
      <Card>
        <div>Card content</div>
        <CardFooter>Footer content</CardFooter>
      </Card>,
    );

    const footer = screen.getByText("Footer content").closest("div");
    expect(footer).toHaveClass("justify-start");
  });

  it("should align content to center", () => {
    render(
      <Card>
        <div>Card content</div>
        <CardFooter align="center">Footer content</CardFooter>
      </Card>,
    );

    const footer = screen.getByText("Footer content").closest("div");
    expect(footer).toHaveClass("justify-center");
  });

  it("should align content to right", () => {
    render(
      <Card>
        <div>Card content</div>
        <CardFooter align="right">Footer content</CardFooter>
      </Card>,
    );

    const footer = screen.getByText("Footer content").closest("div");
    expect(footer).toHaveClass("justify-end");
  });

  it("should have proper styling", () => {
    render(
      <Card>
        <div>Card content</div>
        <CardFooter>Footer content</CardFooter>
      </Card>,
    );

    const footer = screen.getByText("Footer content").closest("div");
    expect(footer).toHaveClass(
      "flex",
      "items-center",
      "border-t",
      "border-gray-100",
      "pt-3",
      "mt-3",
    );
  });

  it("should apply custom className", () => {
    render(
      <Card>
        <div>Card content</div>
        <CardFooter className="custom-footer">Footer content</CardFooter>
      </Card>,
    );

    const footer = screen.getByText("Footer content").closest("div");
    expect(footer).toHaveClass("custom-footer");
  });
});

describe("Card Composition", () => {
  it("should render complete card with all subcomponents", () => {
    render(
      <Card>
        <CardHeader action={<button>Edit</button>}>Card Title</CardHeader>
        <CardContent>This is the main content of the card.</CardContent>
        <CardFooter align="right">
          <button>Save</button>
          <button>Cancel</button>
        </CardFooter>
      </Card>,
    );

    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(
      screen.getByText("This is the main content of the card."),
    ).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("should handle complex nested content", () => {
    render(
      <Card variant="elevated" padding="lg" hover>
        <CardHeader>
          <h3 className="text-lg font-semibold">User Profile</h3>
          <div className="flex space-x-2">
            <button>Edit</button>
            <button>Delete</button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>Name: John Doe</p>
            <p>Email: john@example.com</p>
            <p>Role: Administrator</p>
          </div>
        </CardContent>
        <CardFooter align="center">
          <span className="text-sm text-gray-500">
            Last updated: 2 hours ago
          </span>
        </CardFooter>
      </Card>,
    );

    expect(screen.getByText("User Profile")).toBeInTheDocument();
    expect(screen.getByText("Name: John Doe")).toBeInTheDocument();
    expect(screen.getByText("Email: john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Role: Administrator")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Last updated: 2 hours ago")).toBeInTheDocument();
  });
});
