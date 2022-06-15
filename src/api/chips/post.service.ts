import { Db } from "mongodb";
import db from "../../loaders/database";
import { newChipsValidation, postSchema } from "../../schema/chips/postSchema";

export const postService = async (body: postSchema) => {
  const data: Db = await db();
  let { caption } = body;
  const postData = await data.collection("posts").insertOne({
    caption: caption,
  });
  return postData;
};
