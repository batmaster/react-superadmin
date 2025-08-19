import { useState, useCallback, useMemo } from 'react';

export interface UseSearchOptions<T = any> {
  data: T[];
  searchFields?: (keyof T)[];
  debounceMs?: number;
}

export interface UseSearchReturn<T = any> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredData: T[];
  isSearching: boolean;
  clearSearch: () => void;
  searchResults: T[];
  resultCount: number;
}

export function useSearch<T extends Record<string, any>>(options: UseSearchOptions<T>): UseSearchReturn<T> {
  const { data, searchFields, debounceMs = 300 } = options;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return data;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    
    return data.filter(item => {
      if (searchFields) {
        // Search only in specified fields
        return searchFields.some(field => {
          const value = item[field];
          if (value == null) return false;
          return String(value).toLowerCase().includes(searchLower);
        });
      } else {
        // Search in all string/number fields
        return Object.values(item).some(value => {
          if (value == null) return false;
          return String(value).toLowerCase().includes(searchLower);
        });
      }
    });
  }, [data, debouncedSearchTerm, searchFields]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const isSearching = debouncedSearchTerm.trim().length > 0;
  const searchResults = filteredData;
  const resultCount = filteredData.length;

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    isSearching,
    clearSearch,
    searchResults,
    resultCount,
  };
}
