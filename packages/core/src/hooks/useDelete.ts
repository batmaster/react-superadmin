import { useState, useCallback } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { DataProvider } from "../types";

export interface UseDeleteOptions {
  resource: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDelete(options: UseDeleteOptions) {
  const { dataProvider } = useSuperAdmin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(
    async (id: string | number) => {
      if (!dataProvider) {
        const error = new Error("Data provider not available");
        setError(error);
        options.onError?.(error);
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        await dataProvider.delete(options.resource, { id });
        options.onSuccess?.();
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        options.onError?.(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [dataProvider, options],
  );

  return {
    remove,
    loading,
    error,
  };
}
