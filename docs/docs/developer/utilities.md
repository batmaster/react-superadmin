---
id: utilities
title: Utilities
sidebar_label: Utilities
keywords: [utilities, helpers, functions, development, tools]
---

# Utilities

Learn about the utility functions and helper tools available in React SuperAdmin.

## Core Utilities

### Validation Utilities

```typescript
import { 
  validateEmail, 
  validateRequired, 
  validateLength,
  validatePattern,
  validateUrl 
} from '@react-superadmin/core';

// Email validation
const isValidEmail = validateEmail('user@example.com'); // true
const isInvalidEmail = validateEmail('invalid-email'); // false

// Required field validation
const isRequired = validateRequired('some value'); // true
const isEmpty = validateRequired(''); // false

// Length validation
const isValidLength = validateLength('password', { min: 8, max: 20 }); // true
const tooShort = validateLength('pass', { min: 8 }); // false

// Pattern validation
const isValidPhone = validatePattern('123-456-7890', /^\d{3}-\d{3}-\d{4}$/); // true

// URL validation
const isValidUrl = validateUrl('https://example.com'); // true
const isInvalidUrl = validateUrl('not-a-url'); // false
```

### Formatting Utilities

```typescript
import { 
  formatDate, 
  formatCurrency, 
  formatNumber,
  formatFileSize,
  formatDuration 
} from '@react-superadmin/core';

// Date formatting
const formattedDate = formatDate(new Date(), 'MMM dd, yyyy'); // "Aug 19, 2025"
const relativeDate = formatDate(new Date(), 'relative'); // "2 hours ago"

// Currency formatting
const formattedCurrency = formatCurrency(1234.56, 'USD'); // "$1,234.56"
const euroCurrency = formatCurrency(999.99, 'EUR'); // "€999.99"

// Number formatting
const formattedNumber = formatNumber(1234567, { 
  style: 'decimal',
  minimumFractionDigits: 2 
}); // "1,234,567.00"

// File size formatting
const fileSize = formatFileSize(1024 * 1024); // "1 MB"
const smallFile = formatFileSize(512); // "512 B"

// Duration formatting
const duration = formatDuration(3661); // "1h 1m 1s"
const shortDuration = formatDuration(45); // "45s"
```

### String Utilities

```typescript
import { 
  capitalize, 
  truncate, 
  slugify,
  generateId,
  escapeHtml 
} from '@react-superadmin/core';

// String capitalization
const title = capitalize('hello world'); // "Hello World"
const sentence = capitalize('this is a sentence.'); // "This is a sentence."

// String truncation
const truncated = truncate('This is a very long string that needs truncation', 20); 
// "This is a very long..."

// Slug generation
const slug = slugify('Hello World! How are you?'); // "hello-world-how-are-you"

// ID generation
const id = generateId(); // "rsa_abc123def456"
const customId = generateId('user'); // "user_abc123def456"

// HTML escaping
const escaped = escapeHtml('<script>alert("xss")</script>'); 
// "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
```

### Array Utilities

```typescript
import { 
  groupBy, 
  sortBy, 
  unique,
  chunk,
  flatten 
} from '@react-superadmin/core';

// Group array by property
const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' },
  { id: 3, name: 'Charlie', role: 'admin' }
];

const groupedByRole = groupBy(users, 'role');
// {
//   admin: [{ id: 1, name: 'Alice', role: 'admin' }, { id: 3, name: 'Charlie', role: 'admin' }],
//   user: [{ id: 2, name: 'Bob', role: 'user' }]
// }

// Sort array by property
const sortedUsers = sortBy(users, 'name'); // Sorted alphabetically by name

// Remove duplicates
const numbers = [1, 2, 2, 3, 3, 4];
const uniqueNumbers = unique(numbers); // [1, 2, 3, 4]

// Split array into chunks
const chunked = chunk(numbers, 2); // [[1, 2], [2, 3], [3, 4]]

// Flatten nested arrays
const nested = [[1, 2], [3, [4, 5]]];
const flattened = flatten(nested); // [1, 2, 3, 4, 5]
```

### Object Utilities

```typescript
import { 
  pick, 
  omit, 
  deepClone,
  merge,
  isEmpty 
} from '@react-superadmin/core';

// Pick specific properties
const user = { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' };
const publicUser = pick(user, ['id', 'name']); // { id: 1, name: 'Alice' }

// Omit specific properties
const privateUser = omit(user, ['email', 'role']); // { id: 1, name: 'Alice' }

// Deep clone object
const clonedUser = deepClone(user); // New object with all nested properties cloned

// Merge objects
const defaults = { theme: 'light', language: 'en' };
const userPrefs = { theme: 'dark' };
const merged = merge(defaults, userPrefs); // { theme: 'dark', language: 'en' }

// Check if object is empty
const emptyObj = isEmpty({}); // true
const nonEmptyObj = isEmpty({ key: 'value' }); // false
```

## API Utilities

### HTTP Client

```typescript
import { apiClient } from '@react-superadmin/core';

// GET request
const users = await apiClient.get('/users');

// POST request
const newUser = await apiClient.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT request
const updatedUser = await apiClient.put('/users/123', {
  name: 'John Smith'
});

// DELETE request
await apiClient.delete('/users/123');

// With query parameters
const filteredUsers = await apiClient.get('/users', {
  params: { role: 'admin', limit: 10 }
});

// With custom headers
const response = await apiClient.get('/protected', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Request Interceptors

```typescript
import { apiClient } from '@react-superadmin/core';

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token to all requests
    if (localStorage.getItem('token')) {
      config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Handle errors (e.g., redirect to login on 401)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Storage Utilities

### Local Storage

```typescript
import { 
  storage,
  storageKeys 
} from '@react-superadmin/core';

// Set item
storage.set('user', { id: 1, name: 'Alice' });

// Get item
const user = storage.get('user'); // { id: 1, name: 'Alice' }

// Remove item
storage.remove('user');

// Clear all
storage.clear();

// Check if key exists
const hasUser = storage.has('user'); // false

// Get all keys
const keys = storage.keys(); // ['theme', 'language']

// Get storage size
const size = storage.size(); // 2
```

### Session Storage

```typescript
import { sessionStorage } from '@react-superadmin/core';

// Similar API to localStorage but for session storage
sessionStorage.set('tempData', { value: 'temporary' });
const tempData = sessionStorage.get('tempData');
```

## Error Handling Utilities

### Error Classes

```typescript
import { 
  ApiError, 
  ValidationError, 
  NetworkError 
} from '@react-superadmin/core';

// API Error
try {
  await apiClient.get('/invalid-endpoint');
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message, error.status);
    // Handle API-specific errors
  }
}

// Validation Error
try {
  validateUserData(invalidData);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation errors:', error.errors);
    // Handle validation errors
  }
}

// Network Error
try {
  await apiClient.get('/api');
} catch (error) {
  if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
    // Handle network errors
  }
}
```

### Error Handler

```typescript
import { errorHandler } from '@react-superadmin/core';

// Global error handler
errorHandler.setHandler((error, context) => {
  console.error('Global error:', error);
  
  if (error instanceof ApiError && error.status === 401) {
    // Handle unauthorized
    redirectToLogin();
  } else if (error instanceof ValidationError) {
    // Handle validation errors
    showValidationErrors(error.errors);
  } else {
    // Handle other errors
    showGenericError(error.message);
  }
});

// Error boundary
errorHandler.setBoundary((error, errorInfo) => {
  // Log error to monitoring service
  logErrorToService(error, errorInfo);
});
```

## Performance Utilities

### Debounce

```typescript
import { debounce } from '@react-superadmin/core';

// Debounce function calls
const debouncedSearch = debounce((query) => {
  performSearch(query);
}, 300);

// Use in input change handler
input.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### Throttle

```typescript
import { throttle } from '@react-superadmin/core';

// Throttle function calls
const throttledScroll = throttle(() => {
  updateScrollPosition();
}, 100);

// Use in scroll handler
window.addEventListener('scroll', throttledScroll);
```

### Memoization

```typescript
import { memoize } from '@react-superadmin/core';

// Memoize expensive function
const expensiveCalculation = memoize((input) => {
  // Complex calculation
  return input * input * input;
});

// First call performs calculation
const result1 = expensiveCalculation(5); // Calculates

// Second call with same input returns cached result
const result2 = expensiveCalculation(5); // Returns cached result
```

## Testing Utilities

### Test Helpers

```typescript
import { 
  createMockUser, 
  createMockResource,
  renderWithProviders 
} from '@react-superadmin/core/testing';

// Create mock data
const mockUser = createMockUser({
  id: '1',
  name: 'Test User',
  email: 'test@example.com'
});

const mockResource = createMockResource('users', [
  mockUser,
  createMockUser({ id: '2', name: 'Another User' })
]);

// Render component with providers
const { result } = renderWithProviders(<UserList />, {
  initialData: mockResource
});
```

### Mock API

```typescript
import { mockApi } from '@react-superadmin/core/testing';

// Mock API responses
mockApi.get('/users', {
  status: 200,
  data: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]
});

mockApi.post('/users', {
  status: 201,
  data: { id: 3, name: 'Charlie' }
});

// Mock API errors
mockApi.get('/users/999', {
  status: 404,
  data: { message: 'User not found' }
});
```

## Best Practices

1. **Import Only What You Need**: Import specific utilities instead of the entire module
2. **Use TypeScript**: Leverage TypeScript for better type safety
3. **Handle Errors**: Always handle potential errors from utility functions
4. **Performance**: Use performance utilities like debounce and throttle appropriately
5. **Testing**: Use testing utilities to create consistent test data
6. **Documentation**: Document custom utilities following the same patterns
7. **Reusability**: Create utilities that can be reused across components
8. **Consistency**: Follow the established patterns for utility functions

## Examples

Check out the [Examples](../examples/basic-usage) section to see these utilities in action, or explore the [API Reference](./api) for detailed utility documentation.
