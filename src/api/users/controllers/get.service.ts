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
    return {
      statusCode: 409,
      message: 'User not Found',
      data: null,
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
    return {
      statusCode: 409,
      message: 'User not Found',
      data: null,
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
    let resData = [];
    switch (req.params.type) {
      case 'id':
        // console.log('Entered id');
        resData = await getUserbyID(req.query.id);
        break;
      case 'email':
        resData = await getUserDetails(req.query.email);
        break;
      case 'phone':
        resData = await getUserDetails(req.query.phone);
        break;
    }

    res.status(200).json({
      success: true,
      message: 'Found User Details',
      data: resData,
    });
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
      data: null,
    });
  }
};

export const getLoggedInUser = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = await getUserbyID(req.user);
    res.status(200).json({
      success: true,
      message: 'Found User Details',
      data: user,
    });
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
      data: null,
    });
  }
}