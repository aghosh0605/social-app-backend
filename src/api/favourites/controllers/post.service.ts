import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';

export const handleFavourite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let _collection, _inData;
    switch (req.params.type) {
      case 'post':
        _collection = 'posts';
        _inData = {
          postID: new ObjectId(req.params.id),
          isPost: true,
          isCircle: false,
        };
        break;
      case 'circle':
        _collection = 'circles';
        _inData = {
          circleID: new ObjectId(req.params.id),
          isPost: false,
          isCircle: true,
        };
        break;
      case 'user':
        _collection = 'users';
        _inData = {
          UID: new ObjectId(req.params.id),
          isPost: false,
          isCircle: false,
        };
        break;
    }

    if (typeof req.query.id !== 'string') {
      throw { status: 404, success: false, message: 'ID is not a string' };
    }
    const collection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection(_collection);
    const exist = await collection.findOne({
      _id: new ObjectId(req.query.id),
    });

    if (!exist) {
      throw { status: 404, success: false, message: 'No data Found!' };
    } else {
      const favouritePost: Collection<any> = await (
        await DBInstance.getInstance()
      ).getCollection('favourites');
      let data = {
        ..._inData,
        followerUID: new ObjectId(req.user),
        timeStamp: Date.now(),
      };
      const favPostID: ObjectId = (await favouritePost.insertOne(data))
        .insertedId;
      res.status(200).json({ success: true, favPostID: favPostID });
      next();
    }
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};
