# Data Providers

This package provides a flexible data provider system that follows the React Admin patterns for data fetching and manipulation.

## Overview

The data provider system consists of:

1. **Mock Data Provider** - Uses localStorage for persistence, perfect for development and testing
2. **Prisma Data Provider** - Connects to real databases using Prisma ORM
3. **Data Provider Factory** - Allows switching between providers at runtime
4. **React Hooks** - Easy integration with React components

## Quick Start

### Basic Usage

```tsx
import { DataProviderProvider, useDataProvider } from './hooks/useDataProvider';

function App() {
  return (
    <DataProviderProvider>
      <YourApp />
    </DataProviderProvider>
  );
}

function YourComponent() {
  const { dataProvider } = useDataProvider();

  // Use the data provider
  const fetchData = async () => {
    const result = await dataProvider.getList('users', {
      pagination: { page: 1, perPage: 10 },
      sort: { field: 'name', order: 'ASC' },
      filter: { role: 'admin' },
      search: 'john',
    });
    console.log(result);
  };

  return <button onClick={fetchData}>Fetch Users</button>;
}
```

### Switching Data Providers

```tsx
import { useDataProvider } from './hooks/useDataProvider';
import { dataProviderPresets } from '../config/dataProviderConfig';

function DataProviderSwitcher() {
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

## Configuration

### Environment Variables

Set these environment variables to configure the data provider:

```bash
# Choose data provider type
REACT_APP_DATA_PROVIDER=mock  # or 'prisma'

# Database connection (for Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

### Configuration Presets

```tsx
import { dataProviderPresets } from '../config/dataProviderConfig';

// Use preset configurations
const config = dataProviderPresets.development; // mock with logging
const prodConfig = dataProviderPresets.production; // prisma with caching
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

## Mock Data Provider

The mock data provider uses localStorage for persistence and includes:

- **Realistic delays** to simulate network requests
- **Search functionality** across all text fields
- **Filtering** by exact values
- **Sorting** by any field
- **Pagination** with configurable page sizes
- **Data persistence** in localStorage

### Mock Data Structure

```tsx
const mockData = {
  users: [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  ],
  posts: [
    { id: '1', title: 'First Post', content: 'Content...', authorId: '1' },
  ],
};
```

## Prisma Data Provider

The Prisma data provider connects to real databases and includes:

- **Automatic field selection** based on resource configuration
- **Flexible filtering** with Prisma's query builder
- **Search across multiple fields** with case-insensitive matching
- **Proper error handling** with detailed error messages
- **Automatic timestamps** for created/updated fields

### Prisma Setup

1. Install Prisma:

```bash
pnpm add @prisma/client
pnpm add -D prisma
```

2. Initialize Prisma:

```bash
npx prisma init
```

3. Define your schema in `prisma/schema.prisma`

4. Generate the client:

```bash
npx prisma generate
```

### Resource Field Configuration

Configure which fields to include for each resource:

```tsx
const resourceFields = {
  users: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
  posts: ['id', 'title', 'content', 'authorId', 'published', 'createdAt'],
  products: ['id', 'name', 'price', 'category', 'inStock'],
};
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
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Logging

Enable logging to debug data provider operations:

```tsx
const config = {
  type: 'mock',
  options: {
    enableLogging: true,
  },
};
```

This will log all data provider method calls, parameters, and results to the console.

## Testing

For testing, use the mock data provider with localStorage disabled:

```tsx
const testConfig = {
  type: 'mock',
  options: {
    enableLocalStorage: false,
    enableLogging: false,
  },
};
```

## Performance Considerations

- **Mock Provider**: Fast for development, no network overhead
- **Prisma Provider**: Optimized database queries with proper indexing
- **Caching**: Enable caching for production environments
- **Pagination**: Always use pagination for large datasets
- **Field Selection**: Only select needed fields to reduce data transfer

## Migration from Old Services

If you're migrating from the old `mockService.ts`:

1. Replace service calls with data provider methods
2. Update method signatures to match the new interface
3. Use the data provider factory for easy switching
4. Wrap your app with `DataProviderProvider`

```tsx
// Old way
import { userService } from '../services/mockService';
const users = await userService.list(params);

// New way
import { useDataProvider } from '../hooks/useDataProvider';
const { dataProvider } = useDataProvider();
const result = await dataProvider.getList('users', params);
```
