import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { throwSchema } from '../../../models/commonSchemas';
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
          username: true,
          fullName: 1,
          email: true,
          emailVerification: true,
          emailVerifyHash: 1,
        },
      }
    );
    const token = generateNanoID('0-9a-fA-F', 24);
    const uid = '' + userData['_id'];
    userData.link = `${config.baseurl}/api/auth/signup/verify/verifymail/${uid}/${token}`;
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
    Logger.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Email Verification Failed!!' });
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
    const userData = await usersCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!(userData.emailVerifyHash == token)) {
      throw {
        statusCode: 400,
        message: 'Wrong Verification Token!!',
      };
    }
    await usersCollection.updateOne(
      { _id: userData._id },
      { $set: { emailVerifyHash: '', emailVerification: true } }
    );
    res.status(200).json({ success: true, message: 'Email Verified' });
    next();
  } catch (err) {
    Logger.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Email Verification Failed!!' });
  }
};
