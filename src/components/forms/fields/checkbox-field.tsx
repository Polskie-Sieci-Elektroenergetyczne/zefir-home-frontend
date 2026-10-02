'use client';

import { useField } from 'formik';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@/components/ui/field';

export interface CheckboxFieldProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
}

/** Single boolean checkbox (terms, consent, …). */
export function CheckboxField({ name, label, description, required }: CheckboxFieldProps) {
  const [field, meta, helpers] = useField<boolean>(name);

  const isInvalid = meta.touched && Boolean(meta.error);

  return (
    <Field orientation='horizontal' data-invalid={isInvalid || undefined}>
      <Checkbox
        id={name}
        name={field.name}
        checked={field.value}
        onCheckedChange={(checked) => {
          void helpers.setValue(checked === true);
          void helpers.setTouched(true);
        }}
        aria-invalid={isInvalid || undefined}
        aria-describedby={isInvalid ? `${name}-error` : undefined}
      />

      <FieldContent>
        <FieldLabel htmlFor={name} className='font-normal'>
          {label}
          {required && ' *'}
        </FieldLabel>

        {description && <FieldDescription>{description}</FieldDescription>}

        {isInvalid && <FieldError id={`${name}-error`} errors={[{ message: meta.error }]} />}
      </FieldContent>
    </Field>
  );
}
