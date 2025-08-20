import {
  CreateParams,
  DataProvider,
  DataProviderParams,
  DeleteManyParams,
  DeleteParams,
  GetManyParams,
  GetManyReferenceParams,
  GetOneParams,
  ListResponse,
  UpdateManyParams,
  UpdateParams,
} from '../types';

// Mock data storage
const mockData: Record<string, any[]> = {
  users: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      createdAt: '2024-01-02',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'user',
      createdAt: '2024-01-03',
    },
  ],
  posts: [
    {
      id: '1',
      title: 'First Post',
      content: 'This is the first post content',
      authorId: '1',
      published: true,
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      title: 'Second Post',
      content: 'This is the second post content',
      authorId: '2',
      published: false,
      createdAt: '2024-01-02',
    },
    {
      id: '3',
      title: 'Third Post',
      content: 'This is the third post content',
      authorId: '1',
      published: true,
      createdAt: '2024-01-03',
    },
  ],
  products: [
    {
      id: '1',
      name: 'Product A',
      price: 99.99,
      category: 'electronics',
      inStock: true,
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Product B',
      price: 149.99,
      category: 'clothing',
      inStock: false,
      createdAt: '2024-01-02',
    },
    {
      id: '3',
      name: 'Product C',
      price: 29.99,
      category: 'books',
      inStock: true,
      createdAt: '2024-01-03',
    },
  ],
};

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  Object.entries(mockData).forEach(([resource, data]) => {
    const key = `react-superadmin-${resource}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  });
};

// Get data from localStorage
const getStorageData = (resource: string): any[] => {
  const key = `react-superadmin-${resource}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

// Save data to localStorage
const saveStorageData = (resource: string, data: any[]): void => {
  const key = `react-superadmin-${resource}`;
  localStorage.setItem(key, JSON.stringify(data));
};

// Helper function to apply filters
const applyFilters = (data: any[], filters: Record<string, any>): any[] => {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true;
      if (typeof value === 'string') {
        return String(item[key]).toLowerCase().includes(value.toLowerCase());
      }
      return item[key] === value;
    });
  });
};

// Helper function to apply search
const applySearch = (data: any[], search: string): any[] => {
  if (!search) return data;
  const searchLower = search.toLowerCase();
  return data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchLower)
    )
  );
};

// Helper function to apply sorting
const applySorting = (
  data: any[],
  sort?: { field: string; order: 'ASC' | 'DESC' }
): any[] => {
  if (!sort) return data;

  return [...data].sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];

    if (aValue < bValue) return sort.order === 'ASC' ? -1 : 1;
    if (aValue > bValue) return sort.order === 'ASC' ? 1 : -1;
    return 0;
  });
};

// Helper function to apply pagination
const applyPagination = (
  data: any[],
  pagination?: { page: number; perPage: number }
): { data: any[]; total: number } => {
  if (!pagination) return { data, total: data.length };

  const { page, perPage } = pagination;
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: data.length,
  };
};

export const mockDataProvider: DataProvider = {
  getList: async <T = any>(
    resource: string,
    params: DataProviderParams
  ): Promise<ListResponse<T>> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    let data = getStorageData(resource);

    // Apply search
    if (params.search) {
      data = applySearch(data, params.search);
    }

    // Apply filters
    if (params.filter) {
      data = applyFilters(data, params.filter);
    }

    // Apply sorting
    if (params.sort) {
      data = applySorting(data, params.sort);
    }

    // Apply pagination
    const result = applyPagination(data, params.pagination);
    const page = params.pagination?.page || 1;
    const perPage = params.pagination?.perPage || 10;

    return {
      data: result.data as T[],
      total: result.total,
      page,
      perPage,
      totalPages: Math.ceil(result.total / perPage),
    };
  },

  getOne: async <T = any>(
    resource: string,
    params: GetOneParams
  ): Promise<{ data: T }> => {
    await new Promise(resolve => setTimeout(resolve, 50));

    const data = getStorageData(resource);
    const item = data.find(item => item.id === params.id);

    if (!item) {
      throw new Error(`${resource} with id ${params.id} not found`);
    }

    return { data: item as T };
  },

  getMany: async <T = any>(
    resource: string,
    params: GetManyParams
  ): Promise<{ data: T[] }> => {
    await new Promise(resolve => setTimeout(resolve, 50));

    const data = getStorageData(resource);
    const items = data.filter(item => params.ids.includes(item.id));

    return { data: items as T[] };
  },

  getManyReference: async <T = any>(
    resource: string,
    params: GetManyReferenceParams
  ): Promise<ListResponse<T>> => {
    await new Promise(resolve => setTimeout(resolve, 100));

    let data = getStorageData(resource);

    // Filter by reference
    data = data.filter(item => item[params.target] === params.id);

    // Apply search
    if (params.search) {
      data = applySearch(data, params.search);
    }

    // Apply filters
    if (params.filter) {
      data = applyFilters(data, params.filter);
    }

    // Apply sorting
    if (params.sort) {
      data = applySorting(data, params.sort);
    }

    // Apply pagination
    const result = applyPagination(data, params.pagination);
    const page = params.pagination?.page || 1;
    const perPage = params.pagination?.perPage || 10;

    return {
      data: result.data as T[],
      total: result.total,
      page,
      perPage,
      totalPages: Math.ceil(result.total / perPage),
    };
  },

  create: async <T = any>(
    resource: string,
    params: CreateParams<T>
  ): Promise<{ data: T }> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const data = getStorageData(resource);
    const newItem = {
      ...params.data,
      id: String(Date.now()), // Generate unique ID
      createdAt: new Date().toISOString().split('T')[0],
    } as T;

    data.push(newItem);
    saveStorageData(resource, data);

    return { data: newItem };
  },

  update: async <T = any>( // eslint-disable-line @typescript-eslint/no-unused-vars
    resource: string,
    params: UpdateParams<T>
  ): Promise<{ data: T }> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const data = getStorageData(resource);
    const index = data.findIndex(item => item.id === params.id);

    if (index === -1) {
      throw new Error(`${resource} with id ${params.id} not found`);
    }

    const updatedItem = { ...data[index], ...params.data };
    data[index] = updatedItem;
    saveStorageData(resource, data);

    return { data: updatedItem as T };
  },

  updateMany: async <T = any>(
    resource: string,
    params: UpdateManyParams<T>
  ): Promise<{ data: (string | number)[] }> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const data = getStorageData(resource);
    const updatedIds: (string | number)[] = [];

    params.ids.forEach(id => {
      const index = data.findIndex(item => item.id === id);
      if (index !== -1) {
        data[index] = { ...data[index], ...params.data };
        updatedIds.push(id);
      }
    });

    if (updatedIds.length > 0) {
      saveStorageData(resource, data);
    }

    return { data: updatedIds };
  },

  delete: async <T = any>( // eslint-disable-line @typescript-eslint/no-unused-vars
    resource: string,
    params: DeleteParams
  ): Promise<{ data: T }> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const data = getStorageData(resource);
    const index = data.findIndex(item => item.id === params.id);

    if (index === -1) {
      throw new Error(`${resource} with id ${params.id} not found`);
    }

    const deletedItem = data[index];
    data.splice(index, 1);
    saveStorageData(resource, data);

    return { data: deletedItem as T };
  },

  deleteMany: async <T = any>(
    resource: string,
    params: DeleteManyParams
  ): Promise<{ data: (string | number)[] }> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const data = getStorageData(resource);
    const deletedIds: (string | number)[] = [];

    params.ids.forEach(id => {
      const index = data.findIndex(item => item.id === id);
      if (index !== -1) {
        data.splice(index, 1);
        deletedIds.push(id);
      }
    });

    if (deletedIds.length > 0) {
      saveStorageData(resource, data);
    }

    return { data: deletedIds };
  },
};

// Initialize storage when the module is imported
initializeStorage();
