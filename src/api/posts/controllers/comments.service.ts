import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';

export const makeComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('posts');
    const commentData = await postsCollection.updateOne(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: {
          comments: {
            comment: req.body.comment,
          },
        },
      }
    );
    res.status(200).json(commentData);
    next();
  } catch (error) {
    res.status(500).json(error);
    Logger.error(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('posts');
    const commentData = await postsCollection.updateOne(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: {
          comments: {
            comment: '',
          },
        },
      }
    );
    res.status(200).json(commentData);
    next();
  } catch (error) {
    res.status(500).json(error);
    Logger.error(error);
  }
};
