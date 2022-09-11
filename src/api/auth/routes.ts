import { Router } from 'express';
import yupValidator from '../../middlewares/yupValidator';
import {
  LoginRequestSchema,
  SignupRequestSchema,
} from '../../models/auth.schema';
import { handleLogin } from './controllers/login.service';
import { handleSignup } from './controllers/signup.service';

const authRoutes = Router();

// export type RequestType = {
//   [prop: string]: any;
// } & Request;

authRoutes.post(
  '/login',
  yupValidator('body', LoginRequestSchema),
  handleLogin
);

authRoutes.post(
  '/signup',
  yupValidator('body', SignupRequestSchema),
  handleSignup
);

export default authRoutes;
