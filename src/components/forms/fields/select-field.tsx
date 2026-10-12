'use client';

import { useField } from 'formik';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export interface SelectFieldProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  options: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
}

export function SelectField({
  name,
  label,
  description,
  required,
  placeholder = 'Select',
  options
}: SelectFieldProps) {
  const [field, meta, helpers] = useField<string>(name);

  const isInvalid = meta.touched && Boolean(meta.error);

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={name}>
        {label}
        {required && ' *'}
      </FieldLabel>

      <Select
        name={field.name}
        value={field.value}
        onValueChange={(value) => {
          void helpers.setValue(value ?? '');
          void helpers.setTouched(true);
        }}
      >
        <SelectTrigger
          id={name}
          aria-invalid={isInvalid || undefined}
          aria-describedby={isInvalid ? `${name}-error` : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {description && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError id={`${name}-error`} errors={[{ message: meta.error }]} />}
    </Field>
  );
}
