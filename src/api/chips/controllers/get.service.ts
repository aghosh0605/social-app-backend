import { Db } from 'mongodb';
import db from '../../../loaders/database';
import { dbSchemaID } from '../../../models/chips/dbSchema';

export const getService = async (): Promise<dbSchemaID[]> => {
  const data: Db = await db();
  return await data.collection('posts').find().toArray();
};
