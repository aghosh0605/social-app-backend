import { ObjectId, Collection, DeleteResult } from "mongodb";
import { DBInstance } from "../../../loaders/database";
import { NextFunction, Request, Response } from "express";
import Logger from "../../../loaders/logger";
import { circleSchema } from "../../../models/circleSchema";

export const handleFollow = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const followersCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection("followers");

    const reqType = req.url.split("/")[1];

    const allFollowing =
      reqType === "cid"
        ? await followersCollection.findOne({
            $and: [{ followerId: req.user }, { CID: req.params.id }],
          })
        : await followersCollection.findOne({
            $and: [{ followerId: req.user }, { UID: req.params.id }],
          });

    if (allFollowing) {
      await followersCollection.deleteOne({
        _id: allFollowing._id,
      });

      throw { status: 200, success: true, message: "unfollowed " };
    }

    if (reqType === "cid") {
      const circleCollection: Collection<any> = await (
        await DBInstance.getInstance()
      ).getCollection("circles");

      const foundCircle: circleSchema = await circleCollection.findOne({
        _id: new ObjectId(`${req.params.id}`),
      });

      if (!foundCircle) {
        throw { status: 404, success: false, message: "Circle not found" };
      }

      await followersCollection.insertOne({
        isCircle: true,
        CID: req.params.id,
        followerId: req.user,
        timestamp: new Date(),
      });
    } else {
      const userCollection: Collection<any> = await (
        await DBInstance.getInstance()
      ).getCollection("users");

      const foundUser = await userCollection.findOne({
        _id: new ObjectId(`${req.params.id}`),
      });

      if (!foundUser) {
        throw { status: 404, success: false, message: "User not found" };
      }

      await followersCollection.insertOne({
        isCircle: false,
        UID: req.params.id,
        followerId: req.user,
        timestamp: new Date(),
      });
    }

    res.status(200).json({ success: true, message: `Followed succesfully` });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "❌ Unknown Error Occurred!!",
    });
  }
};
