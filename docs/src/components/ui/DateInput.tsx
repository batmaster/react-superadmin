import { Calendar, Clock } from 'lucide-react';
import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface DateInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value' | 'type' | 'size'
  > {
  /** Current date value (ISO string or null) */
  value?: string | null;

  /** Callback when date changes */
  onChange: (value: string | null) => void;

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

  /** Date format type */
  type?: 'date' | 'datetime-local' | 'time';

  /** Minimum allowed date (ISO string) */
  min?: string;

  /** Maximum allowed date (ISO string) */
  max?: string;

  /** Whether to show an icon */
  showIcon?: boolean;

  /** Custom class names */
  className?: string;

  /** Custom class names for the input element */
  inputClassName?: string;

  /** Custom class names for the label */
  labelClassName?: string;

  /** Placeholder text */
  placeholder?: string;
}

/**
 * An enhanced date input component with validation, accessibility features,
 * and flexible styling options.
 */
export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      value,
      onChange,
      label,
      helperText,
      error,
      required = false,
      disabled = false,
      size = 'md',
      type = 'date',
      min,
      max,
      showIcon = false,
      className,
      inputClassName,
      labelClassName,
      placeholder,
      id,
      ...props
    },
    ref
  ) => {
    const inputId =
      id || `date-input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const isDisabled = disabled;

    const sizeClasses = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    };

    const baseInputClasses = cn(
      'block w-full border rounded-md shadow-sm placeholder-gray-400 transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
      sizeClasses[size],
      hasError
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
      isDisabled && 'opacity-60',
      inputClassName
    );

    const getIcon = () => {
      if (!showIcon) return null;

      switch (type) {
        case 'time':
          return <Clock className='h-4 w-4 text-gray-400' />;
        case 'date':
        case 'datetime-local':
        default:
          return <Calendar className='h-4 w-4 text-gray-400' />;
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value || null;
      onChange(newValue);
    };

    return (
      <div className={cn('w-full', className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-gray-700 mb-1',
              hasError && 'text-red-700',
              isDisabled && 'text-gray-500',
              labelClassName
            )}
          >
            {label}
            {required && <span className='text-red-500 ml-1'>*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className='relative'>
          <input
            ref={ref}
            id={inputId}
            type={type}
            value={value || ''}
            onChange={handleChange}
            min={min}
            max={max}
            disabled={isDisabled}
            placeholder={placeholder}
            className={cn(baseInputClasses, 'pr-10')}
            aria-describedby={cn(
              helperText && `${inputId}-helper`,
              error && `${inputId}-error`
            )}
            aria-invalid={hasError}
            {...props}
          />

          {/* Icon */}
          {showIcon && (
            <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
              {getIcon()}
            </div>
          )}
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

DateInput.displayName = 'DateInput';
