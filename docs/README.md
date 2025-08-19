# React SuperAdmin Documentation

React SuperAdmin is a powerful, modern React framework for building CRUD admin interfaces with TypeScript support.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Configuration](#configuration)
- [Components](#components)
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Examples](#examples)
- [API Reference](#api-reference)

## Installation

```bash
# Install the core package
pnpm add @react-superadmin/core

# Install the web components
pnpm add @react-superadmin/web
```

## Quick Start

```tsx
import React from 'react';
import { 
  SuperAdminProvider, 
  createAdmin, 
  createResource 
} from '@react-superadmin/core';
import { AdminLayout } from '@react-superadmin/web';

// Define a resource
const userResource = createResource({
  name: 'users',
  label: 'Users',
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'role', label: 'Role', type: 'select', options: [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' }
    ]},
  ],
});

// Create admin configuration
const adminConfig = createAdmin({
  title: 'My Admin Panel',
  resources: [userResource],
});

function App() {
  return (
    <SuperAdminProvider config={adminConfig}>
      <AdminLayout>
        <div className="p-6">
          <h1>Welcome to React SuperAdmin!</h1>
        </div>
      </AdminLayout>
    </SuperAdminProvider>
  );
}
```

## Core Concepts

### Resources
Resources represent the entities you want to manage in your admin panel (e.g., users, posts, products).

### Fields
Fields define the structure and behavior of your resource data (e.g., text, email, select, date).

### Views
Views determine how your resources are displayed (list, form, show, custom).

### Permissions
Permissions control what operations users can perform on resources.

## Configuration

### Admin Configuration

```tsx
const adminConfig = createAdmin({
  title: 'My Admin Panel',
  resources: [userResource, postResource],
  theme: {
    primaryColor: '#3b82f6',
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
    loginUrl: '/login',
    logoutUrl: '/logout',
  },
});
```

### Resource Configuration

```tsx
const resource = createResource({
  name: 'users',
  label: 'Users',
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'role', label: 'Role', type: 'select', options: [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' }
    ]},
  ],
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
    list: true,
  },
  views: [
    { name: 'list', label: 'List', type: 'list', layout: 'table' },
    { name: 'form', label: 'Form', type: 'form' },
    { name: 'show', label: 'Show', type: 'show' },
  ],
});
```

### Field Configuration

```tsx
const field = {
  name: 'email',
  label: 'Email Address',
  type: 'email',
  required: true,
  placeholder: 'Enter email address',
  helpText: 'We will never share your email with anyone else.',
  validation: [
    { type: 'required', message: 'Email is required' },
    { type: 'pattern', value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
  ],
};
```

## Components

### Layout Components

- `AdminLayout` - Main layout wrapper
- `Sidebar` - Navigation sidebar
- `Header` - Top header bar
- `Footer` - Bottom footer

### CRUD Components

- `ResourceList` - Display resource data in a list/table
- `ResourceForm` - Create/edit resource forms
- `ResourceShow` - Display single resource details
- `DataTable` - Data table with sorting, pagination
- `SearchBar` - Search functionality
- `Pagination` - Page navigation

### Form Components

- `FormField` - Generic form field wrapper
- `TextInput` - Text input field
- `SelectInput` - Dropdown select field
- `TextareaInput` - Multi-line text input
- `CheckboxInput` - Checkbox field
- `DateInput` - Date picker field

### UI Components

- `Button` - Various button styles and sizes
- `Card` - Content container with shadow
- `Badge` - Status and label badges
- `Modal` - Overlay dialog
- `Dropdown` - Dropdown menu
- `Alert` - Status messages

## Hooks

### Core Hooks

- `useSuperAdmin` - Access admin context
- `useResource` - Manage resource operations
- `useForm` - Form state management
- `useTable` - Table data management

### Utility Hooks

- `usePagination` - Pagination logic
- `useSearch` - Search functionality
- `useSorting` - Data sorting
- `useFilters` - Data filtering
- `useTheme` - Theme management
- `useAuth` - Authentication state

## Utilities

### Resource Creation

```tsx
import { createResource, createAdmin } from '@react-superadmin/core';

const userResource = createResource({
  name: 'users',
  label: 'Users',
  fields: [...],
});

const adminConfig = createAdmin({
  title: 'My Admin',
  resources: [userResource],
});
```

### Validation

```tsx
import { validateForm, validateField } from '@react-superadmin/core';

const errors = validateForm(data, fields);
const fieldError = validateField(value, field);
```

### Formatting

```tsx
import { formatDate, formatCurrency, formatNumber } from '@react-superadmin/core';

const formattedDate = formatDate('2024-01-01');
const formattedPrice = formatCurrency(99.99);
const formattedNumber = formatNumber(1234.56);
```

## Examples

### Basic CRUD Operations

```tsx
import { useResource } from '@react-superadmin/core';

function UserList() {
  const {
    data,
    loading,
    error,
    create,
    read,
    update,
    delete: deleteUser,
    list,
  } = useResource({ resourceName: 'users' });

  useEffect(() => {
    list();
  }, [list]);

  const handleCreate = async (userData) => {
    await create(userData);
  };

  const handleUpdate = async (id, userData) => {
    await update(id, userData);
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(user => (
        <div key={user.id}>
          {user.name} - {user.email}
          <button onClick={() => handleUpdate(user.id, { ...user, status: 'active' })}>
            Activate
          </button>
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### Custom Form

```tsx
import { useForm } from '@react-superadmin/core';
import { FormField } from '@react-superadmin/web';

function UserForm({ initialData, onSubmit }) {
  const {
    data,
    errors,
    loading,
    setFieldValue,
    handleSubmit,
  } = useForm({
    initialData,
    fields: userFields,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit}>
      {userFields.map(field => (
        <FormField
          key={field.name}
          field={field}
          value={data[field.name]}
          onChange={(value) => setFieldValue(field.name, value)}
          error={errors[field.name]}
        />
      ))}
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save User'}
      </button>
    </form>
  );
}
```

## API Reference

### Types

- `Resource<T>` - Base resource interface
- `FieldConfig` - Field configuration
- `ResourceConfig` - Resource configuration
- `AdminConfig` - Admin configuration
- `CrudOperations<T>` - CRUD operation interfaces

### Interfaces

- `SuperAdminContextValue` - Context value interface
- `UseResourceReturn<T>` - Resource hook return type
- `UseFormReturn<T>` - Form hook return type
- `TableProps<T>` - Table component props

## Advanced Usage

### Custom Views

```tsx
const customView = {
  name: 'analytics',
  label: 'Analytics',
  type: 'custom',
  component: AnalyticsView,
};
```

### Custom Field Types

```tsx
const customField = {
  name: 'avatar',
  label: 'Avatar',
  type: 'custom',
  component: AvatarField,
  props: {
    uploadUrl: '/api/upload',
    maxSize: 5 * 1024 * 1024, // 5MB
  },
};
```

### Authentication Integration

```tsx
const authConfig = {
  enabled: true,
  loginUrl: '/login',
  logoutUrl: '/logout',
  userInfoUrl: '/api/user',
  onLogin: (user) => {
    // Custom login logic
  },
  onLogout: () => {
    // Custom logout logic
  },
};
```

## Best Practices

1. **Type Safety**: Always use TypeScript for better development experience
2. **Resource Design**: Design resources with clear, logical field structures
3. **Validation**: Implement proper validation rules for all fields
4. **Permissions**: Use granular permissions for better security
5. **Performance**: Implement pagination and search for large datasets
6. **Accessibility**: Ensure all components meet WCAG guidelines
7. **Testing**: Write comprehensive tests for custom components

## Troubleshooting

### Common Issues

1. **Context Error**: Ensure `SuperAdminProvider` wraps your app
2. **Type Errors**: Check that all required props are provided
3. **Styling Issues**: Verify Tailwind CSS is properly configured
4. **Build Errors**: Ensure all dependencies are installed

### Getting Help

- Check the [GitHub Issues](https://gitlab.com/batmaster/react-superadmin/issues)
- Review the [examples](./examples) directory
- Open a new issue with detailed information

## Contributing

We welcome contributions! Please see our [Contributing Guide](../CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](../LICENSE) file for details.
