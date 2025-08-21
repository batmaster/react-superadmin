---
id: components-reference
title: Components Reference
sidebar_label: Components Reference
keywords: [components, reference, ui, forms, data, navigation, react-admin]
---

# Components Reference

This document provides a comprehensive reference of all components planned for
React SuperAdmin, organized by category and functionality. The reference is
based on [React Admin](https://marmelab.com/react-admin/documentation.html) and
adapted for our framework's architecture.

## 📊 Status Legend

- **✅** = Complete (Code + Testing + Documentation)
- **(TO DO)** = Task created, ready for development
- **(Planned)** = Identified from React Admin reference, needs task creation
- **(In Progress)** = Partially implemented

## 🏗️ App Configuration

### Core Framework Components

- **Admin** ✅ - Main application wrapper that provides context and
  configuration
- **Resource** ✅ - Defines a data resource with its CRUD operations
- **CustomRoutes** (TO DO) - Custom routing outside of resource-based routes
- **Layout** ✅ - Main layout wrapper

## 🔌 Data Fetching

### Data Provider Setup

- **DataProvider Interface** ✅ - Core data provider interface
- **REST API Data Provider** (TO DO) - RESTful API data provider
- **GraphQL Data Provider** (TO DO) - GraphQL API data provider
- **Mock Data Provider** ✅ - Development mock data provider

### Data Provider Hooks

- **useDataProvider** ✅ - Access data provider instance
- **useGetList** ✅ - Fetch list of records
- **useInfiniteGetList** (Planned) - Infinite scroll data fetching
- **useGetOne** ✅ - Fetch single record
- **useGetMany** ✅ - Fetch multiple records by IDs
- **useGetManyReference** ✅ - Fetch related records
- **useCreate** ✅ - Create new record
- **useUpdate** ✅ - Update existing record
- **useUpdateMany** (Planned) - Update multiple records
- **useDelete** ✅ - Delete record
- **useDeleteMany** (Planned) - Delete multiple records
- **useGetTree** (Planned) - Fetch hierarchical data
- **withLifecycleCallbacks** (Planned) - Add lifecycle callbacks
- **fetchJson** (Planned) - HTTP fetch utility

## 🔐 Security

### Authentication

- **Auth Provider Setup** (TO DO) - Authentication provider configuration
- **Login Component** (TO DO) - Login form component
- **RBAC System** (TO DO) - Role-based access control

### Security Hooks

- **useAuthenticated** ✅ - Check authentication status
- **useAuthState** ✅ - Get authentication state
- **useLogin** (Planned) - Login functionality
- **useLogout** (Planned) - Logout functionality
- **useGetIdentity** (Planned) - Get user identity
- **useCanAccess** (Planned) - Check permissions
- **usePermissions** (Planned) - Get user permissions
- **useAuthProvider** (Planned) - Access auth provider

## 📋 List Page

### List Components

- **List** (TO DO) - Main list page wrapper
- **ListBase** (Planned) - Base list component without UI
- **ListGuesser** (Planned) - Auto-generated list component
- **InfiniteList** (Planned) - Infinite scroll list
- **Tree** (Planned) - Hierarchical data display
- **TreeWithDetails** (Planned) - Tree with expandable details

### Data Display

- **DataTable** ✅ - Basic data table component
- **DataGrid** ✅ - Advanced data table with sorting, filtering, pagination
- **Datagrid** (Planned) - React Admin style datagrid
- **DatagridAG** (Planned) - AG Grid integration
- **SimpleList** (Planned) - Basic list display optimized for mobile
- **SingleFieldList** (Planned) - Single field list display
- **EditableDatagrid** (Planned) - Inline editing data grid
- **Calendar** (Planned) - Date-based data visualization
- **Scheduler** (Planned) - Event scheduling interface

### Filtering & Search

- **FilterButton** (Planned) - Filter toggle button
- **FilterList** (Planned) - Filter list component
- **FilterLiveForm** (Planned) - Live filter form
- **FilterLiveSearch** (Planned) - Live search filter
- **SavedQueriesList** (Planned) - Saved queries list
- **StackedFilters** (Planned) - Stacked filter display
- **FilterBar** ✅ - Filter controls bar
- **SearchBar** ✅ - Search input component

### Pagination & Sorting

- **Pagination** ✅ - Page navigation component
- **SortButton** (Planned) - Column sorting button
- **SelectColumnsButton** (Planned) - Column visibility selector
- **Count** (Planned) - Record count display

### List Hooks

- **useListContext** (Planned) - Access list context
- **useList** (Planned) - List state management
- **useListController** (Planned) - List controller logic
- **useUnselect** (Planned) - Unselect items
- **useUnselectAll** (Planned) - Unselect all items

## ✏️ Creation & Edition Pages

### Page Components

- **Create** (TO DO) - Create page wrapper
- **CreateBase** (Planned) - Base create component without UI
- **Edit** (TO DO) - Edit page wrapper
- **EditBase** (Planned) - Base edit component without UI
- **EditGuesser** (Planned) - Auto-generated edit component
- **EditDialog** (Planned) - Edit in dialog modal
- **EditInDialogButton** (Planned) - Button to open edit dialog
- **CreateDialog** (Planned) - Create in dialog modal
- **CreateInDialogButton** (Planned) - Button to open create dialog

### Form Components

- **SimpleForm** ✅ - Basic form layout
- **TabbedForm** ✅ - Multi-tab form layout
- **Form** ✅ - Base form component
- **LongForm** (Planned) - Scrollable long form
- **AccordionForm** (Planned) - Collapsible form sections
- **WizardForm** (Planned) - Multi-step form wizard
- **JsonSchemaForm** (Planned) - Schema-driven forms

### Form Elements

- **Toolbar** (Planned) - Form toolbar with actions
- **SaveButton** (Planned) - Form save button
- **AutoPersistInStore** (Planned) - Auto-save to store
- **AutoSave** (Planned) - Auto-save functionality
- **FormFillerButton** (Planned) - Form auto-fill button

### Form Hooks

- **useCreateContext** (Planned) - Access create context
- **useCreateController** (Planned) - Create controller logic
- **useEditContext** (Planned) - Access edit context
- **useEditController** (Planned) - Edit controller logic
- **useSaveContext** (Planned) - Access save context
- **useRecordFromLocation** (Planned) - Get record from URL
- **useRegisterMutationMiddleware** (Planned) - Register mutation middleware
- **useUnique** (Planned) - Unique field validation

## 👁️ Show Page

### Show Components

- **Show** (TO DO) - Show page wrapper
- **ShowBase** (Planned) - Base show component without UI
- **ShowGuesser** (Planned) - Auto-generated show component
- **SimpleShowLayout** (Planned) - Simple show layout
- **TabbedShowLayout** (Planned) - Tabbed show layout
- **Labeled** (Planned) - Labeled field wrapper
- **ShowDialog** (Planned) - Show in dialog modal
- **ShowInDialogButton** (Planned) - Button to open show dialog

### Show Hooks

- **useShowContext** (Planned) - Access show context
- **useShowController** (Planned) - Show controller logic

## 🔄 Common

### Common Components

- **WithRecord** (Planned) - Record context provider

### Common Hooks

- **useRecordContext** (Planned) - Access record context
- **useGetRecordId** (Planned) - Get current record ID
- **useNotify** (Planned) - Show notifications
- **useRedirect** (Planned) - Redirect functionality
- **useRefresh** (Planned) - Refresh data

## 🔖 Fields

### Basic Fields

- **ArrayField** (Planned) - Display array data
- **BooleanField** (Planned) - Display boolean values
- **ChipField** (Planned) - Display tags or chips
- **DateField** (Planned) - Display dates with formatting
- **EmailField** (Planned) - Display email addresses
- **FileField** (Planned) - Display file information
- **FunctionField** (Planned) - Display computed values
- **ImageField** (Planned) - Display images
- **MarkdownField** (Planned) - Display markdown content
- **NumberField** (Planned) - Display numeric values
- **RecordField** (Planned) - Display record context data
- **ReferenceField** ✅ - Display related record data
- **ReferenceArrayField** (Planned) - Display array of related records
- **ReferenceManyField** (Planned) - Display many related records
- **ReferenceManyCount** (Planned) - Display count of related records
- **ReferenceManyToManyField** (Planned) - Display many-to-many relationships
- **ReferenceOneField** (Planned) - Display single related record
- **RichTextField** (Planned) - Display rich text content
- **SelectField** (Planned) - Display selected values
- **TextField** ✅ - Display text content
- **TranslatableFields** (Planned) - Multi-language field support
- **UrlField** (Planned) - Display URLs with links
- **WrapperField** (Planned) - Custom field wrapper

### Field Hooks

- **useFieldValue** (Planned) - Get field value

## ⌨️ Inputs

### Basic Inputs

- **ArrayInput** ✅ - Dynamic field arrays
- **AutocompleteInput** ✅ - Searchable select input
- **AutocompleteArrayInput** (Planned) - Multiple autocomplete
- **BooleanInput** ✅ - Boolean input (checkbox)
- **CheckboxGroupInput** (Planned) - Multiple checkbox group
- **DateInput** ✅ - Date picker input
- **DateRangeInput** (Planned) - Date range picker
- **DateTimeInput** (Planned) - Date and time picker
- **DualListInput** (Planned) - Two-column list selector
- **FileInput** (Planned) - File upload input
- **ImageInput** (Planned) - Image upload input
- **InPlaceEditor** (Planned) - Inline editing input
- **MarkdownInput** (Planned) - Markdown editor
- **NullableBooleanInput** (Planned) - Three-state boolean input
- **NumberInput** (Planned) - Numeric input field
- **PasswordInput** (Planned) - Password input field
- **PredictiveTextInput** (Planned) - AI-powered text suggestions
- **RadioButtonGroupInput** (Planned) - Radio button group
- **ReferenceInput** (Planned) - Related record selector
- **ReferenceArrayInput** (Planned) - Multiple related record selector
- **ReferenceManyInput** (Planned) - Many related records selector
- **ReferenceManyToManyInput** (Planned) - Many-to-many relationship input
- **ReferenceNodeInput** (Planned) - Tree node selector
- **ReferenceOneInput** (Planned) - Single related record selector
- **RichTextInput** (Planned) - Rich text editor
- **SearchInput** (Planned) - Search input with suggestions
- **SelectInput** ✅ - Single select dropdown
- **SelectArrayInput** (Planned) - Multiple select dropdown
- **SimpleFormIterator** (Planned) - Array input iterator
- **SmartRichTextInput** (Planned) - Intelligent rich text editor
- **TextArrayInput** (Planned) - Array of text inputs
- **TextInput** ✅ - Text input field
- **TimeInput** (Planned) - Time picker input
- **TranslatableInputs** (Planned) - Multi-language input support
- **TreeInput** (Planned) - Tree structure input

### Input Hooks

- **useInput** (Planned) - Input state management

## ⚙️ Preferences

### Preference Hooks

- **useStore** (Planned) - Store state management
- **useRemoveFromStore** (Planned) - Remove from store
- **useResetStore** (Planned) - Reset store state
- **useStoreContext** (Planned) - Access store context

### Preference Components

- **Configurable** (Planned) - User-configurable components

## 🌍 I18N Provider and Translations

### I18N Components

- **Translate** (Planned) - Translation component

### I18N Hooks

- **useTranslate** (Planned) - Translation hook
- **useLocaleState** (Planned) - Locale state management

### I18N Setup

- **LocalesMenuButton** (Planned) - Locale selection menu

## 🎨 Other UI Components

### Layout Components

- **ContainerLayout** (Planned) - Container-based layout
- **HorizontalMenu** (Planned) - Horizontal menu layout
- **SolarLayout** (Planned) - Solar design layout
- **AppBar** ✅ - Top navigation bar
- **Menu** (Planned) - Main navigation menu
- **MultiLevelMenu** (Planned) - Nested menu structure
- **IconMenu** (Planned) - Icon-based menu

### Navigation Components

- **Title** (Planned) - Page title component
- **Breadcrumb** (Planned) - Navigation path display
- **Search** (Planned) - Global search component
- **SearchWithResult** (Planned) - Search with live results

### Utility Components

- **Confirm** (Planned) - Confirmation dialogs
- **RevisionsButton** (Planned) - Version history access
- **CheckForApplicationUpdate** (Planned) - Update checker
- **RecordRepresentation** (Planned) - Record display
- **PrevNextButtons** (Planned) - Previous/next navigation

### UI Hooks

- **useDefineAppLocation** (Planned) - Define app location
- **useGetRecordRepresentation** (Planned) - Get record representation

## 🎨 Theming

### Theme Components

- **ToggleThemeButton** (Planned) - Theme switching button
- **Box** (Planned) - Layout container component
- **Stack** (Planned) - Vertical layout component
- **Grid** (Planned) - Grid layout component

### Theme Hooks

- **useMediaQuery** ✅ - Media query hook
- **useTheme** ✅ - Theme access hook

## 🔄 Realtime

### Realtime Components

- **ListLiveUpdate** (Planned) - Real-time list updates
- **EditLive** (Planned) - Real-time editing
- **ShowLive** (Planned) - Real-time display updates
- **MenuLive** (Planned) - Real-time menu updates

### Realtime Hooks

- **usePublish** (Planned) - Publish realtime events
- **useSubscribe** (Planned) - Subscribe to realtime events
- **useSubscribeCallback** (Planned) - Subscribe with callback
- **useSubscribeToRecord** (Planned) - Subscribe to record changes
- **useSubscribeToRecordList** (Planned) - Subscribe to list changes
- **useLock** (Planned) - Lock records
- **useUnlock** (Planned) - Unlock records
- **useGetLock** (Planned) - Get lock status
- **useGetLockLive** (Planned) - Get live lock status
- **useGetLocks** (Planned) - Get all locks
- **useGetLocksLive** (Planned) - Get live locks
- **useLockOnMount** (Planned) - Lock on component mount
- **useLockOnCall** (Planned) - Lock on function call
- **useGetListLive** (Planned) - Live list data
- **useGetOneLive** (Planned) - Live single record data

## 📱 Basic UI Components

### Interactive Components

- **Button** ✅ - Action buttons
- **Card** ✅ - Content cards
- **Dropdown** ✅ - Dropdown menus
- **Modal** ✅ - Modal dialogs
- **Alert** (In Progress) - Information, warning, and error alerts (needs
  documentation)
- **Badge** ✅ - Status badges and labels
- **Tooltip** (TO DO) - Hover tooltips
- **Label** ✅ - Form labels

### Feedback Components

- **Notification** (Planned) - Toast notifications
- **Loading** (Planned) - Loading indicators
- **Skeleton** (Planned) - Content loading placeholders
- **Progress** (Planned) - Progress bars and indicators

## 📚 Recipes

### Advanced Features

- **Caching** (Planned) - Data caching strategies
- **Unit Testing** ✅ - Testing framework and utilities
- **Advanced Tutorials** (Planned) - Complex implementation guides

## 📊 Implementation Status Summary

### ✅ **COMPLETED (Code + Testing + Documentation)**

- **15 Components** fully implemented with 3-phase completion
- **13 Core Hooks** implemented (need testing & documentation)

### 🔄 **IN PROGRESS (Partially Complete)**

- **8 Components** with code implementation, need testing/documentation
- **Alert Component** - needs documentation

### 📋 **TO DO (Tasks Created)**

- **45+ Components** with GitHub tasks created, ready for development
- **CRUD Pages** (List, Create, Edit, Show) - high priority
- **Authentication System** - security foundation

### 🗺️ **PLANNED (Reference Exists, No Tasks Yet)**

- **80+ Components** identified from
  [React Admin documentation](https://marmelab.com/react-admin/Tutorial.html)
- **Advanced Inputs** (FileInput, ImageInput, RichTextInput)
- **Realtime Features** (Live updates, Lock management)
- **Advanced UI** (Charts, Analytics, Dashboard)

## 🎯 Implementation Priority

### **Phase 1: Core CRUD (High Priority)**

1. **List, Create, Edit, Show** pages - Essential admin functionality
2. **Form validation** - Data integrity
3. **Authentication & RBAC** - Security foundation
4. **Data providers** - API integration

### **Phase 2: Advanced Forms (Medium Priority)**

1. **File & Image inputs** - Media handling
2. **Rich text inputs** - Content management
3. **Reference inputs** - Relationship management
4. **Advanced field types** - Enhanced UX

### **Phase 3: Specialized Features (Lower Priority)**

1. **Realtime updates** - Live collaboration
2. **Dashboard & analytics** - Business intelligence
3. **Advanced theming** - Customization
4. **Development tools** - Developer experience

## 🔧 Development Guidelines

### **Quality Standards**

- **3-Phase Approach**: Code → Testing → Documentation
- **TypeScript**: Full type safety
- **Testing**: 90%+ coverage requirement
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized for speed

### **Component Structure**

- **packages/core/**: Framework components, hooks, types
- **packages/web/**: UI components, forms, layouts
- **Consistent naming**: PascalCase components, camelCase props
- **Clear documentation**: MDX docs with usage examples

---

_Based on
[React Admin documentation](https://marmelab.com/react-admin/Tutorial.html).
This reference tracks our progress toward building a complete admin framework
matching React Admin's comprehensive component ecosystem._
