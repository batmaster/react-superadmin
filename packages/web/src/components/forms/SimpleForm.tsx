import { Plus, Save, Trash2 } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "date"
    | "boolean"
    | "array"
    | "autocomplete";
  required?: boolean;
  placeholder?: string;
  options?: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    message?: string;
  };
  defaultValue?: any;
  disabled?: boolean;
  helperText?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "filled";
}

export interface SimpleFormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  initialValues?: Record<string, any>;
  title?: string;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  className?: string;
  layout?: "vertical" | "horizontal" | "grid";
  columns?: number;
  showActions?: boolean;
  resetOnSubmit?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export const SimpleForm: React.FC<SimpleFormProps> = ({
  fields,
  onSubmit,
  onCancel,
  initialValues = {},
  title,
  submitText = "Save",
  cancelText = "Cancel",
  loading = false,
  className = "",
  layout = "vertical",
  columns = 1,
  showActions = true,
  resetOnSubmit = false,
  validateOnChange = false,
  validateOnBlur = false,
}) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize values for fields that don't have initial values
  useMemo(() => {
    const newValues = { ...initialValues };
    fields.forEach((field) => {
      if (
        newValues[field.name] === undefined &&
        field.defaultValue !== undefined
      ) {
        newValues[field.name] = field.defaultValue;
      }
    });
    setValues(newValues);
  }, [initialValues, fields]);

  // Validation function
  const validateField = useCallback(
    (name: string, value: any): string => {
      const field = fields.find((f) => f.name === name);
      if (!field) return "";

      // Required validation
      if (
        field.required &&
        (value === "" || value === null || value === undefined)
      ) {
        return field.validation?.message || `${field.label} is required`;
      }

      // Skip other validations if value is empty and not required
      if (
        !field.required &&
        (value === "" || value === null || value === undefined)
      ) {
        return "";
      }

      // Min/Max validation for numbers
      if (field.type === "number" && field.validation) {
        if (
          field.validation.min !== undefined &&
          value < field.validation.min
        ) {
          return (
            field.validation.message ||
            `${field.label} must be at least ${field.validation.min}`
          );
        }
        if (
          field.validation.max !== undefined &&
          value > field.validation.max
        ) {
          return (
            field.validation.message ||
            `${field.label} must be at most ${field.validation.max}`
          );
        }
      }

      // Min/Max length validation for text
      if (
        (field.type === "text" ||
          field.type === "email" ||
          field.type === "textarea") &&
        field.validation
      ) {
        if (
          field.validation.minLength !== undefined &&
          value.length < field.validation.minLength
        ) {
          return (
            field.validation.message ||
            `${field.label} must be at least ${field.validation.minLength} characters`
          );
        }
        if (
          field.validation.maxLength !== undefined &&
          value.length > field.validation.maxLength
        ) {
          return (
            field.validation.message ||
            `${field.label} must be at most ${field.validation.maxLength} characters`
          );
        }
      }

      // Pattern validation
      if (
        field.validation?.pattern &&
        !new RegExp(field.validation.pattern).test(value)
      ) {
        return field.validation.message || `${field.label} format is invalid`;
      }

      // Email validation
      if (
        field.type === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        return (
          field.validation?.message ||
          `${field.label} must be a valid email address`
        );
      }

      return "";
    },
    [fields],
  );

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Set all fields as touched when validating the entire form
    const newTouched: Record<string, boolean> = {};
    fields.forEach((field) => {
      newTouched[field.name] = true;
    });
    setTouched(newTouched);

    fields.forEach((field) => {
      const error = validateField(field.name, values[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [fields, values, validateField]);

  // Handle field change
  const handleFieldChange = useCallback(
    (name: string, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Validate on change if enabled
      if (validateOnChange) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validateOnChange, validateField],
  );

  // Handle field blur
  const handleFieldBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validate on blur if enabled
      if (validateOnBlur) {
        const error = validateField(name, values[name]);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validateOnBlur, validateField, values],
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
        if (resetOnSubmit) {
          setValues(initialValues);
          setErrors({});
          setTouched({});
        }
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit, validateForm, resetOnSubmit, initialValues],
  );

  // Handle form reset
  const handleReset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Render form field based on type
  const renderField = useCallback(
    (field: FormField) => {
      const fieldValue = values[field.name];
      const fieldError = errors[field.name];
      const fieldTouched = touched[field.name];
      const showError = fieldError && fieldTouched;

      const commonProps = {
        value: fieldValue,
        onChange: (
          e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >,
        ) => {
          const value =
            e.target.type === "checkbox"
              ? (e.target as HTMLInputElement).checked
              : e.target.value;
          handleFieldChange(field.name, value);
        },
        onBlur: () => handleFieldBlur(field.name),
        disabled: field.disabled || loading,
        required: field.required,
        placeholder: field.placeholder,
        helperText: field.helperText,
        className: field.className,
        error: showError ? fieldError : undefined,
      };

      switch (field.type) {
        case "text":
        case "email":
        case "password":
          return (
            <input
              type={field.type}
              {...commonProps}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 ${
                showError ? "border-red-500" : "border-gray-300"
              } ${field.className || ""}`}
            />
          );

        case "number":
          return (
            <input
              type="number"
              {...commonProps}
              min={field.validation?.min}
              max={field.validation?.max}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 ${
                showError ? "border-red-500" : "border-gray-300"
              } ${field.className || ""}`}
            />
          );

        case "textarea":
          return (
            <textarea
              {...commonProps}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 ${
                showError ? "border-red-500" : "border-gray-300"
              } ${field.className || ""}`}
            />
          );

        case "select":
          return (
            <select
              {...commonProps}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 ${
                showError ? "border-red-500" : "border-gray-300"
              } ${field.className || ""}`}
            >
              <option value="">
                {field.placeholder || `Select ${field.label}`}
              </option>
              {field.options?.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>
          );

        case "checkbox":
          return (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={fieldValue || false}
                onChange={(e) =>
                  handleFieldChange(field.name, e.target.checked)
                }
                disabled={field.disabled || loading}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{field.label}</span>
            </label>
          );

        case "radio":
          return (
            <div className="space-y-2">
              {field.options?.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={fieldValue === option.value}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value)
                    }
                    disabled={field.disabled || loading}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          );

        case "date":
          return (
            <input
              type="date"
              {...commonProps}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 ${
                showError ? "border-red-500" : "border-gray-300"
              } ${field.className || ""}`}
            />
          );

        case "boolean":
          return (
            <select
              {...commonProps}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 ${
                showError ? "border-red-500" : "border-gray-300"
              } ${field.className || ""}`}
            >
              <option value="">{field.placeholder || "Select option"}</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          );

        case "array": {
          const arrayValue = Array.isArray(fieldValue) ? fieldValue : [];
          return (
            <div className="space-y-2">
              {arrayValue.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newArray = [...arrayValue];
                      newArray[index] = e.target.value;
                      handleFieldChange(field.name, newArray);
                    }}
                    placeholder={`Item ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newArray = arrayValue.filter((_, i) => i !== index);
                      handleFieldChange(field.name, newArray);
                    }}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newArray = [...arrayValue, ""];
                  handleFieldChange(field.name, newArray);
                }}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
              >
                <Plus size={16} />
                <span>Add Item</span>
              </button>
            </div>
          );
        }

        case "autocomplete":
          return (
            <div className="relative">
              <input
                type="text"
                value={fieldValue || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                placeholder={field.placeholder || `Search ${field.label}`}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 ${
                  showError ? "border-red-500" : "border-gray-300"
                } ${field.className || ""}`}
              />
              {field.options && fieldValue && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {field.options
                    .filter((option) =>
                      option.label
                        .toLowerCase()
                        .includes(fieldValue.toLowerCase()),
                    )
                    .map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          handleFieldChange(field.name, option.value)
                        }
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                      >
                        {option.label}
                      </button>
                    ))}
                </div>
              )}
            </div>
          );

        default:
          return (
            <input
              type="text"
              {...commonProps}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 ${
                showError ? "border-red-500" : "border-gray-300"
              } ${field.className || ""}`}
            />
          );
      }
    },
    [values, errors, touched, loading, handleFieldChange, handleFieldBlur],
  );

  // Layout classes
  const getLayoutClasses = () => {
    switch (layout) {
      case "horizontal":
        return "space-y-4";
      case "grid":
        return `grid grid-cols-1 md:grid-cols-${columns} gap-4`;
      default:
        return "space-y-4";
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${className}`}>
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
      )}

      <div className={getLayoutClasses()}>
        {fields.map((field) => (
          <div
            key={field.name}
            className={
              layout === "horizontal" ? "flex items-center space-x-4" : ""
            }
          >
            {layout === "horizontal" && (
              <label className="w-1/3 text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}

            <div className={layout === "horizontal" ? "flex-1" : ""}>
              {layout !== "horizontal" && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
              )}

              {renderField(field)}

              {field.helperText && !errors[field.name] && (
                <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>
              )}

              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors[field.name]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showActions && (
        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading || isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
          )}

          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading || isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                {submitText}
              </>
            )}
          </button>
        </div>
      )}
    </form>
  );
};
