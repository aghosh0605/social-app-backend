import { Collection, ObjectId } from "mongodb";
import { DBInstance } from "../../../loaders/database";
import { circleSchema, subTopicsSchema } from "../../../models/circleSchema";
import { NextFunction, Request, Response } from "express";
import Logger from "../../../loaders/logger";
import { postSchema } from "../../../models/postSchema";
import { readSync } from "fs";

const getCollection = async (name: string): Promise<Collection> => {
  const Collection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection(name);

  return Collection;
};

// !GET all circles
export const getAllCircles = async (): Promise<circleSchema[]> => {
  const circlesCollection: Collection<any> = await getCollection("circles");
  const resData: circleSchema[] = await circlesCollection.find().toArray();
  return resData;
};

//! GET circle by topics
export const getTopics = async (id: any): Promise<circleSchema[]> => {
  const circlesCollection: Collection<any> = await getCollection("circles");
  const resData: circleSchema[] = await circlesCollection
    .find({ category: id })
    .toArray();

  return resData;
};

//! GET ALL SUBTOPICS
export const getSubTopics = async (): Promise<subTopicsSchema[]> => {
  const subTopicsCollection: Collection<any> = await getCollection("subTopics");
  const resData: subTopicsSchema[] = await subTopicsCollection.find().toArray();
  return resData;
};

export const getCirclesBySubtopic = async (
  categoryID: string
): Promise<circleSchema[]> => {
  const circlesCollection: Collection<any> = await getCollection("circles");

  const resData: circleSchema[] = await circlesCollection
    .find({
      categoryID: categoryID,
    })
    .toArray();

  return resData;
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
export const getPostOfCircle = async (circleId: any): Promise<postSchema[]> => {
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
    let resData: circleSchema[] | postSchema[] | subTopicsSchema[];

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
      case "sub-topics":
        resData = await getSubTopics();
        break;
      case "topic":
        resData = await getTopics(req.query.topic);
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
