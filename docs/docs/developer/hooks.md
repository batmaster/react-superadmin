---
id: hooks
title: Custom Hooks
sidebar_label: Custom Hooks
keywords: [hooks, custom, development, react, patterns]
---

# Custom Hooks

Learn how to create custom hooks that integrate with React SuperAdmin's architecture.

## Hook Patterns

Custom hooks should follow React's rules of hooks and integrate seamlessly with the framework's patterns.

### Basic Hook Structure

```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseCustomHookOptions {
  enabled?: boolean;
  interval?: number;
}

interface UseCustomHookReturn {
  data: any;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

export const useCustomHook = (
  options: UseCustomHookOptions = {}
): UseCustomHookReturn => {
  const { enabled = true, interval = 5000 } = options;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Your data fetching logic here
      const result = await api.get('/endpoint');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  useEffect(() => {
    if (enabled && interval > 0) {
      const timer = setInterval(fetchData, interval);
      return () => clearInterval(timer);
    }
  }, [enabled, interval, fetchData]);

  return { data, loading, error, refresh };
};
```

## Integration with Core Hooks

### Extending useResource

```typescript
import { useResource } from '@react-superadmin/core';
import { useState, useCallback } from 'react';

export const useExtendedResource = (resourceName: string) => {
  const resource = useResource(resourceName);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedItems(resource.data?.map(item => item.id) || []);
  }, [resource.data]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const bulkDelete = useCallback(async () => {
    if (selectedItems.length === 0) return;

    try {
      await Promise.all(selectedItems.map(id => resource.remove(id)));
      setSelectedItems([]);
    } catch (error) {
      console.error('Bulk delete failed:', error);
    }
  }, [selectedItems, resource]);

  return {
    ...resource,
    selectedItems,
    toggleSelection,
    selectAll,
    clearSelection,
    bulkDelete,
    hasSelection: selectedItems.length > 0,
    selectionCount: selectedItems.length,
  };
};
```

### Extending useTable

```typescript
import { useTable } from '@react-superadmin/core';
import { useState, useCallback, useMemo } from 'react';

export const useEnhancedTable = (resourceName: string) => {
  const table = useTable(resourceName);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [bulkActions, setBulkActions] = useState<string[]>([]);

  const toggleRowSelection = useCallback((id: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAllRows = useCallback(() => {
    setSelectedRows(new Set(table.data?.map(item => item.id) || []));
  }, [table.data]);

  const clearRowSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  const selectedData = useMemo(() => {
    return table.data?.filter(item => selectedRows.has(item.id)) || [];
  }, [table.data, selectedRows]);

  const isAllSelected = useMemo(() => {
    return table.data?.length > 0 && selectedRows.size === table.data.length;
  }, [table.data, selectedRows]);

  const isIndeterminate = useMemo(() => {
    return (
      selectedRows.size > 0 && selectedRows.size < (table.data?.length || 0)
    );
  }, [table.data, selectedRows]);

  return {
    ...table,
    selectedRows: Array.from(selectedRows),
    selectedData,
    toggleRowSelection,
    selectAllRows,
    clearRowSelection,
    isAllSelected,
    isIndeterminate,
    hasSelection: selectedRows.size > 0,
    selectionCount: selectedRows.size,
  };
};
```

## Data Fetching Hooks

### useApiQuery

```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseApiQueryOptions<T> {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: number;
  retryDelay?: number;
}

export const useApiQuery = <T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options: UseApiQueryOptions<T> = {}
) => {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const executeQuery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await queryFn();
      setData(result);
      setRetryCount(0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));

      if (retryCount < retry) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          executeQuery();
        }, retryDelay);
      }
    } finally {
      setLoading(false);
    }
  }, [queryFn, retry, retryDelay, retryCount]);

  const refetch = useCallback(() => {
    executeQuery();
  }, [executeQuery]);

  useEffect(() => {
    if (enabled) {
      executeQuery();
    }
  }, [enabled, executeQuery]);

  useEffect(() => {
    if (refetchOnWindowFocus) {
      const handleFocus = () => refetch();
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [refetchOnWindowFocus, refetch]);

  return { data, loading, error, refetch, retryCount };
};
```

### useInfiniteScroll

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useInfiniteScroll = <T>(
  fetchNextPage: () => Promise<T[]>,
  options: UseInfiniteScrollOptions = {}
) => {
  const { threshold = 0.1, rootMargin = '100px' } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const observerRef = useRef<IntersectionObserver>();
  const lastElementRef = useRef<HTMLDivElement>(null);

  const loadNextPage = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const newData = await fetchNextPage();

      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setData(prev => [...prev, ...newData]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to load next page:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchNextPage, loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadNextPage();
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current = observer;

    if (lastElementRef.current) {
      observer.observe(lastElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadNextPage, hasMore, loading, threshold, rootMargin]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    hasMore,
    page,
    loadNextPage,
    reset,
    lastElementRef,
  };
};
```

## Form Hooks

### useFormValidation

```typescript
import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback(
    (name: keyof T, value: any): string | null => {
      const rule = validationRules[name as string];
      if (!rule) return null;

      if (rule.required && !value) {
        return 'This field is required';
      }

      if (rule.minLength && value && value.length < rule.minLength) {
        return `Minimum length is ${rule.minLength} characters`;
      }

      if (rule.maxLength && value && value.length > rule.maxLength) {
        return `Maximum length is ${rule.maxLength} characters`;
      }

      if (rule.pattern && value && !rule.pattern.test(value)) {
        return 'Invalid format';
      }

      if (rule.custom) {
        return rule.custom(value);
      }

      return null;
    },
    [validationRules]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(key => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  const setFieldValue = useCallback(
    (name: keyof T, value: any) => {
      setValues(prev => ({ ...prev, [name]: value }));

      if (touched[name]) {
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error || undefined }));
      }
    },
    [touched, validateField]
  );

  const setFieldTouched = useCallback(
    (name: keyof T, isTouched = true) => {
      setTouched(prev => ({ ...prev, [name]: isTouched }));

      if (isTouched) {
        const error = validateField(name, values[name]);
        setErrors(prev => ({ ...prev, [name]: error || undefined }));
      }
    },
    [values, validateField]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateForm,
    resetForm,
    isValid: Object.keys(errors).length === 0,
  };
};
```

## State Management Hooks

### useLocalStorage

```typescript
import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(
            `Error parsing localStorage value for key "${key}":`,
            error
          );
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};
```

### useDebounce

```typescript
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

## Data Provider Hooks

React SuperAdmin provides specialized hooks for working with data providers, making it easy to integrate data operations into your components.

### useDataProvider

The main hook for accessing the current data provider and switching between providers.

```typescript
import { useDataProvider } from '@react-superadmin/web';

function UserList() {
  const { dataProvider, switchProvider, getConfig } = useDataProvider();

  // Access current provider
  const currentProvider = getConfig().type;

  // Switch providers
  const switchToMock = () => {
    switchProvider({ type: 'mock', options: { enableLogging: true } });
  };

  const switchToPrisma = () => {
    switchProvider({ type: 'prisma', options: { enableCaching: true } });
  };

  // Use the provider
  const fetchUsers = async () => {
    const result = await dataProvider.getList('users', {
      pagination: { page: 1, perPage: 10 }
    });
    return result.data;
  };

  return (
    <div>
      <p>Current provider: {currentProvider}</p>
      <button onClick={switchToMock}>Use Mock</button>
      <button onClick={switchToPrisma}>Use Prisma</button>
    </div>
  );
}
```

### useDataProviderInstance

A convenience hook that provides direct access to the data provider instance.

```typescript
import { useDataProviderInstance } from '@react-superadmin/web';

function UserForm() {
  const dataProvider = useDataProviderInstance();

  const createUser = async (userData: any) => {
    try {
      const result = await dataProvider.create('users', { data: userData });
      return result.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  };

  const updateUser = async (id: string, userData: any) => {
    try {
      const result = await dataProvider.update('users', { id, data: userData });
      return result.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Custom Data Provider Hooks

You can create custom hooks that wrap data provider operations for specific resources.

```typescript
import { useDataProviderInstance } from '@react-superadmin/web';
import { useState, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useUsers = () => {
  const dataProvider = useDataProviderInstance();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(
    async (params?: any) => {
      setLoading(true);
      setError(null);

      try {
        const result = await dataProvider.getList<User>('users', {
          pagination: { page: 1, perPage: 20 },
          sort: { field: 'name', order: 'ASC' },
          ...params,
        });

        setUsers(result.data);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dataProvider]
  );

  const createUser = useCallback(
    async (userData: Partial<User>) => {
      setLoading(true);
      setError(null);

      try {
        const result = await dataProvider.create<User>('users', {
          data: userData,
        });
        await fetchUsers(); // Refresh the list
        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dataProvider, fetchUsers]
  );

  const updateUser = useCallback(
    async (id: string, userData: Partial<User>) => {
      setLoading(true);
      setError(null);

      try {
        const result = await dataProvider.update<User>('users', {
          id,
          data: userData,
        });
        await fetchUsers(); // Refresh the list
        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dataProvider, fetchUsers]
  );

  const deleteUser = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        await dataProvider.delete('users', { id });
        await fetchUsers(); // Refresh the list
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dataProvider, fetchUsers]
  );

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
```

### Hook Usage in Components

```typescript
function UserManagement() {
  const {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (userData: any) => {
    try {
      await createUser(userData);
      // Show success message
    } catch (error) {
      // Handle error
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users ({users.length})</h2>
      {users.map(user => (
        <div key={user.id}>
          {user.name} - {user.email}
          <button onClick={() => updateUser(user.id, { role: 'admin' })}>
            Make Admin
          </button>
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Testing Custom Hooks

### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCustomHook } from './useCustomHook';

describe('useCustomHook', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useCustomHook());

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should fetch data when enabled', async () => {
    const { result } = renderHook(() => useCustomHook({ enabled: true }));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      // Wait for async operations
    });

    expect(result.current.loading).toBe(false);
  });

  it('should handle errors', async () => {
    // Mock API to throw error
    const { result } = renderHook(() => useCustomHook());

    await act(async () => {
      // Trigger error condition
    });

    expect(result.current.error).toBeTruthy();
  });
});
```

## Best Practices

1. **Follow React Rules**: Always follow the rules of hooks
2. **Use TypeScript**: Provide proper typing for all hooks
3. **Handle Errors**: Implement proper error handling in async hooks
4. **Optimize Performance**: Use useCallback and useMemo where appropriate
5. **Test Hooks**: Write comprehensive tests for all custom hooks
6. **Documentation**: Document parameters, return values, and usage examples
7. **Integration**: Leverage existing core hooks when possible
8. **Naming**: Use descriptive names that start with "use"

## Examples

Check out the [Examples](../examples/basic-usage) section to see these hooks in action, or explore the [API Reference](./api) for detailed hook documentation.

## Related Documentation

- [Features: Data Providers](../features/data-providers) - Comprehensive guide to data providers and their hooks
- [Components](./components.md) - How to use hooks in custom components
- [API](./api.md) - API reference and examples
- [Testing](./testing.md) - Testing strategies for custom hooks
