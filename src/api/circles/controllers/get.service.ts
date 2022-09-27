import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { circleSchema } from '../../../models/circleSchema';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';

export const getCircles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const circlesCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('circles');

    const resData: circleSchema[] = await circlesCollection.find().toArray();
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

export const getSpecificCircles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const circlesCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('circles');
    const resData: circleSchema = await circlesCollection.findOne({
      _id: new ObjectId(`${req.params.id}`),
    });
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
