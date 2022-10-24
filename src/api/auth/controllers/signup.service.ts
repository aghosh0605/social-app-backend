import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { Collection } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { throwSchema } from '../../../models/interfaces';
import * as bcrypt from 'bcrypt';
import { SignupSchema } from '../../../models/authSchema';

const SignupUser = async (
  full_name: string,
  password: string,
  email: string,
  phone: string,
  dob: Date
): Promise<Document> => {
  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  let userExist: SignupSchema = await usersCollection.findOne(
    {
      $and: [
        { full_name: full_name },
        { $or: [{ email: email }, { phone: phone }] },
      ],
    },
    {
      projection: {
        full_name: 1,
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
    full_name: full_name,
    password: hash,
    email: email || null,
    phone: phone || null,
    emailVerification: false,
    mobileVerification: false,
    isAdmin: false,
    dob: dob,
    blockedUID: [],
    blockedCID: [],
  });
  return await usersCollection.findOne({
    $and: [{ email: email }, { phone: phone }],
  });
};

export const handleSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { full_name, password, email, phone, dob } = req.body as SignupSchema;
    const result = await SignupUser(full_name, password, email, phone, dob);
    //console.log(result);
    res.status(201).json({
      success: true,
      message: 'Signup successful. Kindly login to continue',
      data: result,
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
