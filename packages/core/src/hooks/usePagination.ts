import { useState, useCallback, useMemo } from 'react';

export interface UsePaginationOptions {
  total: number;
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

export interface UsePaginationReturn {
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  pageSizeOptions: number[];
}

export function usePagination(options: UsePaginationOptions): UsePaginationReturn {
  const { 
    total, 
    initialPage = 1, 
    initialPageSize = 10,
    pageSizeOptions = [5, 10, 20, 50, 100]
  } = options;
  
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  }, [page, hasNextPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setPage(page - 1);
    }
  }, [page, hasPreviousPage]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  }, []);

  return {
    page,
    setPage,
    pageSize,
    setPageSize: handlePageSizeChange,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    pageSizeOptions,
  };
}
