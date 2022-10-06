import { ObjectId, Collection, DeleteResult } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { responseSchema, throwSchema } from '../../../models/generalSchemas';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { postSchema } from '../../../models/postSchema';
import { s3Delete } from '../../../utils/s3Client';

const deleteService = async (req: Request): Promise<void> => {
  const postsCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('posts');
  const postExist: postSchema = await postsCollection.findOne({
    _id: new ObjectId(req.params.id),
  });
  if (!postExist) {
    throw { status: 404, success: false, message: 'No Post Found!' };
  }
  if (req.user != postExist.UID) {
    throw {
      statusCode: 404,
      message: 'Only creator can delete post',
    } as throwSchema;
  }
  if (postExist.mediaURLs.length > 0) {
    const delObjs = [];
    postExist.mediaURLs.forEach((element) => {
      const URLPath = new URL(element.URL).pathname.substring(1);
      delObjs.push({ Key: URLPath });
      //console.log(delObjs);
    });
    await s3Delete(delObjs);
  }
  const resData: DeleteResult = await postsCollection.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  if (!resData.acknowledged) {
    throw { status: 404, success: false, message: 'Delete Permission Error' };
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteService(req);
    res.status(200).json({ 
      success: true, 
      message: 'Post Deleted',
      data: null,
    });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      status: false,
      message: err.message || '❌ Unknown Error Occurred !! ',
      data: null,
    });
  }
};
