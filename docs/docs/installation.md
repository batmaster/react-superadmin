---
id: installation
title: Installation & Setup
sidebar_label: Installation
description:
  Learn how to install and set up React SuperAdmin CRUD admin framework in your project
---

# Installation & Setup

React SuperAdmin is a **CRUD admin framework** that helps you build complete admin webapps quickly. It provides pre-built admin interfaces, data management, and CRUD operations - not just UI components.

## 🎯 **What You Get**

- **Complete Admin Interface**: Pre-built layouts, navigation, and dashboards
- **CRUD Operations**: Create, Read, Update, Delete for any data model
- **Data Providers**: Connect to APIs, databases, or use mock data
- **Resource Management**: Define Users, Products, Orders, etc. with automatic CRUD
- **Admin Components**: Tables, forms, filters, pagination - all pre-built

## 📦 **Installation**

### **1. Install the Framework**

```bash
# Core framework (required)
pnpm add @react-superadmin/core

# Web admin interface (required)
pnpm add @react-superadmin/web

# Using npm
npm install @react-superadmin/core @react-superadmin/web

# Using yarn
yarn add @react-superadmin/core @react-superadmin/web
```

### **2. Install Tailwind CSS (Required)**

The admin interface uses Tailwind CSS for styling:

```bash
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### **3. Configure Tailwind CSS**

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@react-superadmin/web/**/*.{js,jsx,ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
}
```

### **4. Import Tailwind CSS**

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 🚀 **Quick Start - Build Your First Admin**

### **1. Define Your Resources**

```tsx
// src/resources/users.ts
import { createResource } from '@react-superadmin/core';

export const usersResource = createResource({
  name: 'users',
  label: 'Users',
  fields: [
    { name: 'id', type: 'id', label: 'ID' },
    { name: 'name', type: 'string', label: 'Name', required: true },
    { name: 'email', type: 'email', label: 'Email', required: true },
    { name: 'role', type: 'select', label: 'Role', options: ['admin', 'user'] },
    { name: 'createdAt', type: 'datetime', label: 'Created At' },
  ],
});
```

### **2. Create Your Admin App**

```tsx
// src/App.tsx
import React from 'react';
import { SuperAdminProvider, createAdmin } from '@react-superadmin/core';
import { AdminLayout } from '@react-superadmin/web';
import { usersResource } from './resources/users';

const adminConfig = createAdmin({
  title: 'My Admin Panel',
  resources: [usersResource],
});

function App() {
  return (
    <SuperAdminProvider config={adminConfig}>
      <AdminLayout />
    </SuperAdminProvider>
  );
}

export default App;
```

### **3. That's It! You Now Have:**

✅ **Complete User Management Interface**  
✅ **List View** with search, filters, pagination  
✅ **Create/Edit Forms** with validation  
✅ **Delete Operations** with confirmation  
✅ **Responsive Admin Layout**  
✅ **Navigation and Breadcrumbs**  

## 🔧 **Data Provider Setup**

### **Mock Data (Development)**

```tsx
import { mockDataProvider } from '@react-superadmin/core';

const adminConfig = createAdmin({
  title: 'My Admin Panel',
  resources: [usersResource],
  dataProvider: mockDataProvider, // Uses mock data
});
```

### **API Data (Production)**

```tsx
import { apiDataProvider } from '@react-superadmin/core';

const adminConfig = createAdmin({
  title: 'My Admin Panel',
  resources: [usersResource],
  dataProvider: apiDataProvider({
    apiUrl: 'https://api.myapp.com',
    headers: { Authorization: 'Bearer token' },
  }),
});
```

### **Custom Data Provider**

```tsx
import { DataProvider } from '@react-superadmin/core';

const customDataProvider: DataProvider = {
  getList: async (resource, params) => {
    // Your custom logic
    const response = await fetch(`/api/${resource}`);
    return { data: response.data, total: response.total };
  },
  // ... other methods
};
```

## 📊 **Adding More Resources**

```tsx
// src/resources/products.ts
export const productsResource = createResource({
  name: 'products',
  label: 'Products',
  fields: [
    { name: 'id', type: 'id' },
    { name: 'name', type: 'string', required: true },
    { name: 'price', type: 'number', required: true },
    { name: 'category', type: 'select', options: ['electronics', 'clothing'] },
    { name: 'inStock', type: 'boolean' },
  ],
});

// Add to admin config
const adminConfig = createAdmin({
  title: 'My Admin Panel',
  resources: [usersResource, productsResource], // Multiple resources
});
```

## 🎨 **Customizing the Admin Interface**

### **Custom Layout**

```tsx
import { AdminLayout } from '@react-superadmin/web';

function CustomAdminLayout() {
  return (
    <AdminLayout
      sidebar={<CustomSidebar />}
      header={<CustomHeader />}
      footer={<CustomFooter />}
    />
  );
}
```

### **Custom Fields**

```tsx
import { CustomField } from '@react-superadmin/web';

export const usersResource = createResource({
  name: 'users',
  fields: [
    // ... standard fields
    { 
      name: 'avatar', 
      type: 'custom',
      component: CustomAvatarField,
    },
  ],
});
```

## 🚨 **Common Issues**

### **Admin Not Rendering**

**Problem**: Admin interface shows blank page.

**Solution**: Ensure you have both packages installed:
```bash
pnpm add @react-superadmin/core @react-superadmin/web
```

### **Resources Not Showing**

**Problem**: Resources don't appear in navigation.

**Solution**: Check resource configuration and ensure they're added to admin config.

### **Styling Issues**

**Problem**: Admin looks unstyled.

**Solution**: Verify Tailwind CSS is properly configured and imported.

## 📚 **Next Steps**

1. **Build Your First Resource**: Start with a simple resource like Users
2. **Connect Real Data**: Set up API data provider
3. **Customize Fields**: Add custom field types for your needs
4. **Extend Admin**: Add custom layouts, components, and logic

## 🎯 **Remember**

This is **NOT** a UI component library. It's a **complete admin framework** that gives you:
- **Ready-to-use admin interfaces**
- **Automatic CRUD operations**
- **Data management tools**
- **Admin layouts and navigation**

Focus on building your **business logic and data models** - the admin interface is already built for you!

---

**Goal**: Get from 0 to a working admin panel in minutes, not hours.
