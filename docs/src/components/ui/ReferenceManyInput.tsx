import React, { useCallback, useEffect, useState } from "react";
import { ReferenceInput } from "../forms/ReferenceInput";

export interface ReferenceManyInputProps {
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
  /** The maximum number of items that can be selected */
  maxItems?: number;
  /** Whether to allow reordering items */
  allowReorder?: boolean;
  /** Callback when items are reordered */
  onReorder?: (items: any[]) => void;
  /** Whether to display items as chips */
  showAsChips?: boolean;
  /** Custom renderer for selected items */
  renderSelectedItem?: (item: any) => React.ReactNode;
  /** Whether to use junction table for many-to-many relationships */
  useJunctionTable?: boolean;
  /** The name of the junction table */
  junctionTable?: string;
  /** The foreign key field name */
  foreignKey?: string;
  /** The target field name in the junction table */
  target?: string;
  /** Custom junction table key names */
  junctionTableKeys?: { foreignKey: string; target: string };
}

/**
 * ReferenceManyInput component for handling many-to-many reference relationships
 *
 * This component allows users to select multiple values from a referenced resource
 * with automatic junction table management for many-to-many relationships.
 *
 * @example
 * ```tsx
 * <ReferenceManyInput
 *   name="tags"
 *   label="Tags"
 *   reference="tags"
 *   optionText="name"
 *   optionValue="id"
 *   useJunctionTable={true}
 *   junctionTable="post_tags"
 *   foreignKey="post_id"
 *   target="tag_id"
 * />
 * ```
 */
export const ReferenceManyInput: React.FC<ReferenceManyInputProps> = ({
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
  useJunctionTable = false,
  junctionTable,
  foreignKey,
  target,
  junctionTableKeys,
}) => {
  const [selectedItems, setSelectedItems] = useState<any[]>(
    value || defaultValue || [],
  );
  const [junctionData, setJunctionData] = useState<any[]>([]);
  const [loadingJunction, setLoadingJunction] = useState(false);
  const [junctionError, setJunctionError] = useState<string | null>(null);

  // Load junction data when useJunctionTable is true
  useEffect(() => {
    if (useJunctionTable && junctionTable && dataProvider) {
      loadJunctionData();
    }
  }, [useJunctionTable, junctionTable, dataProvider]);

  const loadJunctionData = useCallback(async () => {
    if (!useJunctionTable || !junctionTable || !dataProvider) return;

    setLoadingJunction(true);
    setJunctionError(null);

    try {
      const fk = junctionTableKeys?.foreignKey || foreignKey;
      const targetKey = junctionTableKeys?.target || target;

      if (!fk || !targetKey) {
        throw new Error(
          "Foreign key and target must be specified for junction table",
        );
      }

      const params = {
        pagination: { page: 1, perPage: 1000 },
        filter: {},
      };

      const result = await dataProvider(junctionTable, params);

      if (result && result.data) {
        setJunctionData(result.data);
      }
    } catch (err) {
      setJunctionError("Failed to load junction data");
      console.error("Error loading junction data:", err);
    } finally {
      setLoadingJunction(false);
    }
  }, [
    useJunctionTable,
    junctionTable,
    dataProvider,
    foreignKey,
    target,
    junctionTableKeys,
  ]);

  // Update selected items when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedItems(value);
    }
  }, [value]);

  // Handle adding a new item
  const handleAddItem = useCallback(
    async (newItem: any) => {
      if (!newItem) return;

      // Check if item already exists
      const exists = selectedItems.some(
        (item) => item[optionValue] === newItem[optionValue],
      );
      if (exists) return;

      // Check max items limit
      if (maxItems && selectedItems.length >= maxItems) return;

      const updatedItems = [...selectedItems, newItem];

      // Create junction record if using junction table
      if (useJunctionTable && junctionTable && dataProvider) {
        try {
          const fk = junctionTableKeys?.foreignKey || foreignKey;
          const targetKey = junctionTableKeys?.target || target;

          if (fk && targetKey) {
            await dataProvider(junctionTable, {
              data: {
                [fk]: "current_record_id", // This would be the actual record ID
                [targetKey]: newItem[optionValue],
              },
            });
          }
        } catch (err) {
          console.error("Error creating junction record:", err);
          // Don't add the item if junction creation fails
          return;
        }
      }

      setSelectedItems(updatedItems);
      onChange?.(updatedItems);
    },
    [
      selectedItems,
      optionValue,
      maxItems,
      useJunctionTable,
      junctionTable,
      dataProvider,
      foreignKey,
      target,
      junctionTableKeys,
      onChange,
    ],
  );

  // Handle removing an item
  const handleRemoveItem = useCallback(
    async (itemToRemove: any) => {
      const updatedItems = selectedItems.filter(
        (item) => item[optionValue] !== itemToRemove[optionValue],
      );

      // Delete junction record if using junction table
      if (useJunctionTable && junctionTable && dataProvider) {
        try {
          const fk = junctionTableKeys?.foreignKey || foreignKey;
          const targetKey = junctionTableKeys?.target || target;

          if (fk && targetKey) {
            // Find and delete the junction record
            const junctionRecord = junctionData.find(
              (record) => record[targetKey] === itemToRemove[optionValue],
            );

            if (junctionRecord) {
              await dataProvider(junctionTable, {
                id: junctionRecord.id,
              });
            }
          }
        } catch (err) {
          console.error("Error deleting junction record:", err);
          // Continue with removal even if junction deletion fails
        }
      }

      setSelectedItems(updatedItems);
      onChange?.(updatedItems);
    },
    [
      selectedItems,
      optionValue,
      useJunctionTable,
      junctionTable,
      dataProvider,
      foreignKey,
      target,
      junctionTableKeys,
      junctionData,
      onChange,
    ],
  );

  // Handle clearing all items
  const handleClearAll = useCallback(async () => {
    // Delete all junction records if using junction table
    if (useJunctionTable && junctionTable && dataProvider) {
      try {
        const fk = junctionTableKeys?.foreignKey || foreignKey;
        const targetKey = junctionTableKeys?.target || target;

        if (fk && targetKey) {
          // Delete all junction records for current record
          for (const item of selectedItems) {
            const junctionRecord = junctionData.find(
              (record) => record[targetKey] === item[optionValue],
            );

            if (junctionRecord) {
              await dataProvider(junctionTable, {
                id: junctionRecord.id,
              });
            }
          }
        }
      } catch (err) {
        console.error("Error deleting junction records:", err);
        // Continue with clearing even if junction deletion fails
      }
    }

    setSelectedItems([]);
    onChange?.([]);
  }, [
    selectedItems,
    optionValue,
    useJunctionTable,
    junctionTable,
    dataProvider,
    foreignKey,
    target,
    junctionTableKeys,
    junctionData,
    onChange,
  ]);

  // Handle reordering items
  const handleReorder = useCallback(
    (reorderedItems: any[]) => {
      setSelectedItems(reorderedItems);
      onChange?.(reorderedItems);
      onReorder?.(reorderedItems);
    },
    [onChange, onReorder],
  );

  // Show error if validation errors exist and field is touched or showing all errors
  const showError = errors.length > 0 && (touched || showValidationErrors);
  const errorMessage = showError ? errors[0] : junctionError;

  // If hidden, don't render anything
  if (hidden) {
    return null;
  }

  // Check if max items reached
  const maxItemsReached = maxItems ? selectedItems.length >= maxItems : false;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label
          className={`block text-sm font-medium text-gray-700 mb-1 ${
            showError ? "text-red-700" : ""
          } ${disabled ? "text-gray-500" : ""} ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Selected Items Display */}
      {selectedItems.length > 0 && (
        <div className="mb-3">
          {showAsChips ? (
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((item, index) => (
                <div
                  key={`${item[optionValue]}-${index}`}
                  className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                  <span className="mr-2">
                    {renderSelectedItem
                      ? renderSelectedItem(item)
                      : item[optionText]}
                  </span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item)}
                      className="text-blue-600 hover:text-blue-800 focus:outline-none"
                      aria-label={`Remove ${item[optionText]}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {selectedItems.map((item, index) => (
                <div
                  key={`${item[optionValue]}-${index}`}
                  className="flex items-center justify-between p-2 border border-gray-200 rounded"
                >
                  <span>
                    {renderSelectedItem
                      ? renderSelectedItem(item)
                      : item[optionText]}
                  </span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item)}
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                      aria-label={`Remove ${item[optionText]}`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Clear All Button */}
          {clearable && selectedItems.length > 1 && !disabled && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-sm text-gray-500 hover:text-gray-700 mt-2"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Reference Input for Adding New Items */}
      {!maxItemsReached && (
        <div className={inputClassName}>
          <ReferenceInput
            name={`${name}_input`}
            label={selectedItems.length === 0 ? label : undefined}
            reference={reference}
            optionText={optionText}
            optionValue={optionValue}
            disabled={disabled || loading}
            placeholder={placeholder}
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
            clearable={false}
            showLoadingSpinner={showLoadingSpinner}
            emptyText={emptyText}
            noOptionsText={noOptionsText}
            loadingText={loadingText}
            errorText={errorText}
            onChange={handleAddItem}
            onFocus={onFocus}
            onBlur={onBlur}
            errors={showError ? [errorMessage || ""] : []}
            touched={touched}
            showValidationErrors={showValidationErrors}
            errorClassName={errorClassName}
            helperClassName={helperClassName}
          />
        </div>
      )}

      {/* Max Items Message */}
      {maxItemsReached && (
        <p className="text-sm text-gray-500 mt-1">
          Maximum {maxItems} items reached
        </p>
      )}

      {/* Helper Text */}
      {helperText && !showError && (
        <p className={`text-sm text-gray-500 mt-1 ${helperClassName}`}>
          {helperText}
        </p>
      )}

      {/* Error Message */}
      {errorMessage && (
        <p className={`text-sm text-red-600 mt-1 ${errorClassName}`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};
