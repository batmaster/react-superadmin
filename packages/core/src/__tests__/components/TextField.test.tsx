import { render, screen } from "@testing-library/react";
import React from "react";
import { TextField } from "../../components/TextField";

describe("TextField Component", () => {
  describe("Basic Rendering", () => {
    it("renders text content via value prop", () => {
      render(<TextField value="Hello World" />);
      expect(screen.getByTestId("text-field")).toBeInTheDocument();
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    it("renders text content via children prop", () => {
      render(<TextField>Hello World</TextField>);
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    it("renders empty string when no content provided", () => {
      render(<TextField />);
      expect(screen.getByTestId("text-field")).toBeInTheDocument();
      const textContainer = screen
        .getByTestId("text-field")
        .querySelector(".text-content");
      expect(textContainer).toBeInTheDocument();
      expect(textContainer?.textContent).toBe("");
    });

    it("converts non-string children to string", () => {
      render(<TextField>{123}</TextField>);
      expect(screen.getByText("123")).toBeInTheDocument();
    });
  });

  describe("Text Formatting", () => {
    it("renders plain text by default", () => {
      render(<TextField value="Plain text content" />);
      expect(screen.getByText("Plain text content")).toBeInTheDocument();
    });

    it("renders markdown text when format is markdown", () => {
      const markdownText = `# Heading 1
## Heading 2
- List item 1
- List item 2

1. Numbered item 1
2. Numbered item 2`;

      render(<TextField value={markdownText} format="markdown" />);

      expect(screen.getByText("Heading 1")).toBeInTheDocument();
      expect(screen.getByText("Heading 2")).toBeInTheDocument();
      expect(screen.getByText("List item 1")).toBeInTheDocument();
      expect(screen.getByText("List item 2")).toBeInTheDocument();
      expect(screen.getByText("Numbered item 1")).toBeInTheDocument();
      expect(screen.getByText("Numbered item 2")).toBeInTheDocument();
    });

    it("renders rich text when format is rich", () => {
      const richText = "<strong>Bold text</strong> and <em>italic text</em>";
      render(<TextField value={richText} format="rich" />);

      const richTextContainer = screen
        .getByTestId("text-field")
        .querySelector(".rich-text");
      expect(richTextContainer).toBeInTheDocument();
    });

    it("uses custom renderer when provided", () => {
      const customRender = (text: string) => (
        <span className="custom-text" data-testid="custom-render">
          {text.toUpperCase()}
        </span>
      );

      render(<TextField value="hello world" render={customRender} />);

      const customElement = screen.getByTestId("custom-render");
      expect(customElement).toBeInTheDocument();
      expect(customElement).toHaveTextContent("HELLO WORLD");
      expect(customElement).toHaveClass("custom-text");
    });
  });

  describe("Text Truncation", () => {
    it("truncates text when maxLength is provided", () => {
      render(
        <TextField
          value="This is a very long text that should be truncated"
          maxLength={20}
        />,
      );

      const textContainer = screen
        .getByTestId("text-field")
        .querySelector(".text-content");
      expect(textContainer).toHaveTextContent("This is a very long ...");
    });

    it("truncates without ellipsis when showEllipsis is false", () => {
      render(
        <TextField
          value="This is a very long text that should be truncated"
          maxLength={20}
          showEllipsis={false}
        />,
      );

      expect(screen.getByText("This is a very long")).toBeInTheDocument();
    });

    it("does not truncate when text is shorter than maxLength", () => {
      render(<TextField value="Short text" maxLength={20} />);

      expect(screen.getByText("Short text")).toBeInTheDocument();
    });

    it("shows tooltip on truncated text when enabled", () => {
      const longText =
        "This is a very long text that should be truncated and show a tooltip";
      render(
        <TextField
          value={longText}
          maxLength={20}
          showTooltipOnTruncate={true}
        />,
      );

      const tooltipContainer = screen
        .getByTestId("text-field")
        .querySelector(".group");
      expect(tooltipContainer).toBeInTheDocument();
    });
  });

  describe("Link Detection", () => {
    it("detects and renders links when detectLinks is true", () => {
      render(
        <TextField
          value="Visit https://example.com for more information"
          detectLinks={true}
        />,
      );

      const link = screen.getByText("https://example.com");
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", "https://example.com");
    });

    it("opens links in new tab when openLinksInNewTab is true", () => {
      render(
        <TextField
          value="Visit https://example.com"
          detectLinks={true}
          openLinksInNewTab={true}
        />,
      );

      const link = screen.getByText("https://example.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("opens links in same tab when openLinksInNewTab is false", () => {
      render(
        <TextField
          value="Visit https://example.com"
          detectLinks={true}
          openLinksInNewTab={false}
        />,
      );

      const link = screen.getByText("https://example.com");
      expect(link).not.toHaveAttribute("target");
      expect(link).not.toHaveAttribute("rel");
    });

    it("applies custom link styling when linkClassName is provided", () => {
      render(
        <TextField
          value="Visit https://example.com"
          detectLinks={true}
          linkClassName="custom-link"
        />,
      );

      const link = screen.getByText("https://example.com");
      expect(link).toHaveClass("custom-link");
    });

    it("detects multiple links in text", () => {
      render(
        <TextField
          value="Visit https://example1.com and https://example2.com"
          detectLinks={true}
        />,
      );

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute("href", "https://example1.com");
      expect(links[1]).toHaveAttribute("href", "https://example2.com");
    });
  });

  describe("Whitespace and Line Breaks", () => {
    it("preserves line breaks when preserveLineBreaks is true", () => {
      render(
        <TextField value="Line 1\nLine 2\nLine 3" preserveLineBreaks={true} />,
      );

      const container = screen.getByTestId("text-field");
      expect(container).toHaveClass("whitespace-pre-line");
    });

    it("preserves whitespace when preserveWhitespace is true", () => {
      render(<TextField value="  Indented text  " preserveWhitespace={true} />);

      const container = screen.getByTestId("text-field");
      expect(container).toHaveClass("whitespace-pre-wrap");
    });
  });

  describe("Accessibility", () => {
    it("sets aria-required attribute when required is true", () => {
      render(<TextField value="Required field" required={true} />);

      const field = screen.getByTestId("text-field");
      expect(field).toHaveAttribute("aria-required", "true");
    });

    it("does not set aria-required attribute when required is false", () => {
      render(<TextField value="Optional field" required={false} />);

      const field = screen.getByTestId("text-field");
      expect(field).not.toHaveAttribute("aria-required");
    });

    it("sets aria-required attribute to false by default", () => {
      render(<TextField value="Default field" />);

      const field = screen.getByTestId("text-field");
      expect(field).not.toHaveAttribute("aria-required");
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className to container", () => {
      render(
        <TextField value="Custom styled text" className="custom-container" />,
      );

      const container = screen.getByTestId("text-field");
      expect(container).toHaveClass("custom-container");
    });

    it("applies custom textClassName to text content", () => {
      render(
        <TextField value="Custom styled text" textClassName="custom-text" />,
      );

      const textContainer = screen
        .getByTestId("text-field")
        .querySelector(".text-content");
      expect(textContainer).toHaveClass("custom-text");
    });
  });

  describe("Edge Cases", () => {
    it("handles null and undefined values gracefully", () => {
      render(<TextField value={null as any} />);
      const textContainer1 = screen
        .getByTestId("text-field")
        .querySelector(".text-content");
      expect(textContainer1?.textContent).toBe("");

      render(<TextField value={undefined as any} />);
      const textContainer2 = screen
        .getAllByTestId("text-field")[1]
        .querySelector(".text-content");
      expect(textContainer2?.textContent).toBe("");
    });

    it("handles very long text without truncation", () => {
      const veryLongText = "a".repeat(10000);
      render(<TextField value={veryLongText} />);

      expect(screen.getByText(veryLongText)).toBeInTheDocument();
    });

    it("handles text with special characters", () => {
      const specialText = "Text with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?";
      render(<TextField value={specialText} />);

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it("handles text with HTML-like content when not in rich format", () => {
      const htmlLikeText = "<div>This should not be rendered as HTML</div>";
      render(<TextField value={htmlLikeText} />);

      expect(screen.getByText(htmlLikeText)).toBeInTheDocument();
    });
  });

  describe("Markdown Processing", () => {
    it("processes markdown headings correctly", () => {
      const markdown = `# Main Heading
## Sub Heading
### Sub Sub Heading`;

      render(<TextField value={markdown} format="markdown" />);

      expect(screen.getByText("Main Heading")).toBeInTheDocument();
      expect(screen.getByText("Sub Heading")).toBeInTheDocument();
      expect(screen.getByText("Sub Sub Heading")).toBeInTheDocument();
    });

    it("processes markdown lists correctly", () => {
      const markdown = `- Item 1
- Item 2
1. Numbered 1
2. Numbered 2`;

      render(<TextField value={markdown} format="markdown" />);

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Numbered 1")).toBeInTheDocument();
      expect(screen.getByText("Numbered 2")).toBeInTheDocument();
    });

    it("processes empty lines in markdown", () => {
      const markdown = `Line 1

Line 2`;

      render(<TextField value={markdown} format="markdown" />);

      expect(screen.getByText("Line 1")).toBeInTheDocument();
      expect(screen.getByText("Line 2")).toBeInTheDocument();
    });
  });

  describe("Tooltip Functionality", () => {
    it("shows custom tooltip content when provided", () => {
      const longText = "This is a very long text that should be truncated";
      const customTooltip = "Custom tooltip content";

      render(
        <TextField
          value={longText}
          maxLength={20}
          showTooltipOnTruncate={true}
          tooltipContent={customTooltip}
        />,
      );

      const tooltipContainer = screen
        .getByTestId("text-field")
        .querySelector(".group");
      expect(tooltipContainer).toBeInTheDocument();
    });

    it("uses full text as tooltip when no custom content provided", () => {
      const longText = "This is a very long text that should be truncated";

      render(
        <TextField
          value={longText}
          maxLength={20}
          showTooltipOnTruncate={true}
        />,
      );

      const tooltipContainer = screen
        .getByTestId("text-field")
        .querySelector(".group");
      expect(tooltipContainer).toBeInTheDocument();
    });
  });
});
