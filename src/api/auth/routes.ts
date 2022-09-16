import { Router } from 'express';
import yupValidator from '../../middlewares/yupValidator';
import {
  yupLoginSchema,
  yupSignupSchema,
  yupOtpVerifySchema,
  yupSendOtpScheme,
} from '../../models/authSchema';
import { handleLogin } from './controllers/login.service';
import { handleSignup } from './controllers/signup.service';
import { sendVerificationMail } from './controllers/email.service';
import { yupObjIdSchema } from '../../models/middlewareSchemas';
import { handleSendOtp, handleVerifyOTP } from './controllers/otp.service';

const authRoutes = Router();

authRoutes.post('/login', yupValidator('body', yupLoginSchema), handleLogin);

authRoutes.post('/signup', yupValidator('body', yupSignupSchema), handleSignup);

authRoutes.get(
  '/send-otp/:uid',
  yupValidator('params', yupSendOtpScheme),
  handleSendOtp
);

authRoutes.post(
  '/verify-otp',
  yupValidator('body', yupOtpVerifySchema),
  handleVerifyOTP
);

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
