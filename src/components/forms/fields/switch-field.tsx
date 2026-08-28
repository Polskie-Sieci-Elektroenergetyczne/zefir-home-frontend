'use client';

import { useField } from 'formik';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';

export interface SwitchFieldProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
}

export function SwitchField({ name, label, description, required }: SwitchFieldProps) {
  const [field, meta, helpers] = useField<boolean>(name);

  const isInvalid = meta.touched && Boolean(meta.error);

  return (
    <Field orientation='horizontal' data-invalid={isInvalid || undefined}>
      <FieldContent>
        <FieldLabel htmlFor={name}>
          {label}
          {required && ' *'}
        </FieldLabel>

        {description && <FieldDescription>{description}</FieldDescription>}

        {isInvalid && <FieldError id={`${name}-error`} errors={[{ message: meta.error }]} />}
      </FieldContent>

      <Switch
        id={name}
        name={field.name}
        checked={field.value}
        onCheckedChange={(checked) => {
          void helpers.setValue(checked);
          void helpers.setTouched(true);
        }}
        aria-invalid={isInvalid || undefined}
        aria-describedby={isInvalid ? `${name}-error` : undefined}
      />
    </Field>
  );
}
