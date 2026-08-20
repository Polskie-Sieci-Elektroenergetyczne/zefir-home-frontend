import * as yup from 'yup';

export const userSchema = yup.object({
  first_name: yup.string().min(2, 'First name must be at least 2 characters'),
  last_name: yup.string().min(2, 'Last name must be at least 2 characters'),
  email: yup.string().email('Please enter a valid email'),
  phone: yup.string().min(1, 'Phone number is required'),
  role: yup.string().min(1, 'Please select a role'),
  status: yup.string().min(1, 'Please select a status')
});

export type UserFormValues = yup.InferType<typeof userSchema>;
