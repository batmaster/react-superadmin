import React, { forwardRef, useState, useEffect, useCallback } from "react";
import { Search, X, Filter } from "lucide-react";
import { cn } from "../../utils/cn";

export interface SearchInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type" | "size" | "autoFocus"
  > {
  /** Current search value */
  value?: string;

  /** Callback when search value changes */
  onChange: (value: string) => void;

  /** Callback when search is submitted (Enter key or search button) */
  onSearch?: (value: string) => void;

  /** Callback when search is cleared */
  onClear?: () => void;

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
  inputSize?: "sm" | "md" | "lg";

  /** Input variant style */
  variant?: "outline" | "filled" | "minimal";

  /** Placeholder text */
  placeholder?: string;

  /** Whether to show a loading state */
  loading?: boolean;

  /** Whether to show a clear button */
  showClearButton?: boolean;

  /** Whether to show a search button */
  showSearchButton?: boolean;

  /** Whether to show a filter button */
  showFilterButton?: boolean;

  /** Whether to show search suggestions */
  showSuggestions?: boolean;

  /** Search suggestions to display */
  suggestions?: string[];

  /** Whether to enable debounced search */
  debounce?: boolean;

  /** Debounce delay in milliseconds */
  debounceMs?: number;

  /** Minimum characters before triggering search */
  minSearchLength?: number;

  /** Whether to show search count/results */
  showSearchCount?: boolean;

  /** Current search result count */
  searchCount?: number;

  /** Whether to show search history */
  showHistory?: boolean;

  /** Search history items */
  searchHistory?: string[];

  /** Whether to show advanced search options */
  showAdvancedSearch?: boolean;

  /** Advanced search fields */
  advancedSearchFields?: Array<{
    name: string;
    label: string;
    type: "text" | "select" | "date" | "number";
    options?: Array<{ value: string; label: string }>;
  }>;

  /** Custom class names */
  className?: string;

  /** Custom class names for the input element */
  inputClassName?: string;

  /** Custom class names for the label */
  labelClassName?: string;

  /** Custom class names for the search button */
  searchButtonClassName?: string;

  /** Custom class names for the clear button */
  clearButtonClassName?: string;

  /** Custom class names for the filter button */
  filterButtonClassName?: string;

  /** Custom class names for suggestions */
  suggestionsClassName?: string;

  /** Custom class names for search history */
  historyClassName?: string;

  /** Custom class names for advanced search */
  advancedSearchClassName?: string;

  /** Whether to auto-focus the input */
  autoFocus?: boolean;

  /** Whether to show character count */
  showCharacterCount?: boolean;

  /** Maximum character limit */
  maxLength?: number;

  /** Whether to show search analytics */
  showAnalytics?: boolean;

  /** Search analytics data */
  analytics?: {
    totalSearches: number;
    popularSearches: string[];
    recentSearches: string[];
  };
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value = "",
      onChange,
      onSearch,
      onClear,
      label,
      helperText,
      error,
      required = false,
      disabled = false,
      inputSize = "md",
      variant = "outline",
      placeholder = "Search...",
      loading = false,
      showClearButton = true,
      showSearchButton = true,
      showFilterButton = false,
      showSuggestions = false,
      suggestions = [],
      debounce = true,
      debounceMs = 300,
      minSearchLength = 1,
      showSearchCount = false,
      searchCount,
      showHistory = false,
      searchHistory = [],
      showAdvancedSearch = false,
      advancedSearchFields = [],
      className,
      inputClassName,
      labelClassName,
      searchButtonClassName,
      clearButtonClassName,
      filterButtonClassName,
      suggestionsClassName,
      historyClassName,
      advancedSearchClassName,
      showCharacterCount = false,
      maxLength,
      showAnalytics = false,
      analytics,
      id,
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestionsDropdown, setShowSuggestionsDropdown] =
      useState(false);
    const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
    const [showAdvancedSearchPanel, setShowAdvancedSearchPanel] =
      useState(false);
    const [highlightedSuggestionIndex, setHighlightedSuggestionIndex] =
      useState(-1);

    const inputId = id || `search-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const isDisabled = disabled || loading;

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg",
    };

    const variantClasses = {
      outline: "border border-gray-300 bg-white",
      filled: "border-0 bg-gray-100",
      minimal: "border-0 bg-transparent border-b border-gray-300",
    };

    const baseInputClasses = cn(
      "block w-full rounded-md shadow-sm transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-0",
      "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
      "placeholder-gray-400",
      sizeClasses[inputSize],
      variantClasses[variant],
      hasError
        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
        : "focus:ring-primary-500 focus:border-primary-500",
      isDisabled && "opacity-60",
      inputClassName,
    );

    // Debounced search effect
    useEffect(() => {
      if (!debounce || inputValue.length < minSearchLength) return;

      const timer = setTimeout(() => {
        onChange(inputValue);
      }, debounceMs);

      return () => clearTimeout(timer);
    }, [inputValue, debounce, debounceMs, minSearchLength, onChange]);

    // Update input value when value prop changes
    useEffect(() => {
      setInputValue(value);
    }, [value]);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      if (!debounce) {
        onChange(newValue);
      }

      // Show suggestions if enabled and has content
      if (showSuggestions && newValue.length >= minSearchLength) {
        setShowSuggestionsDropdown(true);
        setHighlightedSuggestionIndex(-1);
      } else {
        setShowSuggestionsDropdown(false);
      }
    };

    // Handle search submission
    const handleSearch = useCallback(() => {
      if (inputValue.trim() && onSearch) {
        onSearch(inputValue.trim());
        setShowSuggestionsDropdown(false);
        setShowHistoryDropdown(false);
      }
    }, [inputValue, onSearch]);

    // Handle clear
    const handleClear = useCallback(() => {
      setInputValue("");
      onChange("");
      setShowSuggestionsDropdown(false);
      setShowHistoryDropdown(false);
      setHighlightedSuggestionIndex(-1);
      onClear?.();
    }, [onChange, onClear]);

    // Handle key down
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      } else if (e.key === "Escape") {
        setShowSuggestionsDropdown(false);
        setShowHistoryDropdown(false);
        setShowAdvancedSearchPanel(false);
      } else if (e.key === "ArrowDown" && showSuggestionsDropdown) {
        e.preventDefault();
        setHighlightedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowUp" && showSuggestionsDropdown) {
        e.preventDefault();
        setHighlightedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
      }
    };

    // Handle suggestion selection
    const handleSuggestionSelect = (suggestion: string) => {
      setInputValue(suggestion);
      onChange(suggestion);
      setShowSuggestionsDropdown(false);
      setHighlightedSuggestionIndex(-1);
      onSearch?.(suggestion);
    };

    // Handle history item selection
    const handleHistorySelect = (historyItem: string) => {
      setInputValue(historyItem);
      onChange(historyItem);
      setShowHistoryDropdown(false);
      onSearch?.(historyItem);
    };

    // Handle focus
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (showHistory && searchHistory.length > 0) {
        setShowHistoryDropdown(true);
      }
      props.onFocus?.(e);
    };

    // Handle blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      // Delay hiding dropdowns to allow for clicks
      setTimeout(() => {
        setShowSuggestionsDropdown(false);
        setShowHistoryDropdown(false);
      }, 150);
      props.onBlur?.(e);
    };

    // Filtered suggestions
    const filteredSuggestions = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()),
    );

    return (
      <div className={cn("w-full", className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-gray-700 mb-1",
              hasError && "text-red-700",
              isDisabled && "text-gray-500",
              labelClassName,
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search
              className={cn(
                "h-4 w-4",
                hasError ? "text-red-400" : "text-gray-400",
                isFocused && !hasError && "text-primary-500",
              )}
            />
          </div>

          {/* Input */}
          <input
            ref={ref}
            type="text"
            id={inputId}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isDisabled}
            required={required}
            placeholder={placeholder}
            maxLength={maxLength}
            className={cn(
              baseInputClasses,
              "pl-10",
              showClearButton && inputValue && "pr-20",
              !showClearButton && showSearchButton && "pr-20",
              showClearButton && showSearchButton && inputValue && "pr-32",
            )}
            aria-invalid={hasError}
            aria-describedby={cn(
              helperText && `${inputId}-helper`,
              error && `${inputId}-error`,
              showCharacterCount && `${inputId}-count`,
            )}
            {...props}
          />

          {/* Clear Button */}
          {showClearButton && inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                "absolute inset-y-0 right-0 px-3 flex items-center",
                "text-gray-400 hover:text-gray-600 transition-colors duration-200",
                clearButtonClassName,
              )}
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Search Button */}
          {showSearchButton && (
            <button
              type="button"
              onClick={handleSearch}
              disabled={isDisabled || !inputValue.trim()}
              className={cn(
                "absolute inset-y-0 right-0 px-3 flex items-center",
                "text-gray-400 hover:text-primary-600 transition-colors duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                showClearButton && inputValue && "right-12",
                searchButtonClassName,
              )}
              title="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          )}

          {/* Filter Button */}
          {showFilterButton && (
            <button
              type="button"
              onClick={() =>
                setShowAdvancedSearchPanel(!showAdvancedSearchPanel)
              }
              className={cn(
                "absolute inset-y-0 right-0 px-3 flex items-center",
                "text-gray-400 hover:text-primary-600 transition-colors duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                showClearButton && inputValue && "right-12",
                showSearchButton && "right-12",
                filterButtonClassName,
              )}
              title="Advanced search"
            >
              <Filter className="h-4 w-4" />
            </button>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500" />
            </div>
          )}
        </div>

        {/* Helper Text, Error, and Character Count */}
        <div className="mt-1 min-h-[20px] flex items-center justify-between">
          <div className="flex-1">
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
          </div>

          {/* Character Count */}
          {showCharacterCount && maxLength && (
            <span
              id={`${inputId}-count`}
              className={cn(
                "text-xs text-gray-500",
                inputValue.length > maxLength * 0.8 && "text-yellow-600",
                inputValue.length > maxLength * 0.95 && "text-red-600",
              )}
            >
              {inputValue.length}/{maxLength}
            </span>
          )}

          {/* Search Count */}
          {showSearchCount && searchCount !== undefined && inputValue && (
            <span className="text-xs text-gray-500">
              {searchCount} result{searchCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions &&
          showSuggestionsDropdown &&
          filteredSuggestions.length > 0 && (
            <div
              className={cn(
                "absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto",
                suggestionsClassName,
              )}
            >
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                    highlightedSuggestionIndex === index && "bg-gray-100",
                  )}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

        {/* History Dropdown */}
        {showHistory && showHistoryDropdown && searchHistory.length > 0 && (
          <div
            className={cn(
              "absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto",
              historyClassName,
            )}
          >
            <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-200">
              Recent Searches
            </div>
            {searchHistory.map((historyItem, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleHistorySelect(historyItem)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                {historyItem}
              </button>
            ))}
          </div>
        )}

        {/* Advanced Search Panel */}
        {showAdvancedSearch && showAdvancedSearchPanel && (
          <div
            className={cn(
              "absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4",
              advancedSearchClassName,
            )}
          >
            <div className="text-sm font-medium text-gray-700 mb-3">
              Advanced Search
            </div>
            <div className="space-y-3">
              {advancedSearchFields.map((field, index) => (
                <div key={index}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500">
                      <option value="">Any</option>
                      {field.options?.map((option, optIndex) => (
                        <option key={optIndex} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder={`Search in ${field.label.toLowerCase()}...`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Analytics */}
        {showAnalytics && analytics && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md text-xs text-gray-600">
            <div className="flex justify-between items-center mb-2">
              <span>Total searches: {analytics.totalSearches}</span>
              <span>
                Popular: {analytics.popularSearches.slice(0, 3).join(", ")}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
