import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SuperAdminProvider, createAdmin, createResource } from '@react-superadmin/core';
import { AdminLayout } from './components/layout/AdminLayout';
import { ResourceList } from './components/crud/ResourceList';
import { ResourceForm } from './components/crud/ResourceForm';
import { ResourceShow } from './components/crud/ResourceShow';
import { Dashboard } from './components/Dashboard';

// Define resources using the framework utilities
const userResource = createResource({
  name: 'users',
  label: 'Users',
  fields: [
    { name: 'id', label: 'ID', type: 'text' as const },
    { name: 'name', label: 'Name', type: 'text' as const },
    { name: 'email', label: 'Email', type: 'email' as const },
    { name: 'role', label: 'Role', type: 'select' as const, options: [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' },
      { value: 'moderator', label: 'Moderator' }
    ]},
    { name: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'suspended', label: 'Suspended' }
    ]},
    { name: 'createdAt', label: 'Created At', type: 'date' as const },
  ],
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
    list: true,
  },
});

const postResource = createResource({
  name: 'posts',
  label: 'Posts',
  fields: [
    { name: 'id', label: 'ID', type: 'text' as const },
    { name: 'title', label: 'Title', type: 'text' as const },
    { name: 'content', label: 'Content', type: 'textarea' as const },
    { name: 'author', label: 'Author', type: 'text' as const },
    { name: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' }
    ]},
    { name: 'publishedAt', label: 'Published At', type: 'date' as const },
  ],
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
    list: true,
  },
});

const productResource = createResource({
  name: 'products',
  label: 'Products',
  fields: [
    { name: 'id', label: 'ID', type: 'text' as const },
    { name: 'name', label: 'Name', type: 'text' as const },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'price', label: 'Price', type: 'number' as const },
    { name: 'category', label: 'Category', type: 'select' as const, options: [
      { value: 'Electronics', label: 'Electronics' },
      { value: 'Clothing', label: 'Clothing' },
      { value: 'Wearables', label: 'Wearables' },
      { value: 'Home & Garden', label: 'Home & Garden' }
    ]},
    { name: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'in_stock', label: 'In Stock' },
      { value: 'low_stock', label: 'Low Stock' },
      { value: 'out_of_stock', label: 'Out of Stock' }
    ]},
    { name: 'stock', label: 'Stock', type: 'number' as const },
    { name: 'brand', label: 'Brand', type: 'text' as const },
    { name: 'sku', label: 'SKU', type: 'text' as const },
    { name: 'rating', label: 'Rating', type: 'number' as const },
    { name: 'reviews', label: 'Reviews', type: 'number' as const },
  ],
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
    list: true,
  },
});

// Create admin configuration
const adminConfig = createAdmin({
  title: 'React SuperAdmin Demo',
  resources: [userResource, postResource, productResource],
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#6b7280',
    darkMode: false,
  },
  layout: {
    sidebar: true,
    header: true,
    footer: true,
    sidebarWidth: 250,
  },
  auth: {
    enabled: false,
  },
});

function App() {
  return (
    <SuperAdminProvider config={adminConfig}>
      <Router>
        <AdminLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            
            {/* Users routes */}
            <Route path="/users" element={<ResourceList resourceName="users" />} />
            <Route path="/users/create" element={<ResourceForm />} />
            <Route path="/users/:id" element={<ResourceShow />} />
            <Route path="/users/:id/edit" element={<ResourceForm />} />
            
            {/* Posts routes */}
            <Route path="/posts" element={<ResourceList resourceName="posts" />} />
            <Route path="/posts/create" element={<ResourceForm />} />
            <Route path="/posts/:id" element={<ResourceShow />} />
            <Route path="/posts/:id/edit" element={<ResourceForm />} />
            
            {/* Products routes */}
            <Route path="/products" element={<ResourceList resourceName="products" />} />
            <Route path="/products/create" element={<ResourceForm />} />
            <Route path="/products/:id" element={<ResourceShow />} />
            <Route path="/products/:id/edit" element={<ResourceForm />} />
          </Routes>
        </AdminLayout>
      </Router>
    </SuperAdminProvider>
  );
}

export default App;
