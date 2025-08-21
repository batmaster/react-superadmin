import { FieldConfig } from "@react-superadmin/core";
import React from "react";
import { CheckboxInput } from "./CheckboxInput";
import { DateInput } from "./DateInput";
import { SelectInput } from "./SelectInput";
import { TextareaInput } from "./TextareaInput";
import { TextInput } from "./TextInput";

interface FormFieldProps {
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
        return (
          <TextInput
            type={field.type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            error={error}
          />
        );

      case "number":
        return (
          <TextInput
            type="number"
            value={value || ""}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={field.placeholder}
            disabled={disabled}
            error={error}
          />
        );

      case "select":
        return (
          <SelectInput
            value={value || ""}
            onChange={onChange}
            options={field.options || []}
            placeholder={field.placeholder}
            disabled={disabled}
            error={error}
          />
        );

      case "textarea":
        return (
          <TextareaInput
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            error={error}
          />
        );

      case "boolean":
        return (
          <CheckboxInput
            checked={Boolean(value)}
            onChange={(checked) => onChange(checked)}
            disabled={disabled}
            error={error}
          />
        );

      case "date":
        return (
          <DateInput
            value={value || ""}
            onChange={onChange}
            disabled={disabled}
            error={error}
          />
        );

      default:
        return (
          <TextInput
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            error={error}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {renderField()}

      {field.helpText && (
        <p className="text-sm text-gray-500">{field.helpText}</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
