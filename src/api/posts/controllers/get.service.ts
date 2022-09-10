import { Collection } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { dbSchemaID } from '../../../models/posts/dbSchema';

export const getService = async (): Promise<dbSchemaID[]> => {
  const postsCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('posts');
  return await postsCollection.find().toArray();
};
