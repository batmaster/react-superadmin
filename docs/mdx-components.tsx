import { MDXProvider } from '@mdx-js/react';
import React from 'react';

// Import react-live components for live code examples
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';

// Import all UI components from the web package
import { Alert } from '@react-superadmin/web/components/ui/Alert';
import { Badge } from '@react-superadmin/web/components/ui/Badge';
import { Button } from '@react-superadmin/web/components/ui/Button';
import { Card } from '@react-superadmin/web/components/ui/Card';
import { Dropdown } from '@react-superadmin/web/components/ui/Dropdown';
import { Modal } from '@react-superadmin/web/components/ui/Modal';
import { Tooltip } from '@react-superadmin/web/components/ui/Tooltip';

// Import all form components
import { ArrayInput } from '@react-superadmin/web/components/forms/ArrayInput';
import { AutocompleteInput } from '@react-superadmin/web/components/forms/AutocompleteInput';
import { BooleanInput } from '@react-superadmin/web/components/forms/BooleanInput';
import { CheckboxGroupInput } from '@react-superadmin/web/components/forms/CheckboxGroupInput';
import { CheckboxInput } from '@react-superadmin/web/components/forms/CheckboxInput';
import { DateInput } from '@react-superadmin/web/components/forms/DateInput';
import { DateTimeInput } from '@react-superadmin/web/components/forms/DateTimeInput';
import { FileInput } from '@react-superadmin/web/components/forms/FileInput';
import { FormField } from '@react-superadmin/web/components/forms/FormField';
import { ImageInput } from '@react-superadmin/web/components/forms/ImageInput';
import { Input } from '@react-superadmin/web/components/forms/Input';
import { Label } from '@react-superadmin/web/components/forms/Label';
import { MarkdownInput } from '@react-superadmin/web/components/forms/MarkdownInput';
import { NumberInput } from '@react-superadmin/web/components/forms/NumberInput';
import { PasswordInput } from '@react-superadmin/web/components/forms/PasswordInput';
import { ReferenceArrayInput } from '@react-superadmin/web/components/forms/ReferenceArrayInput';
import { ReferenceInput } from '@react-superadmin/web/components/forms/ReferenceInput';
import { ReferenceManyInput } from '@react-superadmin/web/components/forms/ReferenceManyInput';
import { RichTextInput } from '@react-superadmin/web/components/forms/RichTextInput';
import { SearchInput } from '@react-superadmin/web/components/forms/SearchInput';
import { SelectInput } from '@react-superadmin/web/components/forms/SelectInput';
import { SimpleForm } from '@react-superadmin/web/components/forms/SimpleForm';
import { TabbedForm } from '@react-superadmin/web/components/forms/TabbedForm';
import { TextInput } from '@react-superadmin/web/components/forms/TextInput';
import { TextareaInput } from '@react-superadmin/web/components/forms/TextareaInput';
import { TimeInput } from '@react-superadmin/web/components/forms/TimeInput';

// Import all field components
import { BooleanField } from '@react-superadmin/web/components/fields/BooleanField';
import { ChipField } from '@react-superadmin/web/components/fields/ChipField';
import { DateField } from '@react-superadmin/web/components/fields/DateField';
import { EmailField } from '@react-superadmin/web/components/fields/EmailField';
import { ImageField } from '@react-superadmin/web/components/fields/ImageField';
import { NumberField } from '@react-superadmin/web/components/fields/NumberField';
import { UrlField } from '@react-superadmin/web/components/fields/UrlField';

// Import all CRUD components
import { DataTable } from '@react-superadmin/web/components/crud/DataTable';
import { Pagination } from '@react-superadmin/web/components/crud/Pagination';
import { ResourceForm } from '@react-superadmin/web/components/crud/ResourceForm';
import { ResourceList } from '@react-superadmin/web/components/crud/ResourceList';
import { ResourceShow } from '@react-superadmin/web/components/crud/ResourceShow';
import { SearchBar } from '@react-superadmin/web/components/crud/SearchBar';

// Import all layout components
import { AdminLayout } from '@react-superadmin/web/components/layout/AdminLayout';
import { Footer } from '@react-superadmin/web/components/layout/Footer';
import { Header } from '@react-superadmin/web/components/layout/Header';
import { Sidebar } from '@react-superadmin/web/components/layout/Sidebar';

// Create MDX components object
const mdxComponents = {
  // React Live Components
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview,
  // Layout Components
  AdminLayout,
  Alert,
  ArrayInput,
  AutocompleteInput,
  Badge,
  BooleanField,
  BooleanInput,
  // UI Components
  Button,
  Card,
  CheckboxGroupInput,
  CheckboxInput,
  ChipField,
  DataTable,
  DateField,
  DateInput,
  DateTimeInput,
  Dropdown,
  EmailField,
  FileInput,
  Footer,
  FormField,
  Header,
  ImageField,
  ImageInput,
  // Form Components
  Input,
  Label,
  MarkdownInput,
  Modal,
  // Field Components
  NumberField,
  NumberInput,
  Pagination,
  PasswordInput,
  ReferenceArrayInput,
  ReferenceInput,
  ReferenceManyInput,
  ResourceForm,
  // CRUD Components
  ResourceList,
  ResourceShow,
  RichTextInput,
  SearchBar,
  SearchInput,
  SelectInput,
  Sidebar,
  SimpleForm,
  TabbedForm,
  TextareaInput,
  TextInput,
  TimeInput,
  Tooltip,
  UrlField,
};

// MDX Provider component
export function MDXComponentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MDXProvider components={mdxComponents}>{children}</MDXProvider>;
}

// Export React for JSX usage
export { React };

// Export all components globally
export {
  // Layout Components
  AdminLayout,
  Alert,
  ArrayInput,
  AutocompleteInput,
  Badge,
  BooleanField,
  BooleanInput,
  // UI Components
  Button,
  Card,
  CheckboxGroupInput,
  CheckboxInput,
  ChipField,
  DataTable,
  DateField,
  DateInput,
  DateTimeInput,
  Dropdown,
  EmailField,
  FileInput,
  Footer,
  FormField,
  Header,
  ImageField,
  ImageInput,
  // Form Components
  Input,
  Label,
  LiveEditor,
  LiveError,
  LivePreview,
  // React Live Components
  LiveProvider,
  MarkdownInput,
  Modal,
  // Field Components
  NumberField,
  NumberInput,
  Pagination,
  PasswordInput,
  ReferenceArrayInput,
  ReferenceInput,
  ReferenceManyInput,
  ResourceForm,
  // CRUD Components
  ResourceList,
  ResourceShow,
  RichTextInput,
  SearchBar,
  SearchInput,
  SelectInput,
  Sidebar,
  SimpleForm,
  TabbedForm,
  TextareaInput,
  TextInput,
  TimeInput,
  Tooltip,
  UrlField,
};
