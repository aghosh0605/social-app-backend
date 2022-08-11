import { NextFunction, Request, Response, Router } from 'express';
import Logger from '../../loaders/logger';
import validateQuery from '../../middlewares/yupValidator';
import {
  LoginRequest,
  LoginRequestSchema,
  SignupRequest,
  SignupRequestSchema,
} from '../../models/auth/auth.schema';
import { LoginUser, SignupUser } from './controllers/auth.services';

const authRoutes = Router();

// export type RequestType = {
//   [prop: string]: any;
// } & Request;

const handleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body as LoginRequest;
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

const handleSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body as SignupRequest;
    await SignupUser(username, password);
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

authRoutes.post(
  '/login',
  validateQuery('body', LoginRequestSchema),
  handleLogin
);

authRoutes.post(
  '/signup',
  validateQuery('body', SignupRequestSchema),
  handleSignup
);

export default authRoutes;
