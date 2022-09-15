import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { throwSchema } from '../../../models/commonSchemas';
import Logger from '../../../loaders/logger';
import { sendMail } from '../../../utils/sendInBlueClient';
import { NextFunction, Request, Response } from 'express';
import { join } from 'path';
import { generateNanoID } from '../../../utils/nanoidGenerate';

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
    userData.link =
      'https://piechips.herokuapp.com/api/signup/verify/verifymail/' + token;
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
