import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NumberField } from "../../components/NumberField";

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe("NumberField", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<NumberField value={123.45} />);
    expect(screen.getByText("123.45")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(<NumberField value={123.45} className="custom-class" />);
    const numberField = screen.getByText("123.45").closest("div");
    expect(numberField).toHaveClass("custom-class");
  });

  it("renders with custom style", () => {
    const customStyle = { backgroundColor: "red" };
    render(<NumberField value={123.45} style={customStyle} />);
    const numberField = screen.getByText("123.45").closest("div");
    expect(numberField).toHaveStyle(customStyle);
  });

  it("applies default styling", () => {
    render(<NumberField value={123.45} />);
    const numberField = screen.getByText("123.45").closest("div");
    expect(numberField).toHaveClass(
      "text-base",
      "font-normal",
      "text-right",
      "font-mono",
    );
  });

  it("renders with custom variant", () => {
    render(<NumberField value={123.45} variant="primary" />);
    const numberField = screen.getByText("123.45").closest("div");
    expect(numberField).toHaveClass("text-blue-600");
  });

  it("renders with custom size", () => {
    render(<NumberField value={123.45} size="lg" />);
    const numberField = screen.getByText("123.45").closest("div");
    expect(numberField).toHaveClass("text-lg");
  });

  it("renders with custom weight", () => {
    render(<NumberField value={123.45} weight="bold" />);
    const numberField = screen.getByText("123.45").closest("div");
    expect(numberField).toHaveClass("font-bold");
  });

  it("renders with custom alignment", () => {
    render(<NumberField value={123.45} align="center" />);
    const numberField = screen.getByText("123.45").closest("div");
    expect(numberField).toHaveClass("text-center");
  });

  it("formats decimal places correctly", () => {
    render(<NumberField value={123.456} decimals={3} />);
    expect(screen.getByText("123.456")).toBeInTheDocument();
  });

  it("removes trailing zeros", () => {
    render(<NumberField value={123.4} decimals={3} />);
    expect(screen.getByText("123.4")).toBeInTheDocument();
  });

  it("shows thousands separator", () => {
    render(<NumberField value={1234567} showThousandsSeparator />);
    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("uses custom thousands separator", () => {
    render(
      <NumberField
        value={1234567}
        showThousandsSeparator
        thousandsSeparator="."
      />,
    );
    expect(screen.getByText("1.234.567")).toBeInTheDocument();
  });

  it("shows minus sign for negative numbers", () => {
    render(<NumberField value={-123.45} />);
    expect(screen.getByText("-123.45")).toBeInTheDocument();
  });

  it("hides minus sign when showMinusSign is false", () => {
    render(<NumberField value={-123.45} showMinusSign={false} />);
    expect(screen.getByText("123.45")).toBeInTheDocument();
  });

  it("shows plus sign for positive numbers when showPlusSign is true", () => {
    render(<NumberField value={123.45} showPlusSign />);
    expect(screen.getByText("+123.45")).toBeInTheDocument();
  });

  it("adds custom prefix", () => {
    render(<NumberField value={123.45} prefix="Price: " />);
    expect(screen.getByText("Price: 123.45")).toBeInTheDocument();
  });

  it("adds custom suffix", () => {
    render(<NumberField value={123.45} suffix=" units" />);
    expect(screen.getByText("123.45 units")).toBeInTheDocument();
  });

  it("formats as currency with symbol", () => {
    render(<NumberField value={123.45} currency currencySymbol="$" />);
    expect(screen.getByText("$123.45")).toBeInTheDocument();
  });

  it("formats as currency with code", () => {
    render(<NumberField value={123.45} currency currencyCode="USD" />);
    expect(screen.getByText("$123.45")).toBeInTheDocument();
  });

  it("formats as percentage", () => {
    render(<NumberField value={0.1234} percentage />);
    expect(screen.getByText("12.34%")).toBeInTheDocument();
  });

  it("formats as percentage without sign when showPercentageSign is false", () => {
    render(
      <NumberField value={0.1234} percentage showPercentageSign={false} />,
    );
    expect(screen.getByText("12.34")).toBeInTheDocument();
  });

  it("formats as scientific notation", () => {
    render(<NumberField value={1234567} scientific />);
    expect(screen.getByText("1.23e+6")).toBeInTheDocument();
  });

  it("formats as compact notation for thousands", () => {
    render(<NumberField value={1234} compact />);
    expect(screen.getByText("1.2K")).toBeInTheDocument();
  });

  it("formats as compact notation for millions", () => {
    render(<NumberField value={1234567} compact />);
    expect(screen.getByText("1.2M")).toBeInTheDocument();
  });

  it("formats as compact notation for billions", () => {
    render(<NumberField value={1234567890} compact />);
    expect(screen.getByText("1.2B")).toBeInTheDocument();
  });

  it("formats as compact notation for trillions", () => {
    render(<NumberField value={1234567890000} compact />);
    expect(screen.getByText("1.2T")).toBeInTheDocument();
  });

  it("handles zero correctly", () => {
    render(<NumberField value={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("handles very small numbers correctly", () => {
    render(<NumberField value={0.000001} decimals={6} />);
    expect(screen.getByText("0.000001")).toBeInTheDocument();
  });

  it("handles very large numbers correctly", () => {
    render(<NumberField value={999999999999} showThousandsSeparator />);
    expect(screen.getByText("999,999,999,999")).toBeInTheDocument();
  });

  it("handles NaN gracefully", () => {
    render(<NumberField value={NaN} />);
    expect(screen.getByText("Invalid Number")).toBeInTheDocument();
  });

  it("handles Infinity gracefully", () => {
    render(<NumberField value={Infinity} />);
    expect(screen.getByText("Invalid Number")).toBeInTheDocument();
  });

  it("handles negative Infinity gracefully", () => {
    render(<NumberField value={-Infinity} />);
    expect(screen.getByText("Invalid Number")).toBeInTheDocument();
  });

  it("applies clickable styles when clickable is true", () => {
    render(<NumberField value={123.45} clickable />);
    const numberField = screen.getByText("123.45").closest("div");
    expect(numberField).toHaveClass("cursor-pointer", "hover:opacity-80");
  });

  it("calls onClick when clicked and clickable is true", () => {
    const handleClick = jest.fn();
    render(<NumberField value={123.45} clickable onClick={handleClick} />);
    const numberField = screen.getByText("123.45").closest("div");
    fireEvent.click(numberField!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows copy button when showCopyButton is true", () => {
    render(<NumberField value={123.45} showCopyButton />);
    expect(screen.getByTitle("Copy to clipboard")).toBeInTheDocument();
  });

  it("does not show copy button when showCopyButton is false", () => {
    render(<NumberField value={123.45} showCopyButton={false} />);
    expect(screen.queryByTitle("Copy to clipboard")).not.toBeInTheDocument();
  });

  it("copies number to clipboard when copy button is clicked", async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText: mockWriteText });

    render(<NumberField value={123.45} showCopyButton />);
    const copyButton = screen.getByTitle("Copy to clipboard");

    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith("123.45");
    });
  });

  it("shows success indicator after copying", async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText: mockWriteText });

    render(<NumberField value={123.45} showCopyButton />);
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

    render(<NumberField value={123.45} showCopyButton />);
    const copyButton = screen.getByTitle("Copy to clipboard");

    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to copy number:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<NumberField value={123.45} ref={ref} />);
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
        <NumberField value={123.45} variant={variant as any} />,
      );
      expect(screen.getByText("123.45")).toBeInTheDocument();
      unmount();
    });
  });

  it("renders with all sizes", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"];

    sizes.forEach((size) => {
      const { unmount } = render(
        <NumberField value={123.45} size={size as any} />,
      );
      expect(screen.getByText("123.45")).toBeInTheDocument();
      unmount();
    });
  });

  it("renders with all weights", () => {
    const weights = ["normal", "medium", "semibold", "bold", "extrabold"];

    weights.forEach((weight) => {
      const { unmount } = render(
        <NumberField value={123.45} weight={weight as any} />,
      );
      expect(screen.getByText("123.45")).toBeInTheDocument();
      unmount();
    });
  });

  it("renders with all alignments", () => {
    const alignments = ["left", "center", "right"];

    alignments.forEach((align) => {
      const { unmount } = render(
        <NumberField value={123.45} align={align as any} />,
      );
      expect(screen.getByText("123.45")).toBeInTheDocument();
      unmount();
    });
  });

  it("combines multiple formatting options correctly", () => {
    render(
      <NumberField
        value={1234.56}
        prefix="Total: "
        suffix=" items"
        showThousandsSeparator
        decimals={1}
      />,
    );
    expect(screen.getByText("Total: 1,234.6 items")).toBeInTheDocument();
  });

  it("prioritizes compact notation over thousands separator", () => {
    render(<NumberField value={1234} compact showThousandsSeparator />);
    expect(screen.getByText("1.2K")).toBeInTheDocument();
  });

  it("prioritizes scientific notation over compact notation", () => {
    render(<NumberField value={1234} scientific compact />);
    expect(screen.getByText("1.23e+3")).toBeInTheDocument();
  });
});
