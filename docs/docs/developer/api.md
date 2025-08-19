---
id: api
title: API Reference
sidebar_label: API Reference
keywords: [api, reference, components, hooks, types, interfaces]
---

# API Reference

This page provides a comprehensive reference for all the APIs available in React SuperAdmin.

## Core Hooks

### useAuth

Authentication hook for managing user authentication state.

```typescript
import { useAuth } from '@react-superadmin/core';

const { user, login, logout, isAuthenticated } = useAuth();
```

**Returns:**
- `user`: Current user object or null
- `login(credentials)`: Function to log in a user
- `logout()`: Function to log out the current user
- `isAuthenticated`: Boolean indicating if user is authenticated

### useResource

Hook for managing resource data (CRUD operations).

```typescript
import { useResource } from '@react-superadmin/core';

const { data, loading, error, create, read, update, remove } = useResource('users');
```

**Parameters:**
- `resourceName`: String identifier for the resource

**Returns:**
- `data`: Array of resource items
- `loading`: Boolean indicating if request is in progress
- `error`: Error object if request failed
- `create(item)`: Function to create a new item
- `read(id)`: Function to read a specific item
- `update(id, item)`: Function to update an item
- `remove(id)`: Function to delete an item

### useTable

Hook for managing table state and operations.

```typescript
import { useTable } from '@react-superadmin/core';

const { 
  data, 
  pagination, 
  sorting, 
  filters, 
  search,
  setPage,
  setPageSize,
  setSorting,
  setFilters,
  setSearch
} = useTable('users');
```

**Returns:**
- `data`: Current page data
- `pagination`: Pagination state object
- `sorting`: Current sorting configuration
- `filters`: Applied filters
- `search`: Search query
- `setPage(page)`: Function to change page
- `setPageSize(size)`: Function to change page size
- `setSorting(sorting)`: Function to change sorting
- `setFilters(filters)`: Function to apply filters
- `setSearch(query)`: Function to set search query

### useForm

Hook for managing form state and validation.

```typescript
import { useForm } from '@react-superadmin/core';

const { 
  values, 
  errors, 
  touched, 
  handleChange, 
  handleSubmit, 
  setFieldValue,
  resetForm 
} = useForm({
  initialValues: { name: '', email: '' },
  validationSchema: userSchema,
  onSubmit: (values) => console.log(values)
});
```

**Parameters:**
- `config`: Form configuration object

**Returns:**
- `values`: Current form values
- `errors`: Validation errors
- `touched`: Fields that have been touched
- `handleChange`: Function to handle input changes
- `handleSubmit`: Function to handle form submission
- `setFieldValue`: Function to set a specific field value
- `resetForm`: Function to reset form to initial values

## UI Components

### Button

```typescript
import { Button } from '@react-superadmin/web';

<Button 
  variant="primary" 
  size="md" 
  disabled={false}
  onClick={() => console.log('clicked')}
>
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: Boolean to disable the button
- `loading`: Boolean to show loading state
- `onClick`: Click handler function

### FormField

```typescript
import { FormField } from '@react-superadmin/web';

<FormField
  name="email"
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  required
  error={errors.email}
/>
```

**Props:**
- `name`: Field name for form state
- `label`: Field label text
- `type`: Input type
- `placeholder`: Placeholder text
- `required`: Boolean to mark field as required
- `error`: Error message to display
- `disabled`: Boolean to disable the field

### DataTable

```typescript
import { DataTable } from '@react-superadmin/web';

<DataTable
  data={users}
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role' }
  ]}
  pagination={pagination}
  sorting={sorting}
  onSort={setSorting}
  onPageChange={setPage}
/>
```

**Props:**
- `data`: Array of data items
- `columns`: Column configuration array
- `pagination`: Pagination state object
- `sorting`: Current sorting state
- `onSort`: Function called when sorting changes
- `onPageChange`: Function called when page changes
- `loading`: Boolean to show loading state

### Modal

```typescript
import { Modal } from '@react-superadmin/web';

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Edit User"
  size="md"
>
  <p>Modal content goes here</p>
</Modal>
```

**Props:**
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function called when modal should close
- `title`: Modal title text
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `children`: Modal content

## Layout Components

### AdminLayout

```typescript
import { AdminLayout } from '@react-superadmin/web';

<AdminLayout
  sidebar={sidebarItems}
  header={headerContent}
  footer={footerContent}
>
  {children}
</AdminLayout>
```

**Props:**
- `sidebar`: Sidebar navigation items
- `header`: Header content
- `footer`: Footer content
- `children`: Main content area

### Sidebar

```typescript
import { Sidebar } from '@react-superadmin/web';

<Sidebar
  items={[
    { label: 'Dashboard', to: '/', icon: 'dashboard' },
    { label: 'Users', to: '/users', icon: 'users' },
    { label: 'Settings', to: '/settings', icon: 'settings' }
  ]}
  collapsed={false}
  onToggle={() => setCollapsed(!collapsed)}
/>
```

**Props:**
- `items`: Array of navigation items
- `collapsed`: Boolean to control sidebar state
- `onToggle`: Function to toggle sidebar

## Types and Interfaces

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Pagination

```typescript
interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
```

### Sorting

```typescript
interface Sorting {
  field: string;
  direction: 'asc' | 'desc';
}
```

### Filter

```typescript
interface Filter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'contains' | 'in';
  value: any;
}
```

## Utility Functions

### Validation

```typescript
import { validateEmail, validateRequired } from '@react-superadmin/core';

const isValidEmail = validateEmail('user@example.com');
const isValidRequired = validateRequired('some value');
```

### Formatting

```typescript
import { formatDate, formatCurrency } from '@react-superadmin/core';

const formattedDate = formatDate(new Date(), 'MMM dd, yyyy');
const formattedCurrency = formatCurrency(1234.56, 'USD');
```

### API Helpers

```typescript
import { apiClient } from '@react-superadmin/core';

const response = await apiClient.get('/users');
const newUser = await apiClient.post('/users', userData);
const updatedUser = await apiClient.put('/users/123', userData);
const deleted = await apiClient.delete('/users/123');
```

## Error Handling

### API Errors

```typescript
import { ApiError } from '@react-superadmin/core';

try {
  await apiClient.get('/users');
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message, error.status);
  }
}
```

### Validation Errors

```typescript
import { ValidationError } from '@react-superadmin/core';

try {
  validateUserData(userData);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation errors:', error.errors);
  }
}
```

## Configuration

### Theme Configuration

```typescript
import { ThemeProvider } from '@react-superadmin/web';

<ThemeProvider
  theme={{
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      success: '#10b981',
      danger: '#ef4444'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    }
  }}
>
  {children}
</ThemeProvider>
```

### API Configuration

```typescript
import { configureApi } from '@react-superadmin/core';

configureApi({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Best Practices

1. **Use TypeScript** - Leverage type safety for better development experience
2. **Handle Errors** - Always implement proper error handling
3. **Validate Data** - Use validation schemas for form inputs
4. **Optimize Performance** - Use React.memo and useMemo where appropriate
5. **Test Components** - Write comprehensive tests for your components
6. **Follow Patterns** - Use the established patterns for consistency
