import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { ResetSchema, SignupSchema } from '../../../models/authSchema';
import { Collection } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { throwSchema } from '../../../models/interfaces';
import * as bcrypt from 'bcrypt';

const updatePassword = async (identity: string, password: string) => {
  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  const userExists = await usersCollection.findOne({
    $or: [{ email: identity }, { phone: identity }],
  });
  // console.log(userExists);
  if (!userExists) {
    throw {
      statusCode: 400,
      message: 'Please use email or phone to reset your password',
    } as throwSchema;
  }

  if (!userExists.isForgotVerified) {
    throw {
      statusCode: 400,
      message: 'Please verify your email or phone first to reset your password',
    } as throwSchema;
  }
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  const _updateData = { password: hash, isForgotVerified: false };
  // let updateData;
  // if (type == 'email') {
  //   updateData = {
  //     emailVerifyHash: '',
  //     emailVerification: true,
  //     ..._updateData,
  //   };
  // } else {
  //   updateData = {
  //     mobileVerifyHash: '',
  //     mobileVerification: true,
  //     ..._updateData,
  //   };
  await usersCollection.updateOne(
    { _id: userExists._id },
    { $set: _updateData }
  );
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { identity, password } = req.body as ResetSchema;
    const resData = await updatePassword(identity, password);
    res.status(200).json({
      success: true,
      message: 'Password Changed successfully',
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
