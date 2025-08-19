import React from 'react';
import { render, screen, act } from '@testing-library/react';
import {
  SuperAdminProvider,
  useSuperAdmin,
} from '../../contexts/SuperAdminContext';
import { createAdmin, createResource } from '../../utils';

// Test component that uses the hook
const TestComponent = () => {
  const context = useSuperAdmin();
  return (
    <div>
      <div data-testid="title">{context.config.title}</div>
      <div data-testid="resources-count">
        {Object.keys(context.resources).length}
      </div>
      <div data-testid="theme-primary">{context.theme.primaryColor}</div>
      <div data-testid="layout-sidebar">
        {context.layout.sidebar ? 'true' : 'false'}
      </div>
      <div data-testid="auth-enabled">
        {context.auth.enabled ? 'true' : 'false'}
      </div>
      <div data-testid="user">
        {context.user ? 'logged-in' : 'not-logged-in'}
      </div>
    </div>
  );
};

// Test component that triggers logout
const LogoutTestComponent = () => {
  const { logout, user } = useSuperAdmin();

  return (
    <div>
      <div data-testid="user-status">
        {user ? 'logged-in' : 'not-logged-in'}
      </div>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
};

describe('SuperAdminContext', () => {
  const createTestConfig = () => {
    const userResource = createResource({
      name: 'users',
      label: 'Users',
      fields: [{ name: 'name', label: 'Name', type: 'text' as const }],
    });

    return createAdmin({
      title: 'Test Admin',
      resources: [userResource],
      theme: {
        primaryColor: '#ef4444',
        darkMode: true,
      },
      layout: {
        sidebar: false,
        sidebarWidth: 300,
      },
      auth: {
        enabled: true,
      },
    });
  };

  it('should provide context values to children', () => {
    const config = createTestConfig();

    render(
      <SuperAdminProvider config={config}>
        <TestComponent />
      </SuperAdminProvider>
    );

    expect(screen.getByTestId('title')).toHaveTextContent('Test Admin');
    expect(screen.getByTestId('resources-count')).toHaveTextContent('1');
    expect(screen.getByTestId('theme-primary')).toHaveTextContent('#ef4444');
    expect(screen.getByTestId('layout-sidebar')).toHaveTextContent('false');
    expect(screen.getByTestId('auth-enabled')).toHaveTextContent('true');
  });

  it('should convert resources array to object', () => {
    const config = createTestConfig();

    render(
      <SuperAdminProvider config={config}>
        <TestComponent />
      </SuperAdminProvider>
    );

    expect(screen.getByTestId('resources-count')).toHaveTextContent('1');
  });

  it('should merge default and custom theme values', () => {
    const config = createTestConfig();

    render(
      <SuperAdminProvider config={config}>
        <TestComponent />
      </SuperAdminProvider>
    );

    // Custom values should override defaults
    expect(screen.getByTestId('theme-primary')).toHaveTextContent('#ef4444');
    expect(screen.getByTestId('layout-sidebar')).toHaveTextContent('false');
  });

  it('should handle user state changes', () => {
    const config = createTestConfig();

    render(
      <SuperAdminProvider config={config}>
        <LogoutTestComponent />
      </SuperAdminProvider>
    );

    expect(screen.getByTestId('user-status')).toHaveTextContent(
      'not-logged-in'
    );
  });

  it('should handle logout functionality', () => {
    const config = createTestConfig();

    render(
      <SuperAdminProvider config={config}>
        <LogoutTestComponent />
      </SuperAdminProvider>
    );

    const logoutBtn = screen.getByTestId('logout-btn');
    act(() => {
      logoutBtn.click();
    });

    expect(screen.getByTestId('user-status')).toHaveTextContent(
      'not-logged-in'
    );
  });

  it('should throw error when useSuperAdmin is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useSuperAdmin must be used within a SuperAdminProvider');

    consoleSpy.mockRestore();
  });

  it('should handle empty resources array', () => {
    const config = createAdmin({
      title: 'Empty Admin',
      resources: [],
    });

    render(
      <SuperAdminProvider config={config}>
        <TestComponent />
      </SuperAdminProvider>
    );

    expect(screen.getByTestId('resources-count')).toHaveTextContent('0');
  });

  it('should preserve all config properties', () => {
    const config = createTestConfig();

    render(
      <SuperAdminProvider config={config}>
        <TestComponent />
      </SuperAdminProvider>
    );

    expect(screen.getByTestId('title')).toHaveTextContent('Test Admin');
    expect(screen.getByTestId('auth-enabled')).toHaveTextContent('true');
  });
});
