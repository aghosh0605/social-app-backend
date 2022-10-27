import { Collection, ObjectId } from "mongodb";
import { DBInstance } from "../../../loaders/database";
import { circleSchema } from "../../../models/circleSchema";
import { NextFunction, Request, Response } from "express";
import Logger from "../../../loaders/logger";
import { postSchema } from "../../../models/postSchema";

const getCollection = async (name: string): Promise<Collection> => {
  const Collection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection(name);

  return Collection;
};

// GET all circles
export const getAllCircles = async (): Promise<circleSchema[]> => {
  const circlesCollection: Collection<any> = await getCollection("circles");
  const resData: circleSchema[] = await circlesCollection.find().toArray();
  return resData;
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

// ! GET all circles of a certain user using uid
const getCirclesByUser = async (uid: any): Promise<circleSchema[]> => {
  const circlesCollection: Collection<any> = await getCollection("circles");

  const resData: circleSchema[] = await circlesCollection
    .find({
      UID: uid,
    })
    .toArray();

  return resData;
};

// ! GET All circles by a tag
const getCirclesByTag = async (type: any): Promise<circleSchema[]> => {
  const circlesCollection: Collection<any> = await getCollection("circles");
  console.log(type);

  const resData: circleSchema[] = await circlesCollection
    .find({
      tags: type,
    })
    .toArray();

  return resData;
};

//! GET All posts of a specific circle
const getPostOfCircle = async (circleId: any): Promise<postSchema[]> => {
  const postsCollection: Collection<any> = await getCollection("posts");

  const resData: postSchema[] = await postsCollection
    .find({
      circleID: circleId,
    })
    .toArray();

  return resData;
};

//! GET Specific circle using id
const getSpecificCircle = async (id: any): Promise<circleSchema[]> => {
  const circlesCollection: Collection<any> = await getCollection("circles");

  const resData: circleSchema[] = await circlesCollection.findOne({
    _id: new ObjectId(id),
  });

  return resData;
};

//! MAIN FUNCTION
export const getCircle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let resData: circleSchema[] | postSchema[];

    switch (Object.keys(req.query)[0]) {
      case "all":
        resData = await getAllCircles();
        break;
      case "id":
        resData = await getSpecificCircle(req.query.id);
        break;
      case "posts":
        resData = await getPostOfCircle(req.query.posts);
        break;
      case "tag":
        resData = await getCirclesByTag(req.query.tag);
        break;
      case "user":
        resData = await getCirclesByUser(req.query.user);
        break;
    }

    res.status(200).json({
      success: true,
      message: "Found circle Details",
      data: resData,
    });

    next();
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "❌ Unknown Error Occurred!!",
      data: null,
    });
  }
};
