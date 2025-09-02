import React, { useCallback, useEffect, useState } from "react";
import { ReferenceInput } from "./ReferenceInput";

export interface ReferenceArrayInputProps {
  /** The name of the field */
  name: string;
  /** The label to display */
  label?: string;
  /** The resource to reference */
  reference: string;
  /** The field to display from the referenced resource */
  optionText?: string;
  /** The field to use as the value */
  optionValue?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether to show the field */
  hidden?: boolean;
  /** The source field name */
  source?: string;
  /** The validation rules */
  validate?: any;
  /** The default value */
  defaultValue?: any[];
  /** The current value */
  value?: any[];
  /** Callback when the value changes */
  onChange?: (value: any[]) => void;
  /** Callback when the field is focused */
  onFocus?: () => void;
  /** Callback when the field is blurred */
  onBlur?: () => void;
  /** The placeholder text */
  placeholder?: string;
  /** Custom CSS class name */
  className?: string;
  /** Custom CSS class name for the label */
  labelClassName?: string;
  /** Custom CSS class name for the input */
  inputClassName?: string;
  /** Custom CSS class name for error messages */
  errorClassName?: string;
  /** Helper text to display */
  helperText?: string;
  /** Custom CSS class name for helper text */
  helperClassName?: string;
  /** Whether to show validation errors */
  showValidationErrors?: boolean;
  /** The validation errors */
  errors?: string[];
  /** The touched state */
  touched?: boolean;
  /** The loading state */
  loading?: boolean;
  /** The data provider function */
  dataProvider?: (resource: string, params: any) => Promise<any>;
  /** The filter to apply to the reference data */
  filter?: any;
  /** The sort to apply to the reference data */
  sort?: any;
  /** The pagination to apply to the reference data */
  pagination?: any;
  /** Whether to use autocomplete mode */
  autocomplete?: boolean;
  /** The minimum characters to trigger search */
  minSearchLength?: number;
  /** The maximum number of suggestions to show */
  maxSuggestions?: number;
  /** Whether to allow creating new options */
  allowCreate?: boolean;
  /** Callback when creating a new option */
  onCreate?: (value: string) => void;
  /** The size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to show a clear button */
  clearable?: boolean;
  /** The icon to display */
  icon?: React.ReactNode;
  /** Whether to show loading spinner */
  showLoadingSpinner?: boolean;
  /** The empty state text */
  emptyText?: string;
  /** The no options text */
  noOptionsText?: string;
  /** The loading text */
  loadingText?: string;
  /** The error text */
  errorText?: string;
  /** Maximum number of items that can be selected */
  maxItems?: number;
  /** Whether to allow reordering of selected items */
  allowReorder?: boolean;
  /** Callback when items are reordered */
  onReorder?: (items: any[]) => void;
  /** Whether to show selected items as chips/tags */
  showAsChips?: boolean;
  /** Custom renderer for selected items */
  renderSelectedItem?: (item: any, onRemove: () => void) => React.ReactNode;
}

/**
 * ReferenceArrayInput component for handling multiple references to other resources
 *
 * This component allows users to select multiple values from a referenced resource.
 * It supports array values, reordering, and various display modes.
 *
 * @example
 * ```tsx
 * <ReferenceArrayInput
 *   name="categories"
 *   label="Categories"
 *   reference="categories"
 *   optionText="name"
 *   optionValue="id"
 *   value={selectedCategories}
 *   onChange={setSelectedCategories}
 *   dataProvider={myDataProvider}
 * />
 * ```
 */
export const ReferenceArrayInput: React.FC<ReferenceArrayInputProps> = ({
  name,
  label,
  reference,
  optionText = "name",
  optionValue = "id",
  required = false,
  disabled = false,
  hidden = false,
  source,
  validate,
  defaultValue = [],
  value = [],
  onChange,
  onFocus,
  onBlur,
  placeholder,
  className = "",
  labelClassName = "",
  inputClassName = "",
  errorClassName = "",
  helperText,
  helperClassName = "",
  showValidationErrors = true,
  errors = [],
  touched = false,
  loading = false,
  dataProvider,
  filter,
  sort,
  pagination,
  autocomplete = false,
  minSearchLength = 2,
  maxSuggestions = 10,
  allowCreate = false,
  onCreate,
  size = "md",
  clearable = true,
  icon,
  showLoadingSpinner = true,
  emptyText = "No options available",
  noOptionsText = "No options found",
  loadingText = "Loading...",
  errorText = "Error loading options",
  maxItems,
  allowReorder = false,
  onReorder,
  showAsChips = true,
  renderSelectedItem,
}) => {
  const [selectedItems, setSelectedItems] = useState<any[]>(
    value || defaultValue,
  );

  // Update internal state when value prop changes
  useEffect(() => {
    setSelectedItems(value || defaultValue);
  }, [value, defaultValue]);

  // Handle adding a new item
  const handleAddItem = useCallback(
    (newValue: any) => {
      if (!newValue) return;

      const newItems = [...selectedItems, newValue];

      // Check max items limit
      if (maxItems && newItems.length > maxItems) {
        return;
      }

      setSelectedItems(newItems);
      if (onChange) {
        onChange(newItems);
      }
    },
    [selectedItems, maxItems, onChange],
  );

  // Handle removing an item
  const handleRemoveItem = useCallback(
    (itemToRemove: any) => {
      const newItems = selectedItems.filter((item) => item !== itemToRemove);
      setSelectedItems(newItems);
      if (onChange) {
        onChange(newItems);
      }
    },
    [selectedItems, onChange],
  );

  // Handle reordering items
  const handleReorder = useCallback(
    (reorderedItems: any[]) => {
      setSelectedItems(reorderedItems);
      if (onChange) {
        onChange(reorderedItems);
      }
      if (onReorder) {
        onReorder(reorderedItems);
      }
    },
    [onChange, onReorder],
  );

  // Handle clearing all items
  const handleClearAll = useCallback(() => {
    setSelectedItems([]);
    if (onChange) {
      onChange([]);
    }
  }, [onChange]);

  // Show error if validation errors exist and field is touched or showing all errors
  const showError = errors.length > 0 && (touched || showValidationErrors);
  const errorMessage = showError ? errors[0] : undefined;

  // If hidden, don't render anything
  if (hidden) {
    return null;
  }

  // Custom renderer for selected items
  const renderItem = (item: any, index: number) => {
    if (renderSelectedItem) {
      return renderSelectedItem(item, () => handleRemoveItem(item));
    }

    if (showAsChips) {
      return (
        <div
          key={`${item[optionValue]}-${index}`}
          className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded-md text-sm"
        >
          <span>{item[optionText]}</span>
          <button
            type="button"
            onClick={() => handleRemoveItem(item)}
            className="ml-1 text-primary-600 hover:text-primary-800"
            aria-label={`Remove ${item[optionText]}`}
          >
            ×
          </button>
        </div>
      );
    }

    return (
      <div
        key={`${item[optionValue]}-${index}`}
        className="flex items-center justify-between p-2 border rounded-md"
      >
        <span>{item[optionText]}</span>
        <button
          type="button"
          onClick={() => handleRemoveItem(item)}
          className="text-red-600 hover:text-red-800"
          aria-label={`Remove ${item[optionText]}`}
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Selected Items Display */}
      {selectedItems.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Selected Items ({selectedItems.length})
              {maxItems && ` / ${maxItems}`}
            </span>
            {clearable && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-2">
            {selectedItems.map((item, index) => renderItem(item, index))}
          </div>
        </div>
      )}

      {/* Reference Input for Adding New Items */}
      {(!maxItems || selectedItems.length < maxItems) && (
        <ReferenceInput
          name={`${name}_input`}
          label={selectedItems.length === 0 ? undefined : undefined}
          reference={reference}
          optionText={optionText}
          optionValue={optionValue}
          required={required && selectedItems.length === 0}
          disabled={disabled || loading}
          source={source}
          validate={validate}
          value={undefined}
          onChange={handleAddItem}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder || `Add ${label || "item"}`}
          className={inputClassName}
          labelClassName={labelClassName}
          errorClassName={errorClassName}
          helperText={helperText}
          helperClassName={helperClassName}
          showValidationErrors={showValidationErrors}
          errors={errors}
          touched={touched}
          loading={loading}
          dataProvider={dataProvider}
          filter={filter}
          sort={sort}
          pagination={pagination}
          autocomplete={autocomplete}
          minSearchLength={minSearchLength}
          maxSuggestions={maxSuggestions}
          allowCreate={allowCreate}
          onCreate={onCreate}
          size={size}
          clearable={clearable}
          icon={icon}
          showLoadingSpinner={showLoadingSpinner}
          emptyText={emptyText}
          noOptionsText={noOptionsText}
          loadingText={loadingText}
          errorText={errorText}
        />
      )}

      {/* Max Items Warning */}
      {maxItems && selectedItems.length >= maxItems && (
        <p className="text-sm text-amber-600 mt-1">
          Maximum {maxItems} items selected
        </p>
      )}

      {/* Error Display */}
      {errorMessage && (
        <p className={`text-sm text-red-600 mt-1 ${errorClassName}`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};
