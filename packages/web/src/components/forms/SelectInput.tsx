import React, { forwardRef, useState } from "react";
import { cn } from "../../utils/cn";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface SelectInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Current selected value */
  value?: any;

  /** Callback when selection changes */
  onChange: (value: any) => void;

  /** Array of options to display */
  options: SelectOption[];

  /** Placeholder text when no option is selected */
  placeholder?: string;

  /** Label text for the select */
  label?: string;

  /** Helper text below the select */
  helperText?: string;

  /** Error message to display */
  error?: string;

  /** Whether the field is required */
  required?: boolean;

  /** Whether the select is disabled */
  disabled?: boolean;

  /** Whether the select is loading */
  loading?: boolean;

  /** Select size variant */
  size?: "sm" | "md" | "lg";

  /** Whether to show a search input for filtering options */
  searchable?: boolean;

  /** Whether to show selected option with a checkmark */
  showSelectedIndicator?: boolean;

  /** Whether to show option descriptions */
  showDescriptions?: boolean;

  /** Custom class names */
  className?: string;

  /** Custom class names for the select element */
  selectClassName?: string;

  /** Custom class names for the label */
  labelClassName?: string;
}

/**
 * An enhanced select input component with accessibility features, validation,
 * and flexible styling options.
 *
 * @example
 * // Basic usage
 * <SelectInput
 *   label="Country"
 *   value={country}
 *   onChange={setCountry}
 *   options={[
 *     { value: "us", label: "United States" },
 *     { value: "ca", label: "Canada" }
 *   ]}
 * />
 *
 * @example
 * // With search and descriptions
 * <SelectInput
 *   label="Product"
 *   value={product}
 *   onChange={setProduct}
 *   searchable
 *   showDescriptions
 *   options={[
 *     { value: "1", label: "Basic Plan", description: "Perfect for small teams" },
 *     { value: "2", label: "Pro Plan", description: "Great for growing businesses" }
 *   ]}
 * />
 */
export const SelectInput = forwardRef<HTMLDivElement, SelectInputProps>(
  (
    {
      value,
      onChange,
      options,
      placeholder = "Select an option",
      label,
      helperText,
      error,
      required = false,
      disabled = false,
      loading = false,
      size = "md",
      searchable = false,
      showSelectedIndicator = false,
      showDescriptions = false,
      className,
      selectClassName,
      labelClassName,
      id,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const isDisabled = disabled || loading;

    const sizeClasses = {
      sm: "px-2 py-1 text-sm",
      md: "px-3 py-2 text-base",
      lg: "px-4 py-3 text-lg",
    };

    const baseSelectClasses = cn(
      "block w-full border rounded-md shadow-sm placeholder-gray-400 transition-colors duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-0",
      "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
      sizeClasses[size],
      hasError
        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-primary-500 focus:border-primary-500",
      isDisabled && "opacity-60",
      selectClassName,
    );

    // Filter options based on search term
    const filteredOptions = searchable
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : options;

    // Find the selected option
    const selectedOption = options.find((option) => option.value === value);

    const handleSelectChange = (optionValue: any) => {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm("");
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setIsOpen(!isOpen);
      } else if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
      setIsFocused(true);
      props.onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
      setIsFocused(false);
      props.onBlur?.(event);
    };

    return (
      <div className={cn("w-full", className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-gray-700 mb-1",
              hasError && "text-red-700",
              isDisabled && "text-gray-500",
              labelClassName,
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Select Container */}
        <div className="relative">
          <div
            ref={ref}
            className={cn(
              baseSelectClasses,
              "cursor-pointer",
              isFocused && "ring-2 ring-primary-500",
            )}
            onClick={() => !isDisabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={0}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-labelledby={label ? `${inputId}-label` : undefined}
            aria-describedby={cn(
              helperText && `${inputId}-helper`,
              error && `${inputId}-error`,
            )}
            aria-invalid={hasError}
            aria-controls={`${inputId}-listbox`}
            {...props}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn("truncate", !selectedOption && "text-gray-400")}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-gray-400 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </div>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div
                data-testid="loading-spinner"
                className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"
              ></div>
            </div>
          )}

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {/* Search Input */}
              {searchable && (
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              )}

              {/* Options List */}
              <div className="py-1" role="listbox" id={`${inputId}-listbox`}>
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500 text-center">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "px-3 py-2 cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150",
                        option.disabled && "cursor-not-allowed",
                        option.value === value &&
                          "bg-primary-50 text-primary-700",
                      )}
                      onClick={() =>
                        !option.disabled && handleSelectChange(option.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !option.disabled) {
                          handleSelectChange(option.value);
                        }
                      }}
                      role="option"
                      aria-selected={option.value === value}
                      tabIndex={0}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            {showSelectedIndicator &&
                              option.value === value && (
                                <Check className="h-4 w-4 text-primary-600 mr-2 flex-shrink-0" />
                              )}
                            <span className="font-medium">{option.label}</span>
                          </div>
                          {showDescriptions && option.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {option.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Helper Text and Error */}
        <div className="mt-1 min-h-[20px]">
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
      </div>
    );
  },
);

SelectInput.displayName = "SelectInput";
