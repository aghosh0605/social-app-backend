import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { commentSchema } from '../../../models/commentSchema';
import { throwSchema } from '../../../models/commonSchemas';

export const getPostComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commentsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('comments');
    //console.log(req.params);
    const result: commentSchema[] = await commentsCollection
      .find({
        $and: [{ postID: req.params.id }, { isChild: false }],
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

export const getChildComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commentsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('comments');
    //console.log(req.params);
    const result: commentSchema[] = await commentsCollection
      .find({
        $and: [{ parentCommentID: req.params.id }, { isChild: true }],
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

export const makeComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commentsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('comments');
    let data: commentSchema = {
      postID: req.params.id,
      UID: req.user,
      commentText: req.body.commentText,
      isChild: false,
      parentCommentID: undefined,
      createdOn: new Date(),
    };
    if (req.body.isChild) {
      data.isChild = true;
      data.parentCommentID = req.body.parentCommentID;
    }
    const commentData = await commentsCollection.insertOne(data);
    res
      .status(200)
      .json({ success: true, message: 'Comment Added Successfully' });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};

export const editComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commentsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('comments');
    const commentExist = await commentsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!commentExist) {
      throw {
        statusCode: 400,
        message: 'The comment cannot be found',
      } as throwSchema;
    }
    if (commentExist.UID != req.user) {
      throw {
        statusCode: 400,
        message: 'Only creator can delete post',
      } as throwSchema;
    }
    await commentsCollection.updateOne(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: {
          commentText: req.body.commentText,
        },
      }
    );
    res
      .status(200)
      .json({ success: true, message: 'Comment Edited Successfully' });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('comments');
    const commentExist = await commentsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!commentExist) {
      throw {
        statusCode: 400,
        message: 'The comment cannot be found',
      } as throwSchema;
    }
    if (commentExist.UID != req.user) {
      throw {
        statusCode: 400,
        message: 'Only creator can delete post',
      } as throwSchema;
    }
    const commentData = await commentsCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res
      .status(200)
      .json({ success: true, message: 'Comment Deleted Successfully' });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};
