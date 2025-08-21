import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { AlertCircle, GripVertical, Minus, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Label } from './Label';

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
      addButtonText = 'Add Item',
      removeButtonText = 'Remove',
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
    ref
  ) => {
    // Ensure value is always an array
    const arrayValue = useMemo(() => {
      if (!Array.isArray(value)) {
        return [];
      }
      return value;
    }, [value]);

    // Initialize with initial count if empty
    const [internalValue, setInternalValue] = useState(() => {
      if (arrayValue.length === 0 && initialCount > 0) {
        return Array(initialCount).fill('');
      }
      return arrayValue;
    });

    // Update internal value when prop changes
    React.useEffect(() => {
      if (arrayValue.length > 0) {
        setInternalValue(arrayValue);
      }
    }, [arrayValue]);

    const handleAddItem = useCallback(() => {
      if (internalValue.length >= maxItems) return;

      const newValue = [...internalValue, ''];
      setInternalValue(newValue);
      onChange?.(newValue);
    }, [internalValue, maxItems, onChange]);

    const handleRemoveItem = useCallback(
      (index: number) => {
        if (internalValue.length <= minItems) return;

        const newValue = internalValue.filter((_, i) => i !== index);
        setInternalValue(newValue);
        onChange?.(newValue);
      },
      [internalValue, minItems, onChange]
    );

    const handleAddAfter = useCallback(
      (index: number) => {
        if (internalValue.length >= maxItems) return;

        const newValue = [...internalValue];
        newValue.splice(index + 1, 0, '');
        setInternalValue(newValue);
        onChange?.(newValue);
      },
      [internalValue, maxItems, onChange]
    );

    const handleMoveUp = useCallback(
      (index: number) => {
        if (index === 0) return;

        const newValue = [...internalValue];
        [newValue[index], newValue[index - 1]] = [
          newValue[index - 1],
          newValue[index],
        ];
        setInternalValue(newValue);
        onChange?.(newValue);
      },
      [internalValue, onChange]
    );

    const handleMoveDown = useCallback(
      (index: number) => {
        if (index === internalValue.length - 1) return;

        const newValue = [...internalValue];
        [newValue[index], newValue[index + 1]] = [
          newValue[index + 1],
          newValue[index],
        ];
        setInternalValue(newValue);
        onChange?.(newValue);
      },
      [internalValue, onChange]
    );

    const handleItemChange = useCallback(
      (index: number, newValue: any) => {
        const newArray = [...internalValue];
        newArray[index] = newValue;
        setInternalValue(newArray);
        onChange?.(newArray);
      },
      [internalValue, onChange]
    );

    const canAdd = internalValue.length < maxItems;
    const canRemove = internalValue.length > minItems;

    return (
      <div ref={ref} className={className}>
        {label && (
          <Label
            required={required}
            className={labelClassName}
            disabled={disabled}
          >
            {label}
          </Label>
        )}

        <div className={itemsClassName}>
          {internalValue.map((itemValue, index) => {
            const isFirst = index === 0;
            const isLast = index === internalValue.length - 1;
            const isOnly = internalValue.length === 1;
            const canReorderItem = allowReorder && internalValue.length > 1;
            const canRemoveItem = canRemove && !isOnly;
            const canAddAfterItem = canAdd;

            const itemProps: ArrayInputItemProps = {
              index,
              value: itemValue,
              isFirst,
              isLast,
              isOnly,
              canReorder: canReorderItem,
              canRemove: canRemoveItem,
              canAddAfter: canAddAfterItem,
              onChange: value => handleItemChange(index, value),
              onRemove: () => handleRemoveItem(index),
              onAddAfter: () => handleAddAfter(index),
              onMoveUp: () => handleMoveUp(index),
              onMoveDown: () => handleMoveDown(index),
            };

            return (
              <div
                key={index}
                className={`flex items-center gap-2 ${itemClassName || ''}`}
              >
                {showItemNumbers && (
                  <span className='text-sm text-gray-500 min-w-[20px]'>
                    {index + 1}
                  </span>
                )}

                {canReorderItem && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleMoveUp(index)}
                    disabled={isFirst || disabled}
                    className={reorderHandleClassName}
                    aria-label={`Move item ${index + 1} up`}
                  >
                    ↑
                  </Button>
                )}

                <div className='flex-1'>{children(itemProps)}</div>

                {canReorderItem && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleMoveDown(index)}
                    disabled={isLast || disabled}
                    className={reorderHandleClassName}
                    aria-label={`Move item ${index + 1} down`}
                  >
                    ↓
                  </Button>
                )}

                {canRemoveItem && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleRemoveItem(index)}
                    disabled={disabled}
                    className={removeButtonClassName}
                    aria-label={`Remove item ${index + 1}`}
                  >
                    <Minus className='h-4 w-4' />
                  </Button>
                )}

                {canAddAfterItem && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleAddAfter(index)}
                    disabled={disabled}
                    className={addButtonClassName}
                    aria-label={`Add item after ${index + 1}`}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {canAdd && (
          <Button
            onClick={handleAddItem}
            disabled={disabled}
            className={`mt-2 ${addButtonClassName || ''}`}
            aria-label='Add new item'
          >
            <Plus className='h-4 w-4 mr-2' />
            {addButtonText}
          </Button>
        )}

        {showValidationErrors && errors.length > 0 && (
          <div className={`mt-2 text-sm text-red-600 ${errorClassName || ''}`}>
            {errors.map((error, index) => (
              <div key={index} className='flex items-center gap-2'>
                <AlertCircle className='h-4 w-4' />
                {error}
              </div>
            ))}
          </div>
        )}

        {helperText && (
          <div
            className={`mt-2 text-sm text-gray-600 ${helperClassName || ''}`}
          >
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

ArrayInput.displayName = 'ArrayInput';
