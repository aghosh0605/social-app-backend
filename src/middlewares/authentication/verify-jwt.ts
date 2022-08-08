import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { verify } from 'jsonwebtoken';
import config from '../../config/index';

const JwtRequestSchema = yup.object({
  authorization: yup
    .string()
    .trim()
    .min(1, 'JWT cannot be null')
    .matches(/^Bearer .+$/, 'JWT should be Bearer Token')
    .required(),
});

type JwtRequest = yup.InferType<typeof JwtRequestSchema>;

export const validateJWT = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers as JwtRequest;
      if (!authorization) {
        return next({
          statusCode: 404,
          message: 'No JWT Authorization Token available',
        });
      }
      await JwtRequestSchema.validate(req.headers, { abortEarly: false });
      const authToken = authorization.split(' ')[1];
      verify(authToken, config.jwtSecret);
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
};
