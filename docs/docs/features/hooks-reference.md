---
id: hooks-reference
title: Hooks Reference
sidebar_label: Hooks Reference
keywords: [hooks, reference, react, data, forms, authentication, react-admin]
---

# Hooks Reference

This document provides a comprehensive reference of all React hooks planned for
React SuperAdmin, organized by category and functionality. The reference is
based on [React Admin](https://marmelab.com/react-admin/documentation.html) and
adapted for our framework's architecture.

## 🗄️ Data Management Hooks

### Core Data Hooks

- **`useGetList`** - Fetch a list of records with pagination, filtering, and
  sorting
- **`useInfiniteGetList`** - Fetch paginated data with infinite scroll support
- **`useGetOne`** - Fetch a single record by ID
- **`useGetMany`** - Fetch multiple records by IDs
- **`useGetManyReference`** - Fetch related records for a reference field
- **`useGetTree`** - Fetch hierarchical/tree-structured data

### Mutation Hooks

- **`useCreate`** - Create a new record
- **`useUpdate`** - Update an existing record
- **`useUpdateMany`** - Update multiple records at once
- **`useDelete`** - Delete a single record
- **`useDeleteMany`** - Delete multiple records at once

### Live Data Hooks

- **`useGetListLive`** - Real-time list data with live updates
- **`useGetOneLive`** - Real-time single record data
- **`useGetLocks`** - Get record lock information
- **`useGetLocksLive`** - Real-time lock information

## 🔐 Authentication & Security Hooks

### Authentication Hooks

- **`useAuthenticated`** - Check if user is authenticated
- **`useAuthState`** - Get current authentication state
- **`useLogin`** - Handle user login
- **`useLogout`** - Handle user logout
- **`useGetIdentity`** - Get current user identity
- **`useAuthProvider`** - Access authentication provider methods

### Authorization Hooks

- **`useCanAccess`** - Check if user can access a resource/action
- **`usePermissions`** - Get user permissions and roles
- **`useRefreshAuth`** - Refresh authentication tokens

## 📝 Form & Input Hooks

### Form Management Hooks

- **`useForm`** - Form state management and validation
- **`useFormContext`** - Access form context from child components
- **`useFormState`** - Get current form state
- **`useFormValidation`** - Form validation logic
- **`useFormSubmission`** - Handle form submission

### Input Hooks

- **`useInput`** - Input field state management
- **`useInputValidation`** - Input-specific validation
- **`useInputChange`** - Handle input value changes
- **`useInputFocus`** - Input focus management
- **`useInputError`** - Input error state management

### Form Control Hooks

- **`useCreateContext`** - Create form context
- **`useEditContext`** - Edit form context
- **`useSaveContext`** - Save operation context
- **`useRecordFromLocation`** - Get record data from URL
- **`useRegisterMutationMiddleware`** - Register form middleware
- **`useUnique`** - Ensure unique field values

## 📊 List & Table Hooks

### List Management Hooks

- **`useList`** - List data management
- **`useListContext`** - Access list context
- **`useListController`** - List controller logic
- **`useListFilter`** - List filtering logic
- **`useListSort`** - List sorting logic
- **`useListPagination`** - List pagination logic

### Selection Hooks

- **`useUnselect`** - Unselect a single record
- **`useUnselectAll`** - Unselect all records
- **`useSelectionState`** - Manage record selection state
- **`useBulkActions`** - Handle bulk operations

### Filter & Search Hooks

- **`useFilters`** - Filter state management
- **`useSearch`** - Search functionality
- **`useSavedQueries`** - Saved search queries
- **`useFilterState`** - Filter state persistence

## 🧭 Navigation & Routing Hooks

### Navigation Hooks

- **`useNavigate`** - Programmatic navigation
- **`useLocation`** - Current location information
- **`useParams`** - URL parameters
- **`useQuery`** - URL query parameters
- **`useHistory`** - Browser history management

### Resource Navigation Hooks

- **`useResourceNavigation`** - Resource-specific navigation
- **`useResourceContext`** - Current resource context
- **`useResourceDefinition`** - Resource configuration
- **`useResourcePermissions`** - Resource-level permissions

## 🎨 UI & Theming Hooks

### Theme Hooks

- **`useTheme`** - Current theme information
- **`useThemeToggle`** - Theme switching
- **`useColorScheme`** - Color scheme management
- **`useMediaQuery`** - Responsive design queries
- **`useBreakpoint`** - Current breakpoint detection

### Layout Hooks

- **`useLayout`** - Layout configuration
- **`useSidebar`** - Sidebar state management
- **`useHeader`** - Header configuration
- **`useFooter`** - Footer configuration
- **`useResponsive`** - Responsive behavior

## 🔔 Notification & Feedback Hooks

### Notification Hooks

- **`useNotify`** - Show notifications
- **`useNotificationState`** - Notification state management
- **`useNotificationQueue`** - Notification queuing
- **`useNotificationDismiss`** - Dismiss notifications

### Feedback Hooks

- **`useConfirm`** - Confirmation dialogs
- **`useAlert`** - Alert dialogs
- **`useLoading`** - Loading state management
- **`useProgress`** - Progress tracking

## 🔄 Real-time & Live Hooks

### Live Update Hooks

- **`useSubscribe`** - Subscribe to real-time updates
- **`useSubscribeCallback`** - Subscribe with callback
- **`useSubscribeToRecord`** - Subscribe to record updates
- **`useSubscribeToRecordList`** - Subscribe to list updates
- **`usePublish`** - Publish real-time events

### Lock Management Hooks

- **`useLock`** - Lock a record for editing
- **`useUnlock`** - Unlock a record
- **`useGetLock`** - Get record lock status
- **`useGetLockLive`** - Real-time lock status

## 📱 Preferences & Storage Hooks

### Preference Hooks

- **`useStore`** - Persistent storage
- **`useRemoveFromStore`** - Remove stored preferences
- **`useResetStore`** - Reset stored preferences
- **`useStoreContext`** - Store context access
- **`usePreferences`** - User preferences management

### Local Storage Hooks

- **`useLocalStorage`** - Browser local storage
- **`useSessionStorage`** - Browser session storage
- **`useCookie`** - Cookie management
- **`useStorage`** - Generic storage abstraction

## 🧪 Development & Testing Hooks

### Development Hooks

- **`useDebug`** - Development debugging
- **`usePerformance`** - Performance monitoring
- **`useErrorBoundary`** - Error boundary context
- **`useDevTools`** - Development tools integration

### Testing Hooks

- **`useTestUtils`** - Testing utilities
- **`useMockData`** - Mock data for testing
- **`useTestEnvironment`** - Test environment setup
- **`useTestHelpers`** - Test helper functions

## 🌐 Internationalization Hooks

### i18n Hooks

- **`useTranslate`** - Translation function
- **`useLocaleState`** - Current locale state
- **`useLocale`** - Locale information
- **`useNumberFormat`** - Number formatting
- **`useDateFormat`** - Date formatting

### RTL Support Hooks

- **`useRTL`** - Right-to-left support
- **`useTextDirection`** - Text direction detection
- **`useLayoutDirection`** - Layout direction

## 🔧 Utility & Helper Hooks

### Context Hooks

- **`useRecordContext`** - Record context access
- **`useResourceContext`** - Resource context access
- **`useAdminContext`** - Admin context access
- **`useDataProviderContext`** - Data provider context

### State Management Hooks

- **`useAsync`** - Async operation state
- **`useDebounce`** - Debounced values
- **`useThrottle`** - Throttled values
- **`usePrevious`** - Previous value tracking
- **`useToggle`** - Boolean toggle state

### Effect Hooks

- **`useMount`** - Component mount effect
- **`useUnmount`** - Component unmount effect
- **`useUpdateEffect`** - Update-only effect
- **`useDeepCompareEffect`** - Deep comparison effect

## 🎯 Implementation Priority

### Phase 1: Core Hooks (High Priority)

1. **Data Hooks** - Essential for CRUD operations
2. **Authentication Hooks** - Security foundation
3. **Form Hooks** - Form management
4. **Navigation Hooks** - Basic routing

### Phase 2: Advanced Hooks (Medium Priority)

1. **Live Update Hooks** - Real-time functionality
2. **Advanced Form Hooks** - Complex form scenarios
3. **UI Hooks** - User interface management
4. **Performance Hooks** - Optimization tools

### Phase 3: Specialized Hooks (Lower Priority)

1. **i18n Hooks** - Internationalization
2. **Development Hooks** - Developer experience
3. **Testing Hooks** - Quality assurance
4. **Utility Hooks** - Helper functions

## 🔧 Hook Development Guidelines

### Design Principles

- **Single Responsibility** - Each hook should do one thing well
- **Composability** - Hooks should work together seamlessly
- **Performance** - Optimize for minimal re-renders
- **Type Safety** - Full TypeScript support
- **Error Handling** - Graceful error management

### Implementation Standards

- **Hook Structure** - Consistent naming and organization
- **Dependencies** - Proper dependency array management
- **Cleanup** - Proper cleanup in useEffect
- **Testing** - Comprehensive test coverage
- **Documentation** - Clear usage examples

### Naming Conventions

- **Hooks** - camelCase with 'use' prefix (e.g., `useGetList`)
- **Files** - camelCase (e.g., `useGetList.ts`)
- **Types** - PascalCase with 'Hook' suffix (e.g., `UseGetListHook`)
- **Parameters** - camelCase (e.g., `resourceName`)

### Performance Considerations

- **Memoization** - Use useMemo and useCallback appropriately
- **Dependency Arrays** - Minimize unnecessary re-renders
- **Lazy Loading** - Load data only when needed
- **Caching** - Implement intelligent caching strategies
- **Debouncing** - Debounce expensive operations

## 📚 Usage Examples

### Basic Data Hook Usage

```tsx
import { useGetList } from '@react-superadmin/core';

const UserList = () => {
  const { data, isLoading, error } = useGetList('users', {
    pagination: { page: 1, perPage: 10 },
    sort: { field: 'name', order: 'ASC' },
    filter: { status: 'active' },
  });

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  return <UserTable users={data} />;
};
```

### Form Hook Usage

```tsx
import { useForm, useInput } from '@react-superadmin/core';

const UserForm = () => {
  const form = useForm();
  const nameInput = useInput('name', { required: true });
  const emailInput = useInput('email', { type: 'email' });

  const handleSubmit = form.handleSubmit(data => {
    // Submit form data
  });

  return (
    <form onSubmit={handleSubmit}>
      <input {...nameInput} />
      <input {...emailInput} />
      <button type='submit'>Save</button>
    </form>
  );
};
```

### Authentication Hook Usage

```tsx
import { useAuthenticated, useAuthState } from '@react-superadmin/core';

const ProtectedComponent = () => {
  const { isAuthenticated } = useAuthenticated();
  const { user, loading } = useAuthState();

  if (loading) return <Loading />;
  if (!isAuthenticated) return <Login />;

  return <div>Welcome, {user.name}!</div>;
};
```

---

_This hooks reference serves as a comprehensive guide for implementing the React
SuperAdmin framework. Each hook should be developed with TypeScript,
comprehensive testing, and full documentation._
