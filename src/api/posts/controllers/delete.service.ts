import { ObjectId, Collection, DeleteResult } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { responseSchema } from '../../../models/responseSchema';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';

const deleteService = async (id): Promise<responseSchema> => {
  const postsCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('posts');
  const resData: DeleteResult = await postsCollection.deleteOne({
    _id: new ObjectId(id),
  });

  // if (!resData.) {
  //   return { status: 404, success: false, message: 'Not Found' };
  // }
  // if (resData.deletedCount) {
  //   return { status: 200, success: true, message: 'Deleted' };
  // }

  // Logger.warn(
  //   `Found Results\n: ${resData.result} \n Deleted Results: ${resData.deletedCount}\n`
  // );
  return { status: 204, success: false, message: 'No Content' };
};

export const deletePosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resData: responseSchema = await deleteService(req.params);
    res.status(resData.status).json(resData.message);
    next();
  } catch (error) {
    res.status(500).json(error);
    Logger.error(error);
  }
};
