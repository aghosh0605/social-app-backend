import { Collection } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import config from '../../../config/index';
import { throwSchema } from '../../../models/errorSchema';

export const LoginUser = async (username: string, password: string) => {
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

export const SignupUser = async (username: string, password: string) => {
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
