// Layout components
export { AdminLayout } from './components/layout/AdminLayout';
export { Sidebar } from './components/layout/Sidebar';
export { Header } from './components/layout/Header';
export { Footer } from './components/layout/Footer';

// CRUD components
export { ResourceList } from './components/crud/ResourceList';
export { ResourceForm } from './components/crud/ResourceForm';
export { ResourceShow } from './components/crud/ResourceShow';
export { DataTable } from './components/crud/DataTable';
export { SearchBar } from './components/crud/SearchBar';
export { Pagination } from './components/crud/Pagination';

// Form components
export { FormField } from './components/forms/FormField';
export { TextInput } from './components/forms/TextInput';
export { Input } from './components/forms/Input';
export { SelectInput } from './components/forms/SelectInput';
export { TextareaInput } from './components/forms/TextareaInput';
export { CheckboxInput } from './components/forms/CheckboxInput';
export { DateInput } from './components/forms/DateInput';

// UI components
export { Button } from './components/ui/Button';
export { Card } from './components/ui/Card';
export { Badge } from './components/ui/Badge';
export { Modal } from './components/ui/Modal';
export { Dropdown } from './components/ui/Dropdown';
export { Alert } from './components/ui/Alert';

// Hooks
export { useAdminLayout } from './hooks/useAdminLayout';
export { useResourceNavigation } from './hooks/useResourceNavigation';

// Utilities
export { cn } from './utils/cn';
export { formatDate } from './utils/formatDate';
export { formatCurrency } from './utils/formatCurrency';

// Data Providers
export * from './dataProviders';
