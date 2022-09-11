import { Router } from 'express';
import yupValidator from '../../middlewares/yupValidator';
import { yupLoginSchema, yupSignupSchema } from '../../models/auth.schema';
import { handleLogin } from './controllers/login.service';
import { handleSignup } from './controllers/signup.service';

const authRoutes = Router();

// export type RequestType = {
//   [prop: string]: any;
// } & Request;

authRoutes.post('/login', yupValidator('body', yupLoginSchema), handleLogin);

authRoutes.post('/signup', yupValidator('body', yupSignupSchema), handleSignup);

export default authRoutes;
