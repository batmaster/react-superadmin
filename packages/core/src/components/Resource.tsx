import React, { ReactNode, useEffect } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { ResourceConfig } from "../types";
import { cn } from "../utils/cn";

export interface ResourceWrapperProps {
  /** Resource configuration object */
  config: ResourceConfig;
  /** Child components to render within the resource context */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * ResourceWrapper component that defines a data resource with its CRUD operations.
 * This component should be used within the Admin component to define resources.
 *
 * @example
 * ```tsx
 * import { ResourceWrapper } from '@react-superadmin/core';
 *
 * const UserResource = () => (
 *   <ResourceWrapper config={userResourceConfig}>
 *     <UserList />
 *     <UserForm />
 *   </ResourceWrapper>
 * );
 * ```
 */
export const ResourceWrapper: React.FC<ResourceWrapperProps> = ({
  config,
  children,
  className = "",
  style = {},
}) => {
  const { resources } = useSuperAdmin();

  // Validate that the resource name is unique
  useEffect(() => {
    if (resources[config.name]) {
      console.warn(
        `Resource with name "${config.name}" already exists. This may cause conflicts.`,
      );
    }
  }, [config.name, resources]);

  return (
    <div
      className={cn("react-superadmin-resource", className)}
      style={style}
      data-testid={`resource-${config.name}`}
      data-resource-name={config.name}
      data-resource-label={config.label}
    >
      {children}
    </div>
  );
};

export default ResourceWrapper;
