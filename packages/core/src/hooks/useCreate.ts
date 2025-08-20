import { useState, useCallback } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { DataProvider } from "../types";

export interface UseCreateOptions<T = any> {
  resource: string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useCreate<T = any>(options: UseCreateOptions<T>) {
  const { dataProvider } = useSuperAdmin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(
    async (data: Partial<T>) => {
      if (!dataProvider) {
        const error = new Error("Data provider not available");
        setError(error);
        options.onError?.(error);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await dataProvider.create(options.resource, { data });
        options.onSuccess?.(result.data as T);
        return result.data as T;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        options.onError?.(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [dataProvider, options],
  );

  return {
    create,
    loading,
    error,
  };
}
