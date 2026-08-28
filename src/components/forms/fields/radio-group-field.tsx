'use client';

import { useField } from 'formik';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface RadioGroupFieldProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  options: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
}

export function RadioGroupField({
  name,
  label,
  description,
  required,
  options
}: RadioGroupFieldProps) {
  const [field, meta, helpers] = useField<string>(name);

  const isInvalid = meta.touched && Boolean(meta.error);

  return (
    <FieldSet>
      <FieldLegend variant='label'>
        {label}
        {required && ' *'}
      </FieldLegend>

      {description && <FieldDescription>{description}</FieldDescription>}

      <RadioGroup
        name={field.name}
        value={field.value}
        onValueChange={(value) => {
          void helpers.setValue(value);
          void helpers.setTouched(true);
        }}
        onBlur={() => {
          void helpers.setTouched(true);
        }}
        className='flex flex-wrap gap-x-6 gap-y-2'
      >
        {options.map((option) => (
          <Field
            key={option.value}
            orientation='horizontal'
            data-invalid={isInvalid || undefined}
            className='w-auto'
          >
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
              disabled={option.disabled}
              aria-invalid={isInvalid || undefined}
              aria-describedby={isInvalid ? `${name}-error` : undefined}
            />

            <FieldLabel htmlFor={`${name}-${option.value}`} className='font-normal'>
              {option.label}
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>

      {isInvalid && <FieldError id={`${name}-error`} errors={[{ message: meta.error }]} />}
    </FieldSet>
  );
}
