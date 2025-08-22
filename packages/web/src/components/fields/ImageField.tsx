import React, { useState } from "react";
import { cn } from "../../utils/cn";

export interface ImageFieldProps {
  /** The image source URL or data */
  value?: string | null;

  /** The source record containing the field data */
  record?: Record<string, any>;

  /** The source field name in the record */
  source?: string;

  /** Custom CSS classes for the field container */
  className?: string;

  /** Custom CSS classes for the field label */
  labelClassName?: string;

  /** Custom CSS classes for the image */
  imageClassName?: string;

  /** Whether to show the field label */
  showLabel?: boolean;

  /** Custom label text */
  label?: string;

  /** Image display style */
  style?: "image" | "thumbnail" | "avatar" | "card" | "gallery";

  /** Image dimensions */
  width?: number | string;
  height?: number | string;

  /** Whether to maintain aspect ratio */
  maintainAspectRatio?: boolean;

  /** Aspect ratio (width/height) */
  aspectRatio?: number;

  /** Image fit behavior */
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";

  /** Whether to show a loading state */
  loading?: boolean;

  /** Loading text */
  loadingText?: string;

  /** Whether the field is disabled */
  disabled?: boolean;

  /** Custom empty state text */
  emptyText?: string;

  /** Whether to show the empty state */
  showEmpty?: boolean;

  /** Fallback image URL */
  fallbackSrc?: string;

  /** Fallback icon */
  fallbackIcon?: React.ReactNode;

  /** Whether to show image info on hover */
  showInfo?: boolean;

  /** Custom image info content */
  imageInfo?: React.ReactNode;

  /** Click handler for the image */
  onClick?: (value: string | null, record: Record<string, any>) => void;

  /** Whether the image is clickable */
  clickable?: boolean;

  /** Whether to show a lightbox on click */
  lightbox?: boolean;

  /** Custom CSS classes for fallback */
  fallbackClassName?: string;

  /** Whether to show image dimensions */
  showDimensions?: boolean;

  /** Whether to show file size */
  showFileSize?: boolean;

  /** Whether to show alt text */
  showAltText?: boolean;

  /** Alt text for the image */
  alt?: string;

  /** Whether to lazy load the image */
  lazy?: boolean;

  /** Custom CSS classes for loading state */
  loadingClassName?: string;

  /** Custom CSS classes for error state */
  errorClassName?: string;

  /** Whether to show image border */
  showBorder?: boolean;

  /** Border radius */
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";

  /** Whether to show image shadow */
  showShadow?: boolean;

  /** Whether to show image overlay on hover */
  showOverlay?: boolean;

  /** Custom overlay content */
  overlayContent?: React.ReactNode;

  /** Whether to show image actions */
  showActions?: boolean;

  /** Custom action buttons */
  actions?: React.ReactNode;
}

export const ImageField: React.FC<ImageFieldProps> = ({
  value,
  record,
  source,
  className,
  labelClassName,
  imageClassName,
  showLabel = true,
  label,
  style = "image",
  width,
  height,
  maintainAspectRatio = true,
  aspectRatio = 16 / 9,
  objectFit = "cover",
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  emptyText = "No image",
  showEmpty = true,
  fallbackSrc,
  fallbackIcon,
  showInfo = false,
  imageInfo,
  onClick,
  clickable = false,

  fallbackClassName,
  showDimensions = false,
  showFileSize = false,
  showAltText = false,
  alt,
  lazy = true,
  loadingClassName,
  errorClassName,
  showBorder = false,
  borderRadius = "md",
  showShadow = false,
  showOverlay = false,
  overlayContent,
  showActions = false,
  actions,
}) => {
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">(
    "loading",
  );

  // Get the actual value from record if source is provided
  const actualValue = source && record ? record[source] : value;

  // Get field label
  const getFieldLabel = (): string => {
    if (label) return label;
    if (source)
      return (
        source.charAt(0).toUpperCase() +
        source.slice(1).replace(/([A-Z])/g, " $1")
      );
    return "";
  };

  // Get border radius classes
  const getBorderRadiusClasses = (): string => {
    switch (borderRadius) {
      case "none":
        return "rounded-none";
      case "sm":
        return "rounded-sm";
      case "lg":
        return "rounded-lg";
      case "full":
        return "rounded-full";
      default:
        return "rounded-md";
    }
  };

  // Get style-specific classes
  const getStyleClasses = (): string => {
    const baseClasses = "block";

    switch (style) {
      case "thumbnail":
        return cn(baseClasses, "w-20 h-20 object-cover");
      case "avatar":
        return cn(baseClasses, "w-12 h-12 object-cover rounded-full");
      case "card":
        return cn(baseClasses, "w-full h-48 object-cover");
      case "gallery":
        return cn(baseClasses, "w-full h-32 object-cover");
      default:
        return baseClasses;
    }
  };

  // Handle image load
  const handleImageLoad = () => {
    setImageState("loaded");
  };

  // Handle image error
  const handleImageError = () => {
    setImageState("error");
  };

  // Handle click
  const handleClick = () => {
    if (clickable && onClick && !disabled && !loading && actualValue) {
      onClick(actualValue, record || {});
    }
  };

  // Get image dimensions
  const getImageDimensions = () => {
    if (!width && !height) return {};

    if (maintainAspectRatio && aspectRatio) {
      if (width) {
        return {
          width,
          height: typeof width === "number" ? width / aspectRatio : undefined,
        };
      }
      if (height) {
        return {
          height,
          width: typeof height === "number" ? height * aspectRatio : undefined,
        };
      }
    }

    return { width, height };
  };

  // Loading state
  if (loading) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        {showLabel && getFieldLabel() && (
          <span
            className={cn("text-sm font-medium text-gray-700", labelClassName)}
          >
            {getFieldLabel()}
          </span>
        )}
        <div
          className={cn(
            "flex items-center justify-center bg-gray-200 animate-pulse",
            getBorderRadiusClasses(),
            loadingClassName,
          )}
          style={getImageDimensions()}
        >
          <span className="text-sm text-gray-500">{loadingText}</span>
        </div>
      </div>
    );
  }

  // Empty state
  if (!actualValue && showEmpty) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        {showLabel && getFieldLabel() && (
          <span
            className={cn("text-sm font-medium text-gray-700", labelClassName)}
          >
            {getFieldLabel()}
          </span>
        )}
        <div
          className={cn(
            "flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300",
            getBorderRadiusClasses(),
            fallbackClassName,
          )}
          style={getImageDimensions()}
        >
          {fallbackIcon || (
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
          <span className="ml-2 text-sm text-gray-500">{emptyText}</span>
        </div>
      </div>
    );
  }

  // Error state with fallback
  if (imageState === "error" && fallbackSrc) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        {showLabel && getFieldLabel() && (
          <span
            className={cn("text-sm font-medium text-gray-700", labelClassName)}
          >
            {getFieldLabel()}
          </span>
        )}
        <img
          src={fallbackSrc}
          alt={alt || getFieldLabel()}
          className={cn(
            getStyleClasses(),
            getBorderRadiusClasses(),
            showBorder && "border border-gray-300",
            showShadow && "shadow-md",
            imageClassName,
          )}
          style={{
            ...getImageDimensions(),
            objectFit,
          }}
        />
      </div>
    );
  }

  // Error state without fallback
  if (imageState === "error") {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        {showLabel && getFieldLabel() && (
          <span
            className={cn("text-sm font-medium text-gray-700", labelClassName)}
          >
            {getFieldLabel()}
          </span>
        )}
        <div
          className={cn(
            "flex items-center justify-center bg-red-50 border border-red-200",
            getBorderRadiusClasses(),
            errorClassName,
          )}
          style={getImageDimensions()}
        >
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className="ml-2 text-sm text-red-600">
            Failed to load image
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {showLabel && getFieldLabel() && (
        <span
          className={cn("text-sm font-medium text-gray-700", labelClassName)}
        >
          {getFieldLabel()}
        </span>
      )}

      <div className="relative group">
        {clickable && !disabled ? (
          <button
            type="button"
            className="p-0 border-0 bg-transparent"
            onClick={handleClick}
            disabled={disabled}
          >
            <img
              src={actualValue || ""}
              alt={alt || getFieldLabel()}
              loading={lazy ? "lazy" : "eager"}
              className={cn(
                getStyleClasses(),
                getBorderRadiusClasses(),
                showBorder && "border border-gray-300",
                showShadow && "shadow-md",
                "cursor-pointer hover:opacity-90 transition-opacity",
                disabled ? "opacity-50 cursor-not-allowed" : "",
                imageClassName,
              )}
              style={{
                ...getImageDimensions(),
                objectFit,
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </button>
        ) : (
          <img
            src={actualValue || ""}
            alt={alt || getFieldLabel()}
            loading={lazy ? "lazy" : "eager"}
            className={cn(
              getStyleClasses(),
              getBorderRadiusClasses(),
              showBorder && "border border-gray-300",
              showShadow && "shadow-md",
              disabled ? "opacity-50 cursor-not-allowed" : "",
              imageClassName,
            )}
            style={{
              ...getImageDimensions(),
              objectFit,
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Overlay */}
        {showOverlay && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            {overlayContent || (
              <div className="text-white text-center">
                <p className="text-sm font-medium">Click to view</p>
              </div>
            )}
          </div>
        )}

        {/* Image info */}
        {showInfo && imageInfo && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs">
            {imageInfo}
          </div>
        )}

        {/* Actions */}
        {showActions && actions && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {actions}
          </div>
        )}

        {/* Loading indicator */}
        {imageState === "loading" && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Additional info below image */}
      {(showDimensions || showFileSize || showAltText) && (
        <div className="text-xs text-gray-500 space-y-1">
          {showDimensions && width && height && (
            <div>
              Dimensions: {width} × {height}
            </div>
          )}
          {showFileSize && <div>Size: Unknown</div>}
          {showAltText && alt && <div>Alt: {alt}</div>}
        </div>
      )}
    </div>
  );
};

ImageField.displayName = "ImageField";
