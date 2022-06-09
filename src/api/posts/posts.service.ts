import { Db } from "mongodb";
import db from "../../loaders/database";
import { yupPostsSchema, postsSchema } from "../../schema/postsSchema";

export const postsService = async (): Promise<postsSchema[]> => {
  const data: Db = await db();
  const postsData: Array<postsSchema> = await data
    .collection("posts")
    .find()
    .toArray();
  return postsData;
};
