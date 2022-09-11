import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import config from '../config/index';
import { yupJwtHeader, JwtHeader } from './../models/jwtSchema';

export const validateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers as JwtHeader;
    if (!authorization) {
      return next({
        statusCode: 404,
        message: 'No JWT Authorization Token available',
      });
    }
    await yupJwtHeader.validate(req.headers, { abortEarly: false });
    const authToken = authorization.split(' ')[1];
    const decoded = verify(authToken, config.jwtSecret);
    //console.log(decoded);
    req.user = (<JwtPayload>decoded).uid;
    next();
  } catch (err: Error | any) {
    if (err.name === 'ValidationError') {
      let message: string = '';
      err.errors.forEach((error: string) => {
        message += `${error}.\n `;
      });
      return next({
        statusCode: 404,
        message: message,
      });
    }
    next({
      statusCode: 500,
      message: `${err.name}: ${err.message}`,
    });
  }
};
