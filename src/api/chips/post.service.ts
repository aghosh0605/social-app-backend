import { Db } from 'mongodb';
import db from '../../loaders/database';
import { newChipsValidation, postSchema } from '../../schema/chips/postSchema';
import { dbSchema } from '../../schema/chips/dbSchema';

export const postService = async (chipsData: postSchema): Promise<void> => {
  await newChipsValidation
    .validate(chipsData, { abortEarly: false })
    .then(async (value) => {
      const inpData: dbSchema = {
        caption: value.caption,
        comments: {
          commentsCount: 0,
          commentedUsers: {},
        },
        likes: {
          likesCount: 0,
          likedUsers: {},
        },
        tags: value.tags.split(','),
        pictureUrl: [],
        circle: 'Public',
      };
      const data: Db = await db();
      await data.collection('posts').insertOne(inpData);
    });
};
