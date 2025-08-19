import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Textarea } from "../Textarea";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";

// Mock SuperAdminProvider for testing
const mockConfig = {
  title: "Test App",
  resources: {},
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#6b7280",
    darkMode: false,
  },
  layout: {
    sidebar: true,
    header: true,
    footer: true,
    sidebarWidth: 250,
  },
  auth: {
    enabled: true,
    loginUrl: "/login",
    logoutUrl: "/logout",
  },
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <SuperAdminProvider config={mockConfig}>{component}</SuperAdminProvider>,
  );
};

describe("Textarea", () => {
  it("renders textarea element", () => {
    renderWithProvider(<Textarea data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeInTheDocument();
  });

  it("renders children content", () => {
    renderWithProvider(<Textarea>Test content</Textarea>);
    expect(screen.getByDisplayValue("Test content")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    renderWithProvider(<Textarea label="Description" />);
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("renders helper text when provided", () => {
    renderWithProvider(<Textarea helperText="This is helper text" />);
    expect(screen.getByText("This is helper text")).toBeInTheDocument();
  });

  it("renders error message when provided", () => {
    renderWithProvider(<Textarea error="This is an error" />);
    expect(screen.getByText("This is an error")).toBeInTheDocument();
  });

  it("shows required indicator when required is true", () => {
    renderWithProvider(<Textarea label="Description" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("applies custom class names", () => {
    renderWithProvider(
      <Textarea className="custom-class" data-testid="textarea" />,
    );
    expect(screen.getByTestId("textarea")).toHaveClass("custom-class");
  });

  it("applies wrapper class names", () => {
    renderWithProvider(
      <Textarea wrapperClassName="wrapper-class" data-testid="textarea" />,
    );
    const wrapper = screen.getByTestId("textarea").parentElement?.parentElement;
    expect(wrapper).toHaveClass("wrapper-class");
  });

  it("applies custom styles", () => {
    renderWithProvider(
      <Textarea style={{ backgroundColor: "red" }} data-testid="textarea" />,
    );
    expect(screen.getByTestId("textarea")).toHaveStyle({
      backgroundColor: "red",
    });
  });

  it("applies correct size classes", () => {
    const { rerender } = renderWithProvider(
      <Textarea size="sm" data-testid="textarea" />,
    );
    expect(screen.getByTestId("textarea")).toHaveClass("px-3 py-2 text-sm");

    rerender(
      <SuperAdminProvider config={mockConfig}>
        <Textarea size="lg" data-testid="textarea" />
      </SuperAdminProvider>,
    );
    expect(screen.getByTestId("textarea")).toHaveClass("px-4 py-3 text-base");
  });

  it("applies full width when specified", () => {
    renderWithProvider(<Textarea fullWidth data-testid="textarea" />);
    const wrapper = screen.getByTestId("textarea").parentElement?.parentElement;
    expect(wrapper).toHaveClass("w-full");
  });

  it("renders left icon when provided", () => {
    const LeftIcon = () => <span data-testid="left-icon">📝</span>;
    renderWithProvider(
      <Textarea leftIcon={<LeftIcon />} data-testid="textarea" />,
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders right icon when provided", () => {
    const RightIcon = () => <span data-testid="right-icon">✅</span>;
    renderWithProvider(
      <Textarea rightIcon={<RightIcon />} data-testid="textarea" />,
    );
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("applies padding for left icon", () => {
    const LeftIcon = () => <span>📝</span>;
    renderWithProvider(
      <Textarea leftIcon={<LeftIcon />} data-testid="textarea" />,
    );
    expect(screen.getByTestId("textarea")).toHaveClass("pl-10");
  });

  it("applies padding for right icon", () => {
    const RightIcon = () => <span>✅</span>;
    renderWithProvider(
      <Textarea rightIcon={<RightIcon />} data-testid="textarea" />,
    );
    expect(screen.getByTestId("textarea")).toHaveClass("pr-10");
  });

  it("sets correct number of rows", () => {
    renderWithProvider(<Textarea rows={5} data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toHaveAttribute("rows", "5");
  });

  it("sets maxLength when provided", () => {
    renderWithProvider(<Textarea maxLength={100} data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toHaveAttribute("maxLength", "100");
  });

  it("shows character count when enabled", () => {
    renderWithProvider(
      <Textarea
        showCharacterCount
        maxLength={100}
        value="Hello world"
        data-testid="textarea"
      />,
    );
    expect(screen.getByText("11/100")).toBeInTheDocument();
  });

  it("changes character count color based on usage", () => {
    const longText = "a".repeat(80); // 80% of 100
    renderWithProvider(
      <Textarea
        showCharacterCount
        maxLength={100}
        value={longText}
        data-testid="textarea"
      />,
    );
    const countElement = screen.getByText("80/100");
    expect(countElement).toHaveClass("text-yellow-600");
  });

  it("handles user input correctly", () => {
    const handleChange = jest.fn();
    renderWithProvider(
      <Textarea onChange={handleChange} data-testid="textarea" />,
    );

    const textarea = screen.getByTestId("textarea");
    fireEvent.change(textarea, { target: { value: "New text" } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: "New text" }),
      }),
    );
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    renderWithProvider(<Textarea ref={ref} data-testid="textarea" />);
    expect(ref.current).toBe(screen.getByTestId("textarea"));
  });

  it("applies disabled state correctly", () => {
    renderWithProvider(<Textarea disabled data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass("opacity-50", "cursor-not-allowed");
  });

  it("applies error state styling", () => {
    renderWithProvider(
      <Textarea error="Error message" data-testid="textarea" />,
    );
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveClass(
      "border-red-300",
      "focus:border-red-500",
      "focus:ring-red-500",
    );
  });

  it("applies data attributes correctly", () => {
    renderWithProvider(
      <Textarea
        size="lg"
        fullWidth
        error="Error"
        disabled
        data-testid="textarea"
      />,
    );
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("data-size", "lg");
    expect(textarea).toHaveAttribute("data-error", "true");
    expect(textarea).toHaveAttribute("data-disabled", "true");
    expect(textarea).toHaveAttribute("data-full-width", "true");
  });
});
