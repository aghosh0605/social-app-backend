import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';

export const getCurrentUserFav = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const favCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('favourites');
    const favData = await favCollection
      .find({
        followerUID: new ObjectId(req.user),
      })
      .toArray();

    if (!favData) {
      throw { status: 404, success: false, message: 'No favourites Found!' };
    }

    res.status(200).json({ success: true, data: favData });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};
