import * as yup from 'yup';

export const yupLoginSchema = yup.object({
  username: yup.string().required().trim(),
  password: yup.string().required().trim(),
  token: yup.string().trim(),
});

export type LoginSchema = yup.InferType<typeof yupLoginSchema>;

export const yupSignupSchema = yup.object({
  username: yup.string().trim().required(),
  password: yup.string().trim().required(),
});

export type SignupSchema = yup.InferType<typeof yupSignupSchema>;
