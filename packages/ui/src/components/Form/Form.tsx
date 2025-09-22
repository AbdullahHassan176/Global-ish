import React from 'react';
import { useForm, Controller, FieldValues, Path, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { clsx } from 'clsx';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: z.ZodTypeAny;
  description?: string;
  className?: string;
}

export interface FormProps<T extends FieldValues> {
  fields: FormField<T>[];
  schema?: z.ZodSchema<T>;
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => void | Promise<void>;
  submitLabel?: string;
  loading?: boolean;
  className?: string;
  showSubmitButton?: boolean;
  resetOnSubmit?: boolean;
}

export function Form<T extends FieldValues>({
  fields,
  schema,
  defaultValues,
  onSubmit,
  submitLabel = 'Submit',
  loading = false,
  className,
  showSubmitButton = true,
  resetOnSubmit = false
}: FormProps<T>) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<T>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: defaultValues as any
  });

  const handleFormSubmit = async (data: T) => {
    try {
      await onSubmit(data);
      if (resetOnSubmit) {
        reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={clsx('space-y-6', className)}
    >
      {fields.map((field) => (
        <FormField
          key={String(field.name)}
          field={field}
          control={control}
          error={errors[field.name]}
          disabled={loading || field.disabled}
        />
      ))}

      {showSubmitButton && (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="btn btn-primary btn-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading || isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      )}
    </form>
  );
}

interface FormFieldProps<T extends FieldValues> {
  field: FormField<T>;
  control: Control<T>;
  error?: any;
  disabled?: boolean;
}

function FormField<T extends FieldValues>({
  field,
  control,
  error,
  disabled
}: FormFieldProps<T>) {
  const [showPassword, setShowPassword] = React.useState(false);

  const renderField = (value: any, onChange: (value: any) => void) => {
    const commonProps = {
      placeholder: field.placeholder,
      disabled,
      className: clsx(
        'input',
        error && 'border-red-500 focus:ring-red-500',
        field.className
      )
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            {...commonProps}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">{field.label}</span>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${String(field.name)}-${option.value}`}
                  name={String(field.name)}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={disabled}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <label
                  htmlFor={`${String(field.name)}-${option.value}`}
                  className="text-sm text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'password':
        return (
          <div className="relative">
            <input
              {...commonProps}
              type={showPassword ? 'text' : 'password'}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        );

      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => onChange(e.target.files?.[0] || null)}
            disabled={disabled}
            className={clsx(
              'block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100',
              error && 'border-red-500',
              field.className
            )}
          />
        );

      default:
        return (
          <input
            {...commonProps}
            type={field.type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {field.type !== 'checkbox' && (
        <label className="label">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField }) => (
          <div>
            {renderField(controllerField.value, controllerField.onChange)}
            {field.description && (
              <p className="text-sm text-gray-500 mt-1">{field.description}</p>
            )}
            {error && (
              <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error.message}</span>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}

// Common form schemas
export const commonSchemas = {
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
  url: z.string().url('Invalid URL'),
  required: z.string().min(1, 'This field is required'),
  optional: z.string().optional(),
  number: z.number().min(0, 'Must be a positive number'),
  date: z.date(),
  file: z.instanceof(File).optional()
};

// Form builder utility
export function createFormSchema<T extends Record<string, z.ZodTypeAny>>(
  schema: T
): z.ZodSchema<z.infer<z.ZodObject<T>>> {
  return z.object(schema);
}

// Hook for form state management
export function useFormState<T extends FieldValues>(
  defaultValues?: Partial<T>
) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const handleSubmit = async (
    submitFn: (data: T) => Promise<void>,
    data: T
  ) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await submitFn(data);
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(false);
  };

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    handleSubmit,
    reset
  };
}
