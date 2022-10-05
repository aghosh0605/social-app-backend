import { Collection, ObjectId } from 'mongodb';
import {DBInstance} from '../../../loaders/database';
import { postSchema } from '../../../models/postSchema';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';

const updateService = async (req, res): Promise<ObjectId> => {
  const postsCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('posts');
  const inData = req.body as postSchema;
  const resData = await postsCollection.findOneAndUpdate({
    _id: new ObjectId(req.params.id),
  }, {
    $set: inData,
  })
    return resData.value._id;
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postID = await updateService(req, res);
    res.status(200).json({ success: true, message: postID });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};