---
id: quick-start
title: Quick Start
sidebar_label: Quick Start
---

# Quick Start

Build your first admin panel with React SuperAdmin in under 10 minutes.

## Overview

In this guide, you'll create a simple user management system with:
- A list view showing all users
- A form to create and edit users
- Basic CRUD operations
- Responsive design

## Step 1: Basic Setup

Start with a simple admin configuration:

```tsx
import React from 'react';
import { 
  SuperAdminProvider, 
  createAdmin, 
  createResource 
} from '@react-superadmin/core';
import { AdminLayout } from '@react-superadmin/web';

// Define a user resource
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

export default App;
```

## Step 2: Add CRUD Views

Now let's add the actual CRUD functionality:

```tsx
import { ResourceList, ResourceForm, ResourceShow } from '@react-superadmin/web';

// Update your resource configuration
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
  views: [
    { name: 'list', label: 'List', type: 'list' },
    { name: 'create', label: 'Create', type: 'create' },
    { name: 'edit', label: 'Edit', type: 'edit' },
    { name: 'show', label: 'Show', type: 'show' },
  ],
});
```

## Step 3: Add Data Service

Connect to your backend or use mock data:

```tsx
import { mockService } from '@react-superadmin/web';

// In your admin config
const adminConfig = createAdmin({
  title: 'My Admin Panel',
  resources: [userResource],
  dataProvider: mockService, // Use mock data for now
});
```

## Step 4: Run Your App

Start your development server:

```bash
pnpm dev
```

You should now see a fully functional admin panel with:
- Sidebar navigation
- User management interface
- Create, read, update, delete operations
- Responsive design

## What's Next?

- [Core Concepts](./core-concepts/resources) - Learn about resources, fields, and views
- [Configuration](./configuration/admin-config) - Customize your admin panel
- [Examples](./examples/basic-usage) - See more complex examples
- [API Reference](./api/types) - Detailed API documentation
