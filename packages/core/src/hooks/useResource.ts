import { useState, useCallback } from 'react';
import { useSuperAdmin } from '../contexts/SuperAdminContext';
import { Resource, CrudOperations, ListParams, ListResponse } from '../types';

export interface UseResourceOptions<T = any> {
  resourceName: string;
  operations?: Partial<CrudOperations<T>>;
}

export interface UseResourceReturn<T = any> {
  data: T[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  create: (data: Partial<T>) => Promise<T>;
  read: (id: string | number) => Promise<T>;
  update: (id: string | number, data: Partial<T>) => Promise<T>;
  delete: (id: string | number) => Promise<void>;
  list: (params?: ListParams) => Promise<void>;
  refresh: () => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setSort: (sort: string, order: 'asc' | 'desc') => void;
  setFilters: (filters: Record<string, any>) => void;
}

export function useResource<T = any>(options: UseResourceOptions<T>): UseResourceReturn<T> {
  const { resourceName, operations } = options;
  const { resources } = useSuperAdmin();
  
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const resource = resources[resourceName];
  const totalPages = Math.ceil(total / limit);

  const handleError = useCallback((error: any) => {
    const message = error?.message || 'An error occurred';
    setError(message);
    setLoading(false);
  }, []);

  const list = useCallback(async (params?: ListParams): Promise<void> => {
    if (!operations?.list) {
      throw new Error('List operation not available');
    }

    setLoading(true);
    setError(null);
    
    try {
      const listParams: ListParams = {
        page,
        limit,
        search,
        sort,
        order,
        filters,
        ...params,
      };

      const result = await operations.list(listParams);
      setData(result.data);
      setTotal(result.total);
      setPage(result.page);
      setLimit(result.limit);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  }, [operations, page, limit, search, sort, order, filters, handleError]);

  const refresh = useCallback(async (): Promise<void> => {
    await list();
  }, [list]);

  const create = useCallback(async (data: Partial<T>): Promise<T> => {
    if (!operations?.create) {
      throw new Error('Create operation not available');
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await operations.create(data);
      await refresh();
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [operations, refresh, handleError]);

  const read = useCallback(async (id: string | number): Promise<T> => {
    if (!operations?.read) {
      throw new Error('Read operation not available');
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await operations.read(id);
      setLoading(false);
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [operations, handleError]);

  const update = useCallback(async (id: string | number, data: Partial<T>): Promise<T> => {
    if (!operations?.update) {
      throw new Error('Update operation not available');
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await operations.update(id, data);
      await refresh();
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [operations, refresh, handleError]);

  const deleteItem = useCallback(async (id: string | number): Promise<void> => {
    if (!operations?.delete) {
      throw new Error('Delete operation not available');
    }

    setLoading(true);
    setError(null);
    
    try {
      await operations.delete(id);
      await refresh();
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [operations, refresh, handleError]);

  const setPageHandler = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const setLimitHandler = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  const setSearchHandler = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page when searching
  }, []);

  const setSortHandler = useCallback((newSort: string, newOrder: 'asc' | 'desc') => {
    setSort(newSort);
    setOrder(newOrder);
  }, []);

  const setFiltersHandler = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filtering
  }, []);

  return {
    data,
    loading,
    error,
    total,
    page,
    limit,
    totalPages,
    create,
    read,
    update,
    delete: deleteItem,
    list,
    refresh,
    setPage: setPageHandler,
    setLimit: setLimitHandler,
    setSearch: setSearchHandler,
    setSort: setSortHandler,
    setFilters: setFiltersHandler,
  };
}
