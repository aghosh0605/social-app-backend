import { NextFunction, Request, Response } from "express";
import { Collection, ObjectId } from "mongodb";
import { DBInstance } from "../../../loaders/database";
import Logger from "../../../loaders/logger";
import { circleSchema } from "../../../models/circleSchema";
import { yupUserProfileSchema } from "../../../models/userSchema";

const followService = async (req: Request): Promise<string> => {
  const circlesCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection("circles");

  const userCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection("users");

  const foundCircle: circleSchema = await circlesCollection.findOne({
    _id: new ObjectId(req.params.cid),
  });

  const foundUser: yupUserProfileSchema = await userCollection.findOne({
    _id: new ObjectId(req.user),
  });

  if (!foundCircle) {
    throw {
      statusCode: 404,
      message: "Circle not found",
    };
  }

  if (!foundUser) {
    throw {
      statusCode: 404,
      message: "User not found",
    };
  }

  const resData = await circlesCollection.updateOne(
    {
      _id: new ObjectId(req.params.cid),
    },
    {
      $set: { ...foundCircle, followers: newFollowers },
    }
  );

  if (!resData.acknowledged) {
    throw { status: 404, success: false, message: "add followers error" };
  }

  return `followed`;
};

export const follow = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await followService(req);
    res.status(200).json({ success: true, message: `follow request done` });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "❌ Unknown Error Occurred!!",
    });
  }
};
