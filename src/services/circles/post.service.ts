import { dbSchema } from "../../models/circles/dbSchema";
import { Db } from "mongodb";
import db from "../../loaders/database";
import Logger from "../../loaders/logger";

export const postService = async (req, res) => {
  Logger.warn(req);
  return { status: 200, success: true, message: "✅ Uploaded Successfully" };
};
