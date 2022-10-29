import { NextFunction, Request, Response } from 'express';
import config from '../../../config/index';
import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import Logger from '../../../loaders/logger';
import { throwSchema } from '../../../models/interfaces';
import axios from 'axios';

const sendOtp = async (uid: string, type: any) => {
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
  }
  if (userExists.mobileVerification && type == 'signup') {
    throw {
      statusCode: 400,
      message: 'Mobile number already verifed',
    } as throwSchema;
  }
  let otp_template = 'Piechips';
  if (type == 'forgot') {
    otp_template = 'forgotTemplate';
  }
  const url =
    'https://2factor.in/API/V1/' +
    config.twoFactorAPI +
    '/SMS/' +
    userExists?.phone +
    `/AUTOGEN/${otp_template}`;

  const result = await axios.get(url);
  await usersCollection.updateOne(
    { _id: userExists._id },
    { $set: { mobileVerifyHash: result.data.Details } }
  );
  return result.data.Details;
};
const VerifyOtp = async (sessionID: string, otp: number, type: any) => {
  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  const userExists = await usersCollection.findOne({
    mobileVerifyHash: sessionID,
  });
  if (!userExists) {
    throw {
      statusCode: 400,
      message: 'Please send OTP again!!',
    } as throwSchema;
  }
  if (userExists.mobileVerification && type == 'signup') {
    throw {
      statusCode: 400,
      message: 'Mobile number already verifed',
    } as throwSchema;
  }
  const url =
    'https://2factor.in/API/V1/' +
    config.twoFactorAPI +
    '/SMS/VERIFY/' +
    sessionID +
    '/' +
    otp;
  await axios.get(url);
  let updateData = { mobileVerification: true, mobileVerifyHash: '' };
  if (type == 'forgot') {
    updateData['isForgotVerified'] = true;
  }
  await usersCollection.updateOne(
    { _id: userExists._id },
    { $set: updateData }
  );
};

export const handleSendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    const result = await sendOtp(id, type);
    res.status(200).json({
      success: true,
      message: 'OTP Send to your mobile number successfully',
      data: { sessionID: result },
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
    const { type } = req.query;
    await VerifyOtp(sessionid, parseInt(otp), type);
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
