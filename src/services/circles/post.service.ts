import { dbSchema } from "../../models/circles/dbSchema";
import { Db } from "mongodb";
import db from "../../loaders/database";
import Logger from "../../loaders/logger";
import checkFileSize from "../../middlewares/storage/fileSizeVerification";

export const postService = async (req, res) => {
  const fileInfo: any = await checkFileSize(req, res, "profileUrl");

  if (!fileInfo.verified) {
    return { status: 500, success: false, message: "file size exceeded" };
  }

  const newCircleData: dbSchema = { ...req.body, posts: [] };
  //   const database: Db = await db();
  //   await database.collection("circles").insertOne(newCircleData);
  return { status: 200, success: true, message: "✅ Uploaded Successfully" };
};
