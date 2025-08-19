---
id: data-providers
title: Data Providers
sidebar_label: Data Providers
keywords: [data providers, crud, database, api, mock, prisma, custom]
---

# Data Providers

Data providers are the core abstraction layer for data operations in React SuperAdmin. They provide a unified interface for CRUD operations, regardless of the underlying data source (database, API, mock data, etc.).

## Overview

Data providers follow the React Admin pattern and implement a standardized interface that handles:

- **CRUD Operations**: Create, Read, Update, Delete
- **List Operations**: Pagination, filtering, sorting, search
- **Relationship Handling**: References and nested data
- **Error Handling**: Consistent error responses
- **Type Safety**: Full TypeScript support

## Why Data Providers?

Data providers solve common challenges when building admin interfaces:

- **Backend Agnostic**: Switch between different data sources without changing your components
- **Consistent API**: Same interface regardless of whether you're using a database, REST API, or GraphQL
- **Easy Testing**: Use mock providers for isolated testing
- **Runtime Switching**: Change data sources without restarting your application
- **Type Safety**: Full TypeScript support across all providers

## Quick Start

### Basic Setup

1. **Wrap your app with DataProviderProvider:**

```tsx
import { DataProviderProvider } from '@react-superadmin/web';

function App() {
  return (
    <DataProviderProvider>
      <YourApp />
    </DataProviderProvider>
  );
}
```

2. **Use the data provider in your components:**

```tsx
import { useDataProvider } from '@react-superadmin/web';

function UserList() {
  const { dataProvider } = useDataProvider();

  const fetchUsers = async () => {
    const result = await dataProvider.getList('users', {
      pagination: { page: 1, perPage: 10 },
      sort: { field: 'name', order: 'ASC' },
    });
    return result.data;
  };
}
```

## Built-in Data Providers

### 1. Mock Data Provider

The mock data provider is perfect for development, testing, and prototyping. It uses localStorage for persistence and simulates real network behavior.

#### Features

- ✅ **localStorage Persistence**: Data survives page refreshes
- ✅ **Network Simulation**: Realistic delays for realistic testing
- ✅ **Full CRUD**: Complete create, read, update, delete operations
- ✅ **Advanced Queries**: Search, filtering, sorting, pagination
- ✅ **Mock Data**: Pre-populated with realistic sample data
- ✅ **Type Safety**: Full TypeScript support

#### Usage

```tsx
import { mockDataProvider } from '@react-superadmin/core';

// The provider is automatically configured with mock data
const users = await mockDataProvider.getList('users', {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'name', order: 'ASC' },
  filter: { role: 'admin' },
  search: 'john',
});
```

#### Mock Data Structure

```typescript
const mockData = {
  users: [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  ],
  posts: [
    { id: '1', title: 'First Post', content: 'Content...', authorId: '1' },
  ],
  products: [
    { id: '1', name: 'Product A', price: 99.99, category: 'electronics' },
  ],
};
```

#### Configuration

```tsx
import { dataProviderPresets } from '@react-superadmin/web';

const mockConfig = {
  type: 'mock',
  options: {
    enableLocalStorage: true, // Persist data in localStorage
    enableLogging: true, // Log operations to console
    enableCaching: false, // No caching for mock provider
  },
};
```

### 2. Prisma Data Provider

The Prisma data provider connects to real databases using Prisma ORM. It's production-ready and optimized for performance.

#### Features

- ✅ **Database Integration**: Connect to PostgreSQL, MySQL, SQLite, etc.
- ✅ **Field Optimization**: Automatic field selection for performance
- ✅ **Complex Queries**: Advanced filtering and search capabilities
- ✅ **Transaction Support**: Handle complex operations safely
- ✅ **Connection Management**: Automatic connection handling
- ✅ **Error Handling**: Comprehensive error management

#### Setup

1. **Install Dependencies**

   ```bash
   pnpm add @prisma/client
   pnpm add -D prisma
   ```

2. **Initialize Prisma**

   ```bash
   npx prisma init
   ```

3. **Define Schema** (`prisma/schema.prisma`)

   ```prisma
   model User {
     id        String   @id @default(cuid())
     name      String
     email     String   @unique
     role      String   @default("user")
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

4. **Generate Client**
   ```bash
   npx prisma generate
   ```

#### Usage

```tsx
import { prismaDataProvider } from '@react-superadmin/web';

const users = await prismaDataProvider.getList('users', {
  pagination: { page: 1, perPage: 20 },
  sort: { field: 'createdAt', order: 'DESC' },
  filter: { role: 'admin' },
  search: 'john',
});
```

#### Resource Field Configuration

Configure which fields to include for each resource:

```typescript
const resourceFields = {
  users: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
  posts: ['id', 'title', 'content', 'authorId', 'published', 'createdAt'],
  products: ['id', 'name', 'price', 'category', 'inStock'],
};
```

#### Configuration

```tsx
const prismaConfig = {
  type: 'prisma',
  options: {
    enableLogging: process.env.NODE_ENV === 'development',
    enableCaching: true,
    databaseUrl: process.env.DATABASE_URL,
  },
};
```

## Creating Custom Data Providers

You can create custom data providers for any data source by implementing the `DataProvider` interface.

### Basic Template

```typescript
import {
  DataProvider,
  DataProviderParams,
  ListResponse,
} from '@react-superadmin/core';

export class CustomDataProvider implements DataProvider {
  async getList<T = any>(
    resource: string,
    params: DataProviderParams
  ): Promise<ListResponse<T>> {
    // Implement list logic
    throw new Error('Not implemented');
  }

  async getOne<T = any>(
    resource: string,
    params: GetOneParams
  ): Promise<{ data: T }> {
    // Implement get one logic
    throw new Error('Not implemented');
  }

  // ... implement all other methods
}
```

### REST API Provider Example

```typescript
export class RestApiDataProvider implements DataProvider {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string, headers: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  async getList<T = any>(
    resource: string,
    params: DataProviderParams
  ): Promise<ListResponse<T>> {
    const { pagination, sort, filter, search } = params;

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (pagination) {
      queryParams.append('page', pagination.page.toString());
      queryParams.append('perPage', pagination.perPage.toString());
    }
    if (sort) {
      queryParams.append('sort', `${sort.field}:${sort.order}`);
    }
    if (search) {
      queryParams.append('search', search);
    }

    // Add filters
    Object.entries(filter || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(`filter[${key}]`, value.toString());
      }
    });

    const response = await fetch(
      `${this.baseUrl}/${resource}?${queryParams.toString()}`,
      { headers: this.headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      data: data.items,
      total: data.total,
      page: pagination?.page || 1,
      perPage: pagination?.perPage || 10,
      totalPages: Math.ceil(data.total / (pagination?.perPage || 10)),
    };
  }

  async getOne<T = any>(
    resource: string,
    params: GetOneParams
  ): Promise<{ data: T }> {
    const response = await fetch(`${this.baseUrl}/${resource}/${params.id}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  }

  // ... implement other methods similarly
}
```

### GraphQL Provider Example

```typescript
export class GraphQLDataProvider implements DataProvider {
  private client: any; // Apollo Client or similar

  constructor(client: any) {
    this.client = client;
  }

  async getList<T = any>(
    resource: string,
    params: DataProviderParams
  ): Promise<ListResponse<T>> {
    const { pagination, sort, filter, search } = params;

    const query = gql`
      query Get${resource}($limit: Int, $offset: Int, $orderBy: String, $where: String) {
        ${resource}(limit: $limit, offset: $offset, orderBy: $orderBy, where: $where) {
          id
          # Add your fields here
        }
        ${resource}Count(where: $where)
      }
    `;

    const variables = {
      limit: pagination?.perPage || 10,
      offset: ((pagination?.page || 1) - 1) * (pagination?.perPage || 10),
      orderBy: sort ? `${sort.field}_${sort.order}` : undefined,
      where: this.buildWhereClause(filter, search),
    };

    const result = await this.client.query({ query, variables });

    return {
      data: result.data[resource],
      total: result.data[`${resource}Count`],
      page: pagination?.page || 1,
      perPage: pagination?.perPage || 10,
      totalPages: Math.ceil(
        result.data[`${resource}Count`] / (pagination?.perPage || 10)
      ),
    };
  }

  private buildWhereClause(
    filter: Record<string, any>,
    search?: string
  ): string {
    // Implement GraphQL where clause building
    return '';
  }

  // ... implement other methods
}
```

## Data Provider Factory

The data provider factory allows you to switch between different providers at runtime.

### Basic Usage

```tsx
import { DataProviderProvider, useDataProvider } from '@react-superadmin/web';
import { dataProviderPresets } from '@react-superadmin/web';

function App() {
  return (
    <DataProviderProvider initialConfig={dataProviderPresets.development}>
      <YourApp />
    </DataProviderProvider>
  );
}

function ProviderSwitcher() {
  const { switchProvider, getConfig } = useDataProvider();

  const switchToMock = () => {
    switchProvider(dataProviderPresets.mock);
  };

  const switchToPrisma = () => {
    switchProvider(dataProviderPresets.prisma);
  };

  return (
    <div>
      <p>Current: {getConfig().type}</p>
      <button onClick={switchToMock}>Use Mock</button>
      <button onClick={switchToPrisma}>Use Prisma</button>
    </div>
  );
}
```

### Configuration Presets

```typescript
export const dataProviderPresets = {
  development: {
    type: 'mock',
    options: {
      enableLocalStorage: true,
      enableLogging: true,
      enableCaching: false,
    },
  },

  production: {
    type: 'prisma',
    options: {
      enableLogging: false,
      enableCaching: true,
    },
  },

  testing: {
    type: 'mock',
    options: {
      enableLocalStorage: false,
      enableLogging: false,
      enableCaching: false,
    },
  },
};
```

## React Integration

### Using the Hook

```tsx
import { useDataProvider } from '@react-superadmin/web';

function UserList() {
  const { dataProvider } = useDataProvider();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await dataProvider.getList('users', {
        pagination: { page: 1, perPage: 20 },
        sort: { field: 'name', order: 'ASC' },
      });
      setUsers(result.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### CRUD Operations

```tsx
function UserForm() {
  const { dataProvider } = useDataProvider();
  const [formData, setFormData] = useState({});

  const createUser = async () => {
    try {
      const result = await dataProvider.create('users', {
        data: formData,
      });
      console.log('User created:', result.data);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const updateUser = async (id: string) => {
    try {
      const result = await dataProvider.update('users', {
        id,
        data: formData,
      });
      console.log('User updated:', result.data);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await dataProvider.delete('users', { id });
      console.log('User deleted');
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };
}
```

## Data Provider Methods

All data providers implement the same interface:

### `getList(resource, params)`

Fetch a paginated list of records with filtering, sorting, and search.

```tsx
const result = await dataProvider.getList('users', {
  pagination: { page: 1, perPage: 20 },
  sort: { field: 'createdAt', order: 'DESC' },
  filter: { role: 'admin', active: true },
  search: 'john doe',
});
```

### `getOne(resource, params)`

Fetch a single record by ID.

```tsx
const result = await dataProvider.getOne('users', { id: '123' });
```

### `getMany(resource, params)`

Fetch multiple records by IDs.

```tsx
const result = await dataProvider.getMany('users', { ids: ['1', '2', '3'] });
```

### `getManyReference(resource, params)`

Fetch records related to another record.

```tsx
const result = await dataProvider.getManyReference('posts', {
  target: 'authorId',
  id: '123',
  pagination: { page: 1, perPage: 10 },
});
```

### `create(resource, params)`

Create a new record.

```tsx
const result = await dataProvider.create('users', {
  data: { name: 'John Doe', email: 'john@example.com' },
});
```

### `update(resource, params)`

Update an existing record.

```tsx
const result = await dataProvider.update('users', {
  id: '123',
  data: { name: 'Jane Doe' },
});
```

### `updateMany(resource, params)`

Update multiple records.

```tsx
const result = await dataProvider.updateMany('users', {
  ids: ['1', '2', '3'],
  data: { role: 'admin' },
});
```

### `delete(resource, params)`

Delete a record.

```tsx
const result = await dataProvider.delete('users', { id: '123' });
```

### `deleteMany(resource, params)`

Delete multiple records.

```tsx
const result = await dataProvider.deleteMany('users', {
  ids: ['1', '2', '3'],
});
```

## Error Handling

All data providers include comprehensive error handling:

```tsx
try {
  const result = await dataProvider.getList('users', params);
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    console.error('Data provider error:', error.message);
    // Show user-friendly error message
    setError(error.message);
  } else {
    console.error('Unknown error:', error);
    setError('An unexpected error occurred');
  }
}
```

## Performance Considerations

### Mock Provider

- **Pros**: Fast, no network overhead, predictable performance
- **Cons**: Limited data size, no real persistence
- **Use Case**: Development, testing, prototyping

### Prisma Provider

- **Pros**: Real data, scalable, optimized queries
- **Cons**: Network latency, database dependency
- **Use Case**: Production, large datasets

### General Tips

- **Pagination**: Always use pagination for large datasets
- **Field Selection**: Only select needed fields
- **Caching**: Enable caching for production
- **Indexing**: Proper database indexing for Prisma provider

## Testing

### Mock Provider Testing

```typescript
const testConfig = {
  type: 'mock',
  options: {
    enableLocalStorage: false,
    enableLogging: false,
  },
};
```

### Prisma Provider Testing

```typescript
const testConfig = {
  type: 'prisma',
  options: {
    enableLogging: false,
    enableCaching: false,
  },
};
```

### Unit Testing

```typescript
import { renderHook } from '@testing-library/react';
import { DataProviderProvider, useDataProvider } from '@react-superadmin/web';

test('should use mock provider by default', () => {
  const wrapper = ({ children }) => (
    <DataProviderProvider>{children}</DataProviderProvider>
  );

  const { result } = renderHook(() => useDataProvider(), { wrapper });

  expect(result.current.getConfig().type).toBe('mock');
});
```

## Migration Guide

### From Old Services

If migrating from existing services like `mockService.ts`:

1. **Replace imports**

   ```typescript
   // Old
   import { userService } from '../services/mockService';

   // New
   import { useDataProvider } from '@react-superadmin/web';
   ```

2. **Update method calls**

   ```typescript
   // Old
   const users = await userService.list(params);

   // New
   const { dataProvider } = useDataProvider();
   const result = await dataProvider.getList('users', params);
   const users = result.data;
   ```

3. **Wrap your app**

   ```typescript
   import { DataProviderProvider } from '@react-superadmin/web';

   function App() {
     return (
       <DataProviderProvider>
         <YourApp />
       </DataProviderProvider>
     );
   }
   ```

## Troubleshooting

### Common Issues

1. **Provider not found**
   - Ensure `DataProviderProvider` wraps your app
   - Check that the provider is properly exported

2. **Type errors**
   - Verify all required methods are implemented
   - Check TypeScript configuration

3. **Database connection (Prisma)**
   - Verify `DATABASE_URL` environment variable
   - Check database server is running
   - Run `npx prisma generate` after schema changes

4. **Mock data not persisting**
   - Check localStorage is enabled
   - Verify browser supports localStorage

### Debug Mode

Enable logging to debug provider operations:

```typescript
const config = {
  type: 'mock',
  options: { enableLogging: true },
};
```

This will log all data provider method calls, parameters, and results to the console.

## Best Practices

1. **Always handle errors** - Wrap data provider calls in try-catch
2. **Use TypeScript** - Leverage generic types for better type safety
3. **Implement pagination** - Don't load all data at once
4. **Optimize queries** - Only select needed fields
5. **Test thoroughly** - Test with both mock and real providers
6. **Monitor performance** - Use logging in development
7. **Plan for scaling** - Design with future growth in mind

## Examples

See the `DataProviderDemo` component in `packages/web/src/components/examples/DataProviderDemo.tsx` for a complete working example of data provider usage and switching.

## Next Steps

- [Components](../../components/button) - Explore UI components
- [Quick Start](../../quick-start) - Build your first admin panel
- [Examples](../../examples/basic-usage) - See features in action
- [Developer Guide: Hooks](../../developer/hooks) - Advanced hook usage
