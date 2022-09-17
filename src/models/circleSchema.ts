import * as yup from "yup";

export const yupCircleSchema = yup.object({
  circleName: yup.string().trim().required("Please provide username"),
  UID: yup
    .string()
    .trim()
    .required("Please provide User ID")
    .matches(/^[0-9a-f]{24}$/, "Not a Valid UID"),
  tags: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .min(1, "Minimum one character required")
        .max(50, "Maximum 50 characters allowed")
    )
    .required("Please attach tags"),
  mediaURLs: yup.array().of(
    yup.object({
      mimeType: yup.string().nullable().trim(),
      URL: yup.string().url().nullable(),
      thumbnailURL: yup.string().url().nullable(),
    })
  ),
  about: yup
    .string()
    .required("Enter a caption for the post")
    .trim()
    .min(1, "Minimum one character required")
    .max(500, "Maximum 500 characters allowed"),
  category: yup
    .string()
    .required("Select a category")
    .trim()
    .min(1, "Minimum one character required")
    .max(50, "Maximum 50 characters allowed"),
  createdOn: yup.date().default(() => new Date()),
});

export type circleSchema = yup.InferType<typeof yupCircleSchema>;

const yupMediaUrlSchema = yupCircleSchema.pick["mediaURLs"];
export type mediaURLSchema = yup.InferType<typeof yupMediaUrlSchema>;
