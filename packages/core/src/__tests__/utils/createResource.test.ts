import { createResource } from '../../utils/createResource';
import { ResourceConfig } from '../../types';

describe('createResource', () => {
  it('should create a resource with default values', () => {
    const resource = createResource({
      name: 'users',
      label: 'Users',
      fields: [
        { name: 'id', label: 'ID', type: 'text' as const },
        { name: 'name', label: 'Name', type: 'text' as const },
      ],
    });

    expect(resource).toEqual({
      name: 'users',
      label: 'Users',
      fields: [
        { name: 'id', label: 'ID', type: 'text' },
        { name: 'name', label: 'Name', type: 'text' },
      ],
      permissions: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
      },
      views: [
        {
          name: 'list',
          label: 'List',
          type: 'list',
          layout: 'table',
        },
        {
          name: 'create',
          label: 'Create',
          type: 'form',
        },
        {
          name: 'show',
          label: 'Show',
          type: 'show',
        },
        {
          name: 'edit',
          label: 'Edit',
          type: 'form',
        },
      ],
    });
  });

  it('should override default permissions when provided', () => {
    const resource = createResource({
      name: 'posts',
      label: 'Posts',
      fields: [{ name: 'title', label: 'Title', type: 'text' as const }],
      permissions: {
        create: false,
        delete: false,
      },
    });

    expect(resource.permissions).toEqual({
      create: false,
      read: true,
      update: true,
      delete: false,
      list: true,
    });
  });

  it('should use custom views when provided', () => {
    const customViews = [
      {
        name: 'grid',
        label: 'Grid View',
        type: 'list' as const,
        layout: 'grid' as const,
      },
    ];

    const resource = createResource({
      name: 'products',
      label: 'Products',
      fields: [{ name: 'name', label: 'Name', type: 'text' as const }],
      views: customViews,
    });

    expect(resource.views).toEqual(customViews);
  });

  it('should handle empty fields array', () => {
    const resource = createResource({
      name: 'categories',
      label: 'Categories',
      fields: [],
    });

    expect(resource.fields).toEqual([]);
    expect(resource.name).toBe('categories');
    expect(resource.label).toBe('Categories');
  });

  it('should create unique resource names', () => {
    const resource1 = createResource({
      name: 'users',
      label: 'Users',
      fields: [],
    });

    const resource2 = createResource({
      name: 'posts',
      label: 'Posts',
      fields: [],
    });

    expect(resource1.name).toBe('users');
    expect(resource2.name).toBe('posts');
    expect(resource1.name).not.toBe(resource2.name);
  });
});
