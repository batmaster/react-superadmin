import React from "react";
import { PageLayout } from "../src/components/PageLayout";
import { Admin, AdminConfig } from "../src";

// Example configuration for the admin application
const exampleConfig: AdminConfig = {
  title: "Page Layout Demo",
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

// Example action buttons
const CreateButton = () => (
  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
    Create New
  </button>
);

const ExportButton = () => (
  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
    Export Data
  </button>
);

const FilterButton = () => (
  <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
    Filter
  </button>
);

// Example content components
const UserList = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        User List
      </h3>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        {[
          { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "User",
          },
          {
            id: 3,
            name: "Bob Johnson",
            email: "bob@example.com",
            role: "Moderator",
          },
        ].map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md"
          >
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {user.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {user.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DashboardContent = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      { title: "Total Users", value: "1,234", change: "+12%", color: "blue" },
      { title: "Active Sessions", value: "567", change: "+5%", color: "green" },
      { title: "Revenue", value: "$45,678", change: "+23%", color: "purple" },
    ].map((stat, index) => (
      <div
        key={index}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {stat.title}
        </h3>
        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          {stat.value}
        </p>
        <p
          className={`mt-2 text-sm text-${stat.color}-600 dark:text-${stat.color}-400`}
        >
          {stat.change} from last month
        </p>
      </div>
    ))}
  </div>
);

/**
 * PageLayout Example Component
 *
 * This component demonstrates various ways to use the PageLayout component
 * with different configurations and content types.
 */
export const PageLayoutExample: React.FC = () => {
  return (
    <Admin config={exampleConfig}>
      <div className="space-y-8">
        {/* Basic page with title and actions */}
        <PageLayout
          title="Users"
          subtitle="Manage user accounts and permissions"
          actions={
            <div className="flex space-x-3">
              <FilterButton />
              <ExportButton />
              <CreateButton />
            </div>
          }
        >
          <UserList />
        </PageLayout>

        {/* Page with breadcrumbs */}
        <PageLayout
          title="Dashboard"
          subtitle="Overview of your application"
          showBreadcrumbs
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Analytics", href: "/analytics" },
            { label: "Dashboard" },
          ]}
          actions={<CreateButton />}
        >
          <DashboardContent />
        </PageLayout>

        {/* Page without header */}
        <PageLayout showHeader={false} withBackground={false} padded={false}>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Full Width Content
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This page layout has no header, background, or padding, making it
              suitable for full-width content sections.
            </p>
          </div>
        </PageLayout>

        {/* Custom styled page */}
        <PageLayout
          title="Custom Styled Page"
          subtitle="Demonstrating custom styling capabilities"
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900"
          style={{ minHeight: "400px" }}
          actions={<CreateButton />}
        >
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Custom Background
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This page uses custom background colors and styling to create a
              unique visual appearance.
            </p>
          </div>
        </PageLayout>
      </div>
    </Admin>
  );
};

export default PageLayoutExample;
