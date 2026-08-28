'use client';

import { useField } from 'formik';

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Slider } from '@/components/ui/slider';

export interface SliderFieldProps {
  name: string;
  label: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function SliderField({
  name,
  label,
  description,
  min = 0,
  max = 100,
  step = 1
}: SliderFieldProps) {
  const [field, , helpers] = useField<number>(name);

  const labelId = `${name}-label`;
  const value = field.value ?? min;

  return (
    <Field>
      <FieldLabel id={labelId}>{label}</FieldLabel>

      <div className='px-1'>
        <Slider
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(nextValue) => {
            const value = Array.isArray(nextValue) ? nextValue[0] : nextValue;

            void helpers.setValue(value);
          }}
          onBlur={() => {
            void helpers.setTouched(true);
          }}
          aria-labelledby={labelId}
        />

        <div className='text-muted-foreground mt-1 flex justify-between text-xs tabular-nums'>
          <span>{min}</span>
          <span className='text-foreground font-medium'>{value}</span>
          <span>{max}</span>
        </div>
      </div>

      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
