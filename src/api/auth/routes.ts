import { Router } from 'express';
import yupValidator from '../../middlewares/yupValidator';
import {
  yupLoginSchema,
  yupSignupSchema,
  yupOtpVerifySchema,
} from '../../models/authSchema';
import { handleLogin } from './controllers/login.service';
import { handleSignup } from './controllers/signup.service';
import { sendVerificationMail, verifyMail } from './controllers/email.service';
import { yupObjIdSchema } from '../../models/middlewareSchemas';
import { handleSendOtp, handleVerifyOTP } from './controllers/otp.service';

const authRoutes = Router();

authRoutes.post('/login', yupValidator('body', yupLoginSchema), handleLogin);

authRoutes.post('/signup', yupValidator('body', yupSignupSchema), handleSignup);

authRoutes.get(
  '/sendotp/:id',
  yupValidator('params', yupObjIdSchema),
  handleSendOtp
);

authRoutes.get(
  '/verifyotp/:sessionid/:otp',
  //yupValidator('body', yupOtpVerifySchema),
  handleVerifyOTP
);

authRoutes.get(
  '/sendmail/:id',
  yupValidator('params', yupObjIdSchema),
  sendVerificationMail
);

authRoutes.get(
  '/verifymail/:id/:token',
  yupValidator('params', yupObjIdSchema),
  verifyMail
);

export default authRoutes;
