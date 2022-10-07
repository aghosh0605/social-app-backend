import { DBInstance } from '../../../loaders/database';
import Logger from '../../../loaders/logger';
import { Collection, ObjectId } from 'mongodb';
import { Request, Response, NextFunction } from 'express';

const getCurrentUser = async (id: string) => {
  const userCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  const user = await userCollection.findOne({ _id: new ObjectId(id) });
  if (!user) {
    Logger.error('User not found');
    return null;
  }
  return user;
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await getCurrentUser(req.user);
    res.status(200).json({
      success: true,
      message: 'Found User Details',
      data: user,
    });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
      data: null,
    });
  }
};
