import React, { useState } from "react";
import { Select, SelectOption } from "../src/components/Select";
import { Admin, AdminConfig } from "../src";

// Example configuration for the admin application
const exampleConfig: AdminConfig = {
  title: "Select Component Demo",
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

// Example icon components
const GlobeIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const TagIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

// Sample data
const countries: SelectOption[] = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "it", label: "Italy" },
  { value: "es", label: "Spain" },
  { value: "jp", label: "Japan" },
  { value: "cn", label: "China" },
  { value: "in", label: "India" },
  { value: "br", label: "Brazil" },
  { value: "au", label: "Australia" },
];

const categories: SelectOption[] = [
  { value: "electronics", label: "Electronics", data: { group: "Technology" } },
  { value: "computers", label: "Computers", data: { group: "Technology" } },
  { value: "phones", label: "Phones", data: { group: "Technology" } },
  { value: "clothing", label: "Clothing", data: { group: "Fashion" } },
  { value: "shoes", label: "Shoes", data: { group: "Fashion" } },
  { value: "accessories", label: "Accessories", data: { group: "Fashion" } },
  { value: "books", label: "Books", data: { group: "Education" } },
  { value: "courses", label: "Online Courses", data: { group: "Education" } },
  { value: "food", label: "Food & Beverages", data: { group: "Lifestyle" } },
  { value: "fitness", label: "Fitness", data: { group: "Lifestyle" } },
];

const roles: SelectOption[] = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Manager" },
  { value: "user", label: "User" },
  { value: "guest", label: "Guest", disabled: true },
];

const priorities: SelectOption[] = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
  { value: "urgent", label: "Urgent" },
];

/**
 * Select Example Component
 *
 * This component demonstrates various ways to use the Select component
 * with different configurations and states.
 */
export const SelectExample: React.FC = () => {
  const [formData, setFormData] = useState({
    country: "",
    category: "",
    role: "",
    priority: "",
    tags: [] as string[],
    skills: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSelectChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user makes a selection
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.country) {
      newErrors.country = "Please select a country";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    if (formData.tags.length === 0) {
      newErrors.tags = "Please select at least one tag";
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

  return (
    <Admin config={exampleConfig}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Select Component Examples
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Various ways to use the Select component with different
              configurations and states
            </p>
          </div>

          <div className="space-y-8">
            {/* Basic Selects */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Basic Selects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Country"
                  options={countries}
                  placeholder="Select your country"
                  leftIcon={<GlobeIcon />}
                  value={formData.country}
                  onChange={(e) =>
                    handleSelectChange("country", e.target.value)
                  }
                  error={errors.country}
                  required
                  helperText="Choose your country of residence"
                />

                <Select
                  label="Category"
                  options={categories}
                  placeholder="Select a category"
                  leftIcon={<TagIcon />}
                  value={formData.category}
                  onChange={(e) =>
                    handleSelectChange("category", e.target.value)
                  }
                  error={errors.category}
                  required
                  helperText="Choose a product category"
                />
              </div>
            </section>

            {/* Searchable Selects */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Searchable Selects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Search Country"
                  options={countries}
                  placeholder="Search and select a country"
                  leftIcon={<GlobeIcon />}
                  searchable
                  helperText="Type to search through countries"
                />

                <Select
                  label="Search Category"
                  options={categories}
                  placeholder="Search and select a category"
                  leftIcon={<TagIcon />}
                  searchable
                  helperText="Type to search through categories"
                />
              </div>
            </section>

            {/* Multi-Select */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Multi-Select
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Tags"
                  options={categories
                    .slice(0, 8)
                    .map((cat) => ({ ...cat, value: cat.value + "-tag" }))}
                  placeholder="Select multiple tags"
                  leftIcon={<TagIcon />}
                  multiple
                  value={formData.tags}
                  onChange={(e) =>
                    handleSelectChange(
                      "tags",
                      Array.from(e.target.selectedOptions, (opt) => opt.value),
                    )
                  }
                  error={errors.tags}
                  required
                  helperText="Select multiple tags for categorization"
                />

                <Select
                  label="Skills"
                  options={[
                    { value: "react", label: "React" },
                    { value: "typescript", label: "TypeScript" },
                    { value: "nodejs", label: "Node.js" },
                    { value: "python", label: "Python" },
                    { value: "java", label: "Java" },
                    { value: "csharp", label: "C#" },
                    { value: "php", label: "PHP" },
                    { value: "ruby", label: "Ruby" },
                  ]}
                  placeholder="Select your skills"
                  leftIcon={<UserIcon />}
                  multiple
                  value={formData.skills}
                  onChange={(e) =>
                    handleSelectChange(
                      "skills",
                      Array.from(e.target.selectedOptions, (opt) => opt.value),
                    )
                  }
                  helperText="Select all skills you have"
                />
              </div>
            </section>

            {/* Select Sizes */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Select Sizes
              </h2>
              <div className="space-y-4">
                <Select
                  label="Small Select"
                  size="sm"
                  options={countries.slice(0, 5)}
                  placeholder="Small size select"
                  leftIcon={<GlobeIcon />}
                />

                <Select
                  label="Medium Select (Default)"
                  size="md"
                  options={countries.slice(0, 5)}
                  placeholder="Medium size select"
                  leftIcon={<GlobeIcon />}
                />

                <Select
                  label="Large Select"
                  size="lg"
                  options={countries.slice(0, 5)}
                  placeholder="Large size select"
                  leftIcon={<GlobeIcon />}
                />
              </div>
            </section>

            {/* Grouped Options */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Grouped Options
              </h2>
              <div className="space-y-4">
                <Select
                  label="Category with Groups"
                  options={categories}
                  placeholder="Select a category from groups"
                  leftIcon={<TagIcon />}
                  showOptionGroups
                  helperText="Options are organized by groups"
                />

                <Select
                  label="Searchable Grouped Categories"
                  options={categories}
                  placeholder="Search and select from groups"
                  leftIcon={<TagIcon />}
                  searchable
                  showOptionGroups
                  helperText="Search through grouped categories"
                />
              </div>
            </section>

            {/* Select States */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Select States
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Disabled Select"
                  options={countries}
                  placeholder="This select is disabled"
                  disabled
                  leftIcon={<GlobeIcon />}
                  value="us"
                />

                <Select
                  label="Select with Error"
                  options={countries}
                  placeholder="This select has an error"
                  error="Please select a valid option"
                  leftIcon={<GlobeIcon />}
                  helperText="This field has validation errors"
                />
              </div>
            </section>

            {/* Full Width Selects */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Full Width Selects
              </h2>
              <div className="space-y-4">
                <Select
                  label="Full Width Select"
                  options={countries}
                  placeholder="This select takes full width"
                  fullWidth
                  leftIcon={<GlobeIcon />}
                  helperText="Full width select for better mobile experience"
                />

                <Select
                  label="Full Width Multi-Select"
                  options={categories}
                  placeholder="Select multiple categories"
                  fullWidth
                  multiple
                  leftIcon={<TagIcon />}
                  helperText="Full width multi-select with grouped options"
                  showOptionGroups
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Country"
                      options={countries}
                      placeholder="Select your country"
                      leftIcon={<GlobeIcon />}
                      value={formData.country}
                      onChange={(e) =>
                        handleSelectChange("country", e.target.value)
                      }
                      error={errors.country}
                      required
                      helperText="Choose your country of residence"
                    />

                    <Select
                      label="Role"
                      options={roles}
                      placeholder="Select your role"
                      leftIcon={<UserIcon />}
                      value={formData.role}
                      onChange={(e) =>
                        handleSelectChange("role", e.target.value)
                      }
                      error={errors.role}
                      required
                      helperText="Choose your user role"
                    />
                  </div>

                  <Select
                    label="Category"
                    options={categories}
                    placeholder="Select a category"
                    leftIcon={<TagIcon />}
                    value={formData.category}
                    onChange={(e) =>
                      handleSelectChange("category", e.target.value)
                    }
                    error={errors.category}
                    required
                    helperText="Choose a product category"
                    showOptionGroups
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Priority Level"
                      options={priorities}
                      placeholder="Select priority"
                      leftIcon={<CheckIcon />}
                      value={formData.priority}
                      onChange={(e) =>
                        handleSelectChange("priority", e.target.value)
                      }
                      helperText="Choose the priority level"
                    />

                    <Select
                      label="Tags"
                      options={categories
                        .slice(0, 8)
                        .map((cat) => ({ ...cat, value: cat.value + "-tag" }))}
                      placeholder="Select multiple tags"
                      leftIcon={<TagIcon />}
                      multiple
                      value={formData.tags}
                      onChange={(e) =>
                        handleSelectChange(
                          "tags",
                          Array.from(
                            e.target.selectedOptions,
                            (opt) => opt.value,
                          ),
                        )
                      }
                      error={errors.tags}
                      required
                      helperText="Select multiple tags for categorization"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          country: "",
                          category: "",
                          role: "",
                          priority: "",
                          tags: [],
                          skills: [],
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
                  When to Use Select
                </h3>
                <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                  <li>
                    • <strong>Single choice from options:</strong> When users
                    need to choose one option from a predefined list
                  </li>
                  <li>
                    • <strong>Multiple choices:</strong> When users can select
                    multiple options (use multiple prop)
                  </li>
                  <li>
                    • <strong>Large option sets:</strong> When there are many
                    options and search functionality is needed
                  </li>
                  <li>
                    • <strong>Grouped options:</strong> When options can be
                    logically organized into categories
                  </li>
                  <li>
                    • <strong>Form inputs:</strong> For dropdown selection in
                    forms and surveys
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mt-6 mb-4">
                  Best Practices
                </h3>
                <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                  <li>
                    • <strong>Provide clear labels:</strong> Help users
                    understand what they're selecting
                  </li>
                  <li>
                    • <strong>Use meaningful placeholders:</strong> Give users a
                    hint about what to expect
                  </li>
                  <li>
                    • <strong>Limit options:</strong> Use maxOptions to prevent
                    overwhelming users with too many choices
                  </li>
                  <li>
                    • <strong>Enable search:</strong> Use searchable prop for
                    lists with more than 10 options
                  </li>
                  <li>
                    • <strong>Group related options:</strong> Use
                    showOptionGroups for better organization
                  </li>
                  <li>
                    • <strong>Handle validation:</strong> Provide clear error
                    messages for required fields
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

export default SelectExample;
