'use client';

import { useField } from 'formik';
import * as React from 'react';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface ComboboxFieldProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  options: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

/** Searchable select — Popover + Command per the shadcn combobox pattern. */
export function ComboboxField({
  name,
  label,
  description,
  required,
  options,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.'
}: ComboboxFieldProps) {
  const [field, meta, helpers] = useField<string>(name);
  const [open, setOpen] = React.useState(false);

  const isInvalid = meta.touched && Boolean(meta.error);
  const selected = options.find((option) => option.value === field.value);
  const listboxId = `${name}-listbox`;

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={name}>
        {label}
        {required && ' *'}
      </FieldLabel>

      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);

          if (!next) {
            void helpers.setTouched(true);
          }
        }}
      >
        <PopoverTrigger
          render={
            <Button
              id={name}
              type='button'
              variant='outline'
              role='combobox'
              aria-controls={listboxId}
              aria-expanded={open}
              aria-invalid={isInvalid || undefined}
              aria-describedby={isInvalid ? `${name}-error` : undefined}
              className={cn(
                'w-full justify-between font-normal',
                !selected && 'text-muted-foreground'
              )}
            />
          }
        >
          {selected?.label ?? placeholder}

          <Icons.chevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </PopoverTrigger>

        <PopoverContent className='w-(--anchor-width) p-0'>
          <Command>
            <CommandInput placeholder={searchPlaceholder} />

            <CommandList id={listboxId}>
              <CommandEmpty>{emptyMessage}</CommandEmpty>

              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    keywords={[option.label]}
                    onSelect={(nextValue) => {
                      void helpers.setValue(nextValue);
                      void helpers.setTouched(true);
                      setOpen(false);
                    }}
                  >
                    <Icons.check
                      className={cn(
                        'mr-2 h-4 w-4',
                        field.value === option.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />

                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {description && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError id={`${name}-error`} errors={[{ message: meta.error }]} />}
    </Field>
  );
}
