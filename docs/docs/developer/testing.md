---
id: testing
title: Testing
sidebar_label: Testing
keywords:
  [
    testing,
    unit tests,
    integration tests,
    e2e tests,
    jest,
    react testing library,
    cypress,
  ]
---

# Testing

Testing is a critical part of developing with React SuperAdmin. This guide covers testing strategies, tools, and best practices for ensuring your admin applications work correctly.

## Testing Strategy

### Testing Pyramid

```
    /\
   /  \     E2E Tests (Few)
  /____\
 /      \   Integration Tests (Some)
/________\  Unit Tests (Many)
```

- **Unit Tests**: Test individual components, hooks, and utilities in isolation
- **Integration Tests**: Test how components work together
- **E2E Tests**: Test complete user workflows

## Unit Testing

### Testing Components

Use React Testing Library for component testing:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies correct variant classes', () => {
    render(<Button variant="primary">Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-primary');
  });
});
```

### Testing Hooks

Test custom hooks using `@testing-library/react-hooks`:

```tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useResource } from '../hooks/useResource';

describe('useResource Hook', () => {
  test('initializes with default state', () => {
    const { result } = renderHook(() => useResource('users'));

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('fetches data successfully', async () => {
    const mockData = [{ id: 1, name: 'John' }];
    const mockFetch = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useResource('users', { fetch: mockFetch })
    );

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
  });
});
```

### Testing Utilities

Test utility functions directly:

```tsx
import { formatCurrency, validateEmail } from '../utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    test('formats positive numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    test('handles zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    test('handles negative numbers', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });
  });

  describe('validateEmail', () => {
    test('validates correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    test('rejects invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });
});
```

## Integration Testing

### Testing Component Interactions

Test how components work together:

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResourceForm } from '../ResourceForm';
import { ResourceProvider } from '../contexts/ResourceContext';

const TestWrapper = ({ children }) => (
  <ResourceProvider>{children}</ResourceProvider>
);

describe('ResourceForm Integration', () => {
  test('submits form data correctly', async () => {
    const mockSubmit = jest.fn();

    render(
      <TestWrapper>
        <ResourceForm onSubmit={mockSubmit} />
      </TestWrapper>
    );

    // Fill out form
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test Resource' },
    });

    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Test description' },
    });

    // Submit form
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'Test Resource',
        description: 'Test description',
      });
    });
  });
});
```

### Testing Context Providers

Test context behavior:

```tsx
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

const TestComponent = () => {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user?.name || 'Not logged in'}</span>
      <button onClick={() => login({ name: 'Test User' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext Integration', () => {
  test('manages authentication state correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('Not logged in');

    act(() => {
      fireEvent.click(screen.getByText('Login'));
    });

    expect(screen.getByTestId('user')).toHaveTextContent('Test User');

    act(() => {
      fireEvent.click(screen.getByText('Logout'));
    });

    expect(screen.getByTestId('user')).toHaveTextContent('Not logged in');
  });
});
```

## End-to-End Testing

### Using Cypress

Test complete user workflows:

```tsx
// cypress/integration/admin-workflow.spec.ts
describe('Admin Workflow', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.login('admin@example.com', 'password');
  });

  it('creates a new user successfully', () => {
    // Navigate to users page
    cy.visit('/admin/users');

    // Click create button
    cy.get('[data-testid="create-user-btn"]').click();

    // Fill out form
    cy.get('[data-testid="user-name"]').type('John Doe');
    cy.get('[data-testid="user-email"]').type('john@example.com');
    cy.get('[data-testid="user-role"]').select('admin');

    // Submit form
    cy.get('[data-testid="submit-btn"]').click();

    // Verify success
    cy.get('[data-testid="success-message"]').should(
      'contain',
      'User created successfully'
    );

    // Verify user appears in list
    cy.visit('/admin/users');
    cy.get('[data-testid="users-table"]').should('contain', 'John Doe');
  });

  it('edits existing user', () => {
    cy.visit('/admin/users');

    // Find and edit user
    cy.get('[data-testid="edit-user-btn"]').first().click();

    // Update name
    cy.get('[data-testid="user-name"]').clear().type('Updated Name');

    // Save changes
    cy.get('[data-testid="save-btn"]').click();

    // Verify update
    cy.get('[data-testid="success-message"]').should(
      'contain',
      'User updated successfully'
    );
  });
});
```

### Using Playwright

Alternative E2E testing framework:

```tsx
// tests/admin.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    await page.fill('[data-testid="email"]', 'admin@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-btn"]');
  });

  test('should display dashboard after login', async ({ page }) => {
    await expect(page.locator('[data-testid="dashboard"])).toBeVisible();
    await expect(page.locator('[data-testid="welcome-message"])).toContainText('Welcome, Admin');
  });

  test('should navigate between sections', async ({ page }) => {
    // Navigate to users
    await page.click('[data-testid="nav-users"]');
    await expect(page.locator('[data-testid="users-page"])).toBeVisible();

    // Navigate to settings
    await page.click('[data-testid="nav-settings"]');
    await expect(page.locator('[data-testid="settings-page"])).toBeVisible();
  });
});
```

## Testing Best Practices

### 1. Test Behavior, Not Implementation

```tsx
// ❌ Bad: Testing implementation details
test('sets internal state correctly', () => {
  const { result } = renderHook(() => useCounter());
  expect(result.current._internalState).toBe(0);
});

// ✅ Good: Testing behavior
test('increments counter when increment is called', () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});
```

### 2. Use Meaningful Test Descriptions

```tsx
// ❌ Bad: Vague descriptions
test('works correctly', () => {
  // test implementation
});

// ✅ Good: Clear descriptions
test('displays error message when API call fails', () => {
  // test implementation
});
```

### 3. Test Edge Cases

```tsx
describe('DataTable Component', () => {
  test('handles empty data gracefully', () => {
    render(<DataTable data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  test('handles loading state', () => {
    render(<DataTable data={[]} loading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('handles error state', () => {
    render(<DataTable data={[]} error="Failed to load data" />);
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });
});
```

### 4. Mock External Dependencies

```tsx
// Mock API calls
jest.mock('../api/users', () => ({
  fetchUsers: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

// Mock browser APIs
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});
```

## Testing Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Setup Tests

```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';
import 'jest-styled-components';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};
```

## Running Tests

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

### Continuous Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
      - run: npm run build
```

## Common Testing Patterns

### Testing Async Operations

```tsx
test('handles async data loading', async () => {
  const mockFetch = jest.fn().mockResolvedValue({ data: 'test' });

  const { result } = renderHook(() => useAsyncData(mockFetch));

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.data).toBe('test');
});
```

### Testing Form Submissions

```tsx
test('submits form with correct data', async () => {
  const mockSubmit = jest.fn();

  render(<UserForm onSubmit={mockSubmit} />);

  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: 'John Doe' },
  });

  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
    });
  });
});
```

### Testing Error Boundaries

```tsx
test('renders fallback UI when error occurs', () => {
  const ErrorComponent = () => {
    throw new Error('Test error');
  };

  render(
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ErrorComponent />
    </ErrorBoundary>
  );

  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
});
```

## Conclusion

Testing is essential for building reliable React SuperAdmin applications. By following these patterns and best practices, you can ensure your code works correctly and remains maintainable as your application grows.

Remember:

- **Write tests as you develop** - don't leave testing until the end
- **Focus on user behavior** - test what users will actually do
- **Keep tests simple and readable** - complex tests are hard to maintain
- **Use meaningful test data** - make tests realistic and comprehensive

For more advanced testing scenarios, refer to the [React Testing Library documentation](https://testing-library.com/docs/react-testing-library/intro) and [Jest documentation](https://jestjs.io/docs/getting-started).
