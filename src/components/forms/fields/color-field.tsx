'use client';

import { useField } from 'formik';

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export interface ColorFieldProps {
  name: string;
  label: string;
  description?: string;
}

/** Native color picker with a hex text input beside it. */
export function ColorField({ name, label, description }: ColorFieldProps) {
  const [field, , helpers] = useField<string>(name);

  const value = field.value ?? '#000000';

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      <div className='flex items-center gap-3'>
        <input
          id={name}
          name={field.name}
          aria-label={label}
          type='color'
          value={value}
          onChange={(e) => {
            void helpers.setValue(e.target.value);
            void helpers.setTouched(true);
          }}
          className='h-9 w-12 cursor-pointer rounded-md border p-1'
        />

        <Input
          name={field.name}
          value={field.value ?? ''}
          onBlur={field.onBlur}
          onChange={(e) => {
            void helpers.setValue(e.target.value);
          }}
          className='w-28 font-mono'
          placeholder='#000000'
          aria-label={`${label} hex value`}
        />
      </div>

      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
