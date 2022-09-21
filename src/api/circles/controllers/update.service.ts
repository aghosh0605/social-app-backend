import { ObjectId, Collection } from "mongodb";
import { DBInstance } from "../../../loaders/database";
import { NextFunction, Request, Response } from "express";
import Logger from "../../../loaders/logger";
import config from "../../../config";
import { s3Delete, s3Upload } from "../../../utils/s3Client";
import { circleSchema } from "../../../models/circleSchema";
import { UploadedFile } from "express-fileupload";

const singleUpload = async (image: string, element: UploadedFile) => {
  element.name = "circleImages/" + element.name;
  console.log(element.name);

  //   await s3Upload(element as UploadedFile)

  return {
    URL: config.awsBucketBaseURL + "/" + element.name,
    mimeType: element.mimetype,
    thumbnailURL: "",
  };
};

const updateDataService = async (req: Request) => {
  const circlesCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection("circles");

  const foundCircle = await circlesCollection.findOne({
    _id: new ObjectId(req.params.id),
  });

  if (!foundCircle) {
    throw { status: 404, success: false, message: "No Circle Found!" };
  }

  if (req.user != foundCircle.UID) {
    throw {
      status: 404,
      success: false,
      message: "Only creator can edit the circle",
    };
  }

  const resData = await circlesCollection.updateOne(
    {
      _id: new ObjectId(req.params.id),
    },
    {
      $set: { ...req.body },
    }
  );

  if (!resData.acknowledged) {
    throw { status: 404, success: false, message: "Editing Permission Error" };
  }

  return `circle with id : ${foundCircle._id} is updated`;
};

export const updateDataCircle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await updateDataService(req);
    res.status(200).json({ success: true, message: data });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "❌ Unknown Error Occurred !! ",
    });
  }
};
