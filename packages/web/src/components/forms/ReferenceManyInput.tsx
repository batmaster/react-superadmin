import React, { useCallback, useEffect, useState } from "react";
import { ReferenceInput } from "./ReferenceInput";

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
  /** The target resource for the many-to-many relationship */
  target?: string;
  /** The foreign key field */
  foreignKey?: string;
  /** The junction table name */
  junctionTable?: string;
  /** Whether to use a junction table */
  useJunctionTable?: boolean;
  /** The junction table foreign keys */
  junctionTableKeys?: {
    sourceKey: string;
    targetKey: string;
  };
}

/**
 * ReferenceManyInput component for handling many-to-many relationships
 *
 * This component allows users to select multiple values from a referenced resource
 * in a many-to-many relationship context. It supports junction tables and
 * efficient data loading for large datasets.
 *
 * @example
 * ```tsx
 * <ReferenceManyInput
 *   name="categories"
 *   label="Categories"
 *   reference="categories"
 *   target="posts"
 *   foreignKey="postId"
 *   value={selectedCategories}
 *   onChange={setSelectedCategories}
 *   dataProvider={myDataProvider}
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
  target,
  foreignKey,
  junctionTable,
  useJunctionTable = false,
  junctionTableKeys,
}) => {
  const [selectedItems, setSelectedItems] = useState<any[]>(
    value || defaultValue,
  );
  const [junctionData, setJunctionData] = useState<any[]>([]);

  // Update internal state when value prop changes
  useEffect(() => {
    setSelectedItems(value || defaultValue);
  }, [value, defaultValue]);

  // Load junction table data if using junction table
  useEffect(() => {
    if (useJunctionTable && junctionTable && dataProvider) {
      loadJunctionData();
    }
  }, [useJunctionTable, junctionTable, dataProvider]);

  // Load junction table data
  const loadJunctionData = useCallback(async () => {
    if (!dataProvider || !junctionTable) return;

    try {
      const response = await dataProvider(junctionTable, {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: "id", order: "ASC" },
        filter: {},
      });

      setJunctionData(response.data || []);
    } catch (error) {
      console.error("Error loading junction data:", error);
    }
  }, [dataProvider, junctionTable]);

  // Handle adding a new item
  const handleAddItem = useCallback(
    async (newValue: any) => {
      if (!newValue) return;

      const newItems = [...selectedItems, newValue];

      // Check max items limit
      if (maxItems && newItems.length > maxItems) {
        return;
      }

      setSelectedItems(newItems);

      // If using junction table, create junction record
      if (
        useJunctionTable &&
        junctionTable &&
        dataProvider &&
        target &&
        foreignKey
      ) {
        try {
          const junctionRecord = {
            [junctionTableKeys?.sourceKey || foreignKey]: target,
            [junctionTableKeys?.targetKey || `${reference}Id`]:
              newValue[optionValue],
          };

          await dataProvider(junctionTable, {
            data: junctionRecord,
          });
        } catch (error) {
          console.error("Error creating junction record:", error);
        }
      }

      if (onChange) {
        onChange(newItems);
      }
    },
    [
      selectedItems,
      maxItems,
      onChange,
      useJunctionTable,
      junctionTable,
      dataProvider,
      target,
      foreignKey,
      junctionTableKeys,
      reference,
      optionValue,
    ],
  );

  // Handle removing an item
  const handleRemoveItem = useCallback(
    async (itemToRemove: any) => {
      const newItems = selectedItems.filter((item) => item !== itemToRemove);
      setSelectedItems(newItems);

      // If using junction table, remove junction record
      if (
        useJunctionTable &&
        junctionTable &&
        dataProvider &&
        target &&
        foreignKey
      ) {
        try {
          const junctionRecord = junctionData.find(
            (record) =>
              record[junctionTableKeys?.sourceKey || foreignKey] === target &&
              record[junctionTableKeys?.targetKey || `${reference}Id`] ===
                itemToRemove[optionValue],
          );

          if (junctionRecord) {
            await dataProvider(junctionTable, {
              id: junctionRecord.id,
            });
          }
        } catch (error) {
          console.error("Error removing junction record:", error);
        }
      }

      if (onChange) {
        onChange(newItems);
      }
    },
    [
      selectedItems,
      onChange,
      useJunctionTable,
      junctionTable,
      dataProvider,
      target,
      foreignKey,
      junctionTableKeys,
      reference,
      optionValue,
      junctionData,
    ],
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
  const handleClearAll = useCallback(async () => {
    setSelectedItems([]);

    // If using junction table, remove all junction records
    if (
      useJunctionTable &&
      junctionTable &&
      dataProvider &&
      target &&
      foreignKey
    ) {
      try {
        const junctionRecords = junctionData.filter(
          (record) =>
            record[junctionTableKeys?.sourceKey || foreignKey] === target,
        );

        for (const record of junctionRecords) {
          await dataProvider(junctionTable, {
            id: record.id,
          });
        }
      } catch (error) {
        console.error("Error removing junction records:", error);
      }
    }

    if (onChange) {
      onChange([]);
    }
  }, [
    onChange,
    useJunctionTable,
    junctionTable,
    dataProvider,
    target,
    foreignKey,
    junctionTableKeys,
    junctionData,
  ]);

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
