import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { ChevronDown, X, Search } from 'lucide-react';

export interface AutocompleteOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface AutocompleteInputProps {
  label?: string;
  value?: string | number;
  onChange: (value: string | number) => void;
  options: AutocompleteOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled';
  allowCustomValue?: boolean;
  maxSuggestions?: number;
  loading?: boolean;
  noOptionsMessage?: string;
  searchPlaceholder?: string;
}

export const AutocompleteInput = React.forwardRef<
  HTMLDivElement,
  AutocompleteInputProps
>(
  (
    {
      label,
      value,
      onChange,
      options,
      placeholder = 'Select an option...',
      disabled = false,
      required = false,
      error,
      helperText,
      className = '',
      size = 'md',
      variant = 'outline',
      allowCustomValue = false,
      maxSuggestions = 10,
      loading = false,
      noOptionsMessage = 'No options found',
      searchPlaceholder = 'Search options...',
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [inputValue, setInputValue] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Find the selected option
    const selectedOption = useMemo(() => {
      return options.find(option => option.value === value);
    }, [options, value]);

    // Filter options based on search query
    const filteredOptions = useMemo(() => {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Apply maxSuggestions limit to all options
      return filtered.slice(0, maxSuggestions);
    }, [options, searchQuery, maxSuggestions]);

    // Update input value when value prop changes
    useEffect(() => {
      setInputValue(selectedOption?.label || '');
    }, [selectedOption]);

    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (disabled) return;

        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            setHighlightedIndex(prev =>
              prev < filteredOptions.length - 1 ? prev + 1 : prev
            );
            break;
          case 'ArrowUp':
            event.preventDefault();
            setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
            break;
          case 'Enter':
            event.preventDefault();
            if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
              handleOptionSelect(filteredOptions[highlightedIndex]);
            } else if (allowCustomValue && inputValue.trim()) {
              onChange(inputValue.trim());
              setIsOpen(false);
            }
            break;
          case 'Escape':
            setIsOpen(false);
            setHighlightedIndex(-1);
            inputRef.current?.blur();
            break;
          case 'Tab':
            setIsOpen(false);
            setHighlightedIndex(-1);
            break;
        }
      },
      [
        disabled,
        highlightedIndex,
        filteredOptions,
        allowCustomValue,
        inputValue,
        onChange,
      ]
    );

    const handleOptionSelect = useCallback(
      (option: AutocompleteOption) => {
        if (option.disabled) return;

        onChange(option.value);
        setInputValue(option.label);
        setSearchQuery('');
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
      },
      [onChange]
    );

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setSearchQuery(newValue);
        setHighlightedIndex(-1);

        if (!isOpen) {
          setIsOpen(true);
        }
      },
      [isOpen]
    );

    const handleInputFocus = useCallback(() => {
      if (!disabled) {
        setIsOpen(true);
        setSearchQuery(inputValue);
      }
    }, [disabled, inputValue]);

    const handleClear = useCallback(() => {
      onChange('');
      setInputValue('');
      setSearchQuery('');
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    }, [onChange]);

    const handleToggle = useCallback(() => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen) {
          setSearchQuery(inputValue);
          inputRef.current?.focus();
        }
      }
    }, [disabled, isOpen, inputValue]);

    // Size classes
    const sizeClasses = {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-3 py-2',
      lg: 'text-lg px-4 py-2.5',
    };

    // Variant classes
    const variantClasses = {
      outline:
        'border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
      filled:
        'bg-gray-50 border border-gray-300 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
    };

    // Error classes
    const errorClasses = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
      : '';

    return (
      <div ref={ref} className={`w-full ${className}`}>
        {label && (
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {label}
            {required && <span className='text-red-500 ml-1'>*</span>}
          </label>
        )}

        <div ref={containerRef} className='relative'>
          <div className='relative'>
            <input
              ref={inputRef}
              type='text'
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className={`
                w-full rounded-md shadow-sm transition-colors
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                ${errorClasses}
                ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-text'}
                focus:outline-none
              `}
            />

            <div className='absolute inset-y-0 right-0 flex items-center pr-2'>
              {value && !disabled && (
                <button
                  type='button'
                  onClick={handleClear}
                  className='p-1 text-gray-400 hover:text-gray-600 transition-colors'
                  aria-label='Clear selection'
                >
                  <X size={16} />
                </button>
              )}

              <button
                type='button'
                onClick={handleToggle}
                disabled={disabled}
                className={`
                  p-1 ml-1 text-gray-400 transition-colors
                  ${disabled ? 'cursor-not-allowed' : 'hover:text-gray-600 cursor-pointer'}
                  ${isOpen ? 'rotate-180' : ''}
                `}
                aria-label='Toggle dropdown'
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div
              ref={dropdownRef}
              className='absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'
            >
              {/* Search input */}
              <div className='sticky top-0 bg-white border-b border-gray-200 p-2'>
                <div className='relative'>
                  <Search
                    size={16}
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  />
                  <input
                    type='text'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className='w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500'
                  />
                </div>
              </div>

              {/* Options list */}
              <div className='py-1'>
                {loading ? (
                  <div className='px-3 py-2 text-sm text-gray-500 text-center'>
                    Loading...
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className='px-3 py-2 text-sm text-gray-500 text-center'>
                    {noOptionsMessage}
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <button
                      key={option.value}
                      type='button'
                      onClick={() => handleOptionSelect(option)}
                      disabled={option.disabled}
                      className={`
                        w-full text-left px-3 py-2 text-sm transition-colors
                        ${option.disabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
                        ${highlightedIndex === index ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}
                        ${option.value === value ? 'bg-primary-100 text-primary-800' : ''}
                      `}
                    >
                      {option.label}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}

        {/* Helper text */}
        {helperText && !error && (
          <p className='mt-1 text-sm text-gray-500'>{helperText}</p>
        )}
      </div>
    );
  }
);

AutocompleteInput.displayName = 'AutocompleteInput';
