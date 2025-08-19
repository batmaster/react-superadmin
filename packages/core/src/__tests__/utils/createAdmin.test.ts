import { createAdmin } from '../../utils/createAdmin';
import { createResource } from '../../utils/createResource';
import { AdminConfig } from '../../types';

describe('createAdmin', () => {
  it('should create admin config with default values', () => {
    const userResource = createResource({
      name: 'users',
      label: 'Users',
      fields: [{ name: 'name', label: 'Name', type: 'text' as const }],
    });

    const adminConfig = createAdmin({
      title: 'Test Admin',
      resources: [userResource],
    });

    expect(adminConfig).toEqual({
      title: 'Test Admin',
      resources: [userResource],
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
  });

  it('should override default theme when provided', () => {
    const userResource = createResource({
      name: 'users',
      label: 'Users',
      fields: [],
    });

    const adminConfig = createAdmin({
      title: 'Custom Admin',
      resources: [userResource],
      theme: {
        primaryColor: '#ef4444',
        darkMode: true,
      },
    });

    expect(adminConfig.theme).toEqual({
      primaryColor: '#ef4444',
      secondaryColor: '#6b7280',
      darkMode: true,
    });
  });

  it('should override default layout when provided', () => {
    const userResource = createResource({
      name: 'users',
      label: 'Users',
      fields: [],
    });

    const adminConfig = createAdmin({
      title: 'Custom Admin',
      resources: [userResource],
      layout: {
        sidebar: false,
        sidebarWidth: 300,
      },
    });

    expect(adminConfig.layout).toEqual({
      sidebar: false,
      header: true,
      footer: true,
      sidebarWidth: 300,
    });
  });

  it('should override default auth when provided', () => {
    const userResource = createResource({
      name: 'users',
      label: 'Users',
      fields: [],
    });

    const adminConfig = createAdmin({
      title: 'Secure Admin',
      resources: [userResource],
      auth: {
        enabled: true,
      },
    });

    expect(adminConfig.auth).toEqual({
      enabled: true,
    });
  });

  it('should handle multiple resources', () => {
    const userResource = createResource({
      name: 'users',
      label: 'Users',
      fields: [],
    });

    const postResource = createResource({
      name: 'posts',
      label: 'Posts',
      fields: [],
    });

    const adminConfig = createAdmin({
      title: 'Multi Resource Admin',
      resources: [userResource, postResource],
    });

    expect(adminConfig.resources).toHaveLength(2);
    expect(adminConfig.resources[0].name).toBe('users');
    expect(adminConfig.resources[1].name).toBe('posts');
  });

  it('should handle empty resources array', () => {
    const adminConfig = createAdmin({
      title: 'Empty Admin',
      resources: [],
    });

    expect(adminConfig.resources).toEqual([]);
    expect(adminConfig.title).toBe('Empty Admin');
  });

  it('should preserve all provided options', () => {
    const userResource = createResource({
      name: 'users',
      label: 'Users',
      fields: [],
    });

    const adminConfig = createAdmin({
      title: 'Full Admin',
      resources: [userResource],
      theme: {
        primaryColor: '#10b981',
        secondaryColor: '#f59e0b',
        darkMode: true,
        customCSS: 'body { background: red; }',
      },
      layout: {
        sidebar: false,
        header: false,
        footer: false,
        sidebarWidth: 400,
      },
      auth: {
        enabled: true,
        loginUrl: '/login',
        logoutUrl: '/logout',
      },
    });

    expect(adminConfig.theme.customCSS).toBe('body { background: red; }');
    expect(adminConfig.layout.sidebar).toBe(false);
    expect(adminConfig.auth.loginUrl).toBe('/login');
  });
});
