import * as yup from 'yup';

export const yupJwtHeader = yup.object({
  Authorization: yup
    .string()
    .trim()
    .min(1, 'JWT cannot be null')
    .matches(/^Bearer .+$/, 'JWT should be Bearer Token')
    .required(),
});

export type JwtHeader = yup.InferType<typeof yupJwtHeader>;

export const yupObjIdSchema = yup.object({
  id: yup
    .string()
    .required('Please provide User ID')
    .trim()
    .matches(/^[0-9a-f]{24}$/, 'Not a Valid UID'),
});

export type ObjIdSchema = yup.InferType<typeof yupObjIdSchema>;
