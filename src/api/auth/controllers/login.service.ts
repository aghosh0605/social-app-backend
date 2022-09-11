import { Collection } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import config from '../../../config/index';
import { throwSchema } from '../../../models/errorSchema';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { LoginSchema } from '../../../models/auth.schema';

const LoginUser = async (username: string, password: string) => {
  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  const userExists = await usersCollection.findOne({
    username: username,
  });
  if (!userExists) {
    throw {
      statusCode: 400,
      message: 'Please create an account and try again',
    } as throwSchema;
  } else {
    const valid = await bcrypt.compare(password, userExists?.password);
    if (valid) {
      const token = sign(
        {
          admin_logged_in: true,
          username: username,
        },
        config.jwtSecret,
        {
          issuer: 'Cario Growth Services',
          expiresIn: '24h',
        }
      );
      return token;
    } else {
      throw {
        statusCode: 400,
        message: 'Please check your email or password',
      } as throwSchema;
    }
  }
};

export const handleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body as LoginSchema;
    const userToken = await LoginUser(username, password);
    res.status(200).json({
      success: true,
      token: userToken,
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
