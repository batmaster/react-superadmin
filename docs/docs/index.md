---
id: index
title: Welcome to React SuperAdmin
sidebar_label: Welcome
keywords:
  [react, admin, crud, typescript, framework, components, hooks, utilities]
---

# Welcome to React SuperAdmin

Build powerful admin interfaces with React and TypeScript.

## Quick Navigation

- [Introduction](./introduction) - Learn about React SuperAdmin
- [Installation](./installation) - Get started with setup
- [Quick Start](./quick-start) - Build your first admin panel
- [Examples](./examples/basic-usage) - See working examples
- [Components](./components/button) - Explore UI components
- [Cursor Rules](./developer/cursor-rules) - AI-powered development guidelines

## What is React SuperAdmin?

React SuperAdmin is a modern, TypeScript-first framework for building CRUD admin interfaces. It provides:

- 🚀 **Quick Setup** - Get started in minutes
- 🎨 **Beautiful UI** - Modern, responsive design
- 🔒 **Built-in Security** - Role-based access control
- 📱 **Mobile First** - Works on all devices
- 🔧 **Extensible** - Easy to customize and extend

## Get Started

```bash
# Install the core package
pnpm add @react-superadmin/core

# Install the web components
pnpm add @react-superadmin/web
```

## Example

```tsx
import {
  SuperAdminProvider,
  createAdmin,
  createResource,
} from '@react-superadmin/core';
import { AdminLayout } from '@react-superadmin/web';

const userResource = createResource({
  name: 'users',
  label: 'Users',
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
  ],
});

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

## Next Steps

- [Installation](./installation) - Complete setup guide
- [Quick Start](./quick-start) - Build your first admin panel
- [Architecture](./developer/architecture) - Understand the framework architecture
