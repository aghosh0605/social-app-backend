import { ObjectId, Collection } from "mongodb";
import { DBInstance } from "../../../loaders/database";
import { NextFunction, Request, Response } from "express";
import Logger from "../../../loaders/logger";
import { s3Delete } from "../../../utils/s3Client";
import { circleSchema } from "../../../models/circleSchema";
import { uploadPhotos } from "../../../utils/uploadPhotos";

const updateImageService = async (req: Request, res: Response) => {
  const { profile_image_data, cover_image_data } = req.files;

  if (!profile_image_data && !cover_image_data) {
    throw {
      statusCode: 404,
      message: "Images not found",
    };
  }

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
      message: "Only creator can edit the circle",
    };
  }

  // const deleteUrls = foundCircle.mediaURLs.map((el) => {
  //   const url = el.URL.split("com")[1];
  //   const deleteUrl = url.slice(1, url.length);
  //   return { Key: deleteUrl };
  // });

  // await s3Delete(deleteUrls);

  // const newMediaUrls = await uploadPhotos(req, res, "circleImages/");

  // const resData = await circlesCollection.updateOne(
  //   {
  //     _id: new ObjectId(req.params.id),
  //   },
  //   {
  //     $set: {
  //       mediaURLs: newMediaUrls,
  //       last_updated_date: new Date(),
  //       ...req.body,
  //     },
  //   }
  // );

  // if (!resData.acknowledged) {
  //   throw { status: 404, success: false, message: "Editing Permission Error" };
  // }

  return `circle is updated`;
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

  const findSimilar = await circlesCollection.findOne({
    circle_name: req.body.circle_name,
  });

  if (findSimilar && findSimilar.circle_name != foundCircle.circle_name) {
    throw {
      status: 400,
      success: false,
      message: "two circles can't have same username",
    };
  }

  if (req.user != foundCircle.loggedIn_user_id) {
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
      $set: {
        last_updated_date: new Date(),
        ...req.body,
      },
    }
  );

  if (!resData.acknowledged) {
    throw { status: 404, success: false, message: "Editing Permission Error" };
  }

  const updatedCircle: circleSchema = await circlesCollection.findOne({
    _id: new ObjectId(req.params.id),
  });

  return updatedCircle;
};

export const updateDataCircle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await updateDataService(req);
    res
      .status(200)
      .json({
        success: true,
        message: `circle with id ${req.params.id} updated`,
        data: data,
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

export const updateImageCircle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await updateImageService(req, res);
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
