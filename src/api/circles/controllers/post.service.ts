import { UploadedFile } from "express-fileupload";
import { Collection, ObjectId } from "mongodb";
import { DBInstance } from "../../../loaders/database";
import { NextFunction, Request, Response } from "express";
import Logger from "../../../loaders/logger";
import { circleSchema, _circleSchema } from "../../../models/circleSchema";
import { uploadPhotos } from "../../../utils/uploadPhotos";

const createService = async (req, res) => {
  const { cover_image_data, profile_image_data } = req.files;

  if (!cover_image_data || !profile_image_data) {
    throw {
      statusCode: 404,
      message: "Images not found",
    };
  }

  if (
    cover_image_data.mimetype !== "image/jpeg" &&
    cover_image_data.mimetype !== "image/png"
  ) {
    throw {
      statusCode: 415,
      message: "Wrong mimetype for profile image",
    };
  }

  if (
    profile_image_data.mimetype !== "image/jpeg" &&
    profile_image_data.mimetype !== "image/png"
  ) {
    throw {
      statusCode: 415,
      message: "Wrong mimetype for banner image",
    };
  }

  const circlesCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection("circles");
  const circleExist: circleSchema = await circlesCollection.findOne({
    circleName: req.body.circle_name,
  });
  if (circleExist) {
    throw {
      statusCode: 400,
      message: "Circle Already Exists",
    };
  }

  // Upload Files to s3
  const picURL = await uploadPhotos(req, res, "circleImages/");

  //Storing Data to mongoDB
  const inData: _circleSchema = {
    circle_name: req.body.circle_name,
    loggedIn_user_id: req.user,
    about_circle_description: req.body.about_circle_description,
    is_private: req.body.is_Private,
    topic_name: req.body.topic_name,
    topic_id: req.body.topic_id,
    posted_date: new Date(),
    last_updated_date: new Date(),
    cover_image_data: picURL.cover_image_data,
    profile_image_date: picURL.profile_image_data,
  };
  console.log(inData);
  const id = (await circlesCollection.insertOne(inData)).insertedId;
  return { circle_id: id, ...inData };
};

export const createCircles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const circleID = await createService(req, res);
    res.status(200).json({
      success: true,
      message: `You created a circle `,
      data: circleID,
    });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "❌ Unknown Error Occurred!!",
    });
  }
};
