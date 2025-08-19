# Data Provider Structure

This document outlines the complete data provider architecture that has been implemented in the React SuperAdmin project.

## Overview

The data provider system follows React Admin patterns and provides a flexible, extensible way to handle data operations across different backends.

## Architecture

```
packages/
├── core/
│   ├── src/
│   │   ├── types/
│   │   │   ├── dataProvider.ts          # Core data provider interfaces
│   │   │   └── index.ts                 # Exports all types
│   │   ├── dataProviders/
│   │   │   ├── mockDataProvider.ts      # Mock provider with localStorage
│   │   │   └── index.ts                 # Exports providers
│   │   └── index.ts                     # Main package exports
│   └── package.json
└── web/
    ├── src/
    │   ├── dataProviders/
    │   │   ├── prismaDataProvider.ts    # Prisma-based provider
    │   │   ├── dataProviderFactory.ts   # Factory for switching providers
    │   │   ├── index.ts                 # Exports all providers
    │   │   └── README.md                # Detailed documentation
    │   ├── hooks/
    │   │   └── useDataProvider.ts       # React hook for data providers
    │   ├── config/
    │   │   ├── dataProviderConfig.ts    # Configuration presets
    │   │   └── env.example.ts           # Environment configuration example
    │   ├── components/examples/
    │   │   └── DataProviderDemo.tsx     # Demo component
    │   └── index.ts                     # Main package exports
    └── package.json
```

## Core Components

### 1. Data Provider Interface (`packages/core/src/types/dataProvider.ts`)

Defines the standard interface that all data providers must implement:

```typescript
export interface DataProvider {
  getList: <T = any>(
    resource: string,
    params: DataProviderParams
  ) => Promise<ListResponse<T>>;
  getOne: <T = any>(
    resource: string,
    params: GetOneParams
  ) => Promise<{ data: T }>;
  getMany: <T = any>(
    resource: string,
    params: GetManyParams
  ) => Promise<{ data: T[] }>;
  getManyReference: <T = any>(
    resource: string,
    params: GetManyReferenceParams
  ) => Promise<ListResponse<T>>;
  create: <T = any>(
    resource: string,
    params: CreateParams<T>
  ) => Promise<{ data: T }>;
  update: <T = any>(
    resource: string,
    params: UpdateParams<T>
  ) => Promise<{ data: T }>;
  updateMany: <T = any>(
    resource: string,
    params: UpdateManyParams<T>
  ) => Promise<{ data: (string | number)[] }>;
  delete: <T = any>(
    resource: string,
    params: DeleteParams
  ) => Promise<{ data: T }>;
  deleteMany: <T = any>(
    resource: string,
    params: DeleteManyParams
  ) => Promise<{ data: (string | number)[] }>;
}
```

### 2. Mock Data Provider (`packages/core/src/dataProviders/mockDataProvider.ts`)

A complete mock implementation that:

- Uses localStorage for persistence
- Simulates network delays
- Supports search, filtering, sorting, and pagination
- Includes realistic mock data for users, posts, and products
- Implements all required DataProvider methods

### 3. Prisma Data Provider (`packages/web/src/dataProviders/prismaDataProvider.ts`)

A production-ready provider that:

- Connects to real databases via Prisma ORM
- Automatically handles field selection
- Supports complex filtering and search
- Includes proper error handling
- Manages database connections gracefully

### 4. Data Provider Factory (`packages/web/src/dataProviders/dataProviderFactory.ts`)

A factory pattern implementation that:

- Allows runtime switching between providers
- Supports configuration-based provider selection
- Includes optional logging wrapper
- Maintains singleton instances
- Provides easy provider management

### 5. React Hooks (`packages/web/src/hooks/useDataProvider.ts`)

React integration that provides:

- `useDataProvider()` - Access to current provider and switching methods
- `useDataProviderInstance()` - Direct access to data provider instance
- `DataProviderProvider` - Context provider for the data provider system

### 6. Configuration System (`packages/web/src/config/dataProviderConfig.ts`)

Environment-based configuration with:

- Development, production, and testing presets
- Environment variable support
- Validation and error checking
- Easy preset switching

## Usage Examples

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

  const fetchUsers = async () => {
    const result = await dataProvider.getList('users', {
      pagination: { page: 1, perPage: 10 },
      sort: { field: 'name', order: 'ASC' },
      filter: { role: 'admin' },
      search: 'john',
    });
    console.log(result.data);
  };
}
```

### Switching Providers

```tsx
import { useDataProvider } from './hooks/useDataProvider';
import { dataProviderPresets } from '../config/dataProviderConfig';

function ProviderSwitcher() {
  const { switchProvider } = useDataProvider();

  const switchToMock = () => {
    switchProvider(dataProviderPresets.mock);
  };

  const switchToPrisma = () => {
    switchProvider(dataProviderPresets.prisma);
  };
}
```

### Environment Configuration

```bash
# Choose data provider type
REACT_APP_DATA_PROVIDER=mock  # or 'prisma'

# Database connection (for Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

## Features

### Mock Provider Features

- ✅ localStorage persistence
- ✅ Realistic network simulation
- ✅ Full CRUD operations
- ✅ Search and filtering
- ✅ Sorting and pagination
- ✅ Error handling
- ✅ TypeScript support

### Prisma Provider Features

- ✅ Database integration
- ✅ Field selection optimization
- ✅ Complex query support
- ✅ Transaction handling
- ✅ Connection management
- ✅ Error handling
- ✅ TypeScript support

### Factory Features

- ✅ Runtime provider switching
- ✅ Configuration management
- ✅ Logging wrapper
- ✅ Singleton pattern
- ✅ Easy integration

### React Integration Features

- ✅ Context-based state management
- ✅ Hook-based API
- ✅ Provider switching
- ✅ Error boundaries
- ✅ Loading states

## Migration Path

### From Old Services

If migrating from the existing `mockService.ts`:

1. **Replace service imports:**

   ```tsx
   // Old
   import { userService } from '../services/mockService';

   // New
   import { useDataProvider } from '../hooks/useDataProvider';
   ```

2. **Update method calls:**

   ```tsx
   // Old
   const users = await userService.list(params);

   // New
   const { dataProvider } = useDataProvider();
   const result = await dataProvider.getList('users', params);
   ```

3. **Wrap your app:**

   ```tsx
   import { DataProviderProvider } from './hooks/useDataProvider';

   function App() {
     return (
       <DataProviderProvider>
         <YourApp />
       </DataProviderProvider>
     );
   }
   ```

## Testing

### Mock Provider Testing

```tsx
const testConfig = {
  type: 'mock',
  options: {
    enableLocalStorage: false,
    enableLogging: false,
  },
};
```

### Prisma Provider Testing

```tsx
const testConfig = {
  type: 'prisma',
  options: {
    enableLogging: false,
    enableCaching: false,
  },
};
```

## Performance Considerations

- **Mock Provider**: Fast for development, no network overhead
- **Prisma Provider**: Optimized database queries with proper indexing
- **Caching**: Enable for production environments
- **Pagination**: Always use for large datasets
- **Field Selection**: Only select needed fields

## Future Extensions

The architecture supports easy extension:

1. **New Providers**: Implement the `DataProvider` interface
2. **Middleware**: Add to the factory for cross-cutting concerns
3. **Caching**: Implement caching layers
4. **Real-time**: Add WebSocket or SSE support
5. **Offline**: Add offline-first capabilities

## Dependencies

### Core Package

- TypeScript interfaces
- No external dependencies

### Web Package

- React hooks and context
- Prisma client (for Prisma provider)
- TypeScript support

## Installation

### For Development

```bash
pnpm dev  # Uses mock provider by default
```

### For Production

```bash
# Set environment variables
REACT_APP_DATA_PROVIDER=prisma
DATABASE_URL="your-database-url"

pnpm build
pnpm start
```

## Troubleshooting

### Common Issues

1. **Provider not found**: Ensure `DataProviderProvider` wraps your app
2. **Type errors**: Check that all required methods are implemented
3. **Database connection**: Verify `DATABASE_URL` is set for Prisma provider
4. **Mock data**: Check localStorage for data persistence

### Debug Mode

Enable logging to debug provider operations:

```tsx
const config = {
  type: 'mock',
  options: { enableLogging: true },
};
```

This will log all data provider method calls, parameters, and results to the console.
