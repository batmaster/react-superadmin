import { useState, useCallback, useMemo } from 'react';

export interface FilterConfig {
  key: string;
  value: any;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'in' | 'notIn';
}

export interface UseFiltersOptions<T = any> {
  data: T[];
  filterableFields?: string[];
  initialFilters?: FilterConfig[];
}

export interface UseFiltersReturn<T = any> {
  filters: FilterConfig[];
  addFilter: (filter: FilterConfig) => void;
  removeFilter: (key: string) => void;
  updateFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  filteredData: T[];
  activeFilters: FilterConfig[];
  hasActiveFilters: boolean;
}

export function useFilters<T = any>(options: UseFiltersOptions<T>): UseFiltersReturn<T> {
  const { data, filterableFields, initialFilters = [] } = options;
  
  const [filters, setFilters] = useState<FilterConfig[]>(initialFilters);

  const filteredData = useMemo(() => {
    if (filters.length === 0) {
      return data;
    }

    return data.filter(item => {
      return filters.every(filter => {
        const itemValue = item[filter.key as keyof T];
        
        if (itemValue == null) {
          return false;
        }

        switch (filter.operator) {
          case 'equals':
            return itemValue === filter.value;
          
          case 'contains':
            return String(itemValue).toLowerCase().includes(String(filter.value).toLowerCase());
          
          case 'startsWith':
            return String(itemValue).toLowerCase().startsWith(String(filter.value).toLowerCase());
          
          case 'endsWith':
            return String(itemValue).toLowerCase().endsWith(String(filter.value).toLowerCase());
          
          case 'greaterThan':
            if (typeof itemValue === 'number' && typeof filter.value === 'number') {
              return itemValue > filter.value;
            }
            if (itemValue instanceof Date && filter.value instanceof Date) {
              return itemValue.getTime() > filter.value.getTime();
            }
            return false;
          
          case 'lessThan':
            if (typeof itemValue === 'number' && typeof filter.value === 'number') {
              return itemValue < filter.value;
            }
            if (itemValue instanceof Date && filter.value instanceof Date) {
              return itemValue.getTime() < filter.value.getTime();
            }
            return false;
          
          case 'in':
            if (Array.isArray(filter.value)) {
              return filter.value.includes(itemValue);
            }
            return false;
          
          case 'notIn':
            if (Array.isArray(filter.value)) {
              return !filter.value.includes(itemValue);
            }
            return false;
          
          default:
            return true;
        }
      });
    });
  }, [data, filters]);

  const addFilter = useCallback((filter: FilterConfig) => {
    if (filterableFields && !filterableFields.includes(filter.key)) {
      return; // Field is not filterable
    }

    setFilters(prev => {
      const existingIndex = prev.findIndex(f => f.key === filter.key);
      if (existingIndex >= 0) {
        // Update existing filter
        const newFilters = [...prev];
        newFilters[existingIndex] = filter;
        return newFilters;
      } else {
        // Add new filter
        return [...prev, filter];
      }
    });
  }, [filterableFields]);

  const removeFilter = useCallback((key: string) => {
    setFilters(prev => prev.filter(f => f.key !== key));
  }, []);

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters(prev => prev.map(f => f.key === key ? { ...f, value } : f));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const activeFilters = filters.filter(f => f.value != null && f.value !== '');
  const hasActiveFilters = activeFilters.length > 0;

  return {
    filters,
    addFilter,
    removeFilter,
    updateFilter,
    clearFilters,
    filteredData,
    activeFilters,
    hasActiveFilters,
  };
}
