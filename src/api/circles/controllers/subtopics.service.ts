import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';

export const createSubTopics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const subTopicsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('subTopics');
    let inData = {
      Category_Name: req.body.category_Name,
      Details: req.body.details,
      UID: new ObjectId(req.user),
    };
    await subTopicsCollection.insertOne(inData);
    res.status(200).json({
      success: true,
      message: `You created a sub topic `,
      data: inData,
    });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};
