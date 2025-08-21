import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { Check } from 'lucide-react';

export type BooleanInputVariant = 'checkbox' | 'switch' | 'toggle';

export interface BooleanInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'type' | 'size'
  > {
  /** Current boolean value */
  checked?: boolean;

  /** Callback when value changes */
  onChange: (checked: boolean) => void;

  /** Visual variant of the input */
  variant?: BooleanInputVariant;

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
  size?: 'sm' | 'md' | 'lg';

  /** Whether to show an indeterminate state (checkbox only) */
  indeterminate?: boolean;

  /** Custom class names */
  className?: string;

  /** Custom class names for the input element */
  inputClassName?: string;

  /** Custom class names for the label */
  labelClassName?: string;

  /** Color scheme for the input */
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

  /** Position of the label relative to the input */
  labelPosition?: 'left' | 'right';
}

/**
 * A versatile boolean input component that supports multiple variants:
 * checkbox, switch, and toggle with comprehensive styling and features.
 */
export const BooleanInput = forwardRef<HTMLInputElement, BooleanInputProps>(
  (
    {
      checked = false,
      onChange,
      variant = 'checkbox',
      label,
      helperText,
      error,
      required = false,
      disabled = false,
      size = 'md',
      indeterminate = false,
      className,
      inputClassName,
      labelClassName,
      colorScheme = 'primary',
      labelPosition = 'right',
      id,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const combinedRef = (node: HTMLInputElement) => {
      inputRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const inputId =
      id || `boolean-input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const isDisabled = disabled;

    // Handle indeterminate state for checkbox
    useEffect(() => {
      if (inputRef.current && variant === 'checkbox') {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, variant]);

    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const colorSchemeClasses = {
      primary: 'bg-blue-600 border-blue-600',
      secondary: 'bg-gray-600 border-gray-600',
      success: 'bg-green-600 border-green-600',
      warning: 'bg-orange-600 border-orange-600',
      danger: 'bg-red-600 border-red-600',
    };

    const baseInputClasses = cn(
      'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses[size],
      inputClassName
    );

    const renderCheckbox = () => (
      <div className='flex items-center'>
        <input
          ref={combinedRef}
          id={inputId}
          type='checkbox'
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={isDisabled}
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500',
            hasError && 'border-red-300 focus:ring-red-500',
            baseInputClasses
          )}
          aria-describedby={cn(
            helperText && `${inputId}-helper`,
            error && `${inputId}-error`
          )}
          aria-invalid={hasError}
          data-testid='boolean-input'
          {...props}
        />
      </div>
    );

    const renderSwitch = () => (
      <div className='flex items-center'>
        <input
          ref={combinedRef}
          id={inputId}
          type='checkbox'
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={isDisabled}
          className='sr-only'
          aria-describedby={cn(
            helperText && `${inputId}-helper`,
            error && `${inputId}-error`
          )}
          aria-invalid={hasError}
          data-testid='boolean-input'
          {...props}
        />
        <button
          type='button'
          role='switch'
          aria-checked={checked}
          disabled={isDisabled}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
            checked ? colorSchemeClasses[colorScheme] : 'bg-gray-200',
            isDisabled && 'cursor-not-allowed',
            baseInputClasses
          )}
          onClick={() => !isDisabled && onChange(!checked)}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
              checked ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>
    );

    const renderToggle = () => (
      <div className='flex items-center'>
        <input
          ref={combinedRef}
          id={inputId}
          type='checkbox'
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={isDisabled}
          className='sr-only'
          aria-describedby={cn(
            helperText && `${inputId}-helper`,
            error && `${inputId}-error`
          )}
          aria-invalid={hasError}
          data-testid='boolean-input'
          {...props}
        />
        <button
          type='button'
          role='switch'
          aria-checked={checked}
          disabled={isDisabled}
          className={cn(
            'relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200',
            checked ? colorSchemeClasses[colorScheme] : 'bg-gray-200',
            isDisabled && 'cursor-not-allowed',
            baseInputClasses
          )}
          onClick={() => !isDisabled && onChange(!checked)}
        >
          <span
            className={cn(
              'inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 shadow-md',
              checked ? 'translate-x-9' : 'translate-x-1'
            )}
          />
        </button>
      </div>
    );

    const renderInput = () => {
      switch (variant) {
        case 'switch':
          return renderSwitch();
        case 'toggle':
          return renderToggle();
        default:
          return renderCheckbox();
      }
    };

    const renderLabel = () => {
      if (!label) return null;

      return (
        <label
          htmlFor={inputId}
          className={cn(
            'text-sm font-medium',
            hasError && 'text-red-700',
            isDisabled && 'text-gray-500',
            labelClassName
          )}
        >
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      );
    };

    return (
      <div className={cn('w-full', className)}>
        <div
          className={cn(
            'flex items-center gap-3',
            labelPosition === 'left'
              ? 'flex-row'
              : 'flex-row-reverse justify-between'
          )}
        >
          {renderLabel()}
          {renderInput()}
        </div>

        {/* Helper Text and Error */}
        <div className='mt-1 min-h-[20px]'>
          {helperText && !hasError && (
            <p id={`${inputId}-helper`} className='text-sm text-gray-500'>
              {helperText}
            </p>
          )}

          {error && (
            <p id={`${inputId}-error`} className='text-sm text-red-600'>
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

BooleanInput.displayName = 'BooleanInput';
