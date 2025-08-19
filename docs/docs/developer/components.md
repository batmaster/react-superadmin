---
id: components
title: Custom Components
sidebar_label: Custom Components
keywords: [components, custom, development, extending, patterns]
---

# Custom Components

Learn how to create custom components that integrate seamlessly with React SuperAdmin.

## Component Patterns

React SuperAdmin follows established patterns for component development. When creating custom components, follow these patterns to ensure consistency and maintainability.

### Basic Component Structure

```typescript
import React from 'react';
import { cn } from '@react-superadmin/web/utils';

interface CustomComponentProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const CustomComponent: React.FC<CustomComponentProps> = ({
  className,
  children,
  variant = 'default',
  size = 'md',
  ...props
}) => {
  const baseClasses = 'custom-component';
  const variantClasses = {
    default: 'bg-gray-100 text-gray-900',
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-500 text-white'
  };
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
```

### Key Patterns

1. **Props Interface**: Define a clear interface for component props
2. **Default Values**: Provide sensible defaults for optional props
3. **Class Names**: Use the `cn` utility for conditional class names
4. **Forward Props**: Spread remaining props to the root element
5. **TypeScript**: Use proper typing for all props and return values

## Form Components

### Custom Form Field

```typescript
import React from 'react';
import { FormField } from '@react-superadmin/web';
import { cn } from '@react-superadmin/web/utils';

interface CustomFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const CustomField: React.FC<CustomFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  error,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <FormField
      name={name}
      label={label}
      type={type}
      placeholder={placeholder}
      required={required}
      error={error}
      disabled={disabled}
      className={cn('custom-field', className)}
      {...props}
    />
  );
};
```

### Custom Form Layout

```typescript
import React from 'react';
import { cn } from '@react-superadmin/web/utils';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  className
}) => {
  return (
    <div className={cn('form-section', className)}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
};
```

## Table Components

### Custom Table Column

```typescript
import React from 'react';
import { DataTable } from '@react-superadmin/web';

interface CustomColumnProps {
  data: any;
  column: any;
  rowIndex: number;
}

export const CustomColumn: React.FC<CustomColumnProps> = ({
  data,
  column,
  rowIndex
}) => {
  const value = data[column.key];

  // Custom rendering logic
  if (column.key === 'status') {
    return (
      <span className={`status-badge status-${value.toLowerCase()}`}>
        {value}
      </span>
    );
  }

  if (column.key === 'actions') {
    return (
      <div className="flex space-x-2">
        <button className="btn btn-sm btn-primary">Edit</button>
        <button className="btn btn-sm btn-danger">Delete</button>
      </div>
    );
  }

  return <span>{value}</span>;
};
```

### Custom Table Toolbar

```typescript
import React from 'react';
import { Button } from '@react-superadmin/web';

interface TableToolbarProps {
  onAdd?: () => void;
  onExport?: () => void;
  onBulkDelete?: () => void;
  selectedCount?: number;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  onAdd,
  onExport,
  onBulkDelete,
  selectedCount = 0
}) => {
  return (
    <div className="table-toolbar">
      <div className="toolbar-left">
        {onAdd && (
          <Button variant="primary" onClick={onAdd}>
            Add New
          </Button>
        )}
        {selectedCount > 0 && onBulkDelete && (
          <Button variant="danger" onClick={onBulkDelete}>
            Delete Selected ({selectedCount})
          </Button>
        )}
      </div>
      <div className="toolbar-right">
        {onExport && (
          <Button variant="secondary" onClick={onExport}>
            Export
          </Button>
        )}
      </div>
    </div>
  );
};
```

## Layout Components

### Custom Sidebar Item

```typescript
import React from 'react';
import { cn } from '@react-superadmin/web/utils';

interface SidebarItemProps {
  label: string;
  to: string;
  icon?: React.ReactNode;
  badge?: string | number;
  isActive?: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  to,
  icon,
  badge,
  isActive = false,
  onClick
}) => {
  return (
    <div
      className={cn(
        'sidebar-item',
        isActive && 'sidebar-item-active'
      )}
      onClick={onClick}
    >
      {icon && <span className="sidebar-icon">{icon}</span>}
      <span className="sidebar-label">{label}</span>
      {badge && (
        <span className="sidebar-badge">{badge}</span>
      )}
    </div>
  );
};
```

### Custom Header

```typescript
import React from 'react';
import { Button } from '@react-superadmin/web';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  actions,
  onBack
}) => {
  return (
    <div className="page-header">
      <div className="header-content">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="back-button">
            ← Back
          </Button>
        )}
        <div className="header-text">
          <h1 className="header-title">{title}</h1>
          {subtitle && (
            <p className="header-subtitle">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="header-actions">
          {actions}
        </div>
      )}
    </div>
  );
};
```

## Data Display Components

### Custom Card

```typescript
import React from 'react';
import { cn } from '@react-superadmin/web/utils';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className,
  headerActions,
  footer
}) => {
  return (
    <div className={cn('card', className)}>
      {(title || headerActions) && (
        <div className="card-header">
          <div className="card-title">
            {title && <h3 className="card-title-text">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerActions && (
            <div className="card-actions">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};
```

### Custom Badge

```typescript
import React from 'react';
import { cn } from '@react-superadmin/web/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span
      className={cn(
        'badge',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};
```

## Integration with Hooks

### Using Core Hooks

```typescript
import React from 'react';
import { useResource, useTable } from '@react-superadmin/core';
import { CustomTable } from './CustomTable';

interface UserListProps {
  resourceName?: string;
}

export const UserList: React.FC<UserListProps> = ({
  resourceName = 'users'
}) => {
  const { data, loading, error } = useResource(resourceName);
  const tableState = useTable(resourceName);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <CustomTable
      data={data}
      {...tableState}
    />
  );
};
```

### Custom Hook Integration

```typescript
import React from 'react';
import { useForm } from '@react-superadmin/core';

interface CustomFormProps {
  initialValues: any;
  onSubmit: (values: any) => void;
}

export const CustomForm: React.FC<CustomFormProps> = ({
  initialValues,
  onSubmit
}) => {
  const form = useForm({
    initialValues,
    onSubmit,
    validationSchema: customValidationSchema
  });

  return (
    <form onSubmit={form.handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

## Styling and Theming

### CSS Custom Properties

```css
:root {
  --custom-primary: #3b82f6;
  --custom-secondary: #6b7280;
  --custom-success: #10b981;
  --custom-warning: #f59e0b;
  --custom-danger: #ef4444;

  --custom-spacing-xs: 0.25rem;
  --custom-spacing-sm: 0.5rem;
  --custom-spacing-md: 1rem;
  --custom-spacing-lg: 1.5rem;
  --custom-spacing-xl: 2rem;
}

.custom-component {
  background-color: var(--custom-primary);
  padding: var(--custom-spacing-md);
  border-radius: 0.375rem;
}
```

### Tailwind CSS Integration

```typescript
import React from 'react';
import { cn } from '@react-superadmin/web/utils';

interface StyledComponentProps {
  className?: string;
  children: React.ReactNode;
}

export const StyledComponent: React.FC<StyledComponentProps> = ({
  className,
  children
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md p-6',
        'hover:shadow-lg transition-shadow duration-200',
        'border border-gray-200',
        className
      )}
    >
      {children}
    </div>
  );
};
```

## Testing Custom Components

### Component Testing

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomComponent } from './CustomComponent';

describe('CustomComponent', () => {
  it('renders with default props', () => {
    render(<CustomComponent>Test Content</CustomComponent>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <CustomComponent className="custom-class">
        Test Content
      </CustomComponent>
    );
    expect(screen.getByText('Test Content')).toHaveClass('custom-class');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(
      <CustomComponent onClick={handleClick}>
        Test Content
      </CustomComponent>
    );

    fireEvent.click(screen.getByText('Test Content'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Best Practices

1. **Follow Patterns**: Use established component patterns for consistency
2. **TypeScript**: Always use proper typing for props and state
3. **Accessibility**: Include proper ARIA labels and keyboard navigation
4. **Performance**: Use React.memo and useMemo where appropriate
5. **Testing**: Write comprehensive tests for all custom components
6. **Documentation**: Document props, usage examples, and edge cases
7. **Styling**: Use CSS custom properties and Tailwind utilities
8. **Integration**: Leverage core hooks and utilities when possible

## Examples

Check out the [Examples](../examples/basic-usage) section to see these patterns in action, or explore the [API Reference](./api) for detailed component documentation.

## Related Documentation

- [Features: Data Providers](../features/data-providers) - Learn how to integrate components with data providers
- [Hooks](./hooks.md) - Custom React hooks for component state management
- [API](./api.md) - API reference and examples
- [Testing](./testing.md) - Testing strategies for custom components
