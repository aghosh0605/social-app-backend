import { Collection } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { postSchema } from '../../../models/postSchema';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // console.log(req.user);
    const postsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('posts');
    const resData: postSchema[] = await postsCollection.find().toArray();
    res.status(200).json({ status: true, message: resData });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};
