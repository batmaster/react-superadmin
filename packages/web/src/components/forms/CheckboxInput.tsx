import React from 'react';
import { cn } from '../../utils/cn';

interface CheckboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({ 
  className, 
  error, 
  ...props 
}) => {
  return (
    <input
      type="checkbox"
      className={cn(
        'h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded',
        error && 'border-red-300 focus:ring-red-500',
        className
      )}
      {...props}
    />
  );
};
