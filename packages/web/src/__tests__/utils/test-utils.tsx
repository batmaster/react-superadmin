import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
  SuperAdminProvider,
  createAdmin,
  createResource,
} from '@react-superadmin/core';

// Create a test admin configuration
const createTestAdminConfig = () => {
  const testUserResource = createResource({
    name: 'users',
    label: 'Users',
    fields: [
      { name: 'id', label: 'ID', type: 'text' as const },
      { name: 'name', label: 'Name', type: 'text' as const },
      { name: 'email', label: 'Email', type: 'email' as const },
    ],
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      list: true,
    },
  });

  const testPostResource = createResource({
    name: 'posts',
    label: 'Posts',
    fields: [
      { name: 'id', label: 'ID', type: 'text' as const },
      { name: 'title', label: 'Title', type: 'text' as const },
      { name: 'content', label: 'Content', type: 'textarea' as const },
    ],
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      list: true,
    },
  });

  return createAdmin({
    title: 'Test Admin',
    resources: [testUserResource, testPostResource],
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
};

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  adminConfig?: ReturnType<typeof createTestAdminConfig>;
}

const customRender = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  const {
    route = '/',
    adminConfig = createTestAdminConfig(),
    ...renderOptions
  } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <SuperAdminProvider config={adminConfig}>
      <BrowserRouter>{children}</BrowserRouter>
    </SuperAdminProvider>
  );

  // Set up routing if a specific route is provided
  if (route !== '/') {
    window.history.pushState({}, 'Test page', route);
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Export test utilities
export { createTestAdminConfig };
