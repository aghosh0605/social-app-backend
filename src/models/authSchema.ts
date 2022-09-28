import * as yup from 'yup';
import 'yup-phone';

export const yupLoginSchema = yup.object({
  username: yup.string().required().trim(),
  password: yup
    .string()
    .required()
    .trim()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/gm,
      'Username or Password not valid'
    ),
  token: yup.string().trim(),
});

export type LoginSchema = yup.InferType<typeof yupLoginSchema>;

export const yupSignupSchema = yup.object().shape({
  username: yup.string().trim(),
  password: yup
    .string()
    .trim()
    .required()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/gm,
      'Password not matches required characters'
    ),
  email: yup.string().email().trim(),
  phone: yup.string().when('isPhoneBlank', {
    is: false,
    then: yup.string().phone(),
    otherwise: yup.string(),
  }),
  createdOn: yup.date().default(() => new Date()),
  emailVerification: yup.boolean().default(false),
  mobileVerification: yup.boolean().default(false),
  isAdmin: yup.boolean().default(false),
  emailVerificationHash: yup.string().trim(),
  mobileVerificationHash: yup.string().trim(),
  emailVerificationSalt: yup.string().trim(),
});

export type SignupSchema = yup.InferType<typeof yupSignupSchema>;

export const yupOtpVerifySchema = yup.object({
  sessionID: yup.string().trim().required(),
  otp: yup.number().required(),
});

export type OtpVerifySchema = yup.InferType<typeof yupOtpVerifySchema>;

export const yupSendOtpScheme = yup.object({
  uid: yup.string().trim().required(),
});

export type SendOtpSchema = yup.InferType<typeof yupSendOtpScheme>;
