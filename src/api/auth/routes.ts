import { Router } from 'express';
import yupValidator from '../../middlewares/yupValidator';
import { yupLoginSchema, yupSignupSchema } from '../../models/authSchema';
import { handleSignin } from './controllers/signin.service';
import { handleSignup } from './controllers/signup.service';
import { sendVerificationMail, verifyMail } from './controllers/email.service';
import { yupObjIdSchema } from '../../models/middlewareSchemas';
import { handleSendOtp, handleVerifyOTP } from './controllers/otp.service';

const authRoutes = Router();

// Signin and Signup
authRoutes.post('/signin', yupValidator('body', yupLoginSchema), handleSignin);

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
