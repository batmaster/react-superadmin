import React, { useState } from "react";
import { Checkbox } from "../src/components/Checkbox";
import { Admin, AdminConfig } from "../src";

// Example configuration for the admin application
const exampleConfig: AdminConfig = {
  title: "Checkbox Component Demo",
  resources: [],
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#6b7280",
    darkMode: false,
  },
  layout: {
    sidebar: true,
    header: true,
    footer: true,
    sidebarWidth: 250,
  },
  auth: {
    enabled: true,
    loginUrl: "/login",
    logoutUrl: "/logout",
  },
};

/**
 * Checkbox Example Component
 *
 * This component demonstrates various ways to use the Checkbox component
 * with different configurations and states.
 */
export const CheckboxExample: React.FC = () => {
  const [formData, setFormData] = useState({
    terms: false,
    newsletter: false,
    notifications: false,
    marketing: false,
    preferences: {
      email: false,
      sms: false,
      push: false,
    },
    categories: {
      technology: false,
      fashion: false,
      sports: false,
      food: false,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCheckboxChange = (field: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user makes a selection
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNestedChange = (
    parent: string,
    field: string,
    value: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.terms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    if (!formData.newsletter && !formData.notifications) {
      newErrors.communication =
        "Please select at least one communication method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
      console.log("Form data:", formData);
    }
  };

  const getSelectedCount = (obj: Record<string, boolean>) => {
    return Object.values(obj).filter(Boolean).length;
  };

  return (
    <Admin config={exampleConfig}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Checkbox Component Examples
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Various ways to use the Checkbox component with different
              configurations and states
            </p>
          </div>

          <div className="space-y-8">
            {/* Basic Checkboxes */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Basic Checkboxes
              </h2>
              <div className="space-y-4">
                <Checkbox
                  label="Accept terms and conditions"
                  required
                  helperText="You must accept to continue"
                  checked={formData.terms}
                  onChange={(e) =>
                    handleCheckboxChange("terms", e.target.checked)
                  }
                  error={errors.terms}
                />

                <Checkbox
                  label="Subscribe to newsletter"
                  helperText="Receive updates about new features and products"
                  checked={formData.newsletter}
                  onChange={(e) =>
                    handleCheckboxChange("newsletter", e.target.checked)
                  }
                />

                <Checkbox
                  label="Enable push notifications"
                  helperText="Get notified about important updates"
                  checked={formData.notifications}
                  onChange={(e) =>
                    handleCheckboxChange("notifications", e.target.checked)
                  }
                />
              </div>
            </section>

            {/* Checkbox Sizes */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Checkbox Sizes
              </h2>
              <div className="space-y-4">
                <Checkbox
                  label="Small Checkbox"
                  size="sm"
                  helperText="Small size checkbox"
                />

                <Checkbox
                  label="Medium Checkbox (Default)"
                  size="md"
                  helperText="Medium size checkbox"
                />

                <Checkbox
                  label="Large Checkbox"
                  size="lg"
                  helperText="Large size checkbox"
                />
              </div>
            </section>

            {/* Custom Checkboxes */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Custom Checkboxes
              </h2>
              <div className="space-y-4">
                <Checkbox
                  label="Custom styled checkbox"
                  custom
                  helperText="This checkbox has a custom design"
                />

                <Checkbox
                  label="Custom large checkbox"
                  custom
                  size="lg"
                  helperText="Large custom checkbox"
                />

                <Checkbox
                  label="Custom checkbox with error"
                  custom
                  error="This custom checkbox has an error"
                  helperText="Custom checkbox showing error state"
                />
              </div>
            </section>

            {/* Inline Checkboxes */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Inline Checkboxes
              </h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-6">
                  <Checkbox label="Option 1" inline size="sm" />
                  <Checkbox label="Option 2" inline size="sm" />
                  <Checkbox label="Option 3" inline size="sm" />
                </div>

                <div className="flex flex-wrap gap-6">
                  <Checkbox label="Large Inline 1" inline size="lg" />
                  <Checkbox label="Large Inline 2" inline size="lg" />
                </div>
              </div>
            </section>

            {/* Indeterminate State */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Indeterminate State
              </h2>
              <div className="space-y-4">
                <Checkbox
                  label="Select All Categories"
                  indeterminate={
                    getSelectedCount(formData.categories) > 0 &&
                    getSelectedCount(formData.categories) <
                      Object.keys(formData.categories).length
                  }
                  checked={
                    getSelectedCount(formData.categories) ===
                    Object.keys(formData.categories).length
                  }
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    Object.keys(formData.categories).forEach((category) => {
                      handleNestedChange("categories", category, newValue);
                    });
                  }}
                  helperText="Click to select/deselect all categories"
                />

                <div className="ml-6 space-y-2">
                  <Checkbox
                    label="Technology"
                    checked={formData.categories.technology}
                    onChange={(e) =>
                      handleNestedChange(
                        "categories",
                        "technology",
                        e.target.checked,
                      )
                    }
                  />
                  <Checkbox
                    label="Fashion"
                    checked={formData.categories.fashion}
                    onChange={(e) =>
                      handleNestedChange(
                        "categories",
                        "fashion",
                        e.target.checked,
                      )
                    }
                  />
                  <Checkbox
                    label="Sports"
                    checked={formData.categories.sports}
                    onChange={(e) =>
                      handleNestedChange(
                        "categories",
                        "sports",
                        e.target.checked,
                      )
                    }
                  />
                  <Checkbox
                    label="Food"
                    checked={formData.categories.food}
                    onChange={(e) =>
                      handleNestedChange("categories", "food", e.target.checked)
                    }
                  />
                </div>
              </div>
            </section>

            {/* Checkbox States */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Checkbox States
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Checkbox
                    label="Disabled Checkbox"
                    disabled
                    helperText="This checkbox is disabled"
                  />

                  <Checkbox
                    label="Checked Disabled"
                    checked
                    disabled
                    helperText="This checkbox is checked but disabled"
                  />
                </div>

                <div className="space-y-4">
                  <Checkbox
                    label="Checkbox with Error"
                    error="This field has an error"
                    helperText="Error state example"
                  />

                  <Checkbox
                    label="Required with Error"
                    required
                    error="This required field has an error"
                    helperText="Required field showing error"
                  />
                </div>
              </div>
            </section>

            {/* Full Width Checkboxes */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Full Width Checkboxes
              </h2>
              <div className="space-y-4">
                <Checkbox
                  label="Full Width Checkbox"
                  fullWidth
                  helperText="This checkbox takes full width"
                />

                <Checkbox
                  label="Full Width Custom Checkbox"
                  fullWidth
                  custom
                  helperText="Full width custom checkbox"
                />
              </div>
            </section>

            {/* Form Example */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Complete Form Example
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Checkbox
                      label="Accept terms and conditions"
                      required
                      helperText="You must accept to continue"
                      checked={formData.terms}
                      onChange={(e) =>
                        handleCheckboxChange("terms", e.target.checked)
                      }
                      error={errors.terms}
                    />

                    <Checkbox
                      label="Subscribe to newsletter"
                      helperText="Receive updates about new features and products"
                      checked={formData.newsletter}
                      onChange={(e) =>
                        handleCheckboxChange("newsletter", e.target.checked)
                      }
                    />

                    <Checkbox
                      label="Enable push notifications"
                      helperText="Get notified about important updates"
                      checked={formData.notifications}
                      onChange={(e) =>
                        handleCheckboxChange("notifications", e.target.checked)
                      }
                    />

                    <Checkbox
                      label="Receive marketing communications"
                      helperText="Get promotional offers and deals"
                      checked={formData.marketing}
                      onChange={(e) =>
                        handleCheckboxChange("marketing", e.target.checked)
                      }
                    />
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Communication Preferences
                    </h3>
                    <div className="space-y-3">
                      <Checkbox
                        label="Email notifications"
                        checked={formData.preferences.email}
                        onChange={(e) =>
                          handleNestedChange(
                            "preferences",
                            "email",
                            e.target.checked,
                          )
                        }
                      />
                      <Checkbox
                        label="SMS notifications"
                        checked={formData.preferences.sms}
                        onChange={(e) =>
                          handleNestedChange(
                            "preferences",
                            "sms",
                            e.target.checked,
                          )
                        }
                      />
                      <Checkbox
                        label="Push notifications"
                        checked={formData.preferences.push}
                        onChange={(e) =>
                          handleNestedChange(
                            "preferences",
                            "push",
                            e.target.checked,
                          )
                        }
                      />
                    </div>
                    {errors.communication && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.communication}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          terms: false,
                          newsletter: false,
                          notifications: false,
                          marketing: false,
                          preferences: {
                            email: false,
                            sms: false,
                            push: false,
                          },
                          categories: {
                            technology: false,
                            fashion: false,
                            sports: false,
                            food: false,
                          },
                        });
                        setErrors({});
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Reset Form
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Submit Form
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* Usage Guidelines */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Usage Guidelines
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                  When to Use Checkbox
                </h3>
                <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                  <li>
                    • <strong>Boolean choices:</strong> When users need to make
                    yes/no decisions
                  </li>
                  <li>
                    • <strong>Multiple selections:</strong> When users can
                    select multiple options from a list
                  </li>
                  <li>
                    • <strong>Terms acceptance:</strong> For legal agreements
                    and consent forms
                  </li>
                  <li>
                    • <strong>Preferences:</strong> For user settings and
                    configuration options
                  </li>
                  <li>
                    • <strong>Feature toggles:</strong> For enabling/disabling
                    specific functionality
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mt-6 mb-4">
                  Best Practices
                </h3>
                <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                  <li>
                    • <strong>Use clear labels:</strong> Make it obvious what
                    the checkbox controls
                  </li>
                  <li>
                    • <strong>Provide helper text:</strong> Explain the
                    implications of the choice
                  </li>
                  <li>
                    • <strong>Group related options:</strong> Use indeterminate
                    state for "select all" scenarios
                  </li>
                  <li>
                    • <strong>Consider custom design:</strong> Use custom prop
                    for branded checkboxes
                  </li>
                  <li>
                    • <strong>Handle validation:</strong> Provide clear error
                    messages for required fields
                  </li>
                  <li>
                    • <strong>Use appropriate sizes:</strong> Choose size based
                    on context and importance
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Admin>
  );
};

export default CheckboxExample;
