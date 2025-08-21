import { useCallback, useEffect, useRef, useState } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { GetListResult } from "../types";

export interface UseGetListOptions {
  resource: string;
  pagination?: {
    page: number;
    perPage: number;
  };
  sort?: {
    field: string;
    order: "ASC" | "DESC";
  };
  filter?: Record<string, any>;
  onSuccess?: (data: GetListResult<any>) => void;
  onError?: (error: Error) => void;
}

export function useGetList<T = any>(options: UseGetListOptions) {
  const { dataProvider } = useSuperAdmin();
  const [data, setData] = useState<GetListResult<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Store latest callbacks in refs to avoid dependency issues
  const onSuccessRef = useRef(options.onSuccess);
  const onErrorRef = useRef(options.onError);

  // Update refs when callbacks change
  onSuccessRef.current = options.onSuccess;
  onErrorRef.current = options.onError;

  // Extract options for stable dependencies
  const {
    resource,
    pagination = { page: 1, perPage: 10 },
    sort = { field: "id", order: "ASC" },
    filter = {},
  } = options;

  const fetchData = useCallback(async () => {
    if (!dataProvider) {
      setError(new Error("Data provider not available"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = {
        pagination,
        sort,
        filter,
      };

      const result = await dataProvider.getList(resource, params);
      setData(result);

      if (onSuccessRef.current) {
        onSuccessRef.current(result);
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error("Unknown error");
      setError(errorObj);

      if (onErrorRef.current) {
        onErrorRef.current(errorObj);
      }
    } finally {
      setLoading(false);
    }
  }, [
    dataProvider,
    resource,
    pagination.page,
    pagination.perPage,
    sort.field,
    sort.order,
    JSON.stringify(filter),
  ]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch function
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
