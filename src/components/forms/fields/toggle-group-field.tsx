'use client';

import { useField } from 'formik';
import * as React from 'react';

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { ToggleGroup } from '@/components/ui/toggle-group';

export interface ToggleGroupFieldProps {
  name: string;
  label: string;
  description?: string;
  children: React.ReactNode;
}

/** Multi-select toggle group backed by a Formik `string[]` value. */
export function ToggleGroupField({ name, label, description, children }: ToggleGroupFieldProps) {
  const [field, , helpers] = useField<string[]>(name);
  const labelId = `${name}-label`;

  return (
    <Field>
      <FieldLabel id={labelId}>{label}</FieldLabel>

      <ToggleGroup
        multiple
        variant='outline'
        aria-labelledby={labelId}
        value={field.value ?? []}
        onValueChange={(value) => {
          void helpers.setValue(value);
          void helpers.setTouched(true);
        }}
      >
        {children}
      </ToggleGroup>

      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
