import React from 'react';
import { 
  SuperAdminProvider, 
  createAdmin, 
  createResource 
} from '@react-superadmin/core';
import { AdminLayout } from '@react-superadmin/web';

// Define your resources
const userResource = createResource({
  name: 'users',
  label: 'Users',
  fields: [
    { name: 'id', label: 'ID', type: 'text' },
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { 
      name: 'role', 
      label: 'Role', 
      type: 'select',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
        { value: 'moderator', label: 'Moderator' }
      ]
    },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]},
    { name: 'createdAt', label: 'Created At', type: 'date' },
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
    { name: 'id', label: 'ID', type: 'text' },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'content', label: 'Content', type: 'textarea' },
    { name: 'author', label: 'Author', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' }
    ]},
    { name: 'publishedAt', label: 'Published At', type: 'date' },
  ],
});

// Create admin configuration
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
  },
  auth: {
    enabled: true,
  },
});

// Your main app component
function App() {
  return (
    <SuperAdminProvider config={adminConfig}>
      <AdminLayout>
        {/* Your admin content goes here */}
        <div className="p-6">
          <h1 className="text-2xl font-bold">Welcome to React SuperAdmin!</h1>
          <p className="text-gray-600 mt-2">
            This is a powerful admin framework built with React and TypeScript.
          </p>
        </div>
      </AdminLayout>
    </SuperAdminProvider>
  );
}

export default App;
