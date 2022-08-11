import db from '../../../loaders/database';
import { Db } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import config from '../../../config/index';

export const LoginUser = async (username: string, password: string) => {
  const data: Db = await db();
  const userExists = await data.collection('users').findOne({
    username: username,
  });
  if (!userExists) {
    throw {
      statusCode: 400,
      message: 'Please create an account and try again',
    };
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
      };
    }
  }
};

export const SignupUser = async (username: string, password: string) => {
  const data: Db = await db();
  const userExist = await data
    .collection('users')
    .findOne({ username: username });
  if (userExist) {
    throw {
      statusCode: 400,
      message: 'User already exists. Kindly use Login',
    };
  } else {
    bcrypt.genSalt(10, (err: Error | undefined, salt: string) => {
      if (!err) {
        bcrypt.hash(
          password,
          salt,
          async (err: Error | undefined, hash: string) => {
            if (!err) {
              await data.collection('users').insertOne({
                username: username,
                password: hash,
              });
            } else {
              throw {
                statusCode: 500,
                message: 'Generation of password hash failed !!',
                errorStack: err,
              };
            }
          }
        );
      } else {
        throw {
          statusCode: 500,
          message: 'Salt Generation Failed !!',
          errorStack: err,
        };
      }
    });
  }
};
