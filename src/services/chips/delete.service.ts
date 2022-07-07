import { Db, DeleteWriteOpResultObject, ObjectID } from 'mongodb';
import db from '../../loaders/database';
import { responseSchema } from '../../models/responseSchema';
import Logger from '../../loaders/logger';

export const deleteService = async (id): Promise<responseSchema> => {
  const data: Db = await db();
  const resData: DeleteWriteOpResultObject = await data
    .collection('posts')
    .deleteOne({
      _id: new ObjectID(id),
    });

  if (!resData.result.n) {
    return { status: 404, success: false, message: 'Not Found' };
  }
  if (resData.deletedCount) {
    return { status: 200, success: true, message: 'Deleted' };
  }

  Logger.warn(
    `Found Results\n: ${resData.result} \n Deleted Results: ${resData.deletedCount}\n`
  );
  return { status: 204, success: false, message: 'No Content' };
};
