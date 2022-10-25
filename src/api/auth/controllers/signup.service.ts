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
  dob: Date,
  countryCode: string
): Promise<Document> => {
  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  if (!email && !phone) {
    throw {
      statusCode: 404,
      message: 'Please provide an email or phone number',
      data: null,
    } as throwSchema;
  }
  if (phone && !countryCode) {
    throw {
      statusCode: 404,
      message: 'Please provide a country code',
      data: null,
    } as throwSchema;
  }
  let userExist: SignupSchema = await usersCollection.findOne(
    {
      $or: [{ email: email }, { phone: phone }],
    },
    {
      projection: {
        full_name: 1,
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
      data: userExist,
    } as throwSchema;
  }
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  const _dbData = {
    full_name: full_name,
    password: hash,
    emailVerification: false,
    mobileVerification: false,
    isAdmin: false,
    dob: dob,
    blockedUID: [],
    blockedCID: [],
  };
  let dbData;
  if (email && phone && countryCode) {
    dbData = {
      ..._dbData,
      email: email,
      phone: phone,
      countryCode: countryCode,
    };
  } else if (email) {
    dbData = { ..._dbData, email: email, phone: '', countryCode: '' };
  } else {
    dbData = { ..._dbData, email: '', phone: phone, countryCode: countryCode };
  }

  await usersCollection.insertOne(<SignupSchema>dbData);
  return await usersCollection.findOne({
    $or: [{ email: email }, { phone: phone }],
  });
};

export const handleSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { full_name, password, email, phone, dob, countryCode } =
      req.body as SignupSchema;
    const result = await SignupUser(
      full_name,
      password,
      email,
      phone,
      dob,
      countryCode
    );

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
      data: err.data,
    });
  }
};
