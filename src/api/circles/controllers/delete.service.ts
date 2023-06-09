import { ObjectId, Collection, DeleteResult } from "mongodb";
import { DBInstance } from "../../../loaders/database";
import { NextFunction, Request, Response } from "express";
import Logger from "../../../loaders/logger";
import { s3Delete } from "../../../utils/s3Client";
import { circleSchema } from "../../../models/circleSchema";

const deleteService = async (req: Request): Promise<void> => {
  const circlesCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection("circles");

  const foundCircle: circleSchema = await circlesCollection.findOne({
    _id: new ObjectId(req.params.id),
  });

  if (!foundCircle) {
    throw { status: 404, success: false, message: "No Circle Found!" };
  }

  if (req.user != foundCircle.loggedIn_user_id) {
    throw {
      status: 404,
      success: false,
      message: "Only creator can delete circle",
    };
  }
  console.log(foundCircle);

  const mediaURLs = [
    { ...foundCircle.cover_image_data },
    { ...foundCircle.profile_image_data },
  ];

  if (mediaURLs.length > 0) {
    const delObjs = [];
    mediaURLs.forEach((element) => {
      const URLPath = new URL(element.URL).pathname.substring(1);
      delObjs.push({ Key: URLPath });
    });
    await s3Delete(delObjs);
  }

  const resData: DeleteResult = await circlesCollection.deleteOne({
    _id: new ObjectId(req.params.id),
  });

  if (!resData.acknowledged) {
    throw { status: 404, success: false, message: "Delete Permission Error" };
  }
};

export const deleteCircle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteService(req);
    res
      .status(200)
      .json({
        success: true,
        message: "Circle Deleted",
        data: { loggedIn_user_id: req.user, circle_id: req.params.id },
      });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "❌ Unknown Error Occurred !! ",
    });
  }
};
