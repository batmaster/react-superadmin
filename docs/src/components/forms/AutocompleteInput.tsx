import React from 'react';

interface AutocompleteInputProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  options,
  value = '',
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
}) => {
  return (
    <div className='autocomplete-input'>
      <input
        type='text'
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      {options.length > 0 && (
        <div className='options-list mt-1 border border-gray-200 rounded-md'>
          {options.map(option => (
            <div
              key={option.value}
              className='px-3 py-2 hover:bg-gray-100 cursor-pointer'
              onClick={() => onChange?.(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
