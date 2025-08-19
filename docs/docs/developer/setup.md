---
id: setup
title: Setup
sidebar_label: Setup
keywords: [setup, installation, development, environment, configuration]
---

# Setup

This guide will help you set up your development environment for React SuperAdmin.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **pnpm** (recommended) or npm
- **Git** for version control
- **TypeScript** knowledge (basic understanding)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/batmaster/react-superadmin.git
cd react-superadmin
```

### 2. Install Dependencies

```bash
pnpm install
```

**Note**: The first time you run `pnpm install`, it will automatically run the `prepare` script which sets up Git hooks using Husky. This ensures code quality checks run automatically on commits.

### 3. Start Development Server

```bash
# Start the web application
pnpm dev

# Start the documentation
pnpm docs
```

## Development Environment

### Project Structure

```
react-superadmin/
├── packages/
│   ├── core/           # Core framework logic
│   │   ├── src/
│   │   │   ├── hooks/      # Custom React hooks
│   │   │   ├── contexts/   # React contexts
│   │   │   ├── utils/      # Utility functions
│   │   │   └── types/      # TypeScript types
│   │   └── package.json
│   └── web/            # Web UI components
│       ├── src/
│       │   ├── components/ # UI components
│       │   ├── layout/     # Layout components
│       │   └── forms/      # Form components
│       └── package.json
├── docs/               # Documentation
├── examples/           # Example applications
└── package.json        # Root package.json
```

### Package Scripts

```json
{
  "scripts": {
    "dev": "pnpm --filter=@react-superadmin/web dev",
    "docs": "pnpm --filter=react-superadmin-docs start",
    "build": "pnpm --filter=@react-superadmin/core build && pnpm --filter=@react-superadmin/web build",
    "test": "pnpm --filter=@react-superadmin/core test && pnpm --filter=@react-superadmin/web test",
    "lint": "pnpm --filter=@react-superadmin/core lint && pnpm --filter=@react-superadmin/web lint"
  }
}
```

## Configuration

### TypeScript Configuration

Each package has its own `tsconfig.json`:

```json
{
  "extends": "@tsconfig/docusaurus/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Development
NODE_ENV=development
VITE_API_URL=http://localhost:3001/api

# Production
# NODE_ENV=production
# VITE_API_URL=https://your-api.com/api
```

## Development Workflow

### Git Hooks & Code Quality

The project uses **Husky** to automatically run code quality checks:

- **Pre-commit hook**: Runs `lint-staged` to format and lint staged files
- **Commit-msg hook**: Runs `commitlint` to validate commit message format
- **Automatic setup**: Git hooks are installed when you run `pnpm install`

#### What Happens on Commit

1. **Pre-commit**:
   - Formats TypeScript/TSX files with Prettier
   - Runs ESLint with auto-fix on staged files
   - Formats Markdown and JSON files
2. **Commit-msg**:
   - Validates commit message follows conventional commit format
   - Ensures consistent commit history

### 1. Making Changes

1. **Create a feature branch** from main
2. **Make your changes** in the appropriate package
3. **Test your changes** locally
4. **Commit your changes** with descriptive messages (conventional commit format)
5. **Push and create a PR**

### 2. Testing

```bash
# Run tests in all packages
pnpm test

# Run tests in a specific package
pnpm --filter=@react-superadmin/core test
pnpm --filter=@react-superadmin/web test
```

### 3. Commit Conventions

The project uses **conventional commits** with automatic validation:

```bash
# Format: type(scope): description
feat(core): add new useResource hook
fix(web): resolve button styling issue
docs: update README with new examples
test(core): add tests for validation utility
chore: update dependencies
```

**Types**: `feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `style`, `perf`
**Scope**: Optional package name (e.g., `core`, `web`, `docs`)

### 3. Building

```bash
# Build all packages
pnpm build

# Build a specific package
pnpm --filter=@react-superadmin/core build
pnpm --filter=@react-superadmin/web build
```

## Data Provider Setup

React SuperAdmin includes a flexible data provider system that can be configured for different environments and data sources.

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
    });
    return result.data;
  };
}
```

### Mock Provider (Development)

The mock provider is configured by default and requires no additional setup:

```tsx
import { dataProviderPresets } from '@react-superadmin/web';

<DataProviderProvider initialConfig={dataProviderPresets.development}>
  <YourApp />
</DataProviderProvider>;
```

### Prisma Provider (Production)

1. **Install Prisma dependencies:**

```bash
cd packages/web
pnpm add @prisma/client
pnpm add -D prisma
```

2. **Initialize Prisma:**

```bash
npx prisma init
```

3. **Configure your database schema** in `prisma/schema.prisma`

4. **Generate the Prisma client:**

```bash
npx prisma generate
```

5. **Set environment variables:**

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

6. **Use the Prisma provider:**

```tsx
import { dataProviderPresets } from '@react-superadmin/web';

<DataProviderProvider initialConfig={dataProviderPresets.production}>
  <YourApp />
</DataProviderProvider>;
```

### Environment Configuration

Configure data providers based on your environment:

```tsx
import { getCurrentConfig } from '@react-superadmin/web';

const config = getCurrentConfig();
console.log('Current provider:', config.type);

// Environment-based configuration
const envConfig =
  process.env.NODE_ENV === 'production'
    ? dataProviderPresets.production
    : dataProviderPresets.development;
```

### Custom Data Providers

1. **Implement the DataProvider interface:**

```typescript
import { DataProvider } from '@react-superadmin/core';

export class CustomDataProvider implements DataProvider {
  // Implement all required methods
  async getList<T = any>(
    resource: string,
    params: DataProviderParams
  ): Promise<ListResponse<T>> {
    // Your implementation
  }
  // ... other methods
}
```

2. **Add to the factory:**

```typescript
import { dataProviderFactory } from '@react-superadmin/web';

dataProviderFactory.switchProvider({
  type: 'custom',
  options: {
    /* your options */
  },
});
```

## Adding New Features

### Creating a New Hook

1. Create the hook file in `packages/core/src/hooks/`
2. Export it from `packages/core/src/hooks/index.ts`
3. Add tests in `packages/core/src/hooks/__tests__/`
4. Update documentation

### Creating a New Component

1. Create the component file in `packages/web/src/components/`
2. Add it to the component index
3. Create stories for Storybook (if configured)
4. Add tests and documentation

### Creating a New Package

1. Create the package directory
2. Initialize with `pnpm init`
3. Add to workspace configuration
4. Set up build and test scripts

## Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Find the process using the port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

**Dependencies not found:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules packages/*/node_modules
pnpm install
```

**TypeScript errors:**

```bash
# Check TypeScript configuration
pnpm --filter=@react-superadmin/core typecheck
pnpm --filter=@react-superadmin/web typecheck
```

### Getting Help

- Check the [GitHub Issues](https://github.com/batmaster/react-superadmin/issues)
- Review the [API documentation](./api)
- Look at [examples](../examples/basic-usage)
- Ask questions in the [Discussions](https://github.com/batmaster/react-superadmin/discussions)

## Next Steps

- Read the [Architecture](./architecture) guide to understand the framework design
- Explore the [API Reference](./api) for detailed component documentation
- Check out [Examples](../examples/basic-usage) to see the framework in action
- Learn about [Custom Components](./components) for extending the framework
- Understand [Features: Data Providers](../features/data-providers) for data operations and backend integration
