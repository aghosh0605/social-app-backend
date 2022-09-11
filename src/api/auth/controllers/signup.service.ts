import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { Collection } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { throwSchema } from '../../../models/errorSchema';
import * as bcrypt from 'bcrypt';
import { SignupRequest } from '../../../models/auth.schema';

const SignupUser = async (username: string, password: string) => {
  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  const userExist = await usersCollection.findOne({ username: username });
  if (userExist) {
    throw {
      statusCode: 400,
      message: 'User already exists. Kindly use Login',
    } as throwSchema;
  } else {
    bcrypt.genSalt(10, (err: Error | undefined, salt: string) => {
      if (!err) {
        bcrypt.hash(
          password,
          salt,
          async (err: Error | undefined, hash: string) => {
            if (!err) {
              await usersCollection.insertOne({
                username: username,
                password: hash,
              });
            } else {
              throw {
                statusCode: 500,
                message: 'Generation of password hash failed !!',
                errorStack: err,
              } as throwSchema;
            }
          }
        );
      } else {
        throw {
          statusCode: 500,
          message: 'Salt Generation Failed !!',
          errorStack: err,
        } as throwSchema;
      }
    });
  }
};

export const handleSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body as SignupRequest;
    await SignupUser(username, password);
    res.status(201).json({
      success: true,
      status: `✅ ${username} Successfully Signed Up`,
    });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      status: false,
      message: err.message || '❌ Unknown Error Occurred !! ',
    });
  }
};
