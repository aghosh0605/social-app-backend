import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { ResetSchema, SignupSchema } from '../../../models/authSchema';
import { Collection } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { throwSchema } from '../../../models/interfaces';

const updatePassword = async (identity: string, password: string) => {
  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  const userExists: SignupSchema = await usersCollection.findOne(
    {
      $or: [{ email: identity }, { phone: identity }],
    },
    {
      projection: {
        email: 1,
        phone: 1,
        emailVerification: 1,
        mobileVerification: 1,
        isAdmin: 1,
      },
    }
  );
  if (!userExists) {
    throw {
      statusCode: 400,
      message: 'User does not exist. Please try again.',
    } as throwSchema;
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { identity, password } = req.body as ResetSchema;
    const resData = await updatePassword(identity, password);
    res.status(200).json({
      success: true,
      message: 'Password Change successful',
      data: resData,
    });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred !! ',
      data: err.data,
    });
  }
};
