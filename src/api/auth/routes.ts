import { NextFunction, Request, Response, Router } from "express";
import Logger from "../../loaders/logger";
import validateQuery from "../../middlewares/validate-query";
import {
  LoginRequest,
  LoginRequestSchema,
  SignupRequest,
  SignupRequestSchema,
} from "../../models/auth/auth.schema";
import { LoginUser, SignupUser } from "../../services/auth/auth.services";

const authRoutes = Router();

const handleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body as LoginRequest;
    const authToken = await LoginUser(username, password);
    res.status(200).json({
      success: true,
      token: authToken,
    });
  } catch (err) {
    Logger.error(err);
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
      status: `${username} Successfully Signed Up`,
    });
  } catch (err) {
    Logger.error(err);
  }
};

authRoutes.post(
  "/login",
  validateQuery("body", LoginRequestSchema),
  handleLogin
);

authRoutes.post(
  "/signup",
  validateQuery("body", SignupRequestSchema),
  handleSignup
);

export default authRoutes;
