import * as yup from "yup";

export const yupCirclesValidation = yup.object({
  profileUrl: yup.string().required().trim(),
  bannerUrl: yup.string().required().trim(),
  name: yup.string().required().trim(),
  about: yup
    .string()
    .required()
    .trim()
    .min(20, "Minimum 20 characters required"),
  category: yup.string().required().trim(),
  private: yup.boolean().required(),
});

export type newCircleSchema = yup.InferType<typeof yupCirclesValidation>;
