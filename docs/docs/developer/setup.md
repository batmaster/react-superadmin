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
git clone https://github.com/yourusername/react-superadmin.git
cd react-superadmin
```

### 2. Install Dependencies

```bash
pnpm install
```

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

### 1. Making Changes

1. **Create a feature branch** from main
2. **Make your changes** in the appropriate package
3. **Test your changes** locally
4. **Commit your changes** with descriptive messages
5. **Push and create a PR**

### 2. Testing

```bash
# Run tests in all packages
pnpm test

# Run tests in a specific package
pnpm --filter=@react-superadmin/core test
pnpm --filter=@react-superadmin/web test
```

### 3. Building

```bash
# Build all packages
pnpm build

# Build a specific package
pnpm --filter=@react-superadmin/core build
pnpm --filter=@react-superadmin/web build
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

- Check the [GitHub Issues](https://github.com/yourusername/react-superadmin/issues)
- Review the [API documentation](./api)
- Look at [examples](../examples/basic-usage)
- Ask questions in the [Discussions](https://github.com/yourusername/react-superadmin/discussions)

## Next Steps

- Read the [Architecture](./architecture) guide to understand the framework design
- Explore the [API Reference](./api) for detailed component documentation
- Check out [Examples](../examples/basic-usage) to see the framework in action
- Learn about [Custom Components](./components) for extending the framework
