import { ResourceConfig, FieldConfig } from '../types';

export interface CreateResourceOptions {
  name: string;
  label: string;
  fields: FieldConfig[];
  permissions?: {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
    list?: boolean;
  };
  views?: Array<{
    name: string;
    label: string;
    type: 'list' | 'form' | 'show' | 'custom';
    fields?: string[];
    layout?: 'table' | 'grid' | 'cards';
  }>;
}

export function createResource(options: CreateResourceOptions): ResourceConfig {
  return {
    name: options.name,
    label: options.label,
    fields: options.fields,
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      list: true,
      ...options.permissions,
    },
    views: options.views || [
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
  };
}
