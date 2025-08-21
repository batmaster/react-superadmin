import { AlertCircle, GripVertical, Minus, Plus } from "lucide-react";
import React, { forwardRef, useCallback, useMemo } from "react";
import { cn } from "../../utils/cn";
import { Button } from "../ui/Button";
import { Label } from "./Label";

export interface ArrayInputProps {
  /** The label for the array input */
  label?: string;

  /** Whether the field is required */
  required?: boolean;

  /** The current array value */
  value?: any[];

  /** Callback when the array value changes */
  onChange?: (value: any[]) => void;

  /** Function to render each array item */
  children: (props: ArrayInputItemProps) => React.ReactNode;

  /** Initial number of items to show */
  initialCount?: number;

  /** Minimum number of items allowed */
  minItems?: number;

  /** Maximum number of items allowed */
  maxItems?: number;

  /** Whether to allow reordering of items */
  allowReorder?: boolean;

  /** Whether to show item numbers */
  showItemNumbers?: boolean;

  /** Custom add button text */
  addButtonText?: string;

  /** Custom remove button text */
  removeButtonText?: string;

  /** Whether to show validation errors */
  showValidationErrors?: boolean;

  /** Validation errors for the array */
  errors?: string[];

  /** Helper text to display below the input */
  helperText?: string;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** CSS class names for the container */
  className?: string;

  /** CSS class names for the label */
  labelClassName?: string;

  /** CSS class names for the array items container */
  itemsClassName?: string;

  /** CSS class names for individual array items */
  itemClassName?: string;

  /** CSS class names for the add button */
  addButtonClassName?: string;

  /** CSS class names for the remove button */
  removeButtonClassName?: string;

  /** CSS class names for the reorder handle */
  reorderHandleClassName?: string;

  /** CSS class names for validation errors */
  errorClassName?: string;

  /** CSS class names for helper text */
  helperClassName?: string;
}

export interface ArrayInputItemProps {
  /** The index of this item in the array */
  index: number;

  /** The current value of this item */
  value: any;

  /** Whether this is the first item */
  isFirst: boolean;

  /** Whether this is the last item */
  isLast: boolean;

  /** Whether this is the only item */
  isOnly: boolean;

  /** Whether reordering is allowed */
  canReorder: boolean;

  /** Whether this item can be removed */
  canRemove: boolean;

  /** Whether this item can be added after */
  canAddAfter: boolean;

  /** Callback to update this item's value */
  onChange: (value: any) => void;

  /** Callback to remove this item */
  onRemove: () => void;

  /** Callback to add an item after this one */
  onAddAfter: () => void;

  /** Callback to move this item up */
  onMoveUp: () => void;

  /** Callback to move this item down */
  onMoveDown: () => void;
}

/**
 * A comprehensive array input component that supports dynamic arrays of form fields.
 * Follows React Admin patterns with add/remove functionality, validation, and accessibility.
 *
 * @example
 * // Basic usage with text inputs
 * <ArrayInput label="Tags" value={tags} onChange={setTags}>
 *   {({ index, value, onChange, onRemove, canRemove }) => (
 *     <div key={index} className="flex gap-2">
 *       <Input value={value} onChange={onChange} />
 *       {canRemove && <Button onClick={onRemove}>Remove</Button>}
 *     </div>
 *   )}
 * </ArrayInput>
 *
 * @example
 * // With validation and reordering
 * <ArrayInput
 *   label="Skills"
 *   value={skills}
 *   onChange={setSkills}
 *   allowReorder
 *   minItems={1}
 *   maxItems={10}
 *   errors={validationErrors}
 * >
 *   {({ index, value, onChange, onRemove, onMoveUp, onMoveDown, canReorder }) => (
 *     <div key={index} className="flex gap-2 items-center">
 *       {canReorder && <Button onClick={onMoveUp}>↑</Button>}
 *       <Input value={value} onChange={onChange} />
 *       {canReorder && <Button onClick={onMoveDown}>↓</Button>}
 *       <Button onClick={onRemove}>Remove</Button>}
 *     </div>
 *   )}
 * </ArrayInput>
 */
export const ArrayInput = forwardRef<HTMLDivElement, ArrayInputProps>(
  (
    {
      label,
      required = false,
      value = [],
      onChange,
      children,
      initialCount = 1,
      minItems = 0,
      maxItems = Infinity,
      allowReorder = false,
      showItemNumbers = true,
      addButtonText = "Add Item",
      removeButtonText = "Remove",
      showValidationErrors = true,
      errors = [],
      helperText,
      disabled = false,
      className,
      labelClassName,
      itemsClassName,
      itemClassName,
      addButtonClassName,
      removeButtonClassName,
      reorderHandleClassName,
      errorClassName,
      helperClassName,
    },
    ref,
  ) => {
    // Ensure value is always an array
    const arrayValue = useMemo(() => {
      if (!Array.isArray(value)) {
        return [];
      }
      return value;
    }, [value]);

    // Initialize with initial count if empty
    const initializedValue = useMemo(() => {
      if (arrayValue.length === 0 && initialCount > 0) {
        return Array(initialCount).fill(null);
      }
      return arrayValue;
    }, [arrayValue, initialCount]);

    // Update the parent form value
    const updateValue = useCallback(
      (newValue: any[]) => {
        if (onChange && !disabled) {
          onChange(newValue);
        }
      },
      [onChange, disabled],
    );

    // Add a new item at the end
    const addItem = useCallback(() => {
      if (arrayValue.length >= maxItems) return;
      const newValue = [...arrayValue, null];
      updateValue(newValue);
    }, [arrayValue, maxItems, updateValue]);

    // Add a new item after a specific index
    const addItemAfter = useCallback(
      (index: number) => {
        if (arrayValue.length >= maxItems) return;
        const newValue = [...arrayValue];
        newValue.splice(index + 1, 0, null);
        updateValue(newValue);
      },
      [arrayValue, maxItems, updateValue],
    );

    // Remove an item at a specific index
    const removeItem = useCallback(
      (index: number) => {
        if (arrayValue.length <= minItems) return;
        const newValue = arrayValue.filter((_, i) => i !== index);
        updateValue(newValue);
      },
      [arrayValue, minItems, updateValue],
    );

    // Update an item's value
    const updateItem = useCallback(
      (index: number, newValue: any) => {
        const newArray = [...arrayValue];
        newArray[index] = newValue;
        updateValue(newArray);
      },
      [arrayValue, updateValue],
    );

    // Move an item up in the array
    const moveItemUp = useCallback(
      (index: number) => {
        if (index === 0 || !allowReorder) return;
        const newValue = [...arrayValue];
        [newValue[index - 1], newValue[index]] = [
          newValue[index],
          newValue[index - 1],
        ];
        updateValue(newValue);
      },
      [arrayValue, allowReorder, updateValue],
    );

    // Move an item down in the array
    const moveItemDown = useCallback(
      (index: number) => {
        if (index === arrayValue.length - 1 || !allowReorder) return;
        const newValue = [...arrayValue];
        [newValue[index], newValue[index + 1]] = [
          newValue[index + 1],
          newValue[index],
        ];
        updateValue(newValue);
      },
      [arrayValue, allowReorder, updateValue],
    );

    // Check if we can add more items
    const canAddMore = arrayValue.length < maxItems;

    // Check if we can remove items
    const canRemoveItems = arrayValue.length > minItems;

    // Container classes
    const containerClasses = cn("array-input", "space-y-4", className);

    // Items container classes
    const itemsContainerClasses = cn(
      "array-input-items",
      "space-y-3",
      itemsClassName,
    );

    // Individual item classes
    const itemClasses = cn(
      "array-input-item",
      "flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white",
      "hover:border-gray-300 transition-colors",
      itemClassName,
    );

    // Add button classes
    const addButtonClasses = cn("array-input-add-button", addButtonClassName);

    // Remove button classes
    const removeButtonClasses = cn(
      "array-input-remove-button",
      "text-red-600 hover:text-red-700",
      removeButtonClassName,
    );

    // Reorder handle classes
    const reorderHandleClasses = cn(
      "array-input-reorder-handle",
      "text-gray-400 hover:text-gray-600 cursor-move",
      reorderHandleClassName,
    );

    // Error classes
    const errorClasses = cn(
      "array-input-error",
      "text-red-600 text-sm font-medium flex items-center gap-2",
      errorClassName,
    );

    // Helper text classes
    const helperClasses = cn(
      "array-input-helper",
      "text-gray-600 text-sm",
      helperClassName,
    );

    return (
      <div className={containerClasses} ref={ref}>
        {/* Label */}
        {label && (
          <Label
            className={labelClassName}
            required={required}
            disabled={disabled}
          >
            {label}
          </Label>
        )}

        {/* Array Items */}
        <div className={itemsContainerClasses}>
          {initializedValue.map((itemValue, index) => {
            const isFirst = index === 0;
            const isLast = index === initializedValue.length - 1;
            const isOnly = initializedValue.length === 1;
            const canReorder = allowReorder && initializedValue.length > 1;
            const canRemove = canRemoveItems && !isOnly;
            const canAddAfter = canAddMore;

            const itemProps: ArrayInputItemProps = {
              index,
              value: itemValue,
              isFirst,
              isLast,
              isOnly,
              canReorder,
              canRemove,
              canAddAfter,
              onChange: (value) => updateItem(index, value),
              onRemove: () => removeItem(index),
              onAddAfter: () => addItemAfter(index),
              onMoveUp: () => moveItemUp(index),
              onMoveDown: () => moveItemDown(index),
            };

            return (
              <div key={index} className={itemClasses}>
                {/* Reorder Handle */}
                {canReorder && (
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveItemUp(index)}
                      disabled={isFirst}
                      className={cn(
                        "p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
                        isFirst && "invisible",
                      )}
                      aria-label={`Move item ${index + 1} up`}
                    >
                      <GripVertical className="w-4 h-4 rotate-90" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItemDown(index)}
                      disabled={isLast}
                      className={cn(
                        "p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
                        isLast && "invisible",
                      )}
                      aria-label={`Move item ${index + 1} down`}
                    >
                      <GripVertical className="w-4 h-4 -rotate-90" />
                    </button>
                  </div>
                )}

                {/* Item Number */}
                {showItemNumbers && (
                  <div className="flex flex-shrink-0 justify-center items-center w-8 h-8 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
                    {index + 1}
                  </div>
                )}

                {/* Item Content */}
                <div className="flex-1">{children(itemProps)}</div>

                {/* Item Actions */}
                <div className="flex flex-shrink-0 gap-2 items-center">
                  {/* Add After Button */}
                  {canAddAfter && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addItemAfter(index)}
                      disabled={disabled}
                      className="p-2"
                      aria-label={`Add item after ${index + 1}`}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Remove Button */}
                  {canRemove && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={disabled}
                      className={removeButtonClasses}
                      aria-label={`Remove item ${index + 1}`}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Button */}
        {canAddMore && (
          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            disabled={disabled}
            className={addButtonClasses}
            aria-label="Add new item"
          >
            <Plus className="mr-2 w-4 h-4" />
            {addButtonText}
          </Button>
        )}

        {/* Validation Errors */}
        {showValidationErrors && errors.length > 0 && (
          <div className={errorClasses}>
            <AlertCircle className="w-4 h-4" />
            <ul className="space-y-1 list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Helper Text */}
        {helperText && <div className={helperClasses}>{helperText}</div>}
      </div>
    );
  },
);

ArrayInput.displayName = "ArrayInput";
