import { Router } from 'express';
import yupValidator from '../../middlewares/yupValidator';
import { yupLoginSchema, yupSignupSchema } from '../../models/authSchema';
import { handleLogin } from './controllers/login.service';
import { handleSignup } from './controllers/signup.service';
import { sendVerificationMail } from './controllers/email.service';
import { yupObjIdSchema } from '../../models/middlewareSchemas';

const authRoutes = Router();

authRoutes.post('/login', yupValidator('body', yupLoginSchema), handleLogin);

authRoutes.post('/signup', yupValidator('body', yupSignupSchema), handleSignup);

authRoutes.get(
  '/signup/verify/sendmail/:id',
  yupValidator('params', yupObjIdSchema),
  sendVerificationMail
);

authRoutes.get(
  '/signup/verify/verifymail/:id/:token',
  yupValidator('params', yupObjIdSchema),
  sendVerificationMail
);

export default authRoutes;
