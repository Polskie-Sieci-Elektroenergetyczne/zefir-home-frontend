'use client';

import { useField } from 'formik';

import { FileUploader } from '@/components/file-uploader';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';

export interface FileUploadFieldProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  maxSize?: number;
  maxFiles?: number;
}

export function FileUploadField({
  name,
  label,
  description,
  required,
  maxSize = 5 * 1024 * 1024,
  maxFiles = 1
}: FileUploadFieldProps) {
  const [field, meta, helpers] = useField<File[] | undefined>(name);

  const isInvalid = meta.touched && Boolean(meta.error);

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={name}>
        {label}
        {required && ' *'}
      </FieldLabel>

      <FileUploader
        value={field.value}
        onValueChange={(files) => {
          const nextValue = typeof files === 'function' ? files(field.value ?? []) : files;

          void helpers.setValue(nextValue);
          void helpers.setTouched(true);
        }}
        maxSize={maxSize}
        maxFiles={maxFiles}
      />

      {description && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError id={`${name}-error`} errors={[{ message: meta.error }]} />}
    </Field>
  );
}
