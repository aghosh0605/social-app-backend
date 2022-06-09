import * as yup from "yup";

export const yupPostsSchema = yup.object({
  id: yup
    .string()
    .trim()
    .required("PostId Required")
    .length(24, "Must be 24 characters"),
  caption: yup
    .string()
    .trim()
    .min(1, "Minimum one character required")
    .max(500, "Maximum 500 characters allowed"),
  likes: yup.object({
    likesCount: yup
      .number()
      .required("Number of Likes required")
      .default(0)
      .min(1, "Minimum one character required"),
    likedUsers: yup
      .string()
      .min(4, "Minimum four characters required")
      .max(25, "Maximum 25 characters allowed"),
  }),
  comments: yup.object({
    commentsCount: yup
      .number()
      .required("Number of comments required")
      .default(0)
      .min(1, "Minimum one character required"),
    commentedUsers: yup
      .string()
      .min(4, "Minimum four characters required")
      .max(25, "Maximum 25 characters allowed"),
    commentsData: yup
      .string()
      .min(1, "Minimum one character required")
      .max(255, "Maximum 255 characters allowed"),
  }),
});

export type postsSchema = yup.InferType<typeof yupPostsSchema>;
