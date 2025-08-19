import { useState, useCallback, useMemo } from 'react';

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  order: SortOrder;
}

export interface UseSortingOptions<T = any> {
  data: T[];
  initialSort?: SortConfig;
  sortableFields?: string[];
}

export interface UseSortingReturn<T = any> {
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
  sortBy: (key: string) => void;
  sortedData: T[];
  isSorted: (key: string) => boolean;
  getSortDirection: (key: string) => SortOrder | null;
  clearSort: () => void;
}

export function useSorting<T = any>(options: UseSortingOptions<T>): UseSortingReturn<T> {
  const { data, initialSort, sortableFields } = options;
  
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort || { key: '', order: 'asc' });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Handle different types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.order === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.order === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      // Fallback to string comparison
      const aStr = String(aValue);
      const bStr = String(bValue);
      return sortConfig.order === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [data, sortConfig]);

  const sortBy = useCallback((key: string) => {
    if (sortableFields && !sortableFields.includes(key)) {
      return; // Field is not sortable
    }

    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  }, [sortableFields]);

  const isSorted = useCallback((key: string) => {
    return sortConfig.key === key;
  }, [sortConfig.key]);

  const getSortDirection = useCallback((key: string) => {
    return sortConfig.key === key ? sortConfig.order : null;
  }, [sortConfig]);

  const clearSort = useCallback(() => {
    setSortConfig({ key: '', order: 'asc' });
  }, []);

  return {
    sortConfig,
    setSortConfig,
    sortBy,
    sortedData,
    isSorted,
    getSortDirection,
    clearSort,
  };
}
