import React, {
  SelectHTMLAttributes,
  forwardRef,
  useState,
  useRef,
  useEffect,
} from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { cn } from "../utils/cn";

export interface SelectOption {
  /** Option value */
  value: string | number;
  /** Option label to display */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Additional data for the option */
  data?: Record<string, any>;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** Select label */
  label?: string;
  /** Helper text below the select */
  helperText?: string;
  /** Error message to display */
  error?: string;
  /** Whether the select is required */
  required?: boolean;
  /** Select size */
  size?: "sm" | "md" | "lg";
  /** Whether the select is full width */
  fullWidth?: boolean;
  /** Left icon/element */
  leftIcon?: React.ReactNode;
  /** Right icon/element */
  rightIcon?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Select wrapper class names */
  wrapperClassName?: string;
  /** Array of options to display */
  options: SelectOption[];
  /** Placeholder text when no option is selected */
  placeholder?: string;
  /** Whether to show a search input */
  searchable?: boolean;
  /** Whether the select is multi-select */
  multiple?: boolean;
  /** Maximum number of options to display in dropdown */
  maxOptions?: number;
  /** Whether to show option groups */
  showOptionGroups?: boolean;
  /** Custom option renderer */
  renderOption?: (option: SelectOption, index: number) => React.ReactNode;
  /** Custom option group renderer */
  renderOptionGroup?: (
    group: string,
    options: SelectOption[],
  ) => React.ReactNode;
}

/**
 * Select component that provides dropdown selection with various states.
 * This component supports different sizes, validation states, and icon placement.
 *
 * @example
 * ```tsx
 * import { Select } from '@react-superadmin/core';
 *
 * const MyForm = () => (
 *   <Select
 *     label="Country"
 *     options={[
 *       { value: "us", label: "United States" },
 *       { value: "ca", label: "Canada" },
 *       { value: "uk", label: "United Kingdom" }
 *     ]}
 *     placeholder="Select a country"
 *   />
 * );
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      required = false,
      size = "md",
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = "",
      wrapperClassName = "",
      options = [],
      placeholder = "Select an option",
      searchable = false,
      multiple = false,
      maxOptions = 10,
      showOptionGroups = false,
      renderOption,
      renderOptionGroup,
      disabled,
      ...props
    },
    ref,
  ) => {
    const { theme } = useSuperAdmin();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);
    const selectRef = useRef<HTMLDivElement>(null);

    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-3 text-base",
    };

    const iconSizeClasses = {
      sm: "w-4 h-4",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    const hasError = !!error;
    const isDisabled = disabled;

    // Filter options based on search term
    const filteredOptions =
      searchable && searchTerm
        ? options.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : options;

    // Group options if enabled
    const groupedOptions = showOptionGroups
      ? filteredOptions.reduce(
          (groups, option) => {
            const group = option.data?.group || "Default";
            if (!groups[group]) groups[group] = [];
            groups[group].push(option);
            return groups;
          },
          {} as Record<string, SelectOption[]>,
        )
      : { "": filteredOptions };

    // Handle option selection
    const handleOptionSelect = (option: SelectOption) => {
      if (multiple) {
        setSelectedOptions((prev) => {
          const isSelected = prev.some(
            (selected) => selected.value === option.value,
          );
          if (isSelected) {
            return prev.filter((selected) => selected.value !== option.value);
          } else {
            return [...prev, option];
          }
        });
      } else {
        setSelectedOptions([option]);
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTerm("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Get display value
    const getDisplayValue = () => {
      if (selectedOptions.length === 0) return placeholder;
      if (multiple) {
        if (selectedOptions.length === 1) return selectedOptions[0].label;
        return `${selectedOptions.length} options selected`;
      }
      return selectedOptions[0].label;
    };

    return (
      <div className={cn("space-y-1", fullWidth && "w-full", wrapperClassName)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative" ref={selectRef}>
          {leftIcon && (
            <div
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10",
                iconSizeClasses[size],
              )}
            >
              {leftIcon}
            </div>
          )}

          <button
            type="button"
            onClick={() => !isDisabled && setIsOpen(!isOpen)}
            className={cn(
              "block w-full text-left rounded-md border transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              sizeClasses[size],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              hasError
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500",
              "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
              "placeholder-gray-400 dark:placeholder-gray-500",
              className,
            )}
            style={{
              ...(hasError && {
                borderColor: theme.secondaryColor + "40",
              }),
            }}
            disabled={isDisabled}
            data-testid="select-button"
            data-size={size}
            data-error={hasError}
            data-disabled={isDisabled}
            data-full-width={fullWidth}
          >
            <span
              className={cn(
                "block truncate",
                selectedOptions.length === 0 &&
                  "text-gray-400 dark:text-gray-500",
              )}
            >
              {getDisplayValue()}
            </span>

            {rightIcon && (
              <div
                className={cn(
                  "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400",
                  iconSizeClasses[size],
                )}
              >
                {rightIcon}
              </div>
            )}

            <svg
              className={cn(
                "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform duration-200",
                iconSizeClasses[size],
                isOpen && "rotate-180",
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Hidden select for form submission */}
          <select
            ref={ref}
            className="sr-only"
            multiple={multiple}
            disabled={isDisabled}
            {...props}
          >
            {selectedOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {searchable && (
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}

              <div className="py-1">
                {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                  <div key={group}>
                    {showOptionGroups && group && (
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {group}
                      </div>
                    )}

                    {groupOptions.slice(0, maxOptions).map((option, index) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleOptionSelect(option)}
                        disabled={option.disabled}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm transition-colors duration-200",
                          "hover:bg-gray-100 dark:hover:bg-gray-700",
                          "focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700",
                          selectedOptions.some(
                            (selected) => selected.value === option.value,
                          ) &&
                            "bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100",
                          option.disabled && "opacity-50 cursor-not-allowed",
                        )}
                        data-testid={`select-option-${option.value}`}
                      >
                        {renderOption
                          ? renderOption(option, index)
                          : option.label}
                      </button>
                    ))}

                    {groupOptions.length > maxOptions && (
                      <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                        +{groupOptions.length - maxOptions} more options
                      </div>
                    )}
                  </div>
                ))}

                {filteredOptions.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                    No options found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {(helperText || error) && (
          <p
            className={cn(
              "text-sm",
              hasError
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400",
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
