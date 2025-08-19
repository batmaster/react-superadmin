# Testing Guide

This guide covers testing strategies, coding standards, and best practices for the React SuperAdmin framework.

## Table of Contents

- [Testing Setup](#testing-setup)
- [Testing Philosophy](#testing-philosophy)
- [Testing Structure](#testing-structure)
- [What to Test](#what-to-test)
- [Testing Patterns](#testing-patterns)
- [Component Testing](#component-testing)
- [Hook Testing](#hook-testing)
- [Utility Testing](#utility-testing)
- [Context Testing](#context-testing)
- [Mocking Strategies](#mocking-strategies)
- [Test Coverage](#test-coverage)
- [Running Tests](#running-tests)

## Testing Setup

### Prerequisites

The framework uses the following testing stack:

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for Node.js
- **ts-jest** - TypeScript support for Jest

### Installation

Testing dependencies are already included in both packages:

```bash
# Core package
cd packages/core
pnpm install

# Web package
cd packages/web
pnpm install
```

### Configuration

Each package has its own Jest configuration:

- `packages/core/jest.config.js` - Core package testing
- `packages/web/jest.config.js` - Web package testing

## Testing Philosophy

### Core Principles

1. **Test Behavior, Not Implementation** - Focus on what the code does, not how it does it
2. **User-Centric Testing** - Test from the user's perspective
3. **Maintainable Tests** - Write tests that are easy to understand and modify
4. **Comprehensive Coverage** - Test all critical paths and edge cases
5. **Fast Execution** - Keep tests fast and focused

### Testing Pyramid

```
    /\
   /  \     E2E Tests (Few)
  /____\
 /      \   Integration Tests (Some)
/________\  Unit Tests (Many)
```

## Testing Structure

### File Organization

```
src/
├── __tests__/           # Test files
│   ├── setup.ts         # Test configuration
│   ├── utils/           # Test utilities
│   │   └── test-utils.tsx
│   ├── components/      # Component tests
│   ├── hooks/           # Hook tests
│   ├── contexts/        # Context tests
│   └── utils/           # Utility tests
├── components/          # Source components
├── hooks/              # Source hooks
└── utils/              # Source utilities
```

### Naming Conventions

- **Test files**: `ComponentName.test.tsx` or `ComponentName.spec.tsx`
- **Test suites**: `describe('ComponentName', () => {})`
- **Test cases**: `it('should do something', () => {})`
- **Test utilities**: `__tests__/utils/`

## What to Test

### Core Package

#### Utilities (`packages/core/src/utils/`)

**createResource**

- ✅ Creates resource with default values
- ✅ Overrides default permissions
- ✅ Handles custom views
- ✅ Validates required fields
- ✅ Generates unique resource names

**createAdmin**

- ✅ Creates admin config with defaults
- ✅ Merges custom theme/layout/auth
- ✅ Handles multiple resources
- ✅ Preserves all provided options

**Validation**

- ✅ Field validation rules
- ✅ Form validation
- ✅ Error message generation
- ✅ Required field handling

**Formatting**

- ✅ Date formatting
- ✅ Currency formatting
- ✅ Number formatting
- ✅ Text transformations

#### Contexts (`packages/core/src/contexts/`)

**SuperAdminContext**

- ✅ Provides context values
- ✅ Merges default and custom configs
- ✅ Handles user state changes
- ✅ Converts resources array to object
- ✅ Error handling outside provider

#### Hooks (`packages/core/src/hooks/`)

**useSuperAdmin**

- ✅ Returns context values
- ✅ Handles missing context
- ✅ Provides user state
- ✅ Exposes logout function

**useResource**

- ✅ CRUD operations
- ✅ Loading states
- ✅ Error handling
- ✅ Data persistence

**useForm**

- ✅ Form state management
- ✅ Field validation
- ✅ Error handling
- ✅ Form submission

**useTable**

- ✅ Data sorting
- ✅ Pagination
- ✅ Row selection
- ✅ Data filtering

### Web Package

#### Components (`packages/web/src/components/`)

**Layout Components**

- ✅ AdminLayout rendering
- ✅ Sidebar navigation
- ✅ Header functionality
- ✅ Footer display
- ✅ Responsive behavior

**CRUD Components**

- ✅ ResourceList data display
- ✅ ResourceForm field rendering
- ✅ ResourceShow detail view
- ✅ DataTable interactions
- ✅ Search and filtering

**UI Components**

- ✅ Button variants and states
- ✅ Form field rendering
- ✅ Modal functionality
- ✅ Badge styling
- ✅ Card layout

#### Services (`packages/web/src/services/`)

**MockService**

- ✅ CRUD operations
- ✅ Data persistence
- ✅ Search functionality
- ✅ Pagination
- ✅ Error handling

## Testing Patterns

### Component Testing Pattern

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  const defaultProps = {
    // Define default props
  };

  it('should render correctly', () => {
    render(<ComponentName {...defaultProps} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    render(<ComponentName {...defaultProps} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });

  it('should handle edge cases', () => {
    render(<ComponentName {...defaultProps} />);
    // Test edge cases
  });
});
```

### Hook Testing Pattern

```tsx
import { renderHook, act } from '@testing-library/react';
import { useHookName } from '../useHookName';

describe('useHookName', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useHookName());
    expect(result.current.value).toBe(initialValue);
  });

  it('should update state when called', () => {
    const { result } = renderHook(() => useHookName());

    act(() => {
      result.current.updateValue('new value');
    });

    expect(result.current.value).toBe('new value');
  });
});
```

### Utility Testing Pattern

```tsx
import { utilityFunction } from '../utilityFunction';

describe('utilityFunction', () => {
  it('should handle normal input', () => {
    const result = utilityFunction('input');
    expect(result).toBe('expected output');
  });

  it('should handle edge cases', () => {
    const result = utilityFunction('');
    expect(result).toBe('default output');
  });

  it('should handle invalid input', () => {
    expect(() => utilityFunction(null)).toThrow('Invalid input');
  });
});
```

## Component Testing

### Testing Strategy

1. **Render Testing** - Verify component renders without errors
2. **Props Testing** - Test different prop combinations
3. **User Interaction Testing** - Test clicks, form inputs, navigation
4. **State Testing** - Verify state changes correctly
5. **Error Handling** - Test error states and edge cases

### Example: Button Component Test

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ui/Button';

describe('Button', () => {
  const defaultProps = {
    children: 'Click me',
    onClick: jest.fn(),
  };

  it('should render with default variant', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary-600');
  });

  it('should render with different variants', () => {
    render(<Button {...defaultProps} variant="outline" />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('border border-gray-300');
  });

  it('should handle click events', () => {
    const onClick = jest.fn();
    render(<Button {...defaultProps} onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should show loading state', () => {
    render(<Button {...defaultProps} loading={true} />);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

## Hook Testing

### Testing Strategy

1. **Initial State** - Verify hook returns expected initial values
2. **State Updates** - Test state changes and side effects
3. **Dependencies** - Test hook behavior with different dependencies
4. **Cleanup** - Verify cleanup functions work correctly
5. **Error Handling** - Test error states and exceptions

### Example: useResource Hook Test

```tsx
import { renderHook, act, waitFor } from '@testing-library/react';
import { useResource } from '../hooks/useResource';

describe('useResource', () => {
  const mockService = {
    list: jest.fn(),
    create: jest.fn(),
    read: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useResource({ service: mockService }));

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should load data on mount', async () => {
    const mockData = [{ id: '1', name: 'Test' }];
    mockService.list.mockResolvedValue({ data: mockData, total: 1 });

    const { result } = renderHook(() => useResource({ service: mockService }));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });

    expect(mockService.list).toHaveBeenCalled();
  });

  it('should handle create operation', async () => {
    const newItem = { name: 'New Item' };
    mockService.create.mockResolvedValue({ id: '2', ...newItem });

    const { result } = renderHook(() => useResource({ service: mockService }));

    await act(async () => {
      await result.current.create(newItem);
    });

    expect(mockService.create).toHaveBeenCalledWith(newItem);
  });
});
```

## Utility Testing

### Testing Strategy

1. **Input Validation** - Test with valid and invalid inputs
2. **Edge Cases** - Test boundary conditions
3. **Error Handling** - Test error scenarios
4. **Performance** - Test with large datasets
5. **Side Effects** - Verify no unintended side effects

### Example: Validation Utility Test

```tsx
import { validateField, validateForm } from '../utils/validation';

describe('Validation Utils', () => {
  describe('validateField', () => {
    it('should validate required fields', () => {
      const field = { name: 'name', label: 'Name', required: true };
      const value = '';

      const result = validateField(field, value);

      expect(result).toBe('Name is required');
    });

    it('should validate email format', () => {
      const field = { name: 'email', label: 'Email', type: 'email' };
      const value = 'invalid-email';

      const result = validateField(field, value);

      expect(result).toBe('Please enter a valid email address');
    });

    it('should pass validation for valid input', () => {
      const field = { name: 'name', label: 'Name', required: true };
      const value = 'John Doe';

      const result = validateField(field, value);

      expect(result).toBeNull();
    });
  });

  describe('validateForm', () => {
    it('should validate multiple fields', () => {
      const fields = [
        { name: 'name', label: 'Name', required: true },
        { name: 'email', label: 'Email', type: 'email' },
      ];
      const data = { name: '', email: 'invalid' };

      const result = validateForm(fields, data);

      expect(result.name).toBe('Name is required');
      expect(result.email).toBe('Please enter a valid email address');
    });
  });
});
```

## Context Testing

### Testing Strategy

1. **Provider Rendering** - Test context provider renders correctly
2. **Context Values** - Verify context provides expected values
3. **State Updates** - Test context state changes
4. **Consumer Behavior** - Test components using the context
5. **Error Boundaries** - Test context error handling

### Example: SuperAdminContext Test

```tsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import {
  SuperAdminProvider,
  useSuperAdmin,
} from '../contexts/SuperAdminContext';

const TestComponent = () => {
  const context = useSuperAdmin();
  return (
    <div>
      <div data-testid="title">{context.config.title}</div>
      <div data-testid="resources-count">
        {Object.keys(context.resources).length}
      </div>
    </div>
  );
};

describe('SuperAdminContext', () => {
  it('should provide context values', () => {
    const config = { title: 'Test Admin', resources: [] };

    render(
      <SuperAdminProvider config={config}>
        <TestComponent />
      </SuperAdminProvider>
    );

    expect(screen.getByTestId('title')).toHaveTextContent('Test Admin');
    expect(screen.getByTestId('resources-count')).toHaveTextContent('0');
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useSuperAdmin must be used within a SuperAdminProvider');
  });
});
```

## Mocking Strategies

### Service Mocking

```tsx
// Create mock service
const mockUserService = {
  list: jest.fn(),
  create: jest.fn(),
  read: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Mock implementation
mockUserService.list.mockResolvedValue({
  data: [{ id: '1', name: 'John' }],
  total: 1,
  page: 1,
  limit: 10,
});
```

### API Mocking

```tsx
// Mock fetch
global.fetch = jest.fn();

// Mock successful response
(global.fetch as jest.Mock).mockResolvedValue({
  ok: true,
  json: async () => ({ data: 'test' }),
});

// Mock error response
(global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));
```

### Component Mocking

```tsx
// Mock child components
jest.mock('../ChildComponent', () => ({
  ChildComponent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mocked-child">{children}</div>
  ),
}));
```

## Test Coverage

### Coverage Goals

- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 90%+
- **Lines**: 90%+

### Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage

# View HTML coverage report
open packages/core/coverage/lcov-report/index.html
open packages/web/coverage/lcov-report/index.html
```

### Coverage Configuration

```javascript
// jest.config.js
collectCoverageFrom: [
  'src/**/*.{ts,tsx}',
  '!src/**/*.d.ts',
  '!src/**/index.ts',
  '!src/**/*.stories.tsx',
],
```

## Running Tests

### Commands

```bash
# Run all tests
pnpm test

# Run core package tests
pnpm test:core

# Run web package tests
pnpm test:web

# Run tests in watch mode
pnpm test:watch

# Generate coverage reports
pnpm test:coverage

# Run specific test file
pnpm test -- packages/core/src/__tests__/utils/createResource.test.ts

# Run tests matching pattern
pnpm test -- --testNamePattern="createResource"
```

### Test Environment

Tests run in a jsdom environment that simulates a browser:

- DOM APIs available
- localStorage mocked
- fetch API mocked
- Browser events supported

### Debugging Tests

```bash
# Run tests with debug output
pnpm test -- --verbose

# Run single test with debugger
pnpm test -- --runInBand --no-cache --verbose

# Use console.log in tests
console.log('Debug info:', variable);
```

## Best Practices

### Test Organization

1. **Group related tests** in describe blocks
2. **Use descriptive test names** that explain the behavior
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Keep tests focused** on single behavior
5. **Use beforeEach/afterEach** for setup/cleanup

### Test Data

1. **Create realistic test data** that matches production
2. **Use factories** for generating test objects
3. **Avoid hardcoded values** in assertions
4. **Clean up test data** after each test

### Assertions

1. **Test one thing per test case**
2. **Use specific assertions** (toBe, toEqual, toContain)
3. **Test both positive and negative cases**
4. **Verify error messages** and error states

### Performance

1. **Mock expensive operations** (API calls, file I/O)
2. **Use test isolation** to avoid test interference
3. **Clean up resources** after tests
4. **Avoid testing implementation details**

## Common Testing Patterns

### Async Testing

```tsx
it('should handle async operations', async () => {
  const { result } = renderHook(() => useAsyncHook());

  await act(async () => {
    await result.current.loadData();
  });

  expect(result.current.data).toBeDefined();
});
```

### User Event Testing

```tsx
import userEvent from '@testing-library/user-event';

it('should handle user input', async () => {
  const user = userEvent.setup();
  render(<FormComponent />);

  const input = screen.getByRole('textbox');
  await user.type(input, 'test input');

  expect(input).toHaveValue('test input');
});
```

### Snapshot Testing

```tsx
it('should match snapshot', () => {
  const { container } = render(<Component />);
  expect(container).toMatchSnapshot();
});
```

This comprehensive testing guide ensures that all parts of the React SuperAdmin framework are thoroughly tested, maintainable, and reliable.
