import * as yup from "yup";
import "yup-phone";

export const yupLoginSchema = yup.object({
  username: yup.string().required().trim(),
  password: yup.string().required().trim(),
  token: yup.string().trim(),
});

export type LoginSchema = yup.InferType<typeof yupLoginSchema>;

export const yupSignupSchema = yup.object({
  username: yup.string().trim().required(),
  password: yup.string().trim().required(),
  email: yup.string().email().trim().required(),
  phone: yup.string().phone().required(),
  createdOn: yup.date().default(() => new Date()),
  emailVerification: yup.boolean(),
  mobileVerification: yup.boolean(),
  isAdmin: yup.boolean(),
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
