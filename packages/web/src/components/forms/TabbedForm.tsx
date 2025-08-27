import { ChevronLeft, ChevronRight, Save, X } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { cn } from "../../utils/cn";

export interface TabField {
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
    | "time"
    | "boolean"
    | "array"
    | "autocomplete"
    | "file"
    | "image"
    | "markdown"
    | "richtext";
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
  tabIndex?: number; // Which tab this field belongs to
}

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  fields: TabField[];
  validation?: {
    required?: boolean;
    custom?: (values: Record<string, any>) => string | null;
  };
}

export interface TabbedFormProps {
  tabs: Tab[];
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  initialValues?: Record<string, any>;
  title?: string;
  description?: string;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  className?: string;
  showTabs?: boolean;
  showTabNavigation?: boolean;
  showTabValidation?: boolean;
  allowTabSkipping?: boolean;
  defaultActiveTab?: string;
  tabPosition?: "top" | "left" | "bottom";
  tabStyle?: "pills" | "tabs" | "underline";
  showProgress?: boolean;
  showTabNumbers?: boolean;
  showTabIcons?: boolean;
  showTabDescriptions?: boolean;
  tabClassName?: string;
  contentClassName?: string;
  actionsClassName?: string;
  resetOnSubmit?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
  showErrors?: boolean;
  showSuccessMessage?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onTabChange?: (tabId: string, previousTabId?: string) => void;
  onFieldChange?: (fieldName: string, value: any, tabId: string) => void;
  onValidationError?: (errors: Record<string, string>) => void;
}

/**
 * A multi-tab form component that organizes form fields into logical groups
 * with tab navigation, validation, and flexible styling options.
 *
 * @example
 * // Basic usage
 * <TabbedForm
 *   tabs={[
 *     {
 *       id: "personal",
 *       label: "Personal Info",
 *       fields: [
 *         { name: "firstName", label: "First Name", type: "text", required: true },
 *         { name: "lastName", label: "Last Name", type: "text", required: true }
 *       ]
 *     },
 *     {
 *       id: "contact",
 *       label: "Contact Info",
 *       fields: [
 *         { name: "email", label: "Email", type: "email", required: true },
 *         { name: "phone", label: "Phone", type: "tel" }
 *       ]
 *     }
 *   ]}
 *   onSubmit={handleSubmit}
 * />
 *
 * @example
 * // With validation and custom styling
 * <TabbedForm
 *   tabs={tabs}
 *   onSubmit={handleSubmit}
 *   showProgress
 *   tabStyle="pills"
 *   tabPosition="left"
 *   validateOnChange
 *   showTabValidation
 * />
 */
export const TabbedForm: React.FC<TabbedFormProps> = ({
  tabs,
  onSubmit,
  onCancel,
  initialValues = {},
  title,
  description,
  submitText = "Save",
  cancelText = "Cancel",
  loading = false,
  className = "",
  showTabs = true,
  showTabNavigation = true,
  showTabValidation = false,
  allowTabSkipping = false,
  defaultActiveTab,
  tabPosition = "top",
  tabStyle = "tabs",
  showProgress = false,
  showTabNumbers = false,
  showTabIcons = false,
  showTabDescriptions = false,
  tabClassName = "",
  contentClassName = "",
  actionsClassName = "",
  resetOnSubmit = false,
  validateOnChange = false,
  validateOnBlur = false,
  validateOnSubmit = true,
  showErrors = true,
  showSuccessMessage = false,
  successMessage = "Form submitted successfully!",
  errorMessage = "Please fix the errors below.",
  onTabChange,
  onFieldChange,
  onValidationError,
}) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultActiveTab || tabs[0]?.id || "",
  );
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initialize values for fields that don't have initial values
  useMemo(() => {
    const newValues = { ...initialValues };
    tabs.forEach((tab) => {
      tab.fields.forEach((field) => {
        if (
          newValues[field.name] === undefined &&
          field.defaultValue !== undefined
        ) {
          newValues[field.name] = field.defaultValue;
        }
      });
    });
    setValues(newValues);
  }, [initialValues, tabs]);

  // Get current active tab
  const activeTab = useMemo(() => {
    return tabs.find((tab) => tab.id === activeTabId) || tabs[0];
  }, [tabs, activeTabId]);

  // Get all fields from all tabs
  const allFields = useMemo(() => {
    return tabs.flatMap((tab) => tab.fields);
  }, [tabs]);

  // Validation function
  const validateField = useCallback(
    (field: TabField, value: any): string | null => {
      if (field.required && (!value || value === "")) {
        return `${field.label} is required`;
      }

      if (field.validation) {
        const { min, max, minLength, maxLength, pattern, message } =
          field.validation;

        if (min !== undefined && value < min) {
          return message || `${field.label} must be at least ${min}`;
        }

        if (max !== undefined && value > max) {
          return message || `${field.label} must be at most ${max}`;
        }

        if (minLength !== undefined && String(value).length < minLength) {
          return (
            message || `${field.label} must be at least ${minLength} characters`
          );
        }

        if (maxLength !== undefined && String(value).length > maxLength) {
          return (
            message || `${field.label} must be at most ${maxLength} characters`
          );
        }

        if (pattern && !new RegExp(pattern).test(String(value))) {
          return message || `${field.label} format is invalid`;
        }
      }

      return null;
    },
    [],
  );

  // Validate all fields
  const validateAll = useCallback((): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    allFields.forEach((field) => {
      const error = validateField(field, values[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    // Validate tab-level validation
    tabs.forEach((tab) => {
      if (tab.validation?.custom) {
        const tabError = tab.validation.custom(values);
        if (tabError) {
          newErrors[`tab_${tab.id}`] = tabError;
        }
      }
    });

    return newErrors;
  }, [allFields, values, validateField, tabs]);

  // Handle field change
  const handleFieldChange = useCallback(
    (fieldName: string, value: any) => {
      const newValues = { ...values, [fieldName]: value };
      setValues(newValues);

      // Clear error when field is changed
      if (errors[fieldName]) {
        setErrors((prev) => ({ ...prev, [fieldName]: "" }));
      }

      // Validate on change if enabled
      if (validateOnChange) {
        const field = allFields.find((f) => f.name === fieldName);
        if (field) {
          const error = validateField(field, value);
          if (error) {
            setErrors((prev) => ({ ...prev, [fieldName]: error }));
            // Set field as touched so error is displayed
            setTouched((prev) => ({ ...prev, [fieldName]: true }));
          }
        }
      }

      // Call onFieldChange callback
      if (onFieldChange) {
        const field = allFields.find((f) => f.name === fieldName);
        if (field) {
          const tab = tabs.find((t) =>
            t.fields.some((f) => f.name === fieldName),
          );
          onFieldChange(fieldName, value, tab?.id || "");
        }
      }
    },
    [
      values,
      errors,
      validateOnChange,
      allFields,
      validateField,
      onFieldChange,
      tabs,
    ],
  );

  // Handle field blur
  const handleFieldBlur = useCallback(
    (fieldName: string) => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }));

      // Validate on blur if enabled
      if (validateOnBlur) {
        const field = allFields.find((f) => f.name === fieldName);
        if (field) {
          const error = validateField(field, values[fieldName]);
          if (error) {
            setErrors((prev) => ({ ...prev, [fieldName]: error }));
          }
        }
      }
    },
    [validateOnBlur, allFields, validateField, values],
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setIsSubmitting(true);
      setSubmitted(true);

      // Validate all fields
      const newErrors = validateAll();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        // Set all fields as touched so validation errors are displayed
        const newTouched: Record<string, boolean> = {};
        allFields.forEach((field) => {
          newTouched[field.name] = true;
        });
        setTouched(newTouched);
        setIsSubmitting(false);
        if (onValidationError) {
          onValidationError(newErrors);
        }
        return;
      }

      try {
        if (onSubmit) {
          await onSubmit(values);
        }
        setSuccess(true);
        if (resetOnSubmit) {
          setValues(initialValues);
          setTouched({});
          setErrors({});
        }
      } catch (error) {
        console.error("Form submission error:", error);
        setErrors({ general: "An error occurred while submitting the form" });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      values,
      validateAll,
      onSubmit,
      resetOnSubmit,
      initialValues,
      onValidationError,
    ],
  );

  // Handle tab change
  const handleTabChange = useCallback(
    (tabId: string) => {
      const previousTabId = activeTabId;
      setActiveTabId(tabId);
      setActiveTabId(tabId);

      if (onTabChange) {
        onTabChange(tabId, previousTabId);
      }
    },
    [activeTabId, onTabChange],
  );

  // Navigate to next tab
  const handleNextTab = useCallback(() => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTabId);
    if (currentIndex < tabs.length - 1) {
      const currentTab = tabs[currentIndex];

      // Validate current tab fields if validation is enabled
      if (validateOnBlur || validateOnChange || validateOnSubmit) {
        const currentTabErrors: Record<string, string> = {};
        let hasErrors = false;

        currentTab.fields.forEach((field) => {
          const error = validateField(field, values[field.name]);
          if (error) {
            currentTabErrors[field.name] = error;
            hasErrors = true;
          }
        });

        // If there are validation errors, don't navigate and show errors
        if (hasErrors) {
          setErrors((prev) => ({ ...prev, ...currentTabErrors }));
          // Set current tab fields as touched so errors are displayed
          const newTouched: Record<string, boolean> = {};
          currentTab.fields.forEach((field) => {
            newTouched[field.name] = true;
          });
          setTouched((prev) => ({ ...prev, ...newTouched }));
          return;
        }
      }

      handleTabChange(tabs[currentIndex + 1].id);
    }
  }, [
    activeTabId,
    tabs,
    handleTabChange,
    validateOnBlur,
    validateOnChange,
    validateOnSubmit,
    validateField,
    values,
  ]);

  // Navigate to previous tab
  const handlePreviousTab = useCallback(() => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTabId);
    if (currentIndex > 0) {
      handleTabChange(tabs[currentIndex - 1].id);
    }
  }, [activeTabId, tabs, handleTabChange]);

  // Check if tab has errors
  const getTabErrors = useCallback(
    (tabId: string): string[] => {
      const tab = tabs.find((t) => t.id === tabId);
      if (!tab) return [];

      return tab.fields
        .map((field) => errors[field.name])
        .filter(Boolean) as string[];
    },
    [tabs, errors],
  );

  // Check if tab is valid
  const isTabValid = useCallback(
    (tabId: string): boolean => {
      const tabErrors = getTabErrors(tabId);
      return tabErrors.length === 0;
    },
    [getTabErrors],
  );

  // Get tab completion percentage
  const getTabCompletion = useCallback(
    (tabId: string): number => {
      const tab = tabs.find((t) => t.id === tabId);
      if (!tab) return 0;

      const completedFields = tab.fields.filter((field) => {
        const value = values[field.name];
        return value !== undefined && value !== null && value !== "";
      });

      return (completedFields.length / tab.fields.length) * 100;
    },
    [tabs, values],
  );

  // Render form field based on type
  const renderField = useCallback(
    (field: TabField) => {
      const fieldValue = values[field.name];
      const fieldError = errors[field.name];
      const fieldTouched = touched[field.name];

      // For now, render a basic input - this would be replaced with actual input components
      const fieldId = `field-${field.name}`;
      return (
        <div key={field.name} className={field.className || ""}>
          <label
            htmlFor={fieldId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            id={fieldId}
            type={field.type === "boolean" ? "checkbox" : field.type}
            value={field.type === "boolean" ? undefined : fieldValue || ""}
            checked={field.type === "boolean" ? Boolean(fieldValue) : undefined}
            onChange={(e) =>
              handleFieldChange(
                field.name,
                field.type === "boolean" ? e.target.checked : e.target.value,
              )
            }
            onBlur={() => handleFieldBlur(field.name)}
            placeholder={field.placeholder}
            disabled={field.disabled || loading}
            className={cn(
              "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
              fieldError && fieldTouched
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300",
              field.disabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
            )}
          />
          {field.helperText && !fieldError && (
            <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>
          )}
          {fieldError && fieldTouched && (
            <p className="mt-1 text-sm text-red-600">{fieldError}</p>
          )}
        </div>
      );
    },
    [values, errors, touched, loading, handleFieldChange, handleFieldBlur],
  );

  // Get tab style classes
  const getTabStyleClasses = useCallback(() => {
    switch (tabStyle) {
      case "pills":
        return "bg-gray-100 rounded-lg p-1";
      case "underline":
        return "border-b border-gray-200";
      default:
        return "border-b border-gray-200";
    }
  }, [tabStyle]);

  // Get tab position classes
  const getTabPositionClasses = useCallback(() => {
    switch (tabPosition) {
      case "left":
        return "flex-row";
      case "bottom":
        return "flex-col-reverse";
      default:
        return "flex-col";
    }
  }, [tabPosition]);

  if (!tabs.length) {
    return <div>No tabs defined</div>;
  }

  return (
    <div className={cn("w-full", className)}>
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {description && (
            <p className="text-sm text-gray-600 mt-2">{description}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tabs Navigation */}
        {showTabs && (
          <div className={cn("flex", getTabPositionClasses())}>
            <div
              className={cn(
                "flex",
                tabPosition === "left" ? "flex-col space-y-2" : "space-x-1",
                getTabStyleClasses(),
                tabClassName,
              )}
            >
              {tabs.map((tab, index) => {
                const tabErrors = getTabErrors(tab.id);
                const tabCompletion = getTabCompletion(tab.id);
                const isActive = tab.id === activeTabId;
                const hasErrors = tabErrors.length > 0;
                const isCompleted = tabCompletion === 100;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    disabled={tab.disabled}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                      tabPosition === "left"
                        ? "justify-start"
                        : "justify-center",
                      isActive
                        ? "bg-primary-100 text-primary-700 border-primary-500"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                      tab.disabled && "opacity-50 cursor-not-allowed",
                      hasErrors && "text-red-600",
                      isCompleted && "text-green-600",
                    )}
                  >
                    {showTabNumbers && (
                      <span className="flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full bg-gray-200 text-gray-700">
                        {index + 1}
                      </span>
                    )}
                    {showTabIcons && tab.icon && tab.icon}
                    <span>{tab.label}</span>
                    {showTabValidation && hasErrors && (
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                    {showTabValidation && isCompleted && (
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Progress Bar */}
            {showProgress && (
              <div className="flex-1 ml-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${getTabCompletion(activeTabId)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(getTabCompletion(activeTabId))}% complete
                </p>
              </div>
            )}

            {/* Step Indicator */}
            {showTabNumbers && (
              <div className="ml-4">
                <p className="text-sm text-gray-600">
                  {tabs.findIndex((tab) => tab.id === activeTabId) + 1} of{" "}
                  {tabs.length}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content */}
        <div className={cn("min-h-64", contentClassName)}>
          {activeTab && (
            <div>
              {/* Tab Header */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {activeTab.label}
                </h3>
                {showTabDescriptions && activeTab.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {activeTab.description}
                  </p>
                )}
              </div>

              {/* Tab Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTab.fields.map((field) => renderField(field))}
              </div>

              {/* Tab Validation Errors */}
              {showTabValidation && getTabErrors(activeTab.id).length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-medium text-red-800 mb-2">
                    Please fix the following errors:
                  </p>
                  <ul className="text-sm text-red-700 space-y-1">
                    {getTabErrors(activeTab.id).map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div
          className={cn(
            "flex justify-between items-center pt-6 border-t border-gray-200",
            actionsClassName,
          )}
        >
          <div className="flex space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <X className="w-4 h-4 mr-2" />
                {cancelText}
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            {/* Tab Navigation */}
            {showTabNavigation && tabs.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePreviousTab}
                  disabled={
                    tabs.findIndex((tab) => tab.id === activeTabId) === 0
                  }
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextTab}
                  disabled={
                    tabs.findIndex((tab) => tab.id === activeTabId) ===
                    tabs.length - 1
                  }
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : submitText}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        {/* General Error Message */}
        {showErrors && errors.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{errors.general}</p>
          </div>
        )}
      </form>
    </div>
  );
};

TabbedForm.displayName = "TabbedForm";
