import { Db, DeleteWriteOpResultObject, ObjectID } from "mongodb";
import db from "../../loaders/database";
import { responseSchema } from "./../../schema/responseSchema";
import Logger from "../../loaders/logger";

export const deleteService = async (req): Promise<responseSchema> => {
  const data: Db = await db();
  const resData: DeleteWriteOpResultObject = await data
    .collection("posts")
    .deleteOne({
      _id: new ObjectID(req.params.id),
    });

  if (!resData.result.n) {
    return { status: 404, message: "Not Found" };
  }
  if (resData.deletedCount) {
    return { status: 200, message: "Deleted" };
  }

  Logger.warn(
    `Found Results\n: ${resData.result} \n Deleted Results: ${resData.deletedCount}\n`
  );
  return { status: 204, message: "No Content" };
};
