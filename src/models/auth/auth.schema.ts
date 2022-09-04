import * as yup from 'yup';

export const LoginRequestSchema = yup.object({
  username: yup.string().required().trim(),
  password: yup.string().required().trim(),
  token: yup.string().trim(),
});

export type LoginRequest = yup.InferType<typeof LoginRequestSchema>;

export const SignupRequestSchema = yup.object({
  username: yup.string().trim().required(),
  password: yup.string().trim().required(),
});

export type SignupRequest = yup.InferType<typeof SignupRequestSchema>;
