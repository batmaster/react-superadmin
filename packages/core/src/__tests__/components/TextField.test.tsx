import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TextField } from "../../components/TextField";

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe("TextField", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<TextField>Hello World</TextField>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders with value prop", () => {
    render(<TextField value="Test Value" />);
    expect(screen.getByText("Test Value")).toBeInTheDocument();
  });

  it("renders with children prop", () => {
    render(<TextField>Child Content</TextField>);
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(<TextField className="custom-class">Test</TextField>);
    const textField = screen.getByText("Test").closest("div");
    expect(textField).toHaveClass("custom-class");
  });

  it("renders with custom style", () => {
    const customStyle = { backgroundColor: "red" };
    render(<TextField style={customStyle}>Test</TextField>);
    const textField = screen.getByText("Test").closest("div");
    expect(textField).toHaveStyle(customStyle);
  });

  it("applies default styling", () => {
    render(<TextField>Test</TextField>);
    const textField = screen.getByText("Test").closest("div");
    expect(textField).toHaveClass("text-base", "font-normal", "text-left");
  });

  it("renders with custom variant", () => {
    render(<TextField variant="primary">Test</TextField>);
    const textField = screen.getByText("Test").closest("div");
    expect(textField).toHaveClass("text-blue-600");
  });

  it("renders with custom size", () => {
    render(<TextField size="lg">Test</TextField>);
    const textField = screen.getByText("Test").closest("div");
    expect(textField).toHaveClass("text-lg");
  });

  it("renders with custom weight", () => {
    render(<TextField weight="bold">Test</TextField>);
    const textField = screen.getByText("Test").closest("div");
    expect(textField).toHaveClass("font-bold");
  });

  it("renders with custom alignment", () => {
    render(<TextField align="center">Test</TextField>);
    const textField = screen.getByText("Test").closest("div");
    expect(textField).toHaveClass("text-center");
  });

  it("truncates text when truncate is true and maxLength is set", () => {
    const longText = "This is a very long text that should be truncated";
    render(
      <TextField truncate maxLength={20} truncateIndicator="...">
        {longText}
      </TextField>,
    );
    expect(screen.getByText("This is a very long ...")).toBeInTheDocument();
  });

  it("does not truncate when truncate is false", () => {
    const longText = "This is a very long text that should not be truncated";
    render(
      <TextField truncate={false} maxLength={20}>
        {longText}
      </TextField>,
    );
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it("applies ellipsis class when ellipsis is true", () => {
    render(<TextField ellipsis>Test</TextField>);
    const textField = screen.getByText("Test").closest("div");
    expect(textField).toHaveClass("truncate");
  });

  it("applies line clamp classes when lines is set", () => {
    render(<TextField lines={3}>Test</TextField>);
    const textField = screen.getByText("Test").closest("div");
    expect(textField).toHaveClass("line-clamp-3");
  });

  it("makes text non-selectable when selectable is false", () => {
    render(<TextField selectable={false}>Test</TextField>);
    const textField = screen.getByText("Test").closest("div");
    expect(textField).toHaveClass("select-none");
  });

  it("applies clickable styles when clickable is true", () => {
    render(<TextField clickable>Test</TextField>);
    const textField = screen.getByText("Test").closest("div");
    expect(textField).toHaveClass("cursor-pointer", "hover:opacity-80");
  });

  it("calls onClick when clicked and clickable is true", () => {
    const handleClick = jest.fn();
    render(
      <TextField clickable onClick={handleClick}>
        Test
      </TextField>,
    );
    const textField = screen.getByText("Test").closest("div");
    fireEvent.click(textField!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows copy button when showCopyButton is true", () => {
    render(<TextField showCopyButton>Test</TextField>);
    expect(screen.getByTitle("Copy to clipboard")).toBeInTheDocument();
  });

  it("does not show copy button when showCopyButton is false", () => {
    render(<TextField showCopyButton={false}>Test</TextField>);
    expect(screen.queryByTitle("Copy to clipboard")).not.toBeInTheDocument();
  });

  it("copies text to clipboard when copy button is clicked", async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText: mockWriteText });

    render(<TextField showCopyButton>Test Text</TextField>);
    const copyButton = screen.getByTitle("Copy to clipboard");

    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith("Test Text");
    });
  });

  it("shows success indicator after copying", async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText: mockWriteText });

    render(<TextField showCopyButton>Test Text</TextField>);
    const copyButton = screen.getByTitle("Copy to clipboard");

    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText("✓")).toBeInTheDocument();
      expect(screen.getByTitle("Copied!")).toBeInTheDocument();
    });
  });

  it("handles clipboard error gracefully", async () => {
    const mockWriteText = jest
      .fn()
      .mockRejectedValue(new Error("Clipboard error"));
    Object.assign(navigator.clipboard, { writeText: mockWriteText });

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<TextField showCopyButton>Test Text</TextField>);
    const copyButton = screen.getByTitle("Copy to clipboard");

    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to copy text:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<TextField ref={ref}>Test</TextField>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with all variant colors", () => {
    const variants = [
      "default",
      "primary",
      "secondary",
      "success",
      "warning",
      "error",
      "muted",
    ];

    variants.forEach((variant) => {
      const { unmount } = render(
        <TextField variant={variant as any}>Test {variant}</TextField>,
      );
      expect(screen.getByText(`Test ${variant}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("renders with all sizes", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"];

    sizes.forEach((size) => {
      const { unmount } = render(
        <TextField size={size as any}>Test {size}</TextField>,
      );
      expect(screen.getByText(`Test ${size}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("renders with all weights", () => {
    const weights = ["normal", "medium", "semibold", "bold", "extrabold"];

    weights.forEach((weight) => {
      const { unmount } = render(
        <TextField weight={weight as any}>Test {weight}</TextField>,
      );
      expect(screen.getByText(`Test ${weight}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("renders with all alignments", () => {
    const alignments = ["left", "center", "right", "justify"];

    alignments.forEach((align) => {
      const { unmount } = render(
        <TextField align={align as any}>Test {align}</TextField>,
      );
      expect(screen.getByText(`Test ${align}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("prioritizes value over children", () => {
    render(<TextField value="Value Text">Children Text</TextField>);
    expect(screen.getByText("Value Text")).toBeInTheDocument();
    expect(screen.queryByText("Children Text")).not.toBeInTheDocument();
  });

  it("renders nothing when neither value nor children are provided", () => {
    const { container } = render(<TextField />);
    expect(container.firstChild).toBeNull();
  });
});
