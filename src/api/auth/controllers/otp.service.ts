import { NextFunction, Request, Response } from "express";
import config from "../../../config/index";
import { Collection, ObjectId } from "mongodb";
import { DBInstance } from "../../../loaders/database";
import Logger from "../../../loaders/logger";
import { OtpVerifySchema, SendOtpSchema } from "../../../models/auth.schema";
import { throwSchema } from "../../../models/errorSchema";
import got from "got";

const sendOtp = async (uid: string) => {
  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection("users");
  const userExists = await usersCollection.findOne({
    _id: new ObjectId(uid),
  });
  if (!userExists) {
    throw {
      statusCode: 400,
      message: "Please create an account and try again",
    } as throwSchema;
  } else {
    if (userExists.mobileVerification) {
      throw {
        statusCode: 400,
        message: "Mobile number already verifed",
      } as throwSchema;
    } else {
      const url =
        "https://2factor.in/API/V1/" +
        config.twoFactorAPI +
        "/SMS/" +
        userExists?.phone +
        "/AUTOGEN";

      const sessionID = await got(url).json();
      console.log(sessionID);
    }
  }
};

const VerifyOtp = async (otp: number, sessionID: string) => {
  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection("users");
  const userExists = await usersCollection.findOne({
    sessionID: sessionID,
  });
  if (!userExists) {
    throw {
      statusCode: 400,
      message: "Please create an account and try again",
    } as throwSchema;
  } else {
    if (userExists.mobileVerification) {
      throw {
        statusCode: 400,
        message: "Mobile number already verifed",
      } as throwSchema;
    } else {
      const url =
        "https://2factor.in/API/V1/" +
        config.twoFactorAPI +
        "/SMS/VERIFY/" +
        sessionID +
        "/" +
        otp;
      const response = await got(url).json();
    }
  }
};

export const handleSendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { uid } = req.params as SendOtpSchema;
    sendOtp(uid);
    res.status(200).json({
      success: true,
      message: "OTP Sent",
    });
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      status: false,
      message: err.message || "❌ Unknown Error Occurred !! ",
    });
  }
};

export const HandleVerifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { sessionID, otp } = req.body as OtpVerifySchema;
};
