import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { Collection } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { throwSchema } from '../../../models/commonSchemas';
import * as bcrypt from 'bcrypt';
import { SignupSchema } from '../../../models/authSchema';

const SignupUser = async (
  username: string,
  password: string,
  email: string,
  phone: string
) => {
  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  const userExist: SignupSchema = await usersCollection.findOne({
    username: username,
  });
  if (userExist) {
    throw {
      statusCode: 409,
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
              await usersCollection.insertOne(<SignupSchema>{
                username: username,
                password: hash,
                email: email,
                phone: phone,
                emailVerification: false,
                mobileVerification: false,
                isAdmin: false,
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
    const { username, password, email, phone } = req.body as SignupSchema;
    await SignupUser(username, password, email, phone);
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
