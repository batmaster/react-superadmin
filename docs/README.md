# React SuperAdmin Documentation

React SuperAdmin is a powerful, modern React framework for building CRUD admin interfaces with TypeScript support.

## Table of Contents

- [React SuperAdmin Documentation](#react-superadmin-documentation)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Core Concepts](#core-concepts)
    - [Resources](#resources)
    - [Fields](#fields)
    - [Views](#views)
    - [Permissions](#permissions)
  - [Configuration](#configuration)
    - [Admin Configuration](#admin-configuration)
    - [Resource Configuration](#resource-configuration)
    - [Field Configuration](#field-configuration)
  - [Components](#components)
    - [Layout Components](#layout-components)

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
  createResource,
} from '@react-superadmin/core';
import { AdminLayout } from '@react-superadmin/web';

// Define a resource
const userResource = createResource({
  name: 'users',
  label: 'Users',
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
      ],
    },
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
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
      ],
    },
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
    {
      type: 'pattern',
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format',
    },
  ],
};
```

## Components

### Layout Components

- `AdminLayout` - Main layout wrapper
- `Sidebar` - Navigation sidebar
- `Header` - Top header bar
- `

````

## Testing Guide

Comprehensive testing is essential for maintaining code quality and reliability. Our testing strategy covers all aspects of the framework:

### Testing Stack

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for Node.js
- **ts-jest** - TypeScript support

### What We Test

- ✅ **Utilities** - Resource creation, validation, formatting
- ✅ **Hooks** - State management, side effects, error handling
- ✅ **Components** - Rendering, user interactions, props
- ✅ **Contexts** - Provider behavior, state updates
- ✅ **Services** - CRUD operations, data persistence

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm test:core
pnpm test:web

# Generate coverage reports
pnpm test:coverage

# Watch mode for development
pnpm test:watch
````

For detailed testing guidelines, patterns, and examples, see our [Testing Guide](./testing.md).

**Quick Start**: See our [Testing Setup Guide](./testing-setup.md) for immediate testing setup.
