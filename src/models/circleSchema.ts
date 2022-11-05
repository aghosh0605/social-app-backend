import { ObjectId } from "mongodb";
import * as yup from "yup";
import "yup-phone";
export const yupCircleSchema = yup.object({
  circleName: yup.string().trim().required("Please provide a circle name"),
  UID: yup
    .string()
    .trim()
    .required("Please provide User ID")
    .matches(/^[0-9a-f]{24}$/, "Not a Valid UID"),
  isPrivate: yup.boolean().required("Please provide circle if is private"),
  tags: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .min(1, "Minimum one character required")
        .max(50, "Maximum 50 characters allowed")
    ),
  mediaURLs: yup.array().of(
    yup.object({
      mimeType: yup.string().nullable().trim(),
      URL: yup.string().url().nullable(),
      thumbnailURL: yup.string().url().nullable(),
    })
  ),
  about: yup
    .string()
    .required("Enter about the circle")
    .trim()
    .min(1, "Minimum one character required")
    .max(500, "Maximum 500 characters allowed"),
  category: yup
    .string()
    .required("Select a category")
    .trim()
    .min(1, "Minimum one character required")
    .max(50, "Maximum 50 characters allowed"),
  categoryID: yup
    .string()
    .trim()
    .required("Please provide Category ID")
    .matches(/^[0-9a-f]{24}$/, "Not a Valid category ID"),
  createdOn: yup.date().default(() => new Date()),
  last_updated_date: yup.date().default(() => new Date()),
});

export type _circleSchema = yup.InferType<typeof yupCircleSchema>;
export type circleSchema = _circleSchema & {
  _id: ObjectId;
};

const yupMediaUrlSchema = yupCircleSchema.pick["mediaURLs"];
export type mediaURLSchema = yup.InferType<typeof yupMediaUrlSchema>;

// get request schemas

export const yupCircleSearchType = yup.object({
  type: yup.string().trim().required("Please specify a circle search type"),
});

export type circleSearchType = yup.InferType<typeof yupCircleSearchType>;

export const yupCircleSearchData = yup.object({
  tag: yup.string().trim(),
  user: yup
    .string()
    .trim()
    .matches(/^[0-9a-f]{24}$/, "Not a Valid User ID"),
  posts: yup
    .string()
    .trim()
    .matches(/^[0-9a-f]{24}$/, "Not a Valid Posts ID"),
  id: yup
    .string()
    .trim()
    .matches(/^[0-9a-f]{24}$/, "Not a Valid User ID"),
  topic: yup
    .string()
    .trim()
    .matches(/^[0-9a-f]{24}$/, "Not a Valid topic ID"),
});

export type userCircleData = yup.InferType<typeof yupCircleSearchData>;

export const yupSubTopicsSchema = yup.object({
  Serial_Number: yup.number(),
  Category_Name: yup.string(),
  picUrl: yup.string().trim(),
  Details: yup.string().trim(),
});

type _subTopicsSchema = yup.InferType<typeof yupSubTopicsSchema>;

export type subTopicsSchema = _subTopicsSchema & {
  _id: ObjectId;
};
