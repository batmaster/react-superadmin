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

## 🏗️ Core Framework Components

### Admin Container

- **`<Admin>`** - Main application wrapper that provides context and
  configuration
- **`<Resource>`** - Defines a data resource with its CRUD operations
- **`<CustomRoutes>`** - Custom routing outside of resource-based routes

### Layout Components

- **`<Layout>`** - Main layout wrapper
- **`<AdminLayout>`** - Standard admin interface layout
- **`<ContainerLayout>`** - Container-based layout system
- **`<AppBar>`** - Top navigation bar
- **`<Sidebar>`** - Left navigation sidebar
- **`<Footer>`** - Bottom footer component

## 📊 Data Display Components

### List & Table Components

- **`<List>`** - Main list page wrapper
- **`<ListBase>`** - Base list component without UI
- **`<DataGrid>`** - Advanced data table with sorting, filtering, pagination
- **`<SimpleList>`** - Basic list display optimized for mobile
- **`<Tree>`** - Hierarchical data display
- **`<TreeWithDetails>`** - Tree with expandable details
- **`<Calendar>`** - Date-based data visualization
- **`<Scheduler>`** - Event scheduling interface
- **`<KanbanBoard>`** - Drag-and-drop task management

### Field Components

- **`<TextField>`** - Display text content
- **`<NumberField>`** - Display numeric values
- **`<DateField>`** - Display dates with formatting
- **`<DateTimeField>`** - Display date and time
- **`<BooleanField>`** - Display boolean values
- **`<EmailField>`** - Display email addresses
- **`<UrlField>`** - Display URLs with links
- **`<ImageField>`** - Display images
- **`<FileField>`** - Display file information
- **`<RichTextField>`** - Display rich text content
- **`<MarkdownField>`** - Display markdown content
- **`<SelectField>`** - Display selected values
- **`<ChipField>`** - Display tags or chips
- **`<FunctionField>`** - Display computed values

### Relationship Fields

- **`<ReferenceField>`** - Display related record data
- **`<ReferenceArrayField>`** - Display array of related records
- **`<ReferenceManyField>`** - Display many related records
- **`<ReferenceOneField>`** - Display single related record
- **`<ReferenceManyCount>`** - Display count of related records
- **`<ReferenceManyToManyField>`** - Display many-to-many relationships

### Special Fields

- **`<ArrayField>`** - Display array data
- **`<RecordField>`** - Display record context data
- **`<WrapperField>`** - Custom field wrapper
- **`<TranslatableFields>`** - Multi-language field support

## 📝 Form Components

### Form Containers

- **`<Form>`** - Main form wrapper
- **`<SimpleForm>`** - Basic form layout
- **`<TabbedForm>`** - Multi-tab form layout
- **`<LongForm>`** - Scrollable long form
- **`<AccordionForm>`** - Collapsible form sections
- **`<WizardForm>`** - Multi-step form wizard
- **`<JsonSchemaForm>`** - Schema-driven forms

### Input Components

- **`<TextInput>`** - Text input field
- **`<PasswordInput>`** - Password input field
- **`<EmailInput>`** - Email input field
- **`<NumberInput>`** - Numeric input field
- **`<SelectInput>`** - Single select dropdown
- **`<SelectArrayInput>`** - Multiple select dropdown
- **`<AutocompleteInput>`** - Searchable select input
- **`<AutocompleteArrayInput>`** - Multiple autocomplete
- **`<BooleanInput>`** - Boolean input (checkbox)
- **`<CheckboxGroupInput>`** - Multiple checkbox group
- **`<RadioButtonGroupInput>`** - Radio button group
- **`<NullableBooleanInput>`** - Three-state boolean input
- **`<DateInput>`** - Date picker input
- **`<DateTimeInput>`** - Date and time picker
- **`<TimeInput>`** - Time picker input
- **`<DateRangeInput>`** - Date range picker
- **`<FileInput>`** - File upload input
- **`<ImageInput>`** - Image upload input
- **`<RichTextInput>`** - Rich text editor
- **`<MarkdownInput>`** - Markdown editor
- **`<TextareaInput>`** - Multi-line text input
- **`<ArrayInput>`** - Dynamic field arrays
- **`<SimpleFormIterator>`** - Array input iterator
- **`<TextArrayInput>`** - Array of text inputs

### Reference Inputs

- **`<ReferenceInput>`** - Related record selector
- **`<ReferenceArrayInput>`** - Multiple related record selector
- **`<ReferenceManyInput>`** - Many related records selector
- **`<ReferenceManyToManyInput>`** - Many-to-many relationship input
- **`<ReferenceOneInput>`** - Single related record selector
- **`<ReferenceNodeInput>`** - Tree node selector

### Special Inputs

- **`<DualListInput>`** - Two-column list selector
- **`<TreeInput>`** - Tree structure input
- **`<SearchInput>`** - Search input with suggestions
- **`<PredictiveTextInput>`** - AI-powered text suggestions
- **`<InPlaceEditor>`** - Inline editing input
- **`<SmartRichTextInput>`** - Intelligent rich text editor
- **`<TranslatableInputs>`** - Multi-language input support

## 🔐 Authentication & Security

### Auth Components

- **`<Login>`** - Login form component
- **`<Logout>`** - Logout button/component
- **`<Authenticated>`** - Authentication guard wrapper
- **`<CanAccess>`** - Permission-based access control

### Security Components

- **`<UserMenu>`** - User account menu
- **`<Profile>`** - User profile component
- **`<ChangePassword>`** - Password change form
- **`<Permissions>`** - Permission management

## 🧭 Navigation Components

### Menu Components

- **`<Menu>`** - Main navigation menu
- **`<MultiLevelMenu>`** - Nested menu structure
- **`<IconMenu>`** - Icon-based menu
- **`<HorizontalMenu>`** - Horizontal menu layout

### Navigation Components

- **`<Breadcrumb>`** - Navigation path display
- **`<Search>`** - Global search component
- **`<SearchWithResult>`** - Search with live results
- **`<Pagination>`** - Page navigation
- **`<SortButton>`** - Column sorting button
- **`<FilterButton>`** - Filter toggle button
- **`<SelectColumnsButton>`** - Column visibility selector

## 📱 UI Components

### Feedback Components

- **`<Alert>`** - Information, warning, and error alerts
- **`<Notification>`** - Toast notifications
- **`<Confirm>`** - Confirmation dialogs
- **`<Loading>`** - Loading indicators
- **`<Skeleton>`** - Content loading placeholders
- **`<Progress>`** - Progress bars and indicators

### Interactive Components

- **`<Button>`** - Action buttons
- **`<IconButton>`** - Icon-only buttons
- **`<ToggleButton>`** - Toggle state buttons
- **`<Dropdown>`** - Dropdown menus
- **`<Modal>`** - Modal dialogs
- **`<Drawer>`** - Side drawer panels
- **`<Tabs>`** - Tabbed content
- **`<Accordion>`** - Collapsible content sections
- **`<Card>`** - Content cards
- **`<Badge>`** - Status badges and labels
- **`<Tooltip>`** - Hover tooltips
- **`<Popover>`** - Click-triggered popovers

### Data Components

- **`<Count>`** - Record count display
- **`<RecordRepresentation>`** - Record title/name display
- **`<PrevNextButtons>`** - Previous/next navigation
- **`<RevisionsButton>`** - Version history access

## 🎨 Theming & Customization

### Theme Components

- **`<ToggleThemeButton>`** - Theme switching button
- **`<ColorSchemeToggle>`** - Color scheme toggle
- **`<ThemeProvider>`** - Theme context provider
- **`<CustomTheme>`** - Custom theme configuration

### Layout Components

- **`<Box>`** - Layout container component
- **`<Stack>`** - Vertical layout component
- **`<Grid>`** - Grid layout component
- **`<Flex>`** - Flexbox layout component

## 🔄 Real-time Components

### Live Update Components

- **`<ListLiveUpdate>`** - Real-time list updates
- **`<EditLive>`** - Real-time editing
- **`<ShowLive>`** - Real-time display updates
- **`<MenuLive>`** - Real-time menu updates

### Lock Components

- **`<LockIndicator>`** - Record lock status
- **`<UnlockButton>`** - Record unlock action
- **`<LockDialog>`** - Lock management dialog

## 📊 Dashboard & Analytics

### Dashboard Components

- **`<Dashboard>`** - Main dashboard container
- **`<DashboardWidget>`** - Dashboard widget wrapper
- **`<MetricCard>`** - Metric display card
- **`<ChartWidget>`** - Chart visualization widget
- **`<ActivityFeed>`** - Recent activity display
- **`<QuickActions>`** - Quick action buttons

### Chart Components

- **`<LineChart>`** - Line chart visualization
- **`<BarChart>`** - Bar chart visualization
- **`<PieChart>`** - Pie chart visualization
- **`<AreaChart>`** - Area chart visualization
- **`<ScatterPlot>`** - Scatter plot visualization

## 🧪 Development & Testing

### Development Components

- **`<DebugPanel>`** - Development debugging panel
- **`<PerformanceMonitor>`** - Performance metrics display
- **`<ErrorBoundary>`** - Error boundary wrapper
- **`<DevTools>`** - Development tools panel

### Testing Components

- **`<TestWrapper>`** - Test environment wrapper
- **`<MockProvider>`** - Mock data provider
- **`<TestUtils>`** - Testing utility components

## 📚 Utility Components

### Helper Components

- **`<WithRecord>`** - Record context provider
- **`<WithListContext>`** - List context provider
- **`<WithFormContext>`** - Form context provider
- **`<WithShowContext>`** - Show context provider

### Specialized Components

- **`<Configurable>`** - User-configurable components
- **`<Responsive>`** - Responsive behavior wrapper
- **`<Accessible>`** - Accessibility wrapper
- **`<Internationalized>`** - Multi-language wrapper

## 🎯 Implementation Priority

### Phase 1: Core Components (High Priority)

1. **Form Components** - Essential for CRUD operations
2. **Data Display** - Core data visualization
3. **Navigation** - Basic app structure
4. **Authentication** - Security foundation

### Phase 2: Advanced Components (Medium Priority)

1. **Advanced Forms** - Complex input types
2. **Data Visualization** - Charts and graphs
3. **Real-time Features** - Live updates
4. **Advanced UI** - Enhanced user experience

### Phase 3: Specialized Components (Lower Priority)

1. **Analytics** - Dashboard and metrics
2. **Advanced Theming** - Customization options
3. **Development Tools** - Developer experience
4. **Testing Utilities** - Quality assurance

## 🔧 Component Development Guidelines

### Design Principles

- **Consistency** - Follow established patterns
- **Accessibility** - WCAG 2.1 AA compliance
- **Responsiveness** - Mobile-first design
- **Performance** - Optimize for speed
- **Type Safety** - Full TypeScript support

### Implementation Standards

- **Component Structure** - Consistent file organization
- **Props Interface** - Well-defined component APIs
- **Error Handling** - Graceful error management
- **Testing Coverage** - Comprehensive test suites
- **Documentation** - Clear usage examples

### Naming Conventions

- **Components** - PascalCase (e.g., `DataTable`)
- **Files** - PascalCase (e.g., `DataTable.tsx`)
- **Props** - camelCase (e.g., `onRowClick`)
- **Events** - camelCase with 'on' prefix (e.g., `onChange`)

---

_This components reference serves as a comprehensive guide for implementing the
React SuperAdmin framework. Each component should be developed with TypeScript,
comprehensive testing, and full documentation._
