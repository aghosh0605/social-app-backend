import { yupSignupSchema } from './authSchema';
import * as yup from 'yup';

export const yupUserSchema = yupSignupSchema.shape({
  fullName: yup.string().trim().required(),
  profileURL: yup.string().trim(),
  isDark: yup.boolean(),
  blockedUID: yup
    .string()
    .trim()
    .matches(/^[0-9a-f]{24}$/, 'Not a Valid UID'),
  about: yup.string().trim(),
  likedTags: yup.array().of(yup.string().trim()),
  address: yup.string().trim(),
  resumeURL: yup.string().trim(),
  blockedCID: yup
    .string()
    .trim()
    .matches(/^[0-9a-f]{24}$/, 'Not a Valid Circle ID'),
});
