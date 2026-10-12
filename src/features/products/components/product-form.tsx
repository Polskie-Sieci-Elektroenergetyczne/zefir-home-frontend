'use client';

import { useMutation } from '@tanstack/react-query';
import { FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { LoadingButton } from '@/components/ui/loading-button';

import { FileUploadField } from '@/components/forms/fields/file-upload-field';
import { SelectField } from '@/components/forms/fields/select-field';
import { TextField } from '@/components/forms/fields/text-field';
import { TextareaField } from '@/components/forms/fields/textarea-field';

import { categoryOptions } from '@/features/products/constants/product-options';
import { productSchema, type ProductFormValues } from '@/features/products/schemas/product';

import { createProductMutation, updateProductMutation } from '../api/mutations';
import type { Product } from '../api/types';

export default function ProductForm({
  initialData,
  pageTitle
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const isEdit = !!initialData;

  const createMutation = useMutation({
    ...createProductMutation,
    onSuccess: () => {
      toast.success('Product created');
      router.push('/dashboard/product');
    },
    onError: () => {
      toast.error("Couldn't create product. Try again.");
    }
  });

  const updateMutation = useMutation({
    ...updateProductMutation,
    onSuccess: () => {
      toast.success('Product updated');
      router.push('/dashboard/product');
    },
    onError: () => {
      toast.error("Couldn't update product. Try again.");
    }
  });

  const formik = useFormik<ProductFormValues>({
    initialValues: {
      image: undefined,
      name: initialData?.name ?? '',
      category: initialData?.category ?? '',
      price: initialData?.price,
      description: initialData?.description ?? ''
    },
    validationSchema: toFormikValidationSchema(productSchema),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const payload = {
        name: values.name,
        category: values.category,
        price: values.price!,
        description: values.description
      };

      try {
        if (initialData) {
          await updateMutation.mutateAsync({
            id: initialData.id,
            values: payload
          });
        } else {
          await createMutation.mutateAsync(payload);
        }
      } catch {
        // The mutation's onError callback displays the error toast.
      }
    }
  });

  const isPending = formik.isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <FormikProvider value={formik}>
      <Card className='mx-auto w-full max-w-3xl'>
        <CardHeader>
          <CardTitle className='text-left text-2xl font-bold'>{pageTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className='space-y-8' onSubmit={formik.handleSubmit} noValidate>
            <FieldGroup>
              <FileUploadField
                name='image'
                label='Product Image'
                description='Upload a product image'
                maxSize={5 * 1024 * 1024}
                maxFiles={4}
              />
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
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
              </div>
              <TextareaField
                name='description'
                label='Description'
                required
                placeholder='Enter product description'
                maxLength={500}
                rows={4}
              />
            </FieldGroup>
            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={() => router.back()}>
                Cancel
              </Button>
              <LoadingButton loading={isPending} disabled={isPending} type='submit'>
                {isEdit ? 'Update Product' : 'Add Product'}
              </LoadingButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormikProvider>
  );
}
