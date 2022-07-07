import * as yup from 'yup';

export const yupChipsValidation = yup.object({
  caption: yup
    .string()
    .required()
    .trim()
    .min(1, 'Minimum one character required')
    .max(500, 'Maximum 500 characters allowed'),

  tags: yup
    .string()
    .required()
    .trim()
    .max(100, 'Maximum 100 characters allowed'),
  circle: yup
    .string()
    .required()
    .trim()
    .min(1, 'Minimum one character required')
    .max(100, 'Maximum 100 characters allowed'),
});

export type postSchema = yup.InferType<typeof yupChipsValidation>;
