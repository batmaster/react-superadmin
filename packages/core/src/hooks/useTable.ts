import { useState, useCallback, useMemo } from 'react';
import { ColumnConfig } from '../types';

export interface UseTableOptions<T = any> {
  data: T[];
  columns: ColumnConfig<T>[];
  initialSort?: { key: string; order: 'asc' | 'desc' };
  initialPage?: number;
  initialPageSize?: number;
}

export interface UseTableReturn<T = any> {
  data: T[];
  columns: ColumnConfig<T>[];
  sort: { key: string; order: 'asc' | 'desc' };
  setSort: (key: string, order: 'asc' | 'desc') => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  paginatedData: T[];
  totalPages: number;
  selectedRows: T[];
  setSelectedRows: (rows: T[]) => void;
  toggleRowSelection: (row: T) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isRowSelected: (row: T) => boolean;
}

export function useTable<T = any>(options: UseTableOptions<T>): UseTableReturn<T> {
  const { data, columns, initialSort, initialPage = 1, initialPageSize = 10 } = options;
  
  const [sort, setSort] = useState(initialSort || { key: '', order: 'asc' as const });
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  const sortedData = useMemo(() => {
    if (!sort.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sort.key as keyof T];
      const bValue = b[sort.key as keyof T];
      
      if (aValue < bValue) return sort.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sort]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, page, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  const handleSort = useCallback((key: string, order: 'asc' | 'desc') => {
    setSort({ key, order });
    setPage(1); // Reset to first page when sorting
  }, []);

  const toggleRowSelection = useCallback((row: T) => {
    setSelectedRows(prev => {
      const isSelected = prev.includes(row);
      if (isSelected) {
        return prev.filter(r => r !== row);
      } else {
        return [...prev, row];
      }
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedRows([...data]);
  }, [data]);

  const deselectAll = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const isRowSelected = useCallback((row: T) => {
    return selectedRows.includes(row);
  }, [selectedRows]);

  return {
    data,
    columns,
    sort,
    setSort: handleSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    paginatedData,
    totalPages,
    selectedRows,
    setSelectedRows,
    toggleRowSelection,
    selectAll,
    deselectAll,
    isRowSelected,
  };
}
