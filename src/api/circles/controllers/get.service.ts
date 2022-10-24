import { Collection, ObjectId } from "mongodb";
import { DBInstance } from "../../../loaders/database";
import { circleSchema } from "../../../models/circleSchema";
import { NextFunction, Request, Response } from "express";
import Logger from "../../../loaders/logger";

export const getCircles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const circlesCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection("circles");

    const resData: circleSchema[] = await circlesCollection.find().toArray();
    res.status(200).json({
      success: true,
      message: `All circles`,
      data: resData,
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

export const getTopics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const circlesCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection("topics");

    const resData: circleSchema[] = await circlesCollection.find().toArray();
    res.status(200).json({
      success: true,
      message: "Topics",
      data: resData,
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

export const getSubTopics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const circlesCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection("subTopics");

    const resData: circleSchema[] = await circlesCollection.find().toArray();
    res.status(200).json({
      success: true,
      message: "Sub Topics",
      data: resData,
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

export const getCirclesByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const circlesCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection("circles");

    const resData: circleSchema[] = await circlesCollection
      .find({
        UID: `${req.params.id}`,
      })
      .toArray();

    res.status(200).json({
      success: true,
      message: `Circle of id : ${req.params.id}`,
      data: resData,
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

export const getCirclesByTag = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const circlesCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection("circles");

    const resData: circleSchema[] = await circlesCollection
      .find({
        tags: `${req.params.type}`,
      })
      .toArray();

    res.status(200).json({
      success: true,
      message: `Circle of category : ${req.params.type}`,
      data: resData,
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

export const getCirclesByPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection("posts");

    const resData = await postsCollection
      .find({
        UID: req.params.id,
      })
      .toArray();

    res.status(200).json({
      success: true,
      message: `posts for circle id : ${req.params.id}`,
      data: resData,
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

export const getSpecificCircles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const circlesCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection("circles");
    const resData: circleSchema = await circlesCollection.findOne({
      _id: new ObjectId(`${req.params.id}`),
    });
    res.status(200).json({
      success: true,
      message: `Circle of id  : ${req.params.id}`,
      data: resData,
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
