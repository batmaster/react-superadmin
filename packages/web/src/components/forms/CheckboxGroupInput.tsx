import React, { forwardRef, useState, useEffect } from "react";
import { cn } from "../../utils/cn";

export interface CheckboxOption {
  /** Value of the option */
  value: string | number;
  /** Label text for the option */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Additional data for the option */
  data?: Record<string, any>;
}

export interface CheckboxGroupInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "size"> {
  /** Array of checkbox options */
  options: CheckboxOption[];
  /** Currently selected values */
  value?: (string | number)[];
  /** Callback when selection changes */
  onChange?: (value: (string | number)[]) => void;
  /** Label text for the group */
  label?: string;
  /** Helper text below the group */
  helperText?: string;
  /** Error message to display */
  error?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Input size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to show a loading state */
  loading?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is read-only */
  readOnly?: boolean;
  /** Layout direction for the checkboxes */
  direction?: "horizontal" | "vertical";
  /** Maximum number of selections allowed */
  maxSelections?: number;
  /** Whether to show "Select All" option */
  showSelectAll?: boolean;
  /** Whether to show "Clear All" option */
  showClearAll?: boolean;
  /** Custom class names for individual checkboxes */
  checkboxClassName?: string;
  /** Custom class names for the label */
  labelClassName?: string;
  /** Whether to show option descriptions */
  showDescriptions?: boolean;
  /** Custom renderer for option descriptions */
  renderDescription?: (option: CheckboxOption) => React.ReactNode;
}

/**
 * A checkbox group input component that allows multiple selections from a list of options.
 * Supports various layouts, selection limits, and accessibility features.
 *
 * @example
 * // Basic usage
 * <CheckboxGroupInput
 *   label="Select your interests"
 *   options={[
 *     { value: "sports", label: "Sports" },
 *     { value: "music", label: "Music" },
 *     { value: "books", label: "Books" }
 *   ]}
 *   value={selectedInterests}
 *   onChange={setSelectedInterests}
 * />
 *
 * @example
 * // With selection limits and select all
 * <CheckboxGroupInput
 *   label="Choose up to 3 categories"
 *   options={categoryOptions}
 *   value={selectedCategories}
 *   onChange={setSelectedCategories}
 *   maxSelections={3}
 *   showSelectAll
 *   showClearAll
 * />
 *
 * @example
 * // Horizontal layout with descriptions
 * <CheckboxGroupInput
 *   label="Select features"
 *   options={featureOptions}
 *   direction="horizontal"
 *   showDescriptions
 *   renderDescription={(option) => (
 *     <span className="text-sm text-gray-500">{option.data?.description}</span>
 *   )}
 * />
 */
export const CheckboxGroupInput = forwardRef<
  HTMLDivElement,
  CheckboxGroupInputProps
>(
  (
    {
      options,
      value = [],
      onChange,
      label,
      helperText,
      error,
      required = false,
      size = "md",
      loading = false,
      disabled = false,
      readOnly = false,
      direction = "vertical",
      maxSelections,
      showSelectAll = false,
      showClearAll = false,
      checkboxClassName,
      labelClassName,
      showDescriptions = false,
      renderDescription,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState<(string | number)[]>(
      value || [],
    );

    // Sync internal state with controlled value
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    // Use controlled value if provided, otherwise use internal state
    const selectedValues = value !== undefined ? value : internalValue;

    const inputId =
      id || `checkbox-group-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const isDisabled = disabled || loading || readOnly;

    // Size-based styling
    const sizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    // Direction-based layout
    const directionClasses = {
      horizontal: "flex flex-wrap gap-4",
      vertical: "flex flex-col gap-3",
    };

    // Handle checkbox change
    const handleCheckboxChange = (
      optionValue: string | number,
      checked: boolean,
    ) => {
      if (isDisabled) return;

      let newValue: (string | number)[];
      if (checked) {
        // Add value if not already selected
        if (!selectedValues.includes(optionValue)) {
          // Check max selections limit
          if (maxSelections && selectedValues.length >= maxSelections) {
            return; // Don't add if at limit
          }
          newValue = [...selectedValues, optionValue];
        } else {
          newValue = selectedValues;
        }
      } else {
        // Remove value
        newValue = selectedValues.filter((v) => v !== optionValue);
      }

      // Update internal state if not controlled
      if (value === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);
    };

    // Handle select all
    const handleSelectAll = () => {
      if (isDisabled) return;

      const allValues = options
        .filter((option) => !option.disabled)
        .map((option) => option.value);

      // If all are selected, clear all; otherwise select all
      const newValue =
        selectedValues.length === allValues.length ? [] : allValues;

      if (value === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);
    };

    // Handle clear all
    const handleClearAll = () => {
      if (isDisabled) return;

      const newValue: (string | number)[] = [];

      if (value === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);
    };

    // Check if all options are selected
    const allSelected = options
      .filter((option) => !option.disabled)
      .every((option) => selectedValues.includes(option.value));

    // Check if any options are selected
    const anySelected = selectedValues.length > 0;

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        key={JSON.stringify(selectedValues)} // Force re-render when selection changes
        {...props}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium leading-6 text-gray-900 mb-3",
              hasError && "text-red-600",
              isDisabled && "text-gray-400",
              labelClassName,
            )}
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Select All / Clear All Controls */}
        {(showSelectAll || showClearAll) && (
          <div className="flex gap-2 mb-3">
            {showSelectAll && (
              <button
                type="button"
                onClick={handleSelectAll}
                disabled={isDisabled}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300",
                  "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  allSelected && "bg-blue-50 border-blue-300 text-blue-700",
                )}
              >
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            )}
            {showClearAll && anySelected && (
              <button
                type="button"
                onClick={handleClearAll}
                disabled={isDisabled}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300",
                  "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                Clear All
              </button>
            )}
          </div>
        )}

        {/* Checkbox Group */}
        <div
          id={inputId}
          className={cn(directionClasses[direction], sizeClasses[size])}
          role="group"
          aria-labelledby={label ? `${inputId}-label` : undefined}
          aria-describedby={
            [helperText && `${inputId}-helper`, error && `${inputId}-error`]
              .filter(Boolean)
              .join(" ") || undefined
          }
        >
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            const isOptionDisabled = option.disabled || isDisabled;
            const isAtLimit =
              maxSelections &&
              selectedValues.length >= maxSelections &&
              !isSelected;

            return (
              <div
                key={option.value}
                className={cn(
                  "flex items-start gap-3",
                  isOptionDisabled && "opacity-50",
                  isAtLimit && "opacity-30",
                )}
              >
                <input
                  type="checkbox"
                  id={`${inputId}-${option.value}`}
                  value={option.value}
                  checked={isSelected}
                  onChange={(e) =>
                    handleCheckboxChange(option.value, e.target.checked)
                  }
                  disabled={!!(isOptionDisabled || isAtLimit)}
                  readOnly={readOnly}
                  className={cn(
                    "h-4 w-4 rounded border-gray-300 text-blue-600",
                    "focus:ring-blue-500 focus:ring-2 focus:ring-offset-2",
                    "disabled:cursor-not-allowed",
                    checkboxClassName,
                  )}
                  aria-describedby={
                    showDescriptions && option.data?.description
                      ? `${inputId}-${option.value}-description`
                      : undefined
                  }
                />
                <div className="flex flex-col">
                  <label
                    htmlFor={`${inputId}-${option.value}`}
                    className={cn(
                      "text-sm font-medium text-gray-900 cursor-pointer",
                      isOptionDisabled && "cursor-not-allowed text-gray-400",
                      isAtLimit && "cursor-not-allowed",
                    )}
                  >
                    {option.label}
                  </label>
                  {showDescriptions && option.data?.description && (
                    <span
                      id={`${inputId}-${option.value}-description`}
                      className="text-sm text-gray-500 mt-1"
                    >
                      {renderDescription
                        ? renderDescription(option)
                        : option.data.description}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Helper Text */}
        {helperText && (
          <p
            id={`${inputId}-helper`}
            className={cn(
              "mt-2 text-sm",
              hasError ? "text-red-600" : "text-gray-500",
            )}
          >
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Selection Count */}
        {maxSelections && (
          <p className="mt-2 text-sm text-gray-500">
            {selectedValues.length} of {maxSelections} selected
          </p>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="mt-3 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-500">Loading options...</span>
          </div>
        )}
      </div>
    );
  },
);

CheckboxGroupInput.displayName = "CheckboxGroupInput";
