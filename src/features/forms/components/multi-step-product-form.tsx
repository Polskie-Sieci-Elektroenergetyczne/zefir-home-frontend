'use client';

import { FormikProvider, useFormik } from 'formik';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import * as yup from 'yup';

import { SelectField } from '@/components/forms/fields/select-field';
import { TextField } from '@/components/forms/fields/text-field';
import { TextareaField } from '@/components/forms/fields/textarea-field';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { FieldDescription, FieldGroup } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useFormStepper } from '@/hooks/use-stepper';

const productFormSchema = yup.object({
  name: yup.string().min(2, 'Product name must be at least 2 characters').required(),
  category: yup.string().min(1, 'Please select a category').required(),
  price: yup
    .number()
    .typeError('Price is required')
    .required('Price is required')
    .min(0.01, 'Price must be greater than 0'),
  description: yup.string().min(10, 'Description must be at least 10 characters').required()
});

const stepSchemas = [
  productFormSchema.pick(['name', 'category', 'price']),
  productFormSchema.pick(['description']),
  yup.object({})
];

const categoryOptions = [
  { value: 'beauty', label: 'Beauty Products' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports & Outdoors' }
];

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

function ReviewSummary({ values }: { values: ProductFormValues }) {
  return (
    <div className='space-y-3'>
      <Separator />
      <div className='grid gap-3'>
        <div>
          <p className='text-muted-foreground text-xs font-medium uppercase'>Name</p>
          <p className='text-sm'>{values.name || '—'}</p>
        </div>
        <div>
          <p className='text-muted-foreground text-xs font-medium uppercase'>Category</p>
          <p className='text-sm capitalize'>{values.category || '—'}</p>
        </div>
        <div>
          <p className='text-muted-foreground text-xs font-medium uppercase'>Price</p>
          <p className='text-sm'>{values.price != null ? `$${values.price}` : '—'}</p>
        </div>
        <div>
          <p className='text-muted-foreground text-xs font-medium uppercase'>Description</p>
          <p className='text-sm'>{values.description || '—'}</p>
        </div>
      </div>
    </div>
  );
}

export default function MultiStepProductForm() {
  const { step, currentStep, isFirstStep, handleCancelOrBack, handleNextStepOrSubmit } =
    useFormStepper(stepSchemas, {
      fullSchema: productFormSchema
    });

  const formik = useFormik<ProductFormValues>({
    initialValues,
    // Full validation still guards a real Formik submit. Step navigation uses
    // the individual schemas in useFormStepper instead of validateForm().
    validationSchema: productFormSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: () => {
      toast.success('Product created successfully!');
    }
  });

  const handleNext = async () => {
    await handleNextStepOrSubmit(formik);
  };

  const totalSteps = step.count;

  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void handleNext();
        }}
        noValidate
        aria-busy={formik.isSubmitting}
        className='mx-auto flex w-full flex-col gap-2 p-0'
      >
        <div className='flex flex-col gap-2 pt-3'>
          <div className='flex flex-col items-center justify-start gap-1'>
            <span className='text-muted-foreground text-sm'>
              Step {currentStep} of {totalSteps}
            </span>
            <Progress value={(currentStep / totalSteps) * 100} />
          </div>

          <AnimatePresence mode='popLayout'>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.4, type: 'spring' }}
              className='flex flex-col gap-2'
            >
              {currentStep === 1 && (
                <FieldGroup className='space-y-4'>
                  <h3 className='text-lg font-semibold'>Basic Info</h3>
                  <FieldDescription>Enter the product name, category, and price.</FieldDescription>

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
                </FieldGroup>
              )}

              {currentStep === 2 && (
                <FieldGroup className='space-y-4'>
                  <h3 className='text-lg font-semibold'>Details</h3>
                  <FieldDescription>Add a detailed product description.</FieldDescription>

                  <TextareaField
                    name='description'
                    label='Description'
                    required
                    placeholder='Enter product description'
                    maxLength={500}
                    rows={5}
                  />
                </FieldGroup>
              )}

              {currentStep === 3 && (
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold'>Review & Submit</h3>
                  <FieldDescription>Review the details below before submitting.</FieldDescription>
                  <ReviewSummary values={formik.values} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className='flex w-full items-center justify-between gap-3 pt-3'>
            <Button
              size='sm'
              variant='ghost'
              type='button'
              disabled={isFirstStep}
              onClick={() => handleCancelOrBack({ onBack: () => {} })}
            >
              <Icons.chevronLeft /> Previous
            </Button>

            <div className='flex w-full items-center justify-end gap-3 pt-3'>
              {formik.dirty && (
                <Button
                  type='button'
                  onClick={() => formik.resetForm()}
                  className='rounded-lg'
                  variant='outline'
                  size='sm'
                >
                  Reset
                </Button>
              )}

              {step.isCompleted ? (
                <Button type='submit' disabled={formik.isSubmitting}>
                  Submit
                </Button>
              ) : (
                <Button size='sm' variant='ghost' type='button' onClick={() => void handleNext()}>
                  Next <Icons.chevronRight />
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </FormikProvider>
  );
}
