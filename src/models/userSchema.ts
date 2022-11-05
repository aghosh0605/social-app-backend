import { yupSignupSchema } from './authSchema';
import * as yup from 'yup';
import 'yup-phone';

export const yupUserSchema = yup
  .object()
  .shape({
    avatarURL: yup.string().trim(),
    isDark: yup.boolean().default(false),
    info: yup.string().trim(),
    likedTags: yup.array().of(yup.string().trim()),
    place: yup.string().trim(),
    resumeURL: yup.string().trim(),
    profession: yup.string().trim(),
    born: yup.date(),
    websites: yup.object().shape({
      portfolio: yup.string().trim(),
      github: yup.string().trim(),
      linkedin: yup.string().trim(),
      other: yup.string().trim(),
    }),
  })
  .noUnknown(true)
  .strict();

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
