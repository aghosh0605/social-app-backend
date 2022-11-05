import { Collection, ObjectId } from "mongodb";
import { DBInstance } from "../../../loaders/database";
import { postSchema } from "../../../models/postSchema";
import { NextFunction, Request, Response } from "express";
import Logger from "../../../loaders/logger";

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection("posts");

    const limit = 5;
    const page = req.params.page;

    const resData = await postsCollection
      .aggregate([
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "postID",
            pipeline: [
              { $project: { _id: 1 } },
              {
                $count: "commentsCount",
              },
            ],
            as: "comments",
          },
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "postID",
            pipeline: [
              { $project: { _id: 1 } },
              {
                $count: "likesCount",
              },
            ],
            as: "likes",
          },
        },
        {
          $lookup: {
            from: "circles",
            localField: "circleID",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, circleName: 1, category: 1 } }],
            as: "circles",
          },
        },
        { $skip: limit * parseInt(page) },
        { $limit: limit },
        { $sort: { createdOn: -1 } },
      ])
      .toArray();
    res.status(200).json({
      success: true,
      message: "All Posts",
      data: resData,
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

export const getUserPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let _query;
    switch (req.params.type) {
      case "user":
        _query = { UID: new ObjectId(req.params.id) };
        break;
      case "postid":
        _query = { _id: new ObjectId(req.params.id) };
        break;
    }
    const postsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection("posts");

    const limit = 5;
    const page = req.params.page;

    const resData = await postsCollection
      .aggregate([
        { $match: _query },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "postID",
            pipeline: [
              { $project: { _id: 1 } },
              {
                $count: "commentsCount",
              },
            ],
            as: "comments",
          },
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "postID",
            pipeline: [
              { $project: { _id: 1 } },
              {
                $count: "likesCount",
              },
            ],
            as: "likes",
          },
        },
        {
          $lookup: {
            from: "circles",
            localField: "circleID",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, circleName: 1, category: 1 } }],
            as: "circles",
          },
        },
        { $skip: limit * parseInt(page) },
        { $limit: limit },
        { $sort: { createdOn: -1 } },
      ])
      .toArray();
    res.status(200).json({
      success: true,
      message: "All Posts",
      data: resData,
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
