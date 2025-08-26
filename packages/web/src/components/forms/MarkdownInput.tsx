import {
  Bold,
  Code,
  Eye,
  EyeOff,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "../../utils/cn";

export interface MarkdownInputProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "onChange" | "value" | "autoSave"
  > {
  /** Current markdown value */
  value?: string;

  /** Callback when markdown value changes */
  onChange: (value: string) => void;

  /** Label text for the input */
  label?: string;

  /** Helper text below the input */
  helperText?: string;

  /** Error message to display */
  error?: string;

  /** Whether the field is required */
  required?: boolean;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Input size variant */
  inputSize?: "sm" | "md" | "lg";

  /** Placeholder text */
  placeholder?: string;

  /** Whether to show a loading state */
  loading?: boolean;

  /** Whether to show the preview panel */
  showPreview?: boolean;

  /** Whether to show the toolbar */
  showToolbar?: boolean;

  /** Whether to show character count */
  showCharacterCount?: boolean;

  /** Maximum character limit */
  maxLength?: number;

  /** Whether to show line numbers */
  showLineNumbers?: boolean;

  /** Whether to enable spell check */
  spellCheck?: boolean;

  /** Whether to auto-save content */
  autoSave?: boolean;

  /** Auto-save interval in milliseconds */
  autoSaveInterval?: number;

  /** Custom toolbar items */
  toolbarItems?: Array<{
    icon: React.ReactNode;
    title: string;
    action: (text: string, selection: { start: number; end: number }) => string;
  }>;

  /** Custom class names */
  className?: string;

  /** Custom class names for the textarea element */
  textareaClassName?: string;

  /** Custom class names for the label */
  labelClassName?: string;

  /** Custom class names for the toolbar */
  toolbarClassName?: string;

  /** Custom class names for the preview */
  previewClassName?: string;

  /** Whether to show markdown help */
  showHelp?: boolean;

  /** Whether to enable fullscreen mode */
  fullscreen?: boolean;

  /** Whether to show syntax highlighting */
  syntaxHighlighting?: boolean;

  /** Whether to show word count */
  showWordCount?: boolean;

  /** Whether to show reading time estimate */
  showReadingTime?: boolean;
}

export const MarkdownInput = forwardRef<
  HTMLTextAreaElement,
  MarkdownInputProps
>(
  (
    {
      value = "",
      onChange,
      label,
      helperText,
      error,
      required = false,
      disabled = false,
      inputSize = "md",
      placeholder = "Write your markdown here...",
      loading = false,
      showPreview = true,
      showToolbar = true,
      showCharacterCount = false,
      maxLength,
      showLineNumbers = false,
      spellCheck = true,
      autoSave = false,
      autoSaveInterval = 30000,
      toolbarItems = [],
      className,
      textareaClassName,
      labelClassName,
      toolbarClassName,
      previewClassName,
      showHelp = false,
      fullscreen = false,
      syntaxHighlighting = false,
      showWordCount = false,
      showReadingTime = false,
      id,
      ...props
    },
    ref,
  ) => {
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(fullscreen);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [selection, setSelection] = useState({ start: 0, end: 0 });

    // Expose the internal textarea ref to parent via forwarded ref
    useImperativeHandle(ref, () => textareaRef.current!);

    const inputId = id || `markdown-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const isDisabled = disabled || loading;

    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-5 py-4 text-lg",
    };

    const baseTextareaClasses = cn(
      "block w-full rounded-md border shadow-sm transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-0",
      "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
      "placeholder-gray-400 font-mono",
      sizeClasses[inputSize],
      hasError
        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-primary-500 focus:border-primary-500",
      isDisabled && "opacity-60",
      textareaClassName,
    );

    // Default toolbar items
    const defaultToolbarItems = [
      {
        icon: <Bold className="w-4 h-4" />,
        title: "Bold",
        action: (text: string, sel: { start: number; end: number }) => {
          const before = text.substring(0, sel.start);
          const selected = text.substring(sel.start, sel.end);
          const after = text.substring(sel.end);
          return `${before}**${selected}**${after}`;
        },
      },
      {
        icon: <Italic className="w-4 h-4" />,
        title: "Italic",
        action: (text: string, sel: { start: number; end: number }) => {
          const before = text.substring(0, sel.start);
          const selected = text.substring(sel.start, sel.end);
          const after = text.substring(sel.end);
          return `${before}*${selected}*${after}`;
        },
      },
      {
        icon: <List className="w-4 h-4" />,
        title: "Unordered List",
        action: (text: string, sel: { start: number; end: number }) => {
          const before = text.substring(0, sel.start);
          const selected = text.substring(sel.start, sel.end);
          const after = text.substring(sel.end);
          const lines = selected.split("\n").map((line) => `- ${line}`);
          return `${before}${lines.join("\n")}${after}`;
        },
      },
      {
        icon: <ListOrdered className="w-4 h-4" />,
        title: "Ordered List",
        action: (text: string, sel: { start: number; end: number }) => {
          const before = text.substring(0, sel.start);
          const selected = text.substring(sel.start, sel.end);
          const after = text.substring(sel.end);
          const lines = selected
            .split("\n")
            .map((line, index) => `${index + 1}. ${line}`);
          return `${before}${lines.join("\n")}${after}`;
        },
      },
      {
        icon: <Quote className="w-4 h-4" />,
        title: "Blockquote",
        action: (text: string, sel: { start: number; end: number }) => {
          const before = text.substring(0, sel.start);
          const selected = text.substring(sel.start, sel.end);
          const after = text.substring(sel.end);
          const lines = selected.split("\n").map((line) => `> ${line}`);
          return `${before}${lines.join("\n")}${after}`;
        },
      },
      {
        icon: <Code className="w-4 h-4" />,
        title: "Code Block",
        action: (text: string, sel: { start: number; end: number }) => {
          const before = text.substring(0, sel.start);
          const selected = text.substring(sel.start, sel.end);
          const after = text.substring(sel.end);
          return `${before}\`\`\`\n${selected}\n\`\`\`${after}`;
        },
      },
      {
        icon: <Link className="w-4 h-4" />,
        title: "Link",
        action: (text: string, sel: { start: number; end: number }) => {
          const before = text.substring(0, sel.start);
          const selected = text.substring(sel.start, sel.end);
          const after = text.substring(sel.end);
          return `${before}[${selected}](url)${after}`;
        },
      },
      {
        icon: <Image className="w-4 h-4" />,
        title: "Image",
        action: (text: string, sel: { start: number; end: number }) => {
          const before = text.substring(0, sel.start);
          const selected = text.substring(sel.start, sel.end);
          const after = text.substring(sel.end);
          return `${before}![${selected}](image-url)${after}`;
        },
      },
    ];

    const allToolbarItems = [...defaultToolbarItems, ...toolbarItems];

    // Handle textarea change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
    };

    // Handle toolbar action
    const handleToolbarAction = useCallback(
      (
        action: (text: string, sel: { start: number; end: number }) => string,
      ) => {
        if (!textareaRef.current) return;

        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = action(value, { start, end });

        onChange(newText);

        // Restore focus and selection
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(start, end);
          }
        }, 0);
      },
      [value, onChange],
    );

    // Handle selection change
    const handleSelect = () => {
      if (textareaRef.current) {
        setSelection({
          start: textareaRef.current.selectionStart,
          end: textareaRef.current.selectionEnd,
        });
      }
    };

    // Toggle preview mode
    const togglePreview = () => {
      setIsPreviewMode(!isPreviewMode);
    };

    // Toggle fullscreen
    const toggleFullscreen = () => {
      setIsFullscreen(!isFullscreen);
    };

    // Get word count
    const getWordCount = () => {
      return value
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
    };

    // Get reading time estimate
    const getReadingTime = () => {
      const words = getWordCount();
      const wordsPerMinute = 200;
      const minutes = Math.ceil(words / wordsPerMinute);
      return minutes;
    };

    // Render markdown preview (basic implementation)
    const renderPreview = () => {
      if (!value)
        return (
          <div className="italic text-gray-400">No content to preview</div>
        );

      // Basic markdown rendering (in a real implementation, you'd use a markdown parser)
      const html = value
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/^- (.*$)/gim, "<li>$1</li>")
        .replace(/^(\d+)\. (.*$)/gim, "<li>$2</li>")
        .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
        .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\n/g, "<br>");

      return (
        <div
          className="max-w-none prose prose-sm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    };

    return (
      <div className={cn("w-full", className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-gray-700 mb-2",
              hasError && "text-red-700",
              isDisabled && "text-gray-500",
              labelClassName,
            )}
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        {/* Toolbar */}
        {showToolbar && (
          <div
            className={cn(
              "flex gap-1 items-center p-2 bg-gray-50 rounded-t-md border border-gray-200",
              toolbarClassName,
            )}
          >
            {allToolbarItems.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleToolbarAction(item.action)}
                disabled={isDisabled}
                className={cn(
                  "p-2 text-gray-600 rounded transition-colors duration-200 hover:text-gray-900 hover:bg-gray-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                )}
                title={item.title}
              >
                {item.icon}
              </button>
            ))}

            <div className="flex-1" />

            {showPreview && (
              <button
                type="button"
                onClick={togglePreview}
                disabled={isDisabled}
                className={cn(
                  "p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  isPreviewMode && "bg-gray-200 text-gray-900",
                )}
                title={isPreviewMode ? "Hide Preview" : "Show Preview"}
              >
                {isPreviewMode ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        )}

        {/* Main Content */}
        <div
          className={cn(
            "border border-gray-300 rounded-md",
            showToolbar && "rounded-t-none",
            hasError && "border-red-300",
          )}
        >
          {isPreviewMode ? (
            <div
              className={cn(
                "overflow-auto p-4 bg-white min-h-[200px]",
                previewClassName,
              )}
            >
              {renderPreview()}
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              id={inputId}
              value={value}
              onChange={handleChange}
              onSelect={handleSelect}
              disabled={isDisabled}
              required={required}
              placeholder={placeholder}
              maxLength={maxLength}
              spellCheck={spellCheck}
              className={cn(
                baseTextareaClasses,
                "rounded-t-none border-0 resize-none",
                showLineNumbers && "pl-12",
              )}
              rows={8}
              aria-invalid={hasError}
              aria-describedby={cn(
                helperText && `${inputId}-helper`,
                error && `${inputId}-error`,
                showCharacterCount && `${inputId}-count`,
              )}
              {...props}
            />
          )}
        </div>

        {/* Helper Text, Error, and Stats */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex-1">
            {helperText && !hasError && (
              <p id={`${inputId}-helper`} className="text-sm text-gray-500">
                {helperText}
              </p>
            )}

            {error && (
              <p id={`${inputId}-error`} className="text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-4 items-center text-xs text-gray-500">
            {/* Character Count */}
            {showCharacterCount && maxLength && (
              <span
                id={`${inputId}-count`}
                className={cn(
                  value.length > maxLength * 0.8 && "text-yellow-600",
                  value.length > maxLength * 0.95 && "text-red-600",
                )}
              >
                {value.length}/{maxLength}
              </span>
            )}

            {/* Word Count */}
            {showWordCount && <span>{getWordCount()} words</span>}

            {/* Reading Time */}
            {showReadingTime && <span>~{getReadingTime()} min read</span>}
          </div>
        </div>

        {/* Markdown Help */}
        {showHelp && (
          <details className="mt-4">
            <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
              Markdown Help
            </summary>
            <div className="p-3 mt-2 text-xs text-gray-600 bg-gray-50 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Text:</strong>
                  <br />
                  **bold** = <strong>bold</strong>
                  <br />
                  *italic* = <em>italic</em>
                  <br />
                  `code` = <code>code</code>
                </div>
                <div>
                  <strong>Lists:</strong>
                  <br />- item = bullet list
                  <br />
                  1. item = numbered list
                  <br />
                  &gt; quote = blockquote
                </div>
              </div>
            </div>
          </details>
        )}
      </div>
    );
  },
);

MarkdownInput.displayName = "MarkdownInput";
