import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import * as bcrypt from 'bcrypt';
import { throwSchema } from '../../../models/interfaces';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';

const handleReset = async (
  id: any,
  oldPassword: string,
  newPassword: string
) => {
  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  const userExists = await usersCollection.findOne(
    {
      _id: new ObjectId(id),
    },
    {
      projection: {
        full_name: 1,
        password: 1,
        email: 1,
        phone: 1,
        emailVerification: 1,
        mobileVerification: 1,
        isAdmin: 1,
        countryCode: 1,
        dob: 1,
      },
    }
  );
  if (!userExists) {
    throw {
      statusCode: 400,
      message: 'Please create an account and try again',
    } as throwSchema;
  }

  //console.log(password, userExists.password);
  const valid = await bcrypt.compare(oldPassword, userExists.password);
  if (!valid) {
    throw {
      statusCode: 400,
      message: 'Please enter your correct old password',
    } as throwSchema;
  }
  const saltRounds = 10;
  const hash = await bcrypt.hash(newPassword, saltRounds);
  await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { password: hash } }
  );
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;
    await handleReset(req.user, oldPassword, newPassword);
    res.status(200).json({
      success: true,
      message: 'Your password was updated successfully',
    });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred !! ',
    });
  }
};
