import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { throwSchema } from '../../../models/interfaces';
import Logger from '../../../loaders/logger';
import { sendMail } from '../../../utils/sendInBlueClient';
import { NextFunction, Request, Response } from 'express';
import { join } from 'path';
import { generateNanoID } from '../../../utils/nanoidGenerate';
import config from '../../../config';

export const sendVerificationMail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const usersCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('users');
    const userData = await usersCollection.findOne(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        projection: {
          full_name: 1,
          email: true,
          emailVerification: true,
          emailVerifyHash: 1,
        },
      }
    );
    if (userData.emailVerification) {
      throw {
        statusCode: 400,
        message: 'Email is already verified',
      } as throwSchema;
    }
    const token = generateNanoID('0-9a-fA-F', 24);
    const uid = '' + userData['_id'];
    userData.link = `${config.baseurl}/api/auth/verifymail/${uid}/${token}`;
    const path = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'templates',
      `emailVerification.ejs`
    );

    const senderData = { name: 'Piechips', email: 'verification@piechips.com' };
    await sendMail(path, userData, 'Verify your email', senderData);
    await usersCollection.updateOne(
      { _id: userData._id },
      { $set: { emailVerifyHash: token } }
    );
    res.status(200).json({ success: true, message: 'Email Sent!!' });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred !! ',
    });
  }
};

export const verifyMail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, token } = req.params;
    const usersCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('users');
    const userData = await usersCollection.findOne(
      {
        _id: new ObjectId(id),
      },
      {
        projection: {
          username: true,
          email: true,
          emailVerification: true,
          emailVerifyHash: 1,
        },
      }
    );
    if (userData.emailVerifyHash == '') {
      throw {
        statusCode: 400,
        message: 'Please resend verification mail!!',
      } as throwSchema;
    }
    if (userData.emailVerifyHash != token) {
      throw {
        statusCode: 400,
        message: 'Wrong Verification Token!!',
      } as throwSchema;
    }
    await usersCollection.updateOne(
      { _id: userData._id },
      { $set: { emailVerifyHash: '', emailVerification: true } }
    );
    res.status(200).json({ success: true, message: 'Email Verified' });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred !! ',
    });
  }
};
