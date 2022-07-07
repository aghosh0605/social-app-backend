import { Db } from 'mongodb';
import db from '../../loaders/database';
import { postSchema } from '../../models/chips/postSchema';

export const getService = async (): Promise<postSchema[]> => {
  const data: Db = await db();
  return await data.collection('posts').find().toArray();
};
