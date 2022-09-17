import * as yup from 'yup';

export const yupCommentShema = yup.object({
  postID: yup
    .string()
    .trim()
    .matches(/^[0-9a-f]{24}$/, 'Not a Valid Post ID'),
  UID: yup
    .string()
    .trim()
    .matches(/^[0-9a-f]{24}$/, 'Not a Valid UID'),
  commentText: yup.string().trim().required('Please enter your comment'),
  parentCommentID: yup
    .string()
    .trim()
    .matches(/^[0-9a-f]{24}$/, 'Not a Valid comment ID'),
  isChild: yup.boolean().default(false),
  createdOn: yup.date().default(() => new Date()),
});

export type commentSchema = yup.InferType<typeof yupCommentShema>;
