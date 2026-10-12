'use client';

import { useMutation } from '@tanstack/react-query';
import { FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import { toast } from 'sonner';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { SelectField } from '@/components/forms/fields/select-field';
import { TextField } from '@/components/forms/fields/text-field';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { LoadingButton } from '@/components/ui/loading-button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

import { createUserMutation, updateUserMutation } from '../api/mutations';
import type { User } from '../api/types';
import { userSchema, type UserFormValues } from '../schemas/user';
import { ROLE_OPTIONS } from './users-table/options';

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Invited', label: 'Invited' }
];

interface UserFormSheetProps {
  user?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserFormSheet({ user, open, onOpenChange }: UserFormSheetProps) {
  const isEdit = !!user;

  const createMutation = useMutation({
    ...createUserMutation,
    onSuccess: () => {
      toast.success('User created');
    },
    onError: () => {
      toast.error("Couldn't create user. Try again.");
    }
  });

  const updateMutation = useMutation({
    ...updateUserMutation,
    onSuccess: () => {
      toast.success('User updated');
    },
    onError: () => {
      toast.error("Couldn't update user. Try again.");
    }
  });

  const formik = useFormik<UserFormValues>({
    initialValues: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      role: user?.role ?? '',
      status: user?.status ?? 'Active'
    },
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(userSchema),
    validateOnChange: false,
    validateOnBlur: false,

    onSubmit: async (values, helpers) => {
      try {
        if (user) {
          await updateMutation.mutateAsync({
            id: user.id,
            values
          });
        } else {
          await createMutation.mutateAsync(values);
          helpers.resetForm();
        }

        onOpenChange(false);
      } catch {
        // The mutation's onError callback displays the error toast.
      }
    }
  });

  const isPending = formik.isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <FormikProvider value={formik}>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className='flex flex-col'>
          <SheetHeader>
            <SheetTitle>{isEdit ? 'Edit User' : 'New User'}</SheetTitle>
            <SheetDescription>
              {isEdit
                ? 'Update the user details below.'
                : 'Fill in the details to create a new user.'}
            </SheetDescription>
          </SheetHeader>

          <div className='flex-1 overflow-auto'>
            <form
              id='user-form-sheet'
              className='space-y-4 p-4 md:p-4'
              onSubmit={formik.handleSubmit}
              noValidate
            >
              <FieldGroup>
                <div className='grid grid-cols-2 gap-4'>
                  <TextField name='first_name' label='First Name' required placeholder='John' />

                  <TextField name='last_name' label='Last Name' required placeholder='Doe' />
                </div>

                <TextField
                  name='email'
                  label='Email'
                  required
                  type='email'
                  placeholder='john@example.com'
                />

                <TextField
                  name='phone'
                  label='Phone'
                  required
                  type='tel'
                  placeholder='(555) 123-4567'
                />

                <SelectField
                  name='role'
                  label='Role'
                  required
                  options={ROLE_OPTIONS}
                  placeholder='Select role'
                />

                <SelectField
                  name='status'
                  label='Status'
                  required
                  options={STATUS_OPTIONS}
                  placeholder='Select status'
                />
              </FieldGroup>
            </form>
          </div>

          <SheetFooter>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <LoadingButton
              loading={isPending}
              disabled={isPending}
              type='submit'
              form='user-form-sheet'
            >
              {isEdit ? 'Update User' : 'Create User'}
            </LoadingButton>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </FormikProvider>
  );
}

export function UserFormSheetTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icons.add className='mr-2 h-4 w-4' /> Add User
      </Button>

      <UserFormSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
