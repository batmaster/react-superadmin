import { useState, useCallback } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { DataProvider } from "../types";

export interface UseUpdateOptions<T = any> {
  resource: string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useUpdate<T = any>(options: UseUpdateOptions<T>) {
  const { dataProvider } = useSuperAdmin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (id: string | number, data: Partial<T>) => {
      if (!dataProvider) {
        const error = new Error("Data provider not available");
        setError(error);
        options.onError?.(error);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await dataProvider.update(options.resource, {
          id,
          data,
        });
        options.onSuccess?.(result.data);
        return result.data;
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
    update,
    loading,
    error,
  };
}
