import React, { forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input type - supports all HTML5 input types */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local';
  
  /** Label text for the input */
  label?: string;
  
  /** Helper text below the input */
  helperText?: string;
  
  /** Error message to display */
  error?: string;
  
  /** Whether the field is required */
  required?: boolean;
  
  /** Input size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Whether to show a loading state */
  loading?: boolean;
  
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode;
  
  /** Icon to display on the right side */
  rightIcon?: React.ReactNode;
  
  /** Whether to show character count */
  showCharacterCount?: boolean;
  
  /** Maximum character limit */
  maxLength?: number;
  
  /** Whether the input is disabled */
  disabled?: boolean;
  
  /** Whether the input is read-only */
  readOnly?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  label,
  helperText,
  error,
  required = false,
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  showCharacterCount = false,
  maxLength,
  disabled = false,
  readOnly = false,
  className,
  id,
  value: controlledValue,
  defaultValue,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  
  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  // Ensure value is never null or undefined for the input element
  const inputValue = value ?? '';
  
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  const isDisabled = disabled || loading;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  };
  
  const baseInputClasses = cn(
    'block w-full border rounded-md shadow-sm placeholder-gray-400 transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
    'read-only:bg-gray-50 read-only:text-gray-700',
    sizeClasses[size],
    hasError
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
    isDisabled && 'opacity-60',
    className
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only update internal state if not controlled
    if (controlledValue === undefined) {
      setInternalValue(e.target.value);
    }
    props.onChange?.(e);
  };
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };
  
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium text-gray-700 mb-1',
            hasError && 'text-red-700',
            isDisabled && 'text-gray-500'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        {/* Input Element */}
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isDisabled}
          readOnly={readOnly}
          maxLength={maxLength}
          aria-invalid={hasError}
          aria-describedby={cn(
            helperText && `${inputId}-helper`,
            error && `${inputId}-error`,
            showCharacterCount && maxLength && `${inputId}-count`
          )}
          className={cn(
            baseInputClasses,
            leftIcon && 'pl-10',
            rightIcon && 'pr-10'
          )}
          {...props}
        />
        
        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
        
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div 
              data-testid="loading-spinner"
              className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"
            ></div>
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
        
        {/* Character Count */}
        {showCharacterCount && maxLength && (
          <p id={`${inputId}-count`} className="text-sm text-gray-500 text-right">
            {String(value).length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';
