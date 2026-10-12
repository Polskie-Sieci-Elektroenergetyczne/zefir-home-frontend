'use client';

import { format } from 'date-fns';
import { useField } from 'formik';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

export interface DatePickerFieldProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  disabledDates?: (date: Date) => boolean;
}

/** Single date — Popover + Calendar per the shadcn date-picker pattern. */
export function DatePickerField({
  name,
  label,
  description,
  required,
  placeholder = 'Pick a date',
  disabledDates
}: DatePickerFieldProps) {
  const [field, meta, helpers] = useField<Date | undefined>(name);

  const isInvalid = meta.touched && Boolean(meta.error);

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={name}>
        {label}
        {required && ' *'}
      </FieldLabel>

      <Popover
        onOpenChange={(open) => {
          if (!open) {
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
              aria-invalid={isInvalid || undefined}
              aria-describedby={isInvalid ? `${name}-error` : undefined}
              className={cn(
                'w-full justify-start text-left font-normal',
                !field.value && 'text-muted-foreground'
              )}
            />
          }
        >
          <Icons.calendar className='mr-2 h-4 w-4' />

          {field.value ? format(field.value, 'PPP') : <span>{placeholder}</span>}
        </PopoverTrigger>

        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            selected={field.value}
            onSelect={(date) => {
              void helpers.setValue(date);
            }}
            disabled={disabledDates}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      {description && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError id={`${name}-error`} errors={[{ message: meta.error }]} />}
    </Field>
  );
}

export interface DateRangeFieldProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
}

/** Date range — two-month Calendar in range mode. */
export function DateRangeField({
  name,
  label,
  description,
  required,
  placeholder = 'Pick a date range'
}: DateRangeFieldProps) {
  const [field, meta, helpers] = useField<DateRange | undefined>(name);

  const isInvalid = meta.touched && Boolean(meta.error);
  const range = field.value;

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={name}>
        {label}
        {required && ' *'}
      </FieldLabel>

      <Popover
        onOpenChange={(open) => {
          if (!open) {
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
              aria-invalid={isInvalid || undefined}
              aria-describedby={isInvalid ? `${name}-error` : undefined}
              className={cn(
                'w-full justify-start text-left font-normal',
                !range?.from && 'text-muted-foreground'
              )}
            />
          }
        >
          <Icons.calendar className='mr-2 h-4 w-4' />

          {range?.from ? (
            range.to ? (
              <>
                {format(range.from, 'LLL dd, y')} - {format(range.to, 'LLL dd, y')}
              </>
            ) : (
              format(range.from, 'LLL dd, y')
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </PopoverTrigger>

        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='range'
            selected={range}
            onSelect={(nextRange) => {
              void helpers.setValue(nextRange);
            }}
            numberOfMonths={2}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      {description && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError id={`${name}-error`} errors={[{ message: meta.error }]} />}
    </Field>
  );
}
