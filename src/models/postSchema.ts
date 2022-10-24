import * as yup from 'yup';

export const yupPostSchema = yup.object({
  UID: yup
    .string()
    .trim()
    .required('Please provide User ID')
    .matches(/^[0-9a-f]{24}$/, 'Not a Valid UID'),
  circleID: yup
    .string()
    .required('Please provide Circle ID')
    .trim()
    .matches(/^[0-9a-f]{24}$/, 'Not a Valid Circle ID'),
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
  mediaURLs: yup.array().of(
    yup.object({
      mimeType: yup.string().nullable().trim(),
      URL: yup.string().url().nullable(),
      thumbnailURL: yup.string().url().nullable(),
    })
  ),
  caption: yup
    .string()
    .required('Enter a caption for the post')
    .trim()
    .min(1, 'Minimum one character required')
    .max(500, 'Maximum 500 characters allowed'),
  category: yup
    .string()
    .required('Select a category')
    .trim()
    .min(1, 'Minimum one character required')
    .max(50, 'Maximum 50 characters allowed'),
  createdOn: yup.string().default(() => new Date().toDateString()),
});

export type postSchema = yup.InferType<typeof yupPostSchema>;

const yupMediaUrlSchema = yupPostSchema.pick['mediaURLs'];
export type mediaURLSchema = yup.InferType<typeof yupMediaUrlSchema>;

// Fav post schema
export const yupFavPostSchema = yup.object({
  postID: yup.string().required().trim(),
});

export type favPostSchema = yup.InferType<typeof yupFavPostSchema>;