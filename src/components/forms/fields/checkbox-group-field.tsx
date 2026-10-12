'use client';

import { useField } from 'formik';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '@/components/ui/field';
import { cn } from '@/lib/utils';

export interface CheckboxGroupFieldProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  options: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
  className?: string;
}

/**
 * Multi-select checkbox group backed by a Formik `string[]` value.
 */
export function CheckboxGroupField({
  name,
  label,
  description,
  required,
  options,
  className
}: CheckboxGroupFieldProps) {
  const [field, meta, helpers] = useField<string[]>(name);

  const value = field.value ?? [];
  const isInvalid = meta.touched && Boolean(meta.error);

  return (
    <FieldSet>
      <FieldLegend variant='label'>
        {label}
        {required && ' *'}
      </FieldLegend>

      {description && <FieldDescription>{description}</FieldDescription>}

      <FieldGroup data-slot='checkbox-group' className={cn('gap-3', className)}>
        {options.map((option) => {
          const isChecked = value.includes(option.value);

          return (
            <Field
              key={option.value}
              orientation='horizontal'
              data-invalid={isInvalid || undefined}
            >
              <Checkbox
                id={`${name}-${option.value}`}
                name={field.name}
                disabled={option.disabled}
                checked={isChecked}
                aria-invalid={isInvalid || undefined}
                aria-describedby={isInvalid ? `${name}-error` : undefined}
                onCheckedChange={(checked) => {
                  const nextValue =
                    checked === true
                      ? [...value, option.value]
                      : value.filter((item) => item !== option.value);

                  void helpers.setValue(nextValue);
                  void helpers.setTouched(true);
                }}
              />

              <FieldLabel htmlFor={`${name}-${option.value}`} className='font-normal'>
                {option.label}
              </FieldLabel>
            </Field>
          );
        })}
      </FieldGroup>

      {isInvalid && <FieldError id={`${name}-error`} errors={[{ message: meta.error }]} />}
    </FieldSet>
  );
}
