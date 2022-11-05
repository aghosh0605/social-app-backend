import { Collection, ObjectId } from "mongodb";
import { NextFunction, Request, Response } from "express";
import { DBInstance } from "../../../loaders/database";
import Logger from "../../../loaders/logger";
import { yupUserProfileSchema } from "../../../models/userSchema";
import { uploadPhotos } from "../../../utils/uploadPhotos";

const updateService = async (req, res): Promise<any> => {
  const userCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection("users");

  const { appearanceImage } = req.files;
  if (!appearanceImage) {
    throw {
      statusCode: 404,
      message: "appearance image not found ",
    };
  }

  if (
    appearanceImage.mimetype !== "image/jpeg" &&
    appearanceImage.mimetype !== "image/png"
  ) {
    throw {
      statusCode: 415,
      message: "Wrong mimetype for appearance image",
    };
  }

  const picURL = await uploadPhotos(req, res, "appearanceImages/");

  const result = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(req.user) },
    { $set: { appearanceUrl: picURL[0] } }
  );
  return result.value._id;
};

export const updateAppearance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userID = await updateService(req, res);
    res.status(200).json({
      success: true,
      message: "Updated appearance Successfully",
      data: userID,
    });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "❌ Unknown Error Occurred!!",
      data: null,
    });
  }
};
