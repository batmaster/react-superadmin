---
id: basic-usage
title: Basic Usage Example
sidebar_label: Basic Usage
---

# Basic Usage Example

A complete example showing how to build a user management system with React SuperAdmin.

## Complete Example

Here's a full working example that you can copy and paste:

```tsx
import React from 'react';
import { 
  SuperAdminProvider, 
  createAdmin, 
  createResource 
} from '@react-superadmin/core';
import { 
  AdminLayout, 
  ResourceList, 
  ResourceForm, 
  ResourceShow 
} from '@react-superadmin/web';

// Define user fields
const userFields = [
  { 
    name: 'name', 
    label: 'Full Name', 
    type: 'text', 
    required: true,
    placeholder: 'Enter full name'
  },
  { 
    name: 'email', 
    label: 'Email Address', 
    type: 'email', 
    required: true,
    placeholder: 'Enter email address'
  },
  { 
    name: 'role', 
    label: 'User Role', 
    type: 'select', 
    required: true,
    options: [
      { value: 'admin', label: 'Administrator' },
      { value: 'manager', label: 'Manager' },
      { value: 'user', label: 'Regular User' }
    ]
  },
  { 
    name: 'status', 
    label: 'Account Status', 
    type: 'select', 
    required: true,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'suspended', label: 'Suspended' }
    ]
  },
  { 
    name: 'createdAt', 
    label: 'Created Date', 
    type: 'date', 
    readOnly: true
  }
];

// Create user resource
const userResource = createResource({
  name: 'users',
  label: 'Users',
  fields: userFields,
  views: [
    { name: 'list', label: 'All Users', type: 'list' },
    { name: 'create', label: 'Add User', type: 'create' },
    { name: 'edit', label: 'Edit User', type: 'edit' },
    { name: 'show', label: 'User Details', type: 'show' },
  ],
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
    list: true,
  }
});

// Create admin configuration
const adminConfig = createAdmin({
  title: 'User Management System',
  resources: [userResource],
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
    enabled: false, // Disable auth for this example
  },
});

// Main App component
function App() {
  return (
    <SuperAdminProvider config={adminConfig}>
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            User Management System
          </h1>
          <p className="text-gray-600 mb-8">
            This example demonstrates a complete user management system built with React SuperAdmin.
            You can create, view, edit, and delete users with a beautiful, responsive interface.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                User List
              </h2>
              <ResourceList resourceName="users" />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Add New User
              </h2>
              <ResourceForm resourceName="users" />
            </div>
          </div>
        </div>
      </AdminLayout>
    </SuperAdminProvider>
  );
}

export default App;
```

## Key Features Demonstrated

### 1. Resource Definition
- **Fields**: Text, email, select, and date field types
- **Validation**: Required fields and placeholders
- **Options**: Dropdown selections for role and status

### 2. Views Configuration
- **List View**: Display all users in a table
- **Create View**: Form to add new users
- **Edit View**: Form to modify existing users
- **Show View**: Display user details

### 3. Layout & Theme
- **Responsive Design**: Works on all screen sizes
- **Custom Styling**: Tailwind CSS classes
- **Professional Look**: Clean, modern interface

### 4. Permissions
- **Full Access**: Create, read, update, delete operations
- **Flexible**: Easy to restrict specific operations

## Running the Example

1. **Install dependencies**:
   ```bash
   pnpm add @react-superadmin/core @react-superadmin/web
   ```

2. **Copy the code** above into your `App.tsx`

3. **Start development server**:
   ```bash
   pnpm dev
   ```

4. **Open your browser** and see the working admin panel!

## Customization Ideas

### Add More Fields
```tsx
const userFields = [
  // ... existing fields
  { 
    name: 'avatar', 
    label: 'Profile Picture', 
    type: 'image',
    accept: 'image/*'
  },
  { 
    name: 'bio', 
    label: 'Biography', 
    type: 'textarea',
    rows: 4
  },
  { 
    name: 'skills', 
    label: 'Skills', 
    type: 'tags',
    placeholder: 'Add skills...'
  }
];
```

### Custom Validation
```tsx
const userFields = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    validation: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
      { type: 'custom', validator: (value) => !value.includes('spam'), message: 'Spam emails not allowed' }
    ]
  }
];
```

### Custom Actions
```tsx
const userResource = createResource({
  // ... existing config
  actions: [
    {
      name: 'activate',
      label: 'Activate User',
      icon: 'check-circle',
      action: (userId) => {
        // Custom activation logic
        console.log('Activating user:', userId);
      }
    },
    {
      name: 'export',
      label: 'Export to CSV',
      icon: 'download',
      action: (data) => {
        // Export functionality
        console.log('Exporting data:', data);
      }
    }
  ]
});
```

## Next Steps

- [Architecture](../developer/architecture) - Learn about the framework architecture
- [Setup](../developer/setup) - Customize your development environment
- [Components](../components/button) - Explore available UI components
- [API Reference](../developer/api) - Detailed API documentation
