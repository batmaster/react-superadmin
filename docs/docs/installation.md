---
id: installation
title: Installation
sidebar_label: Installation
---

# Installation

Get React SuperAdmin up and running in your project quickly and easily.

## Prerequisites

- Node.js 18+ 
- React 18+
- TypeScript 5+ (recommended)

## Package Installation

### Core Package

Install the core package which contains all the essential functionality:

```bash
pnpm add @react-superadmin/core
```

### Web Components

Install the web components for the UI:

```bash
pnpm add @react-superadmin/web
```

### Peer Dependencies

Make sure you have these peer dependencies installed:

```bash
pnpm add react react-dom
pnpm add -D @types/react @types/react-dom
```

## Quick Setup

After installation, you can start using React SuperAdmin immediately:

```tsx
import { SuperAdminProvider, createAdmin } from '@react-superadmin/core';
import { AdminLayout } from '@react-superadmin/web';

const adminConfig = createAdmin({
  title: 'My Admin Panel',
  resources: [],
});

function App() {
  return (
    <SuperAdminProvider config={adminConfig}>
      <AdminLayout>
        <div className="p-6">
          <h1>Welcome to React SuperAdmin!</h1>
        </div>
      </AdminLayout>
    </SuperAdminProvider>
  );
}
```

## Project Structure

After installation, your project structure should look like this:

```
my-admin-app/
├── src/
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── tsconfig.json
```

## Configuration Files

### TypeScript Configuration

Make sure your `tsconfig.json` includes React types:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Vite Configuration (if using Vite)

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

## Next Steps

- [Quick Start](./quick-start) - Build your first admin panel
- [Architecture](./developer/architecture) - Understand the framework architecture
- [Examples](./examples/basic-usage) - See working examples
- [API Reference](./developer/api) - Detailed API documentation
