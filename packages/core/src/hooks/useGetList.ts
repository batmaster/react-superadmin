import { useState, useEffect, useCallback } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { DataProvider, GetListParams, GetListResult } from "../types";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!dataProvider) {
      setError(new Error("Data provider not available"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params: GetListParams = {
        pagination: options.pagination || { page: 1, perPage: 10 },
        sort: options.sort || { field: "id", order: "ASC" },
        filter: options.filter || {},
      };

      const result = await dataProvider.getList(options.resource, params);
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [dataProvider, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
