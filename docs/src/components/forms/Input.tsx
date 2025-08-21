import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The label for the input */
  label?: string;

  /** Whether the field is required */
  required?: boolean;

  /** Helper text to display below the input */
  helperText?: string;

  /** Error message to display */
  error?: string;

  /** Whether to show a password toggle button */
  showPasswordToggle?: boolean;

  /** CSS class names for the label */
  labelClassName?: string;

  /** CSS class names for the helper text */
  helperClassName?: string;

  /** CSS class names for the error message */
  errorClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      required = false,
      helperText,
      error,
      showPasswordToggle = false,
      className,
      labelClassName,
      helperClassName,
      errorClassName,
      type = 'text',
      disabled,
      ...props
    },
    ref
  ) => {
    const [inputType, setInputType] = useState(type);
    const [isFocused, setIsFocused] = useState(false);

    const togglePasswordVisibility = () => {
      setInputType(inputType === 'password' ? 'text' : 'password');
    };

    const inputId =
      props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className='space-y-2'>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-gray-700',
              disabled && 'text-gray-400',
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className='ml-1 text-red-500' aria-label='required'>
                *
              </span>
            )}
          </label>
        )}

        <div className='relative'>
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            className={cn(
              'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm',
              'placeholder:text-gray-400',
              'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              [helperText && `${inputId}-helper`, error && `${inputId}-error`]
                .filter(Boolean)
                .join(' ') || undefined
            }
            {...props}
          />

          {showPasswordToggle && type === 'password' && (
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
              aria-label={
                inputType === 'password' ? 'Show password' : 'Hide password'
              }
            >
              {inputType === 'password' ? (
                <Eye className='h-4 w-4' />
              ) : (
                <EyeOff className='h-4 w-4' />
              )}
            </button>
          )}
        </div>

        {helperText && (
          <p
            id={`${inputId}-helper`}
            className={cn(
              'text-sm text-gray-500',
              disabled && 'text-gray-400',
              helperClassName
            )}
          >
            {helperText}
          </p>
        )}

        {error && (
          <p
            id={`${inputId}-error`}
            className={cn('text-sm text-red-600', errorClassName)}
            role='alert'
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
