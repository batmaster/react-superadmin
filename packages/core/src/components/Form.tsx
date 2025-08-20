import React, { FormEvent, ReactNode } from "react";

export interface FormProps {
  /** Form submission handler */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  /** Form reset handler */
  onReset?: (event: FormEvent<HTMLFormElement>) => void;
  /** Form content */
  children: ReactNode;
  /** Additional CSS classes for the form container */
  className?: string;
  /** Form method (GET, POST, etc.) */
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Form action URL */
  action?: string;
  /** Form encoding type */
  encType?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain";
  /** Whether the form is disabled */
  disabled?: boolean;
  /** Whether to show loading state */
  loading?: boolean;
  /** Form validation mode */
  validateOn?: "blur" | "change" | "submit" | "never";
  /** Additional CSS classes for form fields */
  fieldClassName?: string;
  /** Additional CSS classes for form actions */
  actionsClassName?: string;
}

/**
 * Form container component for managing form state and validation
 *
 * This component provides a consistent form wrapper with built-in support
 * for form submission, reset, validation, and styling.
 *
 * @example
 * ```tsx
 * import { Form } from '@react-superadmin/core';
 *
 * function UserForm() {
 *   const handleSubmit = (event) => {
 *     event.preventDefault();
 *     // Handle form submission
 *   };
 *
 *   return (
 *     <Form onSubmit={handleSubmit} loading={false}>
 *       <TextInput name="name" label="Name" required />
 *       <TextInput name="email" label="Email" type="email" required />
 *       <Button type="submit">Submit</Button>
 *     </Form>
 *   );
 * }
 * ```
 */
export const Form: React.FC<FormProps> = ({
  onSubmit,
  onReset,
  children,
  className = "",
  method = "POST",
  action,
  encType = "application/x-www-form-urlencoded",
  disabled = false,
  loading = false,
  validateOn = "submit",
  fieldClassName = "",
  actionsClassName = "",
}) => {
  const formClasses = [
    "rs-form",
    loading && "rs-form--loading",
    disabled && "rs-form--disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }

    if (onSubmit) {
      onSubmit(event);
    }
  };

  const handleReset = (event: FormEvent<HTMLFormElement>) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }

    if (onReset) {
      onReset(event);
    }
  };

  return (
    <form
      className={formClasses}
      method={method}
      action={action}
      encType={encType}
      onSubmit={handleSubmit}
      onReset={handleReset}
      noValidate={validateOn === "never"}
      data-testid="form"
    >
      <div className={`rs-form__fields ${fieldClassName}`.trim()}>
        {children}
      </div>

      <div className={`rs-form__actions ${actionsClassName}`.trim()}>
        {/* Form actions can be added here */}
      </div>

      {loading && (
        <div className="rs-form__loading">
          <div className="rs-form__loading-spinner" />
          <span>Processing...</span>
        </div>
      )}
    </form>
  );
};

export default Form;
