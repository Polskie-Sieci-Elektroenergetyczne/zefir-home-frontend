'use client';

import { useField } from 'formik';
import * as React from 'react';

import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export interface TagsFieldProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
}

/** Free-text tag list backed by a Formik `string[]` value. */
export function TagsField({
  name,
  label,
  description,
  required,
  placeholder = 'Type and press Enter...'
}: TagsFieldProps) {
  const [field, meta, helpers] = useField<string[]>(name);
  const [tagInput, setTagInput] = React.useState('');

  const values = field.value ?? [];
  const isInvalid = meta.touched && Boolean(meta.error);

  const addTag = () => {
    const tag = tagInput.trim();

    if (!tag || values.includes(tag)) return;

    void helpers.setValue([...values, tag]);
    void helpers.setTouched(true);
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    void helpers.setValue(values.filter((tag) => tag !== tagToRemove));
    void helpers.setTouched(true);
  };

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel>
        {label}
        {required && ' *'}
      </FieldLabel>

      <div className='flex gap-2'>
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          aria-label={`Add a ${label.toLowerCase().replace(/ \*$/, '')}`}
          aria-invalid={isInvalid || undefined}
          aria-describedby={isInvalid ? `${name}-error` : undefined}
        />

        <Button type='button' variant='secondary' onClick={addTag}>
          Add
        </Button>
      </div>

      {values.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {values.map((tag) => (
            <Badge key={tag} variant='secondary' className='gap-1'>
              {tag}

              <button
                type='button'
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
                className='hover:text-destructive ml-0.5'
              >
                <Icons.close className='h-3 w-3' />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {description && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError id={`${name}-error`} errors={[{ message: meta.error }]} />}
    </Field>
  );
}
