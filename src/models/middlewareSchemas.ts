import * as yup from "yup";

export const yupJwtHeader = yup.object({
  authorization: yup
    .string()
    .trim()
    .min(1, "JWT cannot be null")
    .matches(/^Bearer .+$/, "JWT should be Bearer Token")
    .required(),
});

export type JwtHeader = yup.InferType<typeof yupJwtHeader>;

export const yupObjIdSchema = yup.object({
  id: yup
    .string()
    .required("Please provide User ID")
    .trim()
    .matches(/^[0-9a-f]{24}$/, "Not a Valid UID"),
});

export type ObjIdSchema = yup.InferType<typeof yupObjIdSchema>;

export const yupObjTypeSchema = yup.object({
  type: yup.string().required("Please provide circle category").trim(),
});

export type ObjTypeSchema = yup.InferType<typeof yupObjTypeSchema>;

export const yupObjCirclesBodySchema = yup.object({
  circleName: yup.string().trim().required("Please provide a circle name"),
  isPrivate: yup.boolean().required("Please provide circle if is private"),
  tags: yup.string().trim().required("Please attach alteast one tag"),
  about: yup
    .string()
    .required("Enter about the circle")
    .trim()
    .min(1, "Minimum one character required")
    .max(500, "Maximum 500 characters allowed"),
  category: yup
    .string()
    .trim()
    .matches(/^[0-9a-f]{24}$/, "Not a Valid category ID"),
});

export type ObjCirclesBodySchema = yup.InferType<
  typeof yupObjCirclesBodySchema
>;
