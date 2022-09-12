import { Router } from "express";
import yupValidator from "../../middlewares/yupValidator";
import {
  yupLoginSchema,
  yupOtpVerifySchema,
  yupSendOtpScheme,
  yupSignupSchema,
} from "../../models/auth.schema";
import { handleLogin } from "./controllers/login.service";
import { handleSendOtp, HandleVerifyOTP } from "./controllers/otp.service";
import { handleSignup } from "./controllers/signup.service";

const authRoutes = Router();

// export type RequestType = {
//   [prop: string]: any;
// } & Request;

authRoutes.post("/login", yupValidator("body", yupLoginSchema), handleLogin);

authRoutes.post("/signup", yupValidator("body", yupSignupSchema), handleSignup);

authRoutes.get(
  "/send-otp/:uid",
  yupValidator("params", yupSendOtpScheme),
  handleSendOtp
);

authRoutes.post(
  "/verify-otp",
  yupValidator("body", yupOtpVerifySchema),
  HandleVerifyOTP
);

export default authRoutes;
