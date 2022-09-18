import * as yup from 'yup';

export const yupLikeShema = yup.object({
  postID: yup
    .string()
    .trim()
    .matches(/^[0-9a-f]{24}$/, 'Not a Valid Post ID'),
  UID: yup
    .string()
    .trim()
    .matches(/^[0-9a-f]{24}$/, 'Not a Valid UID'),
  commentID: yup
    .string()
    .trim()
    .matches(/^[0-9a-f]{24}$/, 'Not a Valid Comment ID'),
  likeEmoji: yup.string().trim().required('Please enter your comment'),
  isComment: yup.boolean().default(true),
  createdOn: yup.date().default(() => new Date()),
});

export type likeSchema = yup.InferType<typeof yupLikeShema>;
