import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { postSchema } from '../../../models/postSchema';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //console.log(req.user);
    const postsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('posts');
    const resData: postSchema[] = await postsCollection.find().toArray();
    res.status(200).json({ success: true, message: resData });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};

export const getUserPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //console.log(req.params.id);
    const postsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('posts');
    const resData: postSchema[] = await postsCollection
      .find({ UID: req.params.id })
      .toArray();
    //console.log(resData);
    res.status(200).json({ success: true, message: resData });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};
