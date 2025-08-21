import { useCallback, useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Extract stable values for dependencies
  const resource = options.resource;
  const paginationPage = options.pagination?.page || 1;
  const paginationPerPage = options.pagination?.perPage || 10;
  const sortField = options.sort?.field || "id";
  const sortOrder = options.sort?.order || "ASC";
  const filterKeys = options.filter
    ? Object.keys(options.filter).sort().join(",")
    : "";
  const filterValues = options.filter
    ? Object.keys(options.filter)
        .sort()
        .map((k) => options.filter![k])
        .join(",")
    : "";

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
        pagination: { page: paginationPage, perPage: paginationPerPage },
        sort: { field: sortField, order: sortOrder },
        filter: options.filter || {},
      };

      const result = await dataProvider.getList(resource, params);
      setData(result);

      // Call callbacks if they exist (using current values)
      if (options.onSuccess) {
        options.onSuccess(result);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);

      // Call error callback if it exists (using current values)
      if (options.onError) {
        options.onError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [
    dataProvider,
    resource,
    paginationPage,
    paginationPerPage,
    sortField,
    sortOrder,
    filterKeys,
    filterValues,
  ]);

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
