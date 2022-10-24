import { Collection } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import * as bcrypt from 'bcrypt';
import { sign, JwtPayload } from 'jsonwebtoken';
import config from '../../../config/index';
import { throwSchema } from '../../../models/interfaces';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { LoginSchema } from '../../../models/authSchema';
import { SignupSchema } from '../../../models/authSchema';

const SigninUser = async (identity: string, password: string) => {
  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  const userExists: SignupSchema = await usersCollection.findOne(
    {
      $or: [{ email: identity }, { phone: identity }],
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
  if (!userExists) {
    throw {
      statusCode: 400,
      message: 'Please create an account and try again',
    } as throwSchema;
  }

  //console.log(password, userExists.password);
  const valid = await bcrypt.compare(password, userExists.password);
  if (!valid) {
    throw {
      statusCode: 400,
      message: 'Please check your email or password',
    } as throwSchema;
  }
  delete userExists['password'];
  if (!userExists.mobileVerification && !userExists.emailVerification) {
    throw {
      statusCode: 400,
      message: 'Your account is not verified',
      data: userExists,
    } as throwSchema;
  }
  //console.log('' + userExists['_id']);
  const jwtToken = sign(
    <JwtPayload>{
      isAdmin: userExists.isAdmin,
      id: '' + userExists['_id'],
    },
    config.jwtSecret,
    {
      issuer: 'Cario Growth Services',
      expiresIn: '72h',
    }
  );
  return { token: jwtToken, userdata: userExists };
};

export const handleSignin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { identity, password } = req.body as LoginSchema;
    const resData = await SigninUser(identity, password);
    res.status(200).json({
      success: true,
      message: 'Signin successful',
      data: resData,
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
