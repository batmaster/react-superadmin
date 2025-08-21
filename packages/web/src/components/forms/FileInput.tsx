import React, { useState, useRef, useCallback } from "react";
import { Upload, X, File, Download, Trash2, FolderOpen } from "lucide-react";
import { cn } from "../../utils/cn";

export interface FileInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type"
  > {
  /** Current file value (File object or array of files) */
  value?: File | File[] | null;

  /** Change handler */
  onChange: (value: File | File[] | null) => void;

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

  /** Whether to show file preview */
  showPreview?: boolean;

  /** Whether to show file info */
  showInfo?: boolean;

  /** Whether to allow multiple file selection */
  multiple?: boolean;

  /** Accepted file types */
  accept?: string;

  /** Maximum file size in bytes */
  maxSize?: number;

  /** Maximum file size text */
  maxSizeText?: string;

  /** Whether to show drag and drop area */
  showDragDrop?: boolean;

  /** Drag and drop text */
  dragDropText?: string;

  /** Whether to show file size */
  showFileSize?: boolean;

  /** Whether to show file type */
  showFileType?: boolean;

  /** Whether to show remove button */
  showRemoveButton?: boolean;

  /** Whether to show download button */
  showDownloadButton?: boolean;

  /** Whether to show preview button */
  showPreviewButton?: boolean;

  /** Custom class names */
  className?: string;
  inputClassName?: string;
  previewClassName?: string;
  dragDropClassName?: string;
  buttonClassName?: string;

  /** Whether to show help text */
  showHelp?: boolean;

  /** Whether to show upload progress */
  showProgress?: boolean;

  /** Custom upload handler */
  onUpload?: (file: File) => Promise<string>;

  /** Whether to show validation errors */
  showValidationErrors?: boolean;

  /** Custom validation function */
  validate?: (file: File) => string | null;

  /** Maximum number of files allowed */
  maxFiles?: number;

  /** Whether to show file list */
  showFileList?: boolean;

  /** Whether to allow file reordering */
  allowReorder?: boolean;

  /** Whether to show file count */
  showFileCount?: boolean;
}

/**
 * A specialized file input component with upload, preview, and validation features.
 * Provides a comprehensive file input experience with drag and drop support.
 *
 * @example
 * // Basic usage
 * <FileInput
 *   label="Document"
 *   value={file}
 *   onChange={setFile}
 *   accept=".pdf,.doc,.docx"
 *   showPreview={true}
 * />
 *
 * @example
 * // With multiple files and validation
 * <FileInput
 *   label="Attachments"
 *   value={files}
 *   onChange={setFiles}
 *   multiple={true}
 *   accept="image/*,.pdf"
 *   maxSize={10 * 1024 * 1024} // 10MB
 *   showPreview={true}
 *   showInfo={true}
 *   maxFiles={5}
 * />
 */
export const FileInput: React.FC<FileInputProps> = ({
  value,
  onChange,
  label,
  helperText,
  error,
  required = false,
  disabled = false,
  inputSize = "md",
  placeholder = "Choose files or drag and drop",
  loading = false,
  loadingText = "Uploading...",
  showPreview = true,
  showInfo = false,
  multiple = false,
  accept,
  maxSize,
  maxSizeText,
  showDragDrop = true,
  dragDropText = "Drag and drop files here, or click to browse",
  showFileSize = true,
  showFileType = true,
  showRemoveButton = true,
  showDownloadButton = false,
  showPreviewButton = true,
  className,
  inputClassName,
  previewClassName,
  dragDropClassName,
  buttonClassName,
  showHelp = false,
  showProgress = false,
  onUpload,
  showValidationErrors = true,
  validate,
  maxFiles,
  showFileList = true,
  allowReorder = false,
  showFileCount = false,
  id,
  ...props
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const inputId = id || `file-input-${Math.random().toString(36).substr(2, 9)}`;
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

  // Get files array (handle both single and multiple)
  const getFiles = (): File[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
  };

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);

      // Check max files limit
      if (maxFiles && fileArray.length > maxFiles) {
        if (showValidationErrors) {
          onChange(null);
        }
        return;
      }

      // Validate each file
      const validFiles: File[] = [];

      for (const file of fileArray) {
        // Validate file type
        if (accept && !file.type.match(accept.replace(/\*/g, ".*"))) {
          if (showValidationErrors) {
            continue;
          }
          return;
        }

        // Validate file size
        if (maxSize && file.size > maxSize) {
          if (showValidationErrors) {
            continue;
          }
          return;
        }

        // Custom validation
        if (validate) {
          const validationError = validate(file);
          if (validationError) {
            if (showValidationErrors) {
              continue;
            }
            return;
          }
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      // Handle custom upload if provided
      if (onUpload) {
        const uploadedFiles: File[] = [];

        for (const file of validFiles) {
          try {
            setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
            const url = await onUpload(file);
            // For now, we'll keep the file object, but in a real app you might want to store the URL
            uploadedFiles.push(file);
            setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
          } catch (error) {
            console.error("Upload failed:", error);
            setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
          }
        }

        onChange(multiple ? uploadedFiles : uploadedFiles[0]);
      } else {
        onChange(multiple ? validFiles : validFiles[0]);
      }
    },
    [
      accept,
      maxSize,
      validate,
      onUpload,
      onChange,
      showValidationErrors,
      multiple,
      maxFiles,
    ],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
    },
    [handleFileSelect],
  );

  const handleRemove = useCallback(
    (fileToRemove: File) => {
      const currentFiles = getFiles();
      const newFiles = currentFiles.filter((file) => file !== fileToRemove);

      if (multiple) {
        onChange(newFiles.length > 0 ? newFiles : null);
      } else {
        onChange(null);
      }

      // Clear progress for removed file
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[fileToRemove.name];
        return newProgress;
      });

      // Clear input value
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [multiple, onChange],
  );

  const handleRemoveAll = useCallback(() => {
    onChange(null);
    setUploadProgress({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onChange]);

  const handleDownload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/"))
      return <File className="w-8 h-8 text-blue-500" />;
    if (file.type.startsWith("video/"))
      return <File className="w-8 h-8 text-purple-500" />;
    if (file.type.startsWith("audio/"))
      return <File className="w-8 h-8 text-green-500" />;
    if (file.type.includes("pdf"))
      return <File className="w-8 h-8 text-red-500" />;
    if (file.type.includes("word") || file.type.includes("document"))
      return <File className="w-8 h-8 text-blue-600" />;
    if (file.type.includes("excel") || file.type.includes("spreadsheet"))
      return <File className="w-8 h-8 text-green-600" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const renderFilePreview = (file: File) => {
    if (!showPreview) return null;

    return (
      <div
        key={file.name}
        className={cn(
          "flex items-center space-x-3 p-3 border border-gray-200 rounded-md bg-gray-50",
          previewClassName,
        )}
      >
        {getFileIcon(file)}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          {showInfo && (
            <div className="text-xs text-gray-500 space-y-1">
              {showFileSize && <div>Size: {formatFileSize(file.size)}</div>}
              {showFileType && <div>Type: {file.type || "Unknown"}</div>}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {showPreviewButton && (
            <button
              type="button"
              onClick={() => window.open(URL.createObjectURL(file), "_blank")}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
              title="Preview file"
            >
              <File className="w-4 h-4" />
            </button>
          )}

          {showDownloadButton && (
            <button
              type="button"
              onClick={() => handleDownload(file)}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {showRemoveButton && (
            <button
              type="button"
              onClick={() => handleRemove(file)}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {showProgress && uploadProgress[file.name] !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-md">
            <div
              className="h-full bg-blue-600 rounded-b-md transition-all duration-300"
              style={{ width: `${uploadProgress[file.name]}%` }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderFileList = () => {
    const files = getFiles();
    if (!showFileList || files.length === 0) return null;

    return (
      <div className="space-y-2">
        {files.map(renderFilePreview)}

        {files.length > 1 && showRemoveButton && (
          <button
            type="button"
            onClick={handleRemoveAll}
            className="w-full p-2 text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 rounded-md text-sm font-medium transition-colors"
          >
            Remove All Files
          </button>
        )}
      </div>
    );
  };

  const renderDragDrop = () => {
    if (!showDragDrop) return null;

    return (
      <div
        ref={dropZoneRef}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          "hover:border-blue-400 hover:bg-blue-50",
          dragActive
            ? "border-blue-500 bg-blue-100"
            : "border-gray-300 bg-gray-50",
          dragDropClassName,
        )}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">{dragDropText}</p>
        <p className="text-xs text-gray-500">
          {accept && `Accepted formats: ${accept}`}
          {maxSize && maxSizeText && ` • Max size: ${maxSizeText}`}
          {maxFiles && ` • Max files: ${maxFiles}`}
        </p>
      </div>
    );
  };

  const renderHelp = () => {
    if (!showHelp) return null;

    return (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
        <h4 className="font-medium mb-2">File Upload Guidelines</h4>
        <div className="space-y-1 text-xs">
          {accept && (
            <div>
              <strong>Formats:</strong> {accept}
            </div>
          )}
          {maxSize && (
            <div>
              <strong>Max Size:</strong> {formatFileSize(maxSize)}
            </div>
          )}
          {maxFiles && (
            <div>
              <strong>Max Files:</strong> {maxFiles}
            </div>
          )}
          <div>
            <strong>Drag & Drop:</strong> Supported
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="space-y-3">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          id={inputId}
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={isDisabled}
          className="hidden"
          {...props}
        />

        {/* Drag and drop area */}
        {renderDragDrop()}

        {/* File count */}
        {showFileCount && getFiles().length > 0 && (
          <div className="text-sm text-gray-500">
            {getFiles().length} file{getFiles().length !== 1 ? "s" : ""}{" "}
            selected
          </div>
        )}

        {/* File list */}
        {renderFileList()}

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isDisabled}
            className={cn(
              "inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md",
              "text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              buttonClassName,
            )}
          >
            <Upload className="w-4 h-4 mr-2" />
            Browse Files
          </button>
        </div>
      </div>

      {renderHelp()}

      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
