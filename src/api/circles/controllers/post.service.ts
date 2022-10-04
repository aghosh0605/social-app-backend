import { UploadedFile } from "express-fileupload";
import { Collection, ObjectId } from "mongodb";
import { DBInstance } from "../../../loaders/database";
import { s3Upload } from "../../../utils/s3Client";
import config from "../../../config";
import { NextFunction, Request, Response } from "express";
import Logger from "../../../loaders/logger";
import { circleSchema, mediaURLSchema } from "../../../models/circleSchema";
import { throwSchema } from "../../../models/commonSchemas";

const createService = async (req, res) => {
  const circlesCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection("circles");
  const circleExist: circleSchema = await circlesCollection.findOne({
    circleName: req.body.circleName,
  });
  if (circleExist) {
    throw {
      statusCode: 400,
      message: "Circle Already Exists",
    } as throwSchema;
  }

  // Upload Files to s3
  const files = Object.assign({}, req.files);
  const picURL: Array<mediaURLSchema> = [];
  const images = [files.profileImage, files.bannerImage];

  if (Object.keys(files).length > 0) {
    if (images.length > 1) {
      images.forEach(async (element: UploadedFile) => {
        element.name = "circleImages/" + element.name;
        <mediaURLSchema>picURL.push({
          URL: config.awsBucketBaseURL + element.name,
          mimeType: element.mimetype,
          thumbnailURL: "",
        });
        await s3Upload(element as UploadedFile);
      });
    } else {
      files.images.name = "circleImages/" + files.images.name;
      <mediaURLSchema>picURL.push({
        URL: config.awsBucketBaseURL + files.images.name,
        mimeType: files.images.mimetype,
        thumbnailURL: "",
      });
      await s3Upload(files.images as UploadedFile);
    }
  }

  //Storing Data to mongoDB
  const inData: circleSchema = {
    circleName: req.body.circleName,
    UID: req.user,
    about: req.body.about,
    isPrivate: JSON.parse(req.body.isPrivate),
    tags: req.body.tags.split(","),
    mediaURLs: picURL as mediaURLSchema,
    category: req.body.category,
    createdOn: new Date(),
  };
  console.log(inData);

  return (await circlesCollection.insertOne(inData)).insertedId;
  return "";
};

export const createCircles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const circleID = await createService(req, res);
    res
      .status(200)
      .json({ success: true, message: `created circle with id :${circleID} ` });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "❌ Unknown Error Occurred!!",
    });
  }
};
