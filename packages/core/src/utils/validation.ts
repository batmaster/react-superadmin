import { ValidationRule, FieldConfig } from '../types';

export function validateField(value: any, field: FieldConfig): string | null {
  if (!field.validation) {
    return null;
  }

  for (const rule of field.validation) {
    const error = validateRule(value, rule);
    if (error) {
      return error;
    }
  }

  return null;
}

function validateRule(value: any, rule: ValidationRule): string | null {
  switch (rule.type) {
    case 'required':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return rule.message;
      }
      break;

    case 'min':
      if (typeof value === 'string' && value.length < rule.value) {
        return rule.message;
      }
      if (typeof value === 'number' && value < rule.value) {
        return rule.message;
      }
      break;

    case 'max':
      if (typeof value === 'string' && value.length > rule.value) {
        return rule.message;
      }
      if (typeof value === 'number' && value > rule.value) {
        return rule.message;
      }
      break;

    case 'pattern':
      if (typeof value === 'string' && !new RegExp(rule.value).test(value)) {
        return rule.message;
      }
      break;

    case 'custom':
      if (typeof rule.value === 'function' && !rule.value(value)) {
        return rule.message;
      }
      break;
  }

  return null;
}

export function validateForm(data: Record<string, any>, fields: FieldConfig[]): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const error = validateField(data[field.name], field);
    if (error) {
      errors[field.name] = error;
    }
  }

  return errors;
}
