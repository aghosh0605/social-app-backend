import { Collection, ObjectId } from "mongodb";
import { DBInstance } from "../../../loaders/database";
import { NextFunction, Request, Response } from "express";
import {
  getCirclesBySubtopic,
  getPostOfCircle,
  getSubTopics,
} from "../../circles/controllers/get.service";
import { randomSelector } from "../../../utils/slelectRandon";
import { circleSchema } from "../../../models/circleSchema";
import { postSchema } from "../../../models/postSchema";

export const handleExolore = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resData = await getSubTopics();
  const data = await randomSelector(resData, 5);
  let circles: circleSchema[] = [];
  let posts: postSchema[] = [];
  data.map(async (i) => {
    let _circle = await getCirclesBySubtopic(i._id.toString());
    _circle.map((__circle) => {
      circles.push(__circle);
    });
  });
  circles.map(async (circle) => {
    let _post = await getPostOfCircle(circle._id.toString());
    _post.map((post) => {
      posts.push(post);
    });
  });
  res.status(200).json({
    success: true,
    data: posts,
  });
};
