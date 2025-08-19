# Testing Setup Guide

This guide provides a quick setup for running tests in the React SuperAdmin framework.

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies
pnpm install
```

### 2. Run Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm test:core
pnpm test:web

# Run tests in watch mode
pnpm test:watch

# Generate coverage reports
pnpm test:coverage
```

### 3. Use the Test Script

```bash
# Make script executable (first time only)
chmod +x scripts/test.sh

# Run all tests
./scripts/test.sh

# Run core package tests
./scripts/test.sh core

# Run web tests in watch mode
./scripts/test.sh -w web

# Generate coverage for all packages
./scripts/test.sh -c

# Run tests matching pattern
./scripts/test.sh -p "createResource"
```

## Test Commands

| Command              | Description               |
| -------------------- | ------------------------- |
| `pnpm test`          | Run all tests             |
| `pnpm test:core`     | Run core package tests    |
| `pnpm test:web`      | Run web package tests     |
| `pnpm test:watch`    | Run tests in watch mode   |
| `pnpm test:coverage` | Generate coverage reports |
| `pnpm test:run`      | Use the test script       |

## Test Script Options

| Option           | Description                   |
| ---------------- | ----------------------------- |
| `-h, --help`     | Show help message             |
| `-w, --watch`    | Run tests in watch mode       |
| `-c, --coverage` | Generate coverage reports     |
| `-v, --verbose`  | Run tests with verbose output |
| `-p, --pattern`  | Run tests matching pattern    |

## Examples

```bash
# Basic usage
./scripts/test.sh

# Run specific package
./scripts/test.sh core
./scripts/test.sh web

# Watch mode
./scripts/test.sh -w
./scripts/test.sh -w core

# Coverage
./scripts/test.sh -c
./scripts/test.sh -c web

# Pattern matching
./scripts/test.sh -p "Button"
./scripts/test.sh -p "createResource"

# Verbose output
./scripts/test.sh -v
./scripts/test.sh -v -c
```

## Test Structure

```
packages/
├── core/
│   ├── src/__tests__/
│   │   ├── setup.ts
│   │   ├── utils/
│   │   ├── contexts/
│   │   └── hooks/
│   └── jest.config.js
└── web/
    ├── src/__tests__/
    │   ├── setup.ts
    │   ├── utils/
    │   ├── components/
    │   └── services/
    └── jest.config.js
```

## Coverage Reports

After running `pnpm test:coverage`, view the HTML reports:

```bash
# Open coverage reports
open packages/core/coverage/lcov-report/index.html
open packages/web/coverage/lcov-report/index.html
```

## Troubleshooting

### Common Issues

1. **Tests not running**: Ensure dependencies are installed with `pnpm install`
2. **Import errors**: Check that the core package is built with `pnpm build:core`
3. **Type errors**: Run `pnpm typecheck` to verify TypeScript compilation
4. **Permission denied**: Make test script executable with `chmod +x scripts/test.sh`

### Debug Mode

```bash
# Run tests with debug output
pnpm test -- --verbose

# Run single test file
pnpm test -- packages/core/src/__tests__/utils/createResource.test.ts

# Run tests matching pattern
pnpm test -- --testNamePattern="createResource"
```

## Next Steps

- Read the [Testing Guide](./testing.md) for detailed testing strategies
- Check the [Contributing Guide](../CONTRIBUTING.md) for development guidelines
- Explore existing tests in the `__tests__` directories
- Write tests for new components and features

## Support

If you encounter issues with testing:

1. Check the console output for error messages
2. Verify all dependencies are installed
3. Ensure the core package is built
4. Check the Jest configuration files
5. Open an issue with detailed error information
