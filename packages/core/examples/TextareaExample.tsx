import React, { useState } from "react";
import { Textarea } from "../src/components/Textarea";
import { Admin, AdminConfig } from "../src";

// Example configuration for the admin application
const exampleConfig: AdminConfig = {
  title: "Textarea Component Demo",
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
const DocumentIcon = () => (
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
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const EditIcon = () => (
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
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
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

const AlertIcon = () => (
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
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
);

/**
 * Textarea Example Component
 *
 * This component demonstrates various ways to use the Textarea component
 * with different configurations and states.
 */
export const TextareaExample: React.FC = () => {
  const [formData, setFormData] = useState({
    description: "",
    bio: "",
    notes: "",
    feedback: "",
    longText: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.bio) {
      newErrors.bio = "Bio is required";
    }

    if (formData.feedback && formData.feedback.length < 20) {
      newErrors.feedback = "Feedback must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
    }
  };

  return (
    <Admin config={exampleConfig}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Textarea Component Examples
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Various ways to use the Textarea component with different
              configurations and states
            </p>
          </div>

          <div className="space-y-8">
            {/* Basic Textareas */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Basic Textareas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Textarea
                  label="Description"
                  placeholder="Enter a description..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  error={errors.description}
                  required
                  helperText="Provide a brief description of your item"
                />

                <Textarea
                  label="Bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  error={errors.bio}
                  required
                  rows={4}
                />
              </div>
            </section>

            {/* Textareas with Icons */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Textareas with Icons
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Textarea
                  label="Document Notes"
                  placeholder="Add your notes here..."
                  leftIcon={<DocumentIcon />}
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  helperText="Use this area for additional notes"
                />

                <Textarea
                  label="Feedback"
                  placeholder="Share your feedback..."
                  leftIcon={<EditIcon />}
                  rightIcon={<CheckIcon />}
                  value={formData.feedback}
                  onChange={(e) =>
                    handleInputChange("feedback", e.target.value)
                  }
                  error={errors.feedback}
                  helperText="Your feedback helps us improve"
                />
              </div>
            </section>

            {/* Textarea Sizes */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Textarea Sizes
              </h2>
              <div className="space-y-4">
                <Textarea
                  label="Small Textarea"
                  size="sm"
                  placeholder="Small size textarea"
                  leftIcon={<DocumentIcon />}
                  rows={2}
                />

                <Textarea
                  label="Medium Textarea (Default)"
                  size="md"
                  placeholder="Medium size textarea"
                  leftIcon={<DocumentIcon />}
                  rows={3}
                />

                <Textarea
                  label="Large Textarea"
                  size="lg"
                  placeholder="Large size textarea"
                  leftIcon={<DocumentIcon />}
                  rows={4}
                />
              </div>
            </section>

            {/* Character Count Examples */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Character Count Examples
              </h2>
              <div className="space-y-4">
                <Textarea
                  label="Short Description"
                  placeholder="Enter a short description..."
                  showCharacterCount
                  maxLength={100}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  helperText="Maximum 100 characters"
                  leftIcon={<DocumentIcon />}
                />

                <Textarea
                  label="Long Text"
                  placeholder="Enter a longer text..."
                  showCharacterCount
                  maxLength={500}
                  value={formData.longText}
                  onChange={(e) =>
                    handleInputChange("longText", e.target.value)
                  }
                  helperText="Maximum 500 characters"
                  leftIcon={<DocumentIcon />}
                  rows={6}
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
                    <Textarea
                      label="Description"
                      placeholder="Enter a description..."
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      error={errors.description}
                      required
                      leftIcon={<DocumentIcon />}
                      helperText="Provide a brief description of your item"
                    />

                    <Textarea
                      label="Bio"
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      error={errors.bio}
                      required
                      rows={4}
                      leftIcon={<EditIcon />}
                    />
                  </div>

                  <Textarea
                    label="Feedback"
                    placeholder="Share your feedback..."
                    value={formData.feedback}
                    onChange={(e) =>
                      handleInputChange("feedback", e.target.value)
                    }
                    error={errors.feedback}
                    leftIcon={<EditIcon />}
                    rightIcon={<CheckIcon />}
                    helperText="Your feedback helps us improve"
                    showCharacterCount
                    maxLength={200}
                    rows={4}
                  />

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          description: "",
                          bio: "",
                          notes: "",
                          feedback: "",
                          longText: "",
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
          </div>
        </div>
      </div>
    </Admin>
  );
};

export default TextareaExample;
