import React from "react";
import { ContainerLayout } from "../src/components/ContainerLayout";
import { Admin, AdminConfig } from "../src";

// Example configuration for the admin application
const exampleConfig: AdminConfig = {
  title: "Container Layout Demo",
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

// Example content components
const ArticleContent = () => (
  <div className="prose max-w-none">
    <h1>Article Title</h1>
    <p>
      This is an example article content that demonstrates how the
      ContainerLayout component can be used to wrap content in a constrained
      width container.
    </p>
    <p>
      The ContainerLayout component provides various options for controlling the
      appearance and behavior of the container, including maxWidth, padding,
      centering, and background styling.
    </p>
  </div>
);

const FormContent = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Contact Form</h2>
    <div>
      <label className="block text-sm font-medium text-gray-700">Name</label>
      <input
        type="text"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Enter your name"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Enter your email"
      />
    </div>
    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
      Submit
    </button>
  </div>
);

const CardContent = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Information Card</h2>
    <p className="text-gray-600">
      This card demonstrates the ContainerLayout with background styling
      enabled. It's useful for creating distinct content sections with visual
      separation.
    </p>
    <div className="bg-gray-50 p-4 rounded-md">
      <p className="text-sm text-gray-500">
        Additional information can be displayed in highlighted sections like
        this.
      </p>
    </div>
  </div>
);

/**
 * ContainerLayout Example Component
 *
 * This component demonstrates various ways to use the ContainerLayout component
 * with different configurations and content types.
 */
export const ContainerLayoutExample: React.FC = () => {
  return (
    <Admin config={exampleConfig}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="space-y-8">
          {/* Small container with article content */}
          <ContainerLayout maxWidth="sm" withBackground>
            <ArticleContent />
          </ContainerLayout>

          {/* Medium container with form content */}
          <ContainerLayout maxWidth="md" withBackground>
            <FormContent />
          </ContainerLayout>

          {/* Large container with card content */}
          <ContainerLayout maxWidth="lg" withBackground>
            <CardContent />
          </ContainerLayout>

          {/* Extra large container without background */}
          <ContainerLayout maxWidth="xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Full Width Content
              </h2>
              <p className="mt-2 text-gray-600">
                This container uses the "xl" maxWidth and has no background,
                making it suitable for full-width content sections.
              </p>
            </div>
          </ContainerLayout>

          {/* Custom styled container */}
          <ContainerLayout
            maxWidth="2xl"
            withBackground
            className="border-2 border-blue-200"
            style={{ backgroundColor: "#f0f9ff" }}
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-blue-900">
                Custom Styled Container
              </h2>
              <p className="mt-2 text-blue-700">
                This container demonstrates custom styling with className and
                style props.
              </p>
            </div>
          </ContainerLayout>
        </div>
      </div>
    </Admin>
  );
};

export default ContainerLayoutExample;
