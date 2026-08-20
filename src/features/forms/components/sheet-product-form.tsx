'use client';

import { FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';

import { SelectField } from '@/components/forms/fields/select-field';
import { TextField } from '@/components/forms/fields/text-field';
import { TextareaField } from '@/components/forms/fields/textarea-field';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

const productSchema = yup.object({
  name: yup.string().min(2, 'Product name must be at least 2 characters').required(),
  category: yup.string().min(1, 'Please select a category').required(),
  price: yup
    .number()
    .typeError('Price is required')
    .required('Price is required')
    .min(0.01, 'Price must be greater than 0'),
  description: yup.string().min(10, 'Description must be at least 10 characters').required()
});

type ProductFormValues = {
  name: string;
  category: string;
  price: number | undefined;
  description: string;
};

const initialValues: ProductFormValues = {
  name: '',
  category: '',
  price: undefined,
  description: ''
};

const categoryOptions = [
  { value: 'beauty', label: 'Beauty Products' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports & Outdoors' }
];

export default function SheetProductForm() {
  const [open, setOpen] = useState(false);

  const formik = useFormik<ProductFormValues>({
    initialValues,
    validationSchema: productSchema,
    onSubmit: () => {
      alert('Product created successfully!');
      setOpen(false);
      formik.resetForm();
    }
  });

  return (
    <FormikProvider value={formik}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button />}>
          <Icons.add className='mr-2 h-4 w-4' />
          Add Product
        </SheetTrigger>

        <SheetContent className='flex flex-col'>
          <SheetHeader>
            <SheetTitle>New Product</SheetTitle>
            <SheetDescription>Fill in the details to create a new product.</SheetDescription>
          </SheetHeader>

          <div className='flex-1 overflow-auto'>
            <form
              id='sheet-product-form'
              className='space-y-4 p-4 md:p-4'
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <FieldGroup>
                <TextField
                  name='name'
                  label='Product Name'
                  required
                  placeholder='Enter product name'
                />

                <SelectField
                  name='category'
                  label='Category'
                  required
                  options={categoryOptions}
                  placeholder='Select category'
                />

                <TextField
                  name='price'
                  label='Price'
                  required
                  type='number'
                  min={0}
                  step={0.01}
                  placeholder='Enter price'
                />

                <TextareaField
                  name='description'
                  label='Description'
                  required
                  placeholder='Enter product description'
                  maxLength={500}
                  rows={4}
                  showCount
                />
              </FieldGroup>
            </form>
          </div>

          <SheetFooter>
            <Button type='button' variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type='submit' form='sheet-product-form' disabled={formik.isSubmitting}>
              Create Product
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </FormikProvider>
  );
}
