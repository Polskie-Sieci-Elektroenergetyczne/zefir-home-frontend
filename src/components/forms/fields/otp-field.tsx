'use client';

import { useField } from 'formik';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '@/components/ui/input-otp';

export interface OtpFieldProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
}

/** 6-digit one-time-code input (3 + 3 with a separator). */
export function OtpField({ name, label, description, required }: OtpFieldProps) {
  const [field, meta, helpers] = useField<string>(name);

  const isInvalid = meta.touched && Boolean(meta.error);

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel>
        {label}
        {required && ' *'}
      </FieldLabel>

      <InputOTP
        maxLength={6}
        value={field.value ?? ''}
        onChange={(value) => {
          void helpers.setValue(value);
        }}
        onBlur={() => {
          void helpers.setTouched(true);
        }}
        aria-label={label}
        aria-invalid={isInvalid || undefined}
        aria-describedby={isInvalid ? `${name}-error` : undefined}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>

        <InputOTPSeparator />

        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      {description && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError id={`${name}-error`} errors={[{ message: meta.error }]} />}
    </Field>
  );
}
