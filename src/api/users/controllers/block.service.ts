import { Collection, ObjectId } from "mongodb";
import { DBInstance } from "../../../loaders/database";
import { NextFunction, Request, Response } from "express";
import Logger from "../../../loaders/logger";

export const blockUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const usersCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection("users");
    const user = req.user;

    if (!(await usersCollection.findOne({ id }))) {
      res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    } else {
      await usersCollection.updateOne(
        { _id: user },
        { $push: { blockedUID: id } }
      );
      next();
    }
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "❌ Unknown Error Occurred!!",
    });
  }
};
