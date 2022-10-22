import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { Collection, Document } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { throwSchema } from '../../../models/generalSchemas';
import * as bcrypt from 'bcrypt';
import { SignupSchema } from '../../../models/authSchema';

const SignupUser = async (
  username: string,
  password: string,
  email: string,
  phone: string
): Promise<void> => {
  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  let userExist: SignupSchema = await usersCollection.findOne(
    {
      $and: [
        { username: username },
        { $or: [{ email: email }, { phone: phone }] },
      ],
    },
    {
      projection: {
        username: 1,
        password: 1,
        email: 1,
        phone: 1,
        emailVerification: 1,
        mobileVerification: 1,
        isAdmin: 1,
      },
    }
  );
  if (userExist) {
    throw {
      statusCode: 409,
      message: 'User already exists. Kindly use Signin instead',
    } as throwSchema;
  }
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  await usersCollection.insertOne(<SignupSchema>{
    username: username,
    password: hash,
    email: email || undefined,
    phone: phone || undefined,
    emailVerification: false,
    mobileVerification: false,
    isAdmin: false,
  });
};

export const handleSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password, email, phone } = req.body as SignupSchema;
    await SignupUser(username, password, email, phone);
    //console.log(result);
    res.status(201).json({
      success: true,
      message: 'Signup successful. Kindly login to continue',
    });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred !! ',
      data: null,
    });
  }
};
