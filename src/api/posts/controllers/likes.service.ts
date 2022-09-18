import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { likeSchema } from '../../../models/likeSchema';
import { throwSchema } from '../../../models/commonSchemas';

export const getPostLike = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const likesCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('likes');
    //console.log(req.params);
    const result: likeSchema[] = await likesCollection
      .find({
        $and: [{ postID: req.params.id }, { isComment: false }],
      })
      .toArray();
    res.status(200).json({ success: true, message: result });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};

export const getCommentLike = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const likesCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('likes');
    //console.log(req.params);
    const result: likeSchema[] = await likesCollection
      .find({
        $and: [{ commentID: req.params.id }, { isComment: true }],
      })
      .toArray();
    res.status(200).json({ success: true, message: result });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};

export const makeLike = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const likesCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('likes');
    let data: likeSchema = {
      postID: req.params.id,
      UID: req.user,
      commentID: undefined,
      likeEmoji: req.body.likeEmoji,
      isComment: false,
      createdOn: new Date(),
    };
    if (req.body.isComment) {
      data.isComment = true;
      data.commentID = req.params.id;
      data.postID = undefined;
    }
    await likesCollection.insertOne(data);
    res.status(200).json({ success: true, message: 'Liked Successfully' });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};

export const editLike = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const likesCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('likes');
    const likeExist = await likesCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!likeExist) {
      throw {
        statusCode: 400,
        message: 'The like cannot be found',
      } as throwSchema;
    }
    if (likeExist.UID != req.user) {
      throw {
        statusCode: 400,
        message: 'Only creator can edit post',
      } as throwSchema;
    }
    await likesCollection.updateOne(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: {
          likeEmoji: req.body.likeEmoji,
        },
      }
    );
    res
      .status(200)
      .json({ success: true, message: 'Like Changed Successfully' });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};

export const deleteLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const likesCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('likes');
    const likeExist = await likesCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!likeExist) {
      throw {
        statusCode: 400,
        message: 'The like cannot be found',
      } as throwSchema;
    }
    if (likeExist.UID != req.user) {
      throw {
        statusCode: 400,
        message: 'Only creator can unlike',
      } as throwSchema;
    }
    await likesCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.status(200).json({ success: true, message: 'Disliked Successfully' });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};
