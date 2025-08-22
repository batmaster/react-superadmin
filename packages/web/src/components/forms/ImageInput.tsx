import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  Eye,
  Download,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "../../utils/cn";

export interface ImageInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type"
  > {
  /** Current image value (URL or File object) */
  value?: string | File | null;

  /** Change handler */
  onChange: (value: string | File | null) => void;

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

  /** Whether to show image preview */
  showPreview?: boolean;

  /** Whether to show image info */
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

  /** Whether to show image dimensions */
  showDimensions?: boolean;

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

  /** Whether to enable image compression */
  enableCompression?: boolean;

  /** Image compression quality (0-1) */
  compressionQuality?: number;

  /** Maximum image dimensions */
  maxDimensions?: { width: number; height: number };

  /** Whether to maintain aspect ratio */
  maintainAspectRatio?: boolean;

  /** Aspect ratio (width/height) */
  aspectRatio?: number;

  /** Whether to show upload progress */
  showProgress?: boolean;

  /** Custom upload handler */
  onUpload?: (file: File) => Promise<string>;

  /** Whether to show validation errors */
  showValidationErrors?: boolean;

  /** Custom validation function */
  validate?: (file: File) => string | null;
}

/**
 * A specialized image input component with upload, preview, and validation features.
 * Provides a comprehensive image input experience with drag and drop support.
 *
 * @example
 * // Basic usage
 * <ImageInput
 *   label="Profile Picture"
 *   value={image}
 *   onChange={setImage}
 *   accept="image/*"
 *   showPreview={true}
 * />
 *
 * @example
 * // With validation and compression
 * <ImageInput
 *   label="Product Image"
 *   value={productImage}
 *   onChange={setProductImage}
 *   accept="image/jpeg,image/png"
 *   maxSize={5 * 1024 * 1024} // 5MB
 *   enableCompression={true}
 *   compressionQuality={0.8}
 *   showPreview={true}
 *   showInfo={true}
 * />
 */
export const ImageInput: React.FC<ImageInputProps> = ({
  value,
  onChange,
  label,
  helperText,
  error,
  required = false,
  disabled = false,
  inputSize = "md",
  placeholder = "Choose an image or drag and drop",
  loading = false,
  loadingText = "Uploading...",
  showPreview = true,
  showInfo = false,
  multiple = false,
  accept = "image/*",
  maxSize,
  maxSizeText,
  showDragDrop = true,
  dragDropText = "Drag and drop an image here, or click to browse",
  showFileSize = true,
  showDimensions = true,
  showRemoveButton = true,
  showDownloadButton = false,
  showPreviewButton = true,
  className,
  inputClassName,
  previewClassName,
  dragDropClassName,
  buttonClassName,
  showHelp = false,
  enableCompression = false,
  compressionQuality = 0.8,
  maxDimensions,
  maintainAspectRatio = true,
  aspectRatio = 16 / 9,
  showProgress = false,
  onUpload,
  showValidationErrors = true,
  validate,
  id,
  ...props
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<{
    width: number;
    height: number;
    size: number;
    type: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const inputId =
    id || `image-input-${Math.random().toString(36).substr(2, 9)}`;
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

  // Generate preview URL and image info
  React.useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);

      // Get image dimensions and info
      const img = new Image();
      img.onload = () => {
        setImageInfo({
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: value.size,
          type: value.type,
        });
      };
      img.src = url;

      return () => URL.revokeObjectURL(url);
    } else if (typeof value === "string") {
      setPreviewUrl(value);
      setImageInfo(null); // Reset info for URL values
    } else {
      setPreviewUrl(null);
      setImageInfo(null);
    }
  }, [value]);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];

      // Validate file type
      if (accept && !file.type.match(accept.replace(/\*/g, ".*"))) {
        if (showValidationErrors) {
          onChange(null);
        }
        return;
      }

      // Validate file size
      if (maxSize && file.size > maxSize) {
        if (showValidationErrors) {
          onChange(null);
        }
        return;
      }

      // Custom validation
      if (validate) {
        const validationError = validate(file);
        if (validationError) {
          if (showValidationErrors) {
            onChange(null);
          }
          return;
        }
      }

      // Handle compression if enabled
      if (enableCompression && file.type.startsWith("image/")) {
        try {
          const compressedFile = await compressImage(file);
          onChange(compressedFile);
        } catch (error) {
          console.error("Image compression failed:", error);
          onChange(file);
        }
      } else {
        onChange(file);
      }

      // Handle custom upload if provided
      if (onUpload) {
        try {
          setUploadProgress(0);
          const url = await onUpload(file);
          onChange(url);
          setUploadProgress(100);
        } catch (error) {
          console.error("Upload failed:", error);
          setUploadProgress(0);
        }
      }
    },
    [
      accept,
      maxSize,
      validate,
      enableCompression,
      onUpload,
      onChange,
      showValidationErrors,
    ],
  );

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Apply max dimensions if specified
        if (maxDimensions) {
          if (width > maxDimensions.width || height > maxDimensions.height) {
            if (maintainAspectRatio) {
              const ratio = Math.min(
                maxDimensions.width / width,
                maxDimensions.height / height,
              );
              width *= ratio;
              height *= ratio;
            } else {
              width = maxDimensions.width;
              height = maxDimensions.height;
            }
          }
        }

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error("Failed to compress image"));
              }
            },
            file.type,
            compressionQuality,
          );
        } else {
          reject(new Error("Canvas context not available"));
        }
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

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

  const handleRemove = useCallback(() => {
    onChange(null);
    setPreviewUrl(null);
    setImageInfo(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onChange]);

  const handleDownload = useCallback(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      const a = document.createElement("a");
      a.href = url;
      a.download = value.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (typeof value === "string") {
      const a = document.createElement("a");
      a.href = value;
      a.download = "image";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [value]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderPreview = () => {
    if (!showPreview || !previewUrl) return null;

    return (
      <div className={cn("relative inline-block", previewClassName)}>
        <img
          src={previewUrl}
          alt="Preview"
          className={cn(
            "max-w-full h-auto rounded-md",
            "border border-gray-200",
          )}
          style={{
            maxHeight: "200px",
            objectFit: "contain",
          }}
        />

        {showPreviewButton && (
          <button
            type="button"
            onClick={() => window.open(previewUrl, "_blank")}
            className="absolute top-2 right-2 p-1 bg-white bg-opacity-80 rounded-full shadow-sm hover:bg-opacity-100 transition-all"
            title="View full size"
          >
            <Eye size={16} />
          </button>
        )}
      </div>
    );
  };

  const renderImageInfo = () => {
    if (!showInfo || !imageInfo) return null;

    return (
      <div className="mt-2 text-xs text-gray-500 space-y-1">
        {showDimensions && (
          <div>
            Dimensions: {imageInfo.width} × {imageInfo.height}px
          </div>
        )}
        {showFileSize && <div>Size: {formatFileSize(imageInfo.size)}</div>}
        <div>Type: {imageInfo.type}</div>
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
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">{dragDropText}</p>
        <p className="text-xs text-gray-500">
          {accept && `Accepted formats: ${accept}`}
          {maxSize && maxSizeText && ` • Max size: ${maxSizeText}`}
        </p>
      </div>
    );
  };

  const renderProgress = () => {
    if (!showProgress || uploadProgress === 0 || uploadProgress === 100)
      return null;

    return (
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Uploading... {uploadProgress}%
        </p>
      </div>
    );
  };

  const renderHelp = () => {
    if (!showHelp) return null;

    return (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
        <h4 className="font-medium mb-2">Image Upload Guidelines</h4>
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
          {maxDimensions && (
            <div>
              <strong>Max Dimensions:</strong> {maxDimensions.width} ×{" "}
              {maxDimensions.height}px
            </div>
          )}
          {enableCompression && (
            <div>
              <strong>Compression:</strong> Enabled (Quality:{" "}
              {Math.round(compressionQuality * 100)}%)
            </div>
          )}
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

        {/* Preview */}
        {renderPreview()}

        {/* Image info */}
        {renderImageInfo()}

        {/* Progress bar */}
        {renderProgress()}

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
            <Upload size={16} className="mr-2" />
            Browse Files
          </button>

          {showDownloadButton && value && (
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDisabled}
              className={cn(
                "inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md",
                "text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                buttonClassName,
              )}
            >
              <Download size={16} className="mr-2" />
              Download
            </button>
          )}

          {showRemoveButton && value && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isDisabled}
              className={cn(
                "inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md",
                "text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                buttonClassName,
              )}
            >
              <Trash2 size={16} className="mr-2" />
              Remove
            </button>
          )}
        </div>
      </div>

      {renderHelp()}

      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
