import React, { useCallback, useEffect, useState } from 'react';
import { AutocompleteInput } from './AutocompleteInput';
import { SelectInput } from './SelectInput';

export interface ReferenceInputProps {
  /** The name of the field */
  name: string;
  /** The label to display */
  label?: string;
  /** The resource to reference */
  reference: string;
  /** The field to display from the referenced resource */
  optionText?: string;
  /** The field to use as the value */
  optionValue?: string;
  /** Whether to allow multiple selections */
  multiple?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether to show the field */
  hidden?: boolean;
  /** The source field name */
  source?: string;
  /** The validation rules */
  validate?: any;
  /** The default value */
  defaultValue?: any;
  /** The current value */
  value?: any;
  /** Callback when the value changes */
  onChange?: (value: any) => void;
  /** Callback when the field is focused */
  onFocus?: () => void;
  /** Callback when the field is blurred */
  onBlur?: () => void;
  /** Whether to show a search input */
  searchable?: boolean;
  /** The placeholder text */
  placeholder?: string;
  /** Custom CSS class name */
  className?: string;
  /** Custom CSS class name for the label */
  labelClassName?: string;
  /** Custom CSS class name for the input */
  inputClassName?: string;
  /** Custom CSS class name for error messages */
  errorClassName?: string;
  /** Helper text to display */
  helperText?: string;
  /** Custom CSS class name for helper text */
  helperClassName?: string;
  /** Whether to show validation errors */
  showValidationErrors?: boolean;
  /** The validation errors */
  errors?: string[];
  /** The touched state */
  touched?: boolean;
  /** The loading state */
  loading?: boolean;
  /** The data provider function */
  dataProvider?: (resource: string, params: any) => Promise<any>;
  /** The filter to apply to the reference data */
  filter?: any;
  /** The sort to apply to the reference data */
  sort?: any;
  /** The pagination to apply to the reference data */
  pagination?: any;
  /** Whether to use autocomplete mode */
  autocomplete?: boolean;
  /** The minimum characters to trigger search */
  minSearchLength?: number;
  /** The maximum number of suggestions to show */
  maxSuggestions?: number;
  /** Whether to allow creating new options */
  allowCreate?: boolean;
  /** Callback when creating a new option */
  onCreate?: (value: string) => void;
  /** The size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show a clear button */
  clearable?: boolean;
  /** The icon to display */
  icon?: React.ReactNode;
  /** Whether to show loading spinner */
  showLoadingSpinner?: boolean;
  /** The empty state text */
  emptyText?: string;
  /** The no options text */
  noOptionsText?: string;
  /** The loading text */
  loadingText?: string;
  /** The error text */
  errorText?: string;
}

/**
 * ReferenceInput component for handling references to other resources
 *
 * This component allows users to select values from a referenced resource.
 * It supports both single and multiple selections, with optional search functionality.
 *
 * @example
 * ```tsx
 * <ReferenceInput
 *   name="author"
 *   label="Author"
 *   reference="authors"
 *   optionText="name"
 *   optionValue="id"
 *   required
 * />
 * ```
 */
export const ReferenceInput: React.FC<ReferenceInputProps> = ({
  name,
  label,
  reference,
  optionText = 'name',
  optionValue = 'id',
  multiple = false,
  required = false,
  disabled = false,
  hidden = false,
  source,
  validate,
  defaultValue,
  value,
  onChange,
  onFocus,
  onBlur,
  searchable = true,
  placeholder,
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  helperText,
  helperClassName = '',
  showValidationErrors = true,
  errors = [],
  touched = false,
  loading = false,
  dataProvider,
  filter,
  sort,
  pagination,
  autocomplete = false,
  minSearchLength = 2,
  maxSuggestions = 10,
  allowCreate = false,
  onCreate,
  size = 'md',
  clearable = true,
  icon,
  showLoadingSpinner = true,
  emptyText = 'No options available',
  noOptionsText = 'No options found',
  loadingText = 'Loading...',
  errorText = 'Error loading options',
}) => {
  const [options, setOptions] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');

  // Load reference data
  const loadReferenceData = useCallback(async () => {
    if (!dataProvider || !reference) return;

    setLoadingOptions(true);
    setError(null);

    try {
      const params = {
        pagination: pagination || { page: 1, perPage: 100 },
        sort: sort || { field: optionText, order: 'ASC' },
        filter: filter || {},
      };

      const result = await dataProvider(reference, 'getList', params);

      if (result && result.data) {
        const formattedOptions = result.data.map((item: any) => ({
          value: item[optionValue],
          label: item[optionText],
          data: item,
        }));
        setOptions(formattedOptions);
      }
    } catch (err) {
      setError(errorText || 'Failed to load reference data');
      console.error('Error loading reference data:', err);
    } finally {
      setLoadingOptions(false);
    }
  }, [
    dataProvider,
    reference,
    optionText,
    optionValue,
    filter,
    sort,
    pagination,
    errorText,
  ]);

  // Load data on mount
  useEffect(() => {
    loadReferenceData();
  }, [loadReferenceData]);

  // Handle search
  const handleSearch = useCallback(
    async (searchTerm: string) => {
      if (!dataProvider || !reference || searchTerm.length < minSearchLength) {
        return;
      }

      setLoadingOptions(true);
      setError(null);

      try {
        const params = {
          pagination: { page: 1, perPage: maxSuggestions },
          sort: sort || { field: optionText, order: 'ASC' },
          filter: {
            ...filter,
            [optionText]: searchTerm,
          },
        };

        const result = await dataProvider(reference, 'getList', params);

        if (result && result.data) {
          const formattedOptions = result.data.map((item: any) => ({
            value: item[optionValue],
            label: item[optionText],
            data: item,
          }));
          setOptions(formattedOptions);
        }
      } catch (err) {
        setError(errorText || 'Failed to search reference data');
        console.error('Error searching reference data:', err);
      } finally {
        setLoadingOptions(false);
      }
    },
    [
      dataProvider,
      reference,
      optionText,
      optionValue,
      filter,
      sort,
      maxSuggestions,
      minSearchLength,
      errorText,
    ]
  );

  // Handle value change
  const handleChange = useCallback(
    (newValue: any) => {
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  // Handle create new option
  const handleCreate = useCallback(
    (newValue: string) => {
      if (onCreate) {
        onCreate(newValue);
      }
    },
    [onCreate]
  );

  // Show error if validation errors exist and field is touched or showing all errors
  const showError = errors.length > 0 && (touched || showValidationErrors);
  const errorMessage = showError ? errors[0] : error;

  // If hidden, don't render anything
  if (hidden) {
    return null;
  }

  // Use AutocompleteInput for autocomplete mode
  if (autocomplete) {
    return (
      <AutocompleteInput
        label={label}
        value={value}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        disabled={disabled || loading}
        required={required}
        error={errorMessage}
        helperText={helperText}
        className={className}
        size={size}
        loading={loadingOptions}
        noOptionsMessage={noOptionsText}
        searchPlaceholder={placeholder}
      />
    );
  }

  // Use SelectInput for regular mode
  return (
    <SelectInput
      name={name}
      label={label}
      options={options}
      multiple={multiple}
      required={required}
      disabled={disabled || loading}
      source={source}
      validate={validate}
      defaultValue={defaultValue}
      value={value}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      searchable={searchable}
      placeholder={placeholder}
      className={className}
      labelClassName={labelClassName}
      selectClassName={inputClassName}
      errorClassName={errorClassName}
      helperText={helperText}
      helperClassName={helperClassName}
      showValidationErrors={showValidationErrors}
      error={errorMessage}
      touched={touched}
      loading={loadingOptions}
      size={size}
      clearable={clearable}
      icon={icon}
      showLoadingSpinner={showLoadingSpinner}
      emptyText={emptyText}
      noOptionsText={noOptionsText}
      loadingText={loadingText}
      errorText={error}
    />
  );
};
