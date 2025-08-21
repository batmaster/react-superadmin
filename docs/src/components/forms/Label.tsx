import React from 'react';
import { cn } from '../../utils/cn';

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Whether the field is required */
  required?: boolean;

  /** Whether the label is disabled */
  disabled?: boolean;

  /** The size variant of the label */
  size?: 'sm' | 'md' | 'lg';

  /** The style variant of the label */
  variant?: 'default' | 'bold' | 'subtle';
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      children,
      required = false,
      disabled = false,
      size = 'md',
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    const variantClasses = {
      default: 'font-medium text-gray-700',
      bold: 'font-semibold text-gray-900',
      subtle: 'font-normal text-gray-600',
    };

    return (
      <label
        ref={ref}
        className={cn(
          'block',
          sizeClasses[size],
          variantClasses[variant],
          disabled && 'text-gray-400 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className='ml-1 text-red-500' aria-label='required'>
            *
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';
