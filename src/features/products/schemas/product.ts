import * as yup from 'yup';

const MAX_FILE_SIZE = 5_000_000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const productSchema = yup.object({
  image: yup
    .mixed<File[]>()
    .test('required', 'Image is required.', (files) => files?.length === 1)
    .test(
      'fileSize',
      'Max file size is 5MB.',
      (files) => !files?.[0] || files[0].size <= MAX_FILE_SIZE
    )
    .test(
      'fileType',
      '.jpg, .jpeg, .png and .webp files are accepted.',
      (files) => !files?.[0] || ACCEPTED_IMAGE_TYPES.includes(files[0].type)
    ),
  name: yup.string().min(2, 'Product name must be at least 2 characters.').required(),
  category: yup.string().min(1, 'Please select a category').required(),
  price: yup.number().required('Price is required'),
  description: yup.string().min(10, 'Description must be at least 10 characters.').required()
});

export type ProductFormValues = {
  image: File[] | undefined;
  name: string;
  category: string;
  price: number | undefined;
  description: string;
};
