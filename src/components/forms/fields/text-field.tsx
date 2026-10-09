'use client';

import { useField } from 'formik';
import * as React from 'react';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export interface TextFieldProps extends Omit<
  React.ComponentProps<typeof Input>,
  'name' | 'value' | 'onChange' | 'onBlur'
> {
  name: string;
  label: string;
  description?: string;
  required?: boolean;

  /**
   * Formik does not expose per-field async validation state.
   * Pass this explicitly if a field performs an async check.
   */
  isValidating?: boolean;
}

/**
 * Formik-backed text-style input.
 *
 * Supports text, email, password, tel, url, time and number inputs.
 * Number values are converted at the component boundary so Formik receives
 * `number | undefined` rather than the DOM's string representation.
 */
export function TextField({
  name,
  label,
  description,
  required,
  isValidating = false,
  type,
  ...inputProps
}: TextFieldProps) {
  const [field, meta, helpers] = useField<string | number | undefined>(name);

  const isInvalid = meta.touched && Boolean(meta.error);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      const nextValue = event.target.value === '' ? undefined : Number(event.target.value);

      void helpers.setValue(nextValue);
      return;
    }

    void helpers.setValue(event.target.value);
  };

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={name}>
        {label}
        {required && ' *'}
      </FieldLabel>

      <div className='relative'>
        <Input
          {...inputProps}
          id={name}
          name={field.name}
          type={type}
          value={field.value ?? ''}
          onBlur={field.onBlur}
          onChange={handleChange}
          aria-invalid={isInvalid || undefined}
          aria-describedby={isInvalid ? `${name}-error` : undefined}
        />

        {isValidating && <Spinner className='absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2' />}
      </div>

      {description && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError id={`${name}-error`} errors={[{ message: meta.error }]} />}
    </Field>
  );
}
