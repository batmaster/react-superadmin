import { useState, useCallback } from 'react';
import { FieldConfig } from '../types';
import { validateForm } from '../utils/validation';

export interface UseFormOptions<T = any> {
  initialData?: Partial<T>;
  fields: FieldConfig[];
  onSubmit: (data: T) => void | Promise<void>;
  onCancel?: () => void;
}

export interface UseFormReturn<T = any> {
  data: Partial<T>;
  errors: Record<string, string>;
  loading: boolean;
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error: string) => void;
  validate: () => boolean;
  handleSubmit: (e: React.FormEvent) => void;
  reset: () => void;
  isDirty: boolean;
}

export function useForm<T = any>(options: UseFormOptions<T>): UseFormReturn<T> {
  const { initialData = {}, fields, onSubmit } = options;
  
  const [data, setData] = useState<Partial<T>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [originalData] = useState<Partial<T>>(initialData);

  const setFieldValue = useCallback((field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const validate = useCallback((): boolean => {
    const validationErrors = validateForm(data, fields);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [data, fields]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(data as T);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  }, [data, validate, onSubmit]);

  const reset = useCallback(() => {
    setData(originalData);
    setErrors({});
  }, [originalData]);

  const isDirty = JSON.stringify(data) !== JSON.stringify(originalData);

  return {
    data,
    errors,
    loading,
    setFieldValue,
    setFieldError,
    validate,
    handleSubmit,
    reset,
    isDirty,
  };
}
