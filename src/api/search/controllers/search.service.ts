import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';

export const searchHomePage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const usersCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('users');
    const circleCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('circles');
    if (req.body.searchData) {
      let circleMatchingData = await circleCollection
        .find({
          circleName: { $regex: req.body.searchData, $options: 'i' },
        })
        .project({ _id: 0 })
        .toArray();
      let usersMatchingData = await usersCollection
        .find({
          full_name: { $regex: req.body.searchData, $options: 'i' },
        })
        .project({ _id: 0 })
        .toArray();
      let finalData = { circleMatchingData, usersMatchingData };
      res.status(200).json({
        success: true,
        message: 'Searched Successfully!',
        data: finalData,
      });
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

export const searchCirclePage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const circleCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('circles');
    if (req.body.searchData) {
      let circleMatchingData = await circleCollection
        .find({
          $or: [
            { circleName: { $regex: req.body.searchData, $options: 'i' } },
            {
              category: { $regex: req.body.searchData, $options: 'i' },
            },
          ],
        })
        .project({ _id: 0 })
        .toArray();
      res
        .status(200)
        .json({
          success: true,
          message: 'Searched Successfully!',
          data: circleMatchingData,
        });
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
