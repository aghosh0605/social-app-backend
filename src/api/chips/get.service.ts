import { Db } from "mongodb";
import db from "../../loaders/database";
import { postSchema } from "../../schema/chips/postSchema";

export const getService = async (): Promise<postSchema[]> => {
  const data: Db = await db();
  const postsData: Array<postSchema> = await data
    .collection("posts")
    .find()
    .toArray();
  return postsData;
};
