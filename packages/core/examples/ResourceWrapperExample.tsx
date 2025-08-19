import React, { useState } from "react";
import { ResourceWrapper } from "../src/components/Resource";
import { Button } from "../src/components/Button";
import { Card } from "../src/components/Card";
import { SuperAdminProvider } from "../src/contexts/SuperAdminContext";

const exampleConfig = {
  title: "React SuperAdmin",
  theme: { primary: "#1976d2" },
  layout: { sidebarWidth: 240 },
  auth: { enabled: true },
  resources: [],
};

export default function ResourceWrapperExample() {
  const [selectedResource, setSelectedResource] = useState("users");
  const [showOptions, setShowOptions] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);

  const resources = [
    {
      name: "users",
      label: "Users",
      icon: "👥",
      description: "Manage user accounts and profiles",
      options: { create: true, edit: true, delete: true, list: true },
      permissions: ["read", "write", "delete", "admin"],
      metadata: {
        version: "1.0",
        category: "user-management",
        api: "/api/users",
      },
    },
    {
      name: "products",
      label: "Products",
      icon: "📦",
      description: "Manage product catalog and inventory",
      options: { create: true, edit: true, delete: false, list: true },
      permissions: ["read", "write"],
      metadata: { version: "1.0", category: "inventory", api: "/api/products" },
    },
    {
      name: "orders",
      label: "Orders",
      icon: "🛒",
      description: "Process and track customer orders",
      options: { create: false, edit: true, delete: false, list: true },
      permissions: ["read", "write"],
      metadata: { version: "1.0", category: "sales", api: "/api/orders" },
    },
    {
      name: "analytics",
      label: "Analytics",
      icon: "📊",
      description: "View reports and analytics data",
      options: { create: false, edit: false, delete: false, list: true },
      permissions: ["read"],
      metadata: {
        version: "1.0",
        category: "reporting",
        api: "/api/analytics",
      },
    },
  ];

  const selectedResourceData = resources.find(
    (r) => r.name === selectedResource,
  );

  return (
    <SuperAdminProvider config={exampleConfig}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          ResourceWrapper Component Examples
        </h1>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Basic ResourceWrapper</h2>
          <ResourceWrapper name="basic-resource">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Basic Resource</h3>
              <p className="text-blue-700 text-sm">
                This is a basic resource wrapper example.
              </p>
            </div>
          </ResourceWrapper>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Resource Selection</h2>
          <div className="space-y-2 mb-4">
            <div className="flex flex-wrap gap-2">
              {resources.map((resource) => (
                <Button
                  key={resource.name}
                  onClick={() => setSelectedResource(resource.name)}
                  variant={
                    selectedResource === resource.name ? "default" : "outline"
                  }
                  size="sm"
                >
                  <span className="mr-2">{resource.icon}</span>
                  {resource.label}
                </Button>
              ))}
            </div>
          </div>

          {selectedResourceData && (
            <ResourceWrapper
              name={selectedResourceData.name}
              label={selectedResourceData.label}
              icon={selectedResourceData.icon}
              options={selectedResourceData.options}
              permissions={selectedResourceData.permissions}
              metadata={selectedResourceData.metadata}
            >
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">
                    {selectedResourceData.icon}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedResourceData.label}
                    </h3>
                    <p className="text-gray-600">
                      {selectedResourceData.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Resource Information
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <strong>Name:</strong> {selectedResourceData.name}
                      </div>
                      <div>
                        <strong>Label:</strong> {selectedResourceData.label}
                      </div>
                      <div>
                        <strong>Icon:</strong> {selectedResourceData.icon}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Configuration
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <strong>Options:</strong>{" "}
                        {Object.keys(selectedResourceData.options)
                          .filter((k) => selectedResourceData.options[k])
                          .join(", ")}
                      </div>
                      <div>
                        <strong>Permissions:</strong>{" "}
                        {selectedResourceData.permissions.join(", ")}
                      </div>
                      <div>
                        <strong>Category:</strong>{" "}
                        {selectedResourceData.metadata.category}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ResourceWrapper>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Resource with Custom Options
          </h2>
          <div className="space-y-2 mb-4">
            <Button
              onClick={() => setShowOptions(!showOptions)}
              variant="outline"
            >
              {showOptions ? "Hide" : "Show"} Options
            </Button>
          </div>

          <ResourceWrapper
            name="custom-options-resource"
            label="Custom Options Resource"
            icon="⚙️"
            options={{
              create: true,
              edit: true,
              delete: false,
              list: true,
              export: true,
              import: true,
            }}
          >
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-semibold text-green-900 mb-4">
                Resource with Custom Options
              </h3>
              <p className="text-green-700 mb-4">
                This resource has custom options configured for create, edit,
                list, export, and import operations. Delete operations are
                disabled.
              </p>

              {showOptions && (
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Available Operations:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Create</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Edit</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Delete</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">List</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Export</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Import</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ResourceWrapper>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Resource with Custom Permissions
          </h2>
          <div className="space-y-2 mb-4">
            <Button
              onClick={() => setShowPermissions(!showPermissions)}
              variant="outline"
            >
              {showPermissions ? "Hide" : "Show"} Permissions
            </Button>
          </div>

          <ResourceWrapper
            name="permissions-resource"
            label="Permissions Resource"
            icon="🔐"
            permissions={["read", "write", "delete", "admin", "audit"]}
          >
            <div className="p-6 bg-purple-50 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-900 mb-4">
                Resource with Custom Permissions
              </h3>
              <p className="text-purple-700 mb-4">
                This resource has specific permissions configured for different
                user roles and access levels.
              </p>

              {showPermissions && (
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Required Permissions:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {["read", "write", "delete", "admin", "audit"].map(
                      (permission) => (
                        <div
                          key={permission}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm capitalize">
                            {permission}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Users must have all these permissions to access this
                    resource.
                  </p>
                </div>
              )}
            </div>
          </ResourceWrapper>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Resource with Custom Metadata
          </h2>
          <div className="space-y-2 mb-4">
            <Button
              onClick={() => setShowMetadata(!showMetadata)}
              variant="outline"
            >
              {showMetadata ? "Hide" : "Show"} Metadata
            </Button>
          </div>

          <ResourceWrapper
            name="metadata-resource"
            label="Metadata Resource"
            icon="📋"
            metadata={{
              version: "2.1.0",
              category: "advanced-features",
              api: "/api/v2/metadata",
              documentation: "https://docs.example.com/metadata",
              lastUpdated: "2024-01-15",
              maintainer: "core-team",
              tags: ["experimental", "beta", "feature-flag"],
            }}
          >
            <div className="p-6 bg-orange-50 rounded-lg">
              <h3 className="text-xl font-semibold text-orange-900 mb-4">
                Resource with Custom Metadata
              </h3>
              <p className="text-orange-700 mb-4">
                This resource includes comprehensive metadata for versioning,
                categorization, and documentation.
              </p>

              {showMetadata && (
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Resource Metadata:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div>
                        <strong>Version:</strong> 2.1.0
                      </div>
                      <div>
                        <strong>Category:</strong> advanced-features
                      </div>
                      <div>
                        <strong>API Endpoint:</strong> /api/v2/metadata
                      </div>
                      <div>
                        <strong>Documentation:</strong>{" "}
                        docs.example.com/metadata
                      </div>
                    </div>
                    <div>
                      <div>
                        <strong>Last Updated:</strong> 2024-01-15
                      </div>
                      <div>
                        <strong>Maintainer:</strong> core-team
                      </div>
                      <div>
                        <strong>Tags:</strong> experimental, beta, feature-flag
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ResourceWrapper>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Resource with Custom Styling
          </h2>
          <ResourceWrapper
            name="styled-resource"
            label="Styled Resource"
            icon="🎨"
            className="custom-resource-class"
            wrapperClassName="styled-wrapper"
            style={{ border: "2px solid #8b5cf6" }}
          >
            <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-900 mb-4">
                Resource with Custom Styling
              </h3>
              <p className="text-purple-700 mb-4">
                This resource demonstrates custom styling including custom
                classes, wrapper classes, and inline styles.
              </p>
              <div className="bg-white p-4 rounded border border-purple-200">
                <p className="text-sm text-gray-600">
                  The resource has custom CSS classes and inline styles applied
                  for enhanced visual appearance.
                </p>
              </div>
            </div>
          </ResourceWrapper>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Complex Resource Example
          </h2>
          <ResourceWrapper
            name="complex-resource"
            label="Complex Resource"
            icon="🚀"
            options={{
              create: true,
              edit: true,
              delete: true,
              list: true,
              export: true,
              import: true,
              duplicate: true,
              archive: true,
            }}
            permissions={[
              "read",
              "write",
              "delete",
              "admin",
              "audit",
              "approve",
            ]}
            metadata={{
              version: "3.0.0",
              category: "enterprise",
              api: "/api/v3/complex",
              documentation: "https://docs.example.com/complex",
              lastUpdated: "2024-01-20",
              maintainer: "enterprise-team",
              tags: ["enterprise", "premium", "advanced"],
              dependencies: ["auth-service", "notification-service"],
              rateLimit: "1000/hour",
              cache: "redis",
              monitoring: true,
            }}
          >
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-4">🚀</span>
                <div>
                  <h3 className="text-2xl font-bold text-blue-900">
                    Complex Resource
                  </h3>
                  <p className="text-blue-700">
                    Enterprise-grade resource with comprehensive configuration
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Operations
                  </h4>
                  <div className="space-y-2">
                    {[
                      "create",
                      "edit",
                      "delete",
                      "list",
                      "export",
                      "import",
                      "duplicate",
                      "archive",
                    ].map((op) => (
                      <div
                        key={op}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm capitalize">{op}</span>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Permissions
                  </h4>
                  <div className="space-y-2">
                    {[
                      "read",
                      "write",
                      "delete",
                      "admin",
                      "audit",
                      "approve",
                    ].map((perm) => (
                      <div
                        key={perm}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm capitalize">{perm}</span>
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Technical Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Version:</strong> 3.0.0
                    </div>
                    <div>
                      <strong>Category:</strong> enterprise
                    </div>
                    <div>
                      <strong>Rate Limit:</strong> 1000/hour
                    </div>
                    <div>
                      <strong>Cache:</strong> redis
                    </div>
                    <div>
                      <strong>Monitoring:</strong> enabled
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Dependencies
                </h4>
                <div className="flex space-x-2">
                  {["auth-service", "notification-service"].map((dep) => (
                    <span
                      key={dep}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ResourceWrapper>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            ResourceWrapper Props Reference
          </h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>name:</strong> string - Required resource identifier
            </div>
            <div>
              <strong>label:</strong> string - Human-readable resource name
              (defaults to name)
            </div>
            <div>
              <strong>icon:</strong> string - Icon to represent the resource
            </div>
            <div>
              <strong>options:</strong> object - Resource operation options
              (create, edit, delete, list, etc.)
            </div>
            <div>
              <strong>permissions:</strong> string[] - Required permissions to
              access the resource
            </div>
            <div>
              <strong>metadata:</strong> object - Additional resource metadata
            </div>
            <div>
              <strong>children:</strong> ReactNode - Content to display within
              the resource
            </div>
            <div>
              <strong>className:</strong> string - Additional CSS classes for
              the resource
            </div>
            <div>
              <strong>wrapperClassName:</strong> string - CSS classes for the
              wrapper element
            </div>
            <div>
              <strong>style:</strong> CSSProperties - Inline styles for the
              resource
            </div>
          </div>
        </Card>
      </div>
    </SuperAdminProvider>
  );
}
