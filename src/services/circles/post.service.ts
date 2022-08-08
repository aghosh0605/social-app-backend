import { dbSchema } from "../../models/circles/dbSchema";
import { Db } from "mongodb";
import db from "../../loaders/database";
import Logger from "../../loaders/logger";
import checkFileSize from "../../middlewares/storage/fileSizeVerification";

export const postService = async (req, res) => {
  //   const profileInfo: any = await checkFileSize(req, res, "profileUrl");

  //   if (!profileInfo.verified) {
  //     return { status: 500, success: false, message: profileInfo.message };
  //   }

  const imagesInfo: any = await checkFileSize(req, res, [
    { name: "profileUrl" },
    { name: "bannerUrl" },
  ]);

  if (!imagesInfo.status) {
    return { status: 500, success: false, message: imagesInfo.message };
  }

  const newCircleData: dbSchema = { ...req.body, posts: [] };
  //   const database: Db = await db();
  //   await database.collection("circles").insertOne(newCircleData);
  return { status: 200, success: true, message: "✅ Uploaded Successfully" };
};
