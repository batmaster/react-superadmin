import React from 'react';
import { cn } from '../../utils/cn';

interface SelectInputProps {
  value: any;
  onChange: (value: any) => void;
  options: Array<{ value: any; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  error,
  className,
}) => {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={cn(
        'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
        error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
        className
      )}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
