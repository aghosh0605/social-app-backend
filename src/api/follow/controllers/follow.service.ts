import { ObjectId, Collection, DeleteResult } from "mongodb";
import { DBInstance } from "../../../loaders/database";
import { NextFunction, Request, Response } from "express";
import Logger from "../../../loaders/logger";

export const handleFollow = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const followersCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection("followers");

    followersCollection.insertOne({
      isCircle: false,
      Uid: req.params.id,
      followerId: req.user,
      timestamp: new Date(),
    });
  } catch (err) {
    throw err;
  }

  //   const reqType: string = req.url.split("/")[1];
  //   console.log(reqType);

  //   switch (reqType) {
  //     case "cid":
  //       console.log("cid", req.params.id);
  //     case "uid":
  //       console.log("uid", req.params.id);
  //   }
};
