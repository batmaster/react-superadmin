import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "../../utils/cn";

export interface RichTextInputProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "onChange" | "value" | "autoSave"
  > {
  /** Current rich text value */
  value?: string;

  /** Change handler */
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

  /** Loading text to display */
  loadingText?: string;

  /** Whether to show the preview mode */
  showPreview?: boolean;

  /** Whether to show the toolbar */
  showToolbar?: boolean;

  /** Whether to show character count */
  showCharacterCount?: boolean;

  /** Maximum character length */
  maxLength?: number;

  /** Whether to show line numbers */
  showLineNumbers?: boolean;

  /** Whether to enable spell checking */
  spellCheck?: boolean;

  /** Whether to enable auto-save */
  autoSave?: boolean;

  /** Auto-save interval in milliseconds */
  autoSaveInterval?: number;

  /** Custom toolbar items */
  toolbarItems?: string[];

  /** Custom class names */
  className?: string;
  inputClassName?: string;
  toolbarClassName?: string;
  previewClassName?: string;
  editorClassName?: string;

  /** Whether to show help text */
  showHelp?: boolean;

  /** Whether to enable fullscreen mode */
  fullscreen?: boolean;

  /** Whether to enable syntax highlighting */
  syntaxHighlighting?: boolean;

  /** Whether to show word count */
  showWordCount?: boolean;

  /** Whether to show reading time estimate */
  showReadingTime?: boolean;
}

/**
 * A rich text input component with a toolbar for formatting options.
 * Provides a comprehensive rich text editing experience with preview mode.
 *
 * @example
 * // Basic usage
 * <RichTextInput
 *   label="Content"
 *   value={content}
 *   onChange={setContent}
 *   placeholder="Enter your content..."
 * />
 *
 * @example
 * // With preview mode
 * <RichTextInput
 *   label="Article"
 *   value={article}
 *   onChange={setArticle}
 *   showPreview={true}
 *   showToolbar={true}
 * />
 */
export const RichTextInput: React.FC<RichTextInputProps> = ({
  value = "",
  onChange,
  label,
  helperText,
  error,
  required = false,
  disabled = false,
  inputSize = "md",
  placeholder = "Enter your content...",
  loading = false,
  loadingText = "Loading...",
  showPreview = false,
  showToolbar = true,
  showCharacterCount = false,
  maxLength,
  showLineNumbers = false,
  spellCheck = true,
  autoSave = false,
  autoSaveInterval = 30000,
  toolbarItems = [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "list",
    "listOrdered",
    "quote",
    "code",
    "link",
    "image",
    "align",
  ],
  className,
  inputClassName,
  toolbarClassName,
  previewClassName,
  editorClassName,
  showHelp = false,
  fullscreen = false,
  showWordCount = false,
  showReadingTime = false,
  id,
  ...props
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  const inputId = id || `richtext-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  const isDisabled = disabled || loading;

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-3 text-lg",
  };

  const baseClasses = cn(
    "block w-full rounded-md border shadow-sm transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-0",
    "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
    "placeholder-gray-400",
    sizeClasses[inputSize],
    hasError
      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
    inputClassName,
  );

  // Calculate word count and reading time
  useEffect(() => {
    if (showWordCount || showReadingTime) {
      const words = value
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      const count = words.length;
      setWordCount(count);

      if (showReadingTime) {
        // Average reading speed: 200-250 words per minute
        const estimatedTime = Math.ceil(count / 225);
        setReadingTime(estimatedTime);
      }
    }
  }, [value, showWordCount, showReadingTime]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && value) {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }

      const timer = setTimeout(() => {
        // Trigger auto-save (this could be a callback or local storage)
        console.log("Auto-saving content...");
      }, autoSaveInterval);

      setAutoSaveTimer(timer);

      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [value, autoSave, autoSaveInterval]);

  // Cleanup auto-save timer
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, []);

  const handleFormat = useCallback(
    (command: string, value?: string) => {
      if (!textareaRef.current || isDisabled) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value || textarea.value.substring(start, end);

      let newText = "";
      let newCursorPos = start;

      switch (command) {
        case "bold":
          newText = `**${selectedText}**`;
          newCursorPos = start + 2;
          break;
        case "italic":
          newText = `*${selectedText}*`;
          newCursorPos = start + 1;
          break;
        case "underline":
          newText = `<u>${selectedText}</u>`;
          newCursorPos = start + 3;
          break;
        case "strikethrough":
          newText = `~~${selectedText}~~`;
          newCursorPos = start + 2;
          break;
        case "list":
          newText = `- ${selectedText}`;
          newCursorPos = start + 2;
          break;
        case "listOrdered":
          newText = `1. ${selectedText}`;
          newCursorPos = start + 3;
          break;
        case "quote":
          newText = `> ${selectedText}`;
          newCursorPos = start + 2;
          break;
        case "code":
          newText = selectedText.includes("\n")
            ? `\`\`\`\n${selectedText}\n\`\`\``
            : `\`${selectedText}\``;
          newCursorPos = start + (selectedText.includes("\n") ? 4 : 1);
          break;
        case "link": {
          const url = prompt("Enter URL:");
          if (url) {
            newText = `[${selectedText}](${url})`;
            newCursorPos = start + newText.length;
          } else {
            return;
          }
          break;
        }
        case "image": {
          const imageUrl = prompt("Enter image URL:");
          const altText = prompt("Enter alt text:");
          if (imageUrl) {
            newText = `![${altText || "Image"}](${imageUrl})`;
            newCursorPos = start + newText.length;
          } else {
            return;
          }
          break;
        }
        case "alignLeft": {
          newText = `<div style="text-align: left;">${selectedText}</div>`;
          newCursorPos = start + 35;
          break;
        }
        case "alignCenter": {
          newText = `<div style="text-align: center;">${selectedText}</div>`;
          newCursorPos = start + 37;
          break;
        }
        case "alignRight": {
          newText = `<div style="text-align: right;">${selectedText}</div>`;
          newCursorPos = start + 36;
          break;
        }
        case "alignJustify": {
          newText = `<div style="text-align: justify;">${selectedText}</div>`;
          break;
        }
        default:
          return;
      }

      const newValue =
        textarea.value.substring(0, start) +
        newText +
        textarea.value.substring(end);
      onChange(newValue);

      // Set cursor position after format is applied
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          textareaRef.current.focus();
        }
      }, 0);
    },
    [onChange, isDisabled],
  );

  const handleUndo = useCallback(() => {
    if (textareaRef.current) {
      document.execCommand("undo");
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (textareaRef.current) {
      document.execCommand("redo");
    }
  }, []);

  const togglePreview = useCallback(() => {
    setIsPreviewMode(!isPreviewMode);
  }, [isPreviewMode]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const renderToolbar = () => {
    if (!showToolbar) return null;

    const toolbarButtons = [
      { command: "bold", icon: Bold, label: "Bold", shortcut: "Ctrl+B" },
      { command: "italic", icon: Italic, label: "Italic", shortcut: "Ctrl+I" },
      {
        command: "underline",
        icon: Underline,
        label: "Underline",
        shortcut: "Ctrl+U",
      },
      { command: "strikethrough", icon: Strikethrough, label: "Strikethrough" },
      { command: "list", icon: List, label: "Bullet List" },
      { command: "listOrdered", icon: ListOrdered, label: "Numbered List" },
      { command: "quote", icon: Quote, label: "Quote" },
      { command: "code", icon: Code, label: "Code" },
      { command: "link", icon: Link, label: "Link" },
      { command: "image", icon: Image, label: "Image" },
      { command: "alignLeft", icon: AlignLeft, label: "Align Left" },
      { command: "alignCenter", icon: AlignCenter, label: "Align Center" },
      { command: "alignRight", icon: AlignRight, label: "Align Right" },
      { command: "alignJustify", icon: AlignJustify, label: "Align Justify" },
    ];

    return (
      <div
        className={cn(
          "flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50",
          "sticky top-0 z-10",
          toolbarClassName,
        )}
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleUndo}
            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
            title="Undo (Ctrl+Z)"
          >
            <Undo size={16} />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
            title="Redo (Ctrl+Y)"
          >
            <Redo size={16} />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {toolbarButtons.map(({ command, icon: Icon, label, shortcut }) => {
          if (!toolbarItems.includes(command)) return null;

          return (
            <button
              key={command}
              type="button"
              onClick={() => handleFormat(command)}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
              title={`${label}${shortcut ? ` (${shortcut})` : ""}`}
            >
              <Icon size={16} />
            </button>
          );
        })}

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <div className="flex items-center gap-1">
          {showPreview && (
            <button
              type="button"
              onClick={togglePreview}
              className={cn(
                "p-1 rounded text-sm",
                isPreviewMode
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200",
              )}
              title={isPreviewMode ? "Edit Mode" : "Preview Mode"}
            >
              {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}

          {fullscreen && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isFullscreen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    if (!isPreviewMode) return null;

    return (
      <div
        className={cn(
          "p-4 border border-gray-300 rounded-md bg-white min-h-[200px]",
          "prose prose-sm max-w-none",
          previewClassName,
        )}
      >
        {value ? (
          <div dangerouslySetInnerHTML={{ __html: value }} />
        ) : (
          <p className="text-gray-500 italic">No content to preview</p>
        )}
      </div>
    );
  };

  const renderEditor = () => {
    if (isPreviewMode) return null;

    return (
      <div className={cn("relative", editorClassName)}>
        {showLineNumbers && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gray-100 border-r border-gray-200 text-xs text-gray-500 select-none">
            {value.split("\n").map((_, index) => (
              <div key={index} className="px-2 py-1 text-right">
                {index + 1}
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={isDisabled}
          spellCheck={spellCheck}
          className={cn(
            baseClasses,
            showLineNumbers && "pl-10",
            "resize-none min-h-[200px]",
          )}
          {...props}
        />
      </div>
    );
  };

  const renderStats = () => {
    if (!showCharacterCount && !showWordCount && !showReadingTime) return null;

    return (
      <div className="flex items-center justify-between text-xs text-gray-500 mt-2 px-1">
        <div className="flex items-center gap-4">
          {showCharacterCount && (
            <span>
              {value.length}
              {maxLength && ` / ${maxLength}`} characters
            </span>
          )}

          {showWordCount && <span>{wordCount} words</span>}

          {showReadingTime && <span>~{readingTime} min read</span>}
        </div>

        {autoSave && <span className="text-green-600">Auto-save enabled</span>}
      </div>
    );
  };

  const renderHelp = () => {
    if (!showHelp) return null;

    return (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
        <h4 className="font-medium mb-2">Rich Text Formatting</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <strong>Text:</strong>
            <br />
            **bold** = <strong>bold</strong>
            <br />
            *italic* = <em>italic</em>
            <br />
            ~~strikethrough~~ = <del>strikethrough</del>
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
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={cn(
          "border border-gray-300 rounded-md overflow-hidden",
          hasError && "border-red-300",
          isDisabled && "bg-gray-50",
        )}
      >
        {renderToolbar()}

        {loading ? (
          <div className="p-4 text-center text-gray-500">{loadingText}</div>
        ) : (
          <>
            {renderPreview()}
            {renderEditor()}
          </>
        )}
      </div>

      {renderStats()}
      {renderHelp()}

      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
