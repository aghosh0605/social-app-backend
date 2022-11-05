import { DBInstance } from '../../../loaders/database';
import Logger from '../../../loaders/logger';
import { Collection, ObjectId } from 'mongodb';
import { Request, Response, NextFunction } from 'express';
import { throwSchema } from '../../../models/interfaces';

const getUserbyID = async (id: any) => {
  const userCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  const user = await userCollection.findOne({ _id: new ObjectId(id) });
  if (!user) {
    throw {
      statusCode: 409,
      message: 'User not Found',
    } as throwSchema;
  }
  return user;
};

const getUserDetails = async (identity: any) => {
  const userCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  const user = await userCollection.findOne({
    $or: [{ email: identity }, { phone: identity }],
  });
  if (!user) {
    throw {
      statusCode: 409,
      message: 'User not Found',
    } as throwSchema;
  }
  return user;
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let user;
    switch (req.params.type) {
      case 'id':
        // console.log('Entered id');
        user = await getUserbyID(req.query.id);
        break;
      case 'email':
        user = await getUserDetails(req.query.email);
        break;
      case 'phone':
        user = await getUserDetails(req.query.phone);
        break;
    }

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

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('users');
    const user = await userCollection.findOne({ _id: new ObjectId(req.user) });
    if (!user) {
      throw {
        statusCode: 409,
        message: 'User not Found',
      } as throwSchema;
    }

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
