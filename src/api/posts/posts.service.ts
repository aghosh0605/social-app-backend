import { Db } from "mongodb";
import { DBInstance } from "./../../loaders/database";
import { yupPostsSchema, postsSchema } from "../../schema/postsSchema";

export const postsService = async (): Promise<postsSchema[]> => {
  const data: Db = await DBInstance.getDatabase();
  const postsData: Array<postsSchema> = await data
    .collection("posts")
    .find()
    .limit(10)
    .toArray();
  return postsData;
};
