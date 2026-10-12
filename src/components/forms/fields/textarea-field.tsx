'use client';

import { useField } from 'formik';
import * as React from 'react';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

export interface TextareaFieldProps extends Omit<
  React.ComponentProps<typeof Textarea>,
  'name' | 'value' | 'onChange' | 'onBlur'
> {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  showCount?: boolean;
}

export function TextareaField({
  name,
  label,
  description,
  required,
  showCount = false,
  maxLength,
  ...textareaProps
}: TextareaFieldProps) {
  const [field, meta, helpers] = useField<string>(name);

  const value = field.value ?? '';
  const isInvalid = meta.touched && Boolean(meta.error);

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={name}>
        {label}
        {required && ' *'}
      </FieldLabel>

      <Textarea
        {...textareaProps}
        id={name}
        name={field.name}
        value={value}
        maxLength={maxLength}
        onChange={(event) => {
          void helpers.setValue(event.target.value);
        }}
        onBlur={field.onBlur}
        aria-invalid={isInvalid || undefined}
        aria-describedby={isInvalid ? `${name}-error` : undefined}
      />

      {showCount && maxLength && (
        <div className='text-muted-foreground text-right text-xs'>
          {value.length}/{maxLength}
        </div>
      )}

      {description && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError id={`${name}-error`} errors={[{ message: meta.error }]} />}
    </Field>
  );
}
