import { yupSignupSchema } from './authSchema';
import * as yup from 'yup';
import 'yup-phone';

export const yupUserSchema = yupSignupSchema.shape({
  profileURL: yup.string().trim(),
  isDark: yup.boolean().default(false),
  blockedUID: yup.array().of(
    yup
      .string()
      .trim()
      .matches(/^[0-9a-f]{24}$/, 'Not a Valid User ID')
  ),
  about: yup.string().trim(),
  likedTags: yup.array().of(yup.string().trim()),
  address: yup.string().trim(),
  resumeURL: yup.string().trim(),
  blockedCID: yup.array().of(
    yup
      .string()
      .trim()
      .matches(/^[0-9a-f]{24}$/, 'Not a Valid Circle ID')
  ),
});

export type yupUserProfileSchema = yup.InferType<typeof yupUserSchema>;

export const yupUserSearchType = yup.object({
  type: yup.string().trim().required('Please specify a user search type'),
});

export type userSearchType = yup.InferType<typeof yupUserSearchType>;

export const yupUserSearchData = yup.object({
  email: yup.string().email().trim(),
  phone: yup.string().when('isPhoneBlank', {
    is: false,
    then: yup.string().phone(),
    otherwise: yup.string(),
  }),
  id: yup
    .string()
    .trim()
    .matches(/^[0-9a-f]{24}$/, 'Not a Valid User ID'),
});

export type userSearchData = yup.InferType<typeof yupUserSearchData>;
