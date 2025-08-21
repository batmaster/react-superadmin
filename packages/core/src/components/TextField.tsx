import React from "react";
import { cn } from "../utils/cn";

export type TextFormat = "plain" | "rich" | "markdown";

export interface TextFieldProps {
  /** The text content to display */
  children?: React.ReactNode;

  /** The text value to display (alternative to children) */
  value?: string;

  /** Format of the text content */
  format?: TextFormat;

  /** Maximum number of characters to display before truncating */
  maxLength?: number;

  /** Whether to show ellipsis when text is truncated */
  showEllipsis?: boolean;

  /** Whether to detect and render links automatically */
  detectLinks?: boolean;

  /** Whether to open links in a new tab */
  openLinksInNewTab?: boolean;

  /** CSS class names for the container */
  className?: string;

  /** CSS class names for the text content */
  textClassName?: string;

  /** Whether the field is required (for accessibility) */
  required?: boolean;

  /** Custom renderer for the text content */
  render?: (text: string) => React.ReactNode;

  /** Whether to preserve line breaks */
  preserveLineBreaks?: boolean;

  /** Whether to preserve whitespace */
  preserveWhitespace?: boolean;

  /** Custom styling for links */
  linkClassName?: string;

  /** Whether to show a tooltip on truncated text */
  showTooltipOnTruncate?: boolean;

  /** Custom tooltip content */
  tooltipContent?: string;
}

/**
 * A versatile text field component that supports different text formats,
 * truncation, link detection, and accessibility features.
 *
 * @example
 * // Basic text display
 * <TextField value="This is some text content" />
 *
 * @example
 * // With truncation and ellipsis
 * <TextField
 *   value="Very long text that will be truncated"
 *   maxLength={20}
 *   showEllipsis
 * />
 *
 * @example
 * // With link detection
 * <TextField
 *   value="Visit https://example.com for more info"
 *   detectLinks
 *   openLinksInNewTab
 * />
 *
 * @example
 * // With custom rendering
 * <TextField
 *   value="Custom formatted text"
 *   render={(text) => <span className="font-bold">{text}</span>}
 * />
 */
export const TextField: React.FC<TextFieldProps> = ({
  children,
  value,
  format = "plain",
  maxLength,
  showEllipsis = true,
  detectLinks = false,
  openLinksInNewTab = true,
  className,
  textClassName,
  required = false,
  render,
  preserveLineBreaks = false,
  preserveWhitespace = false,
  linkClassName,
  showTooltipOnTruncate = false,
  tooltipContent,
}) => {
  // Determine the text content
  const textContent = children || value || "";
  const textString =
    typeof textContent === "string" ? textContent : String(textContent || "");

  // Handle truncation
  const isTruncated = maxLength && textString.length > maxLength;
  const displayText = isTruncated
    ? textString.substring(0, maxLength) + (showEllipsis ? "..." : "")
    : textString;

  // Link detection regex
  const linkRegex = /(https?:\/\/[^\s]+)/g;

  // Process text based on format
  const processText = (text: string): React.ReactNode => {
    if (render) {
      return render(text);
    }

    if (format === "markdown") {
      // Basic markdown processing (can be enhanced with a markdown library)
      return processMarkdown(text);
    }

    if (format === "rich") {
      // Rich text processing (can be enhanced with a rich text library)
      return processRichText(text);
    }

    // Plain text with link detection
    if (detectLinks) {
      return processLinks(text);
    }

    return text;
  };

  // Process markdown text
  const processMarkdown = (text: string): React.ReactNode => {
    // Basic markdown processing - this can be enhanced with a proper markdown library
    const lines = text.split("\n");

    return lines.map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-2xl font-bold mb-2">
            {line.substring(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-xl font-semibold mb-2">
            {line.substring(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-lg font-medium mb-1">
            {line.substring(4)}
          </h3>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-4">
            {line.substring(2)}
          </li>
        );
      }
      if (line.startsWith("1. ")) {
        return (
          <li key={index} className="ml-4">
            {line.substring(3)}
          </li>
        );
      }
      if (line.match(/^\d+\. /)) {
        return (
          <li key={index} className="ml-4">
            {line.replace(/^\d+\. /, "")}
          </li>
        );
      }
      if (line.trim() === "") {
        return <br key={index} />;
      }
      return (
        <p key={index} className="mb-2">
          {processLinks(line)}
        </p>
      );
    });
  };

  // Process rich text
  const processRichText = (text: string): React.ReactNode => {
    // Basic rich text processing - this can be enhanced with a proper rich text library
    return (
      <div className="rich-text" dangerouslySetInnerHTML={{ __html: text }} />
    );
  };

  // Process links in text
  const processLinks = (text: string): React.ReactNode => {
    const parts = text.split(linkRegex);

    return parts.map((part, index) => {
      if (linkRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target={openLinksInNewTab ? "_blank" : undefined}
            rel={openLinksInNewTab ? "noopener noreferrer" : undefined}
            className={cn(
              "text-blue-600 hover:text-blue-800 underline",
              linkClassName,
            )}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Determine if we need a tooltip
  const needsTooltip = showTooltipOnTruncate && isTruncated;
  const tooltipText = tooltipContent || textString;

  // Container classes
  const containerClasses = cn(
    "text-field",
    preserveLineBreaks && "whitespace-pre-line",
    preserveWhitespace && "whitespace-pre-wrap",
    className,
  );

  // Text content classes
  const textClasses = cn("text-content", textClassName);

  return (
    <div
      className={containerClasses}
      data-testid="text-field"
      aria-required={required || undefined}
    >
      {needsTooltip ? (
        <div className="relative group" title={tooltipText}>
          <div className={textClasses}>{processText(displayText)}</div>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
            {tooltipText}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      ) : (
        <div className={textClasses}>{processText(displayText)}</div>
      )}
    </div>
  );
};

TextField.displayName = "TextField";
