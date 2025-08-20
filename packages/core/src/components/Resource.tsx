import React, { ReactNode, useEffect } from "react";
import {
  ResourceConfig,
  FieldConfig,
  PermissionConfig,
  ViewConfig,
} from "../types";
import { useSuperAdmin } from "../contexts/SuperAdminContext";

export interface ResourceProps {
  /** Resource configuration */
  config: ResourceConfig;
  /** Custom actions for this resource */
  actions?: ReactNode;
  /** Custom routes for this resource */
  routes?: ReactNode;
  /** Resource-level data provider override */
  dataProvider?: any;
  /** Resource-level authentication rules */
  authRules?: PermissionConfig;
  /** Custom field renderers */
  fieldRenderers?: Record<
    string,
    (field: FieldConfig, value: any) => ReactNode
  >;
  /** Resource-level configuration options */
  options?: {
    /** Enable/disable specific operations */
    operations?: {
      create?: boolean;
      read?: boolean;
      update?: boolean;
      delete?: boolean;
      list?: boolean;
    };
    /** Custom validation rules */
    validation?: Record<string, any>;
    /** Resource-specific settings */
    settings?: Record<string, any>;
  };
  /** Children components */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Resource component for defining CRUD operations on data resources
 *
 * This component allows you to define and configure individual resources
 * within the admin system, including their fields, permissions, views,
 * and custom configurations.
 *
 * @example
 * ```tsx
 * import { Resource, createResource } from '@react-superadmin/core';
 *
 * const userResource = createResource({
 *   name: 'users',
 *   label: 'Users',
 *   fields: [
 *     { name: 'name', label: 'Name', type: 'text', required: true },
 *     { name: 'email', label: 'Email', type: 'email', required: true },
 *     { name: 'role', label: 'Role', type: 'select', options: [
 *       { value: 'admin', label: 'Administrator' },
 *       { value: 'user', label: 'User' }
 *     ]}
 *   ]
 * });
 *
 * function App() {
 *   return (
 *     <Admin config={adminConfig}>
 *       <Resource config={userResource}>
 *         <Route path="/users" element={<UserList />} />
 *         <Route path="/users/create" element={<UserCreate />} />
 *         <Route path="/users/:id" element={<UserShow />} />
 *         <Route path="/users/:id/edit" element={<UserEdit />} />
 *       </Resource>
 *     </Admin>
 *   );
 * }
 * ```
 */
export const Resource: React.FC<ResourceProps> = ({
  config,
  actions,
  routes,
  dataProvider: _dataProvider,
  authRules,
  fieldRenderers,
  options,
  children,
  className = "",
}) => {
  const { resources: _resources } = useSuperAdmin();

  // Merge resource-level options with config
  const finalConfig: ResourceConfig = {
    ...config,
    permissions: {
      ...config.permissions,
      ...authRules,
      ...options?.operations,
    },
    options: {
      ...config.options,
      ...options,
    },
  };

  // Register resource with the admin context
  useEffect(() => {
    // The resource is already registered via the Admin component's config
    // This effect can be used for additional resource-level setup if needed
  }, [config.name]);

  // Check if user has permission to access this resource
  const _hasPermission = (operation: keyof PermissionConfig): boolean => {
    const permissions = finalConfig.permissions;
    return permissions?.[operation] ?? true;
  };

  // Get field configuration with custom renderers
  const getFieldConfig = (fieldName: string): FieldConfig | undefined => {
    return finalConfig.fields.find((field) => field.name === fieldName);
  };

  // Render custom field if renderer exists
  const _renderField = (fieldName: string, value: any): ReactNode => {
    const field = getFieldConfig(fieldName);
    if (!field) return value;

    const customRenderer = fieldRenderers?.[fieldName];
    if (customRenderer) {
      return customRenderer(field, value);
    }

    // Default field rendering based on type
    return renderDefaultField(field, value);
  };

  // Default field rendering
  const renderDefaultField = (field: FieldConfig, value: any): ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>;
    }

    switch (field.type) {
      case "boolean":
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {value ? "Yes" : "No"}
          </span>
        );
      case "date":
        return <span>{new Date(value).toLocaleDateString()}</span>;
      case "select": {
        const option = field.options?.find((opt) => opt.value === value);
        return <span>{option?.label || value}</span>;
      }
      default:
        return <span>{String(value)}</span>;
    }
  };

  // Get available views for this resource
  const getAvailableViews = (): ViewConfig[] => {
    return finalConfig.views || [];
  };

  // Check if a specific view is available
  const _hasView = (viewName: string): boolean => {
    return getAvailableViews().some((view) => view.name === viewName);
  };

  return (
    <div
      className={`react-superadmin-resource ${className}`}
      data-resource={config.name}
    >
      {/* Resource Header */}
      <div className="resource-header mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{config.label}</h2>
        {actions && <div className="resource-actions mt-2">{actions}</div>}
      </div>

      {/* Resource Content */}
      <div className="resource-content">
        {/* Custom Routes */}
        {routes && <div className="resource-routes mb-4">{routes}</div>}

        {/* Children Components */}
        {children && <div className="resource-children">{children}</div>}
      </div>

      {/* Resource Debug Info (development only) */}
      {process.env.NODE_ENV === "development" && (
        <details className="resource-debug mt-4 p-4 bg-gray-100 rounded">
          <summary className="cursor-pointer font-medium text-gray-700">
            Resource Debug Info
          </summary>
          <div className="mt-2 text-sm text-gray-600">
            <p>
              <strong>Name:</strong> {config.name}
            </p>
            <p>
              <strong>Label:</strong> {config.label}
            </p>
            <p>
              <strong>Fields:</strong> {config.fields.length}
            </p>
            <p>
              <strong>Views:</strong>{" "}
              {getAvailableViews()
                .map((v) => v.name)
                .join(", ")}
            </p>
            <p>
              <strong>Permissions:</strong>{" "}
              {JSON.stringify(finalConfig.permissions)}
            </p>
          </div>
        </details>
      )}
    </div>
  );
};

export default Resource;
