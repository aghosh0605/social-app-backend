import { Collection, ObjectId } from 'mongodb';
import { NextFunction, Request, Response } from 'express';
import {DBInstance}  from '../../../loaders/database';
import Logger from '../../../loaders/logger';
import { yupUserProfileSchema } from '../../../models/userSchema'; 

const updateService = async (req, res): Promise<ObjectId> => {
  const id = req.params.id;
  const inData = req.body as yupUserProfileSchema;
  const userCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  const result = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: inData }
  );
  return result.value._id;
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userID = await updateService(req, res);
    res.status(200).json({ 
      success: true, 
      message: "Updated User Successfully",
      data: userID
    });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
      data: null,
    });
  }
};
