import React from 'react';

interface SelectInputProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  options,
  value = '',
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  multiple = false,
}) => {
  return (
    <select
      value={value}
      onChange={e => onChange?.(e.target.value)}
      disabled={disabled}
      multiple={multiple}
      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
    >
      <option value='' disabled>
        {placeholder}
      </option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
