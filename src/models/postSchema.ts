import * as yup from 'yup';

export const yupPostSchema = yup.object({
  UID: yup
    .string()
    .required('Please provide User ID')
    .trim()
    .matches(/^[0-9a-fA-F]{24}$/, 'Not a Valid UID'),
  circleID: yup
    .string()
    .required('Please provide Circle ID')
    .trim()
    .matches(/^[0-9a-fA-F]{24}$/, 'Not a Valid Circle ID'),
  tags: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .min(1, 'Minimum one character required')
        .max(50, 'Maximum 50 characters allowed')
    )
    .required('Please attach tags'),
  mediaURLs: yup
    .array()
    .of(
      yup.object({
        mimeType: yup.string().required().trim(),
        URL: yup.string().url().nullable(),
        thumbnailURL: yup.string().url().nullable(),
      })
    )
    .required('Please attach media URLs'),
  caption: yup
    .string()
    .required()
    .trim()
    .min(1, 'Minimum one character required')
    .max(500, 'Maximum 500 characters allowed'),
  category: yup
    .string()
    .required()
    .trim()
    .min(1, 'Minimum one character required')
    .max(50, 'Maximum 50 characters allowed'),
  createdOn: yup.date().default(() => new Date()),
});

export type postSchema = yup.InferType<typeof yupPostSchema>;
