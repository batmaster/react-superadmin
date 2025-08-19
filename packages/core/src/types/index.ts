import { ReactNode } from 'react';

// Base resource interface
export interface Resource<T = any> {
  id: string | number;
  [key: string]: any;
}

// CRUD operations
export interface CrudOperations<T = any> {
  create: (data: Partial<T>) => Promise<T>;
  read: (id: string | number) => Promise<T>;
  update: (id: string | number, data: Partial<T>) => Promise<T>;
  delete: (id: string | number) => Promise<void>;
  list: (params?: ListParams) => Promise<ListResponse<T>>;
}

// List parameters
export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// List response
export interface ListResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Field configuration
export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'boolean' | 'file';
  required?: boolean;
  options?: Array<{ value: any; label: string }>;
  validation?: ValidationRule[];
  placeholder?: string;
  helpText?: string;
}

// Validation rules
export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

// Admin configuration
export interface AdminConfig {
  title: string;
  resources: ResourceConfig[];
  theme?: ThemeConfig;
  layout?: LayoutConfig;
  auth?: AuthConfig;
}

// Resource configuration
export interface ResourceConfig {
  name: string;
  label: string;
  fields: FieldConfig[];
  operations?: Partial<CrudOperations>;
  permissions?: PermissionConfig;
  views?: ViewConfig[];
}

// Permission configuration
export interface PermissionConfig {
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
  list?: boolean;
}

// View configuration
export interface ViewConfig {
  name: string;
  label: string;
  type: 'list' | 'form' | 'show' | 'custom';
  fields?: string[];
  layout?: 'table' | 'grid' | 'cards';
}

// Theme configuration
export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  darkMode?: boolean;
  customCSS?: string;
}

// Layout configuration
export interface LayoutConfig {
  sidebar?: boolean;
  header?: boolean;
  footer?: boolean;
  sidebarWidth?: number;
}

// Authentication configuration
export interface AuthConfig {
  enabled: boolean;
  loginUrl?: string;
  logoutUrl?: string;
  userInfoUrl?: string;
}

// Context types
export interface SuperAdminContextValue {
  config: AdminConfig;
  resources: Record<string, ResourceConfig>;
  theme: ThemeConfig;
  layout: LayoutConfig;
  auth: AuthConfig;
  user?: any;
  setUser: (user: any) => void;
  logout: () => void;
}

// Component props
export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Form types
export interface FormProps<T = any> extends BaseComponentProps {
  data?: Partial<T>;
  onSubmit: (data: T) => void;
  onCancel?: () => void;
  loading?: boolean;
  fields: FieldConfig[];
}

// Table types
export interface TableProps<T = any> extends BaseComponentProps {
  data: T[];
  columns: ColumnConfig<T>[];
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selected: T[]) => void;
  pagination?: boolean;
  search?: boolean;
  loading?: boolean;
}

export interface ColumnConfig<T = any> {
  key: string;
  label: string;
  render?: (value: any, row: T) => ReactNode;
  sortable?: boolean;
  width?: number | string;
}
