import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { ResetSchema, SignupSchema } from '../../../models/authSchema';
import { Collection } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { throwSchema } from '../../../models/interfaces';
import { tokenInterface } from '../../../models/resetInterface';
import * as bcrypt from 'bcrypt';

const updatePassword = async (identity: string, password: string) => {
  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('tokens');
  const userExists: tokenInterface = await usersCollection.findOne({
    $or: [{ email: identity }, { phone: identity }, {}],
  });
  if (!userExists) {
    throw {
      statusCode: 400,
      message: 'Please use email or phone to reset your password',
    } as throwSchema;
  }
  if (!userExists.isVerified) {
    throw {
      statusCode: 400,
      message: 'Please verify your email or phone first to reset your password',
    } as throwSchema;
  }
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
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
