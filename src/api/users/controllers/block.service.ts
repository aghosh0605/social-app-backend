import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { yupUserProfileSchema } from '../../../models/userSchema';

export const blockUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const usersCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('users');

    const userExist: yupUserProfileSchema = await usersCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!userExist) {
      throw {
        statusCode: 400,
        message: 'User Not Found!',
      };
    }
    const blockedList: Array<string> = userExist.blockedUID;
    if (blockedList.find((element) => element == req.params.id)) {
      throw {
        statusCode: 400,
        message: 'User already blocked!',
      };
    }
    await usersCollection.updateOne(
      { _id: new ObjectId(req.user) },
      { $push: { blockedUID: req.params.id } }
    );
    res.status(200).json({ success: true, message: 'User Blocked!' });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};
