import React, { useState } from "react";
import { Button } from "../src/components/Button";
import { Admin, AdminConfig } from "../src";

// Example configuration for the admin application
const exampleConfig: AdminConfig = {
  title: "Button Component Demo",
  resources: {},
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
const PlusIcon = () => (
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
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const SearchIcon = () => (
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
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ArrowRightIcon = () => (
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
      d="M13 7l5 5m0 0l-5 5m5-5H6"
    />
  </svg>
);

const TrashIcon = () => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

/**
 * Button Example Component
 *
 * This component demonstrates various ways to use the Button component
 * with different configurations and states.
 */
export const ButtonExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAsyncAction = async () => {
    setIsLoading(true);
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <Admin config={exampleConfig}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Button Component Examples
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Various ways to use the Button component with different variants,
              sizes, and states
            </p>
          </div>

          <div className="space-y-8">
            {/* Button Variants */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Button Variants
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </section>

            {/* Button Sizes */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Button Sizes
              </h2>
              <div className="flex items-center space-x-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </section>

            {/* Buttons with Icons */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Buttons with Icons
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button leftIcon={<PlusIcon />}>Create New</Button>
                <Button rightIcon={<ArrowRightIcon />}>Continue</Button>
                <Button
                  leftIcon={<SearchIcon />}
                  rightIcon={<ArrowRightIcon />}
                >
                  Search & Go
                </Button>
                <Button variant="danger" leftIcon={<TrashIcon />}>
                  Delete
                </Button>
                <Button variant="outline" leftIcon={<PlusIcon />}>
                  Add Item
                </Button>
                <Button variant="ghost" rightIcon={<ArrowRightIcon />}>
                  Next Step
                </Button>
              </div>
            </section>

            {/* Loading States */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Loading States
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button loading>Loading...</Button>
                <Button loading loadingText="Processing...">
                  Submit
                </Button>
                <Button loading variant="success" loadingText="Saving...">
                  Save Changes
                </Button>
                <Button loading variant="danger" loadingText="Deleting...">
                  Delete
                </Button>
                <Button loading variant="outline" loadingText="Uploading...">
                  Upload File
                </Button>
                <Button loading variant="ghost" loadingText="Refreshing...">
                  Refresh
                </Button>
              </div>
            </section>

            {/* Interactive Loading Example */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Interactive Loading Example
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Click the button below to see a loading state for 2 seconds:
                </p>
                <div className="flex space-x-4">
                  <Button
                    loading={isLoading}
                    onClick={handleAsyncAction}
                    leftIcon={<PlusIcon />}
                  >
                    {isLoading ? "Processing..." : "Start Async Action"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsLoading(false)}
                    disabled={!isLoading}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </section>

            {/* Full Width Buttons */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Full Width Buttons
              </h2>
              <div className="space-y-4 max-w-md">
                <Button fullWidth>Full Width Button</Button>
                <Button fullWidth variant="outline">
                  Full Width Outline
                </Button>
                <Button fullWidth variant="ghost">
                  Full Width Ghost
                </Button>
              </div>
            </section>

            {/* Disabled States */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Disabled States
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button disabled>Disabled Primary</Button>
                <Button disabled variant="outline">
                  Disabled Outline
                </Button>
                <Button disabled variant="ghost">
                  Disabled Ghost
                </Button>
                <Button disabled variant="danger">
                  Disabled Danger
                </Button>
                <Button disabled variant="success">
                  Disabled Success
                </Button>
                <Button disabled variant="warning">
                  Disabled Warning
                </Button>
              </div>
            </section>

            {/* Button Groups */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Button Groups
              </h2>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button size="sm">Current</Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" leftIcon={<PlusIcon />}>
                    Add
                  </Button>
                  <Button variant="outline" leftIcon={<SearchIcon />}>
                    Search
                  </Button>
                  <Button variant="outline" leftIcon={<TrashIcon />}>
                    Delete
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button variant="success" size="sm">
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            </section>

            {/* Form Actions */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Form Actions
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="primary" leftIcon={<PlusIcon />}>
                      Subscribe
                    </Button>
                    <Button variant="outline">Cancel</Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Call to Action
              </h2>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-blue-100 mb-6">
                  Join thousands of users who are already using our platform
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    Learn More
                  </Button>
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Admin>
  );
};

export default ButtonExample;
