import { NextFunction, Request, Response } from 'express';
import config from '../../../config/index';
import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import Logger from '../../../loaders/logger';
import { OtpVerifySchema, SendOtpSchema } from '../../../models/authSchema';
import { throwSchema } from '../../../models/commonSchemas';
import axios from 'axios';

const sendOtp = async (uid: string) => {
  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  const userExists = await usersCollection.findOne({
    _id: new ObjectId(uid),
  });
  if (!userExists) {
    throw {
      statusCode: 400,
      message: 'Please create an account and try again',
    } as throwSchema;
  } else {
    if (userExists.mobileVerification) {
      throw {
        statusCode: 400,
        message: 'Mobile number already verifed',
      } as throwSchema;
    } else {
      const url =
        'https://2factor.in/API/V1/' +
        config.twoFactorAPI +
        '/SMS/' +
        userExists?.phone +
        '/AUTOGEN';

      const result = await axios.get(url);
      await usersCollection.updateOne(
        { _id: userExists._id },
        { $set: { mobileVerifyHash: result.data.Details } }
      );
      return result.data.Details;
    }
  }
};

const VerifyOtp = async (sessionID: string, otp: number) => {
  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  const userExists = await usersCollection.findOne({
    mobileVerifyHash: sessionID,
  });
  if (!userExists) {
    throw {
      statusCode: 400,
      message: 'Please create an account and try again',
    } as throwSchema;
  } else {
    if (userExists.mobileVerification) {
      throw {
        statusCode: 400,
        message: 'Mobile number already verifed',
      } as throwSchema;
    } else {
      const url =
        'https://2factor.in/API/V1/' +
        config.twoFactorAPI +
        '/SMS/VERIFY/' +
        sessionID +
        '/' +
        otp;
      await axios.get(url);
      await usersCollection.updateOne(
        { _id: userExists._id },
        { $set: { mobileVerification: true, mobileVerifyHash: '' } }
      );
    }
  }
};

export const handleSendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await sendOtp(id);
    res.status(200).json({
      success: true,
      message: result,
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

export const handleVerifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sessionid, otp } = req.params;
    await VerifyOtp(sessionid, parseInt(otp));
    res.status(200).json({
      success: true,
      message: 'Mobile number verfied successfully',
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
