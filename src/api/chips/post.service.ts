import { Db } from "mongodb";
import db from "../../loaders/database";
import { newChipsValidation, postSchema } from "../../schema/chips/postSchema";
import { responseSchema } from "./../../schema/responseSchema";

export const postService = async (
  body: postSchema
): Promise<responseSchema> => {
  const data: Db = await db();
  let { caption } = body;
  await data.collection("posts").insertOne({
    caption: caption,
  });
  return { status: 201, message: "Created" };
};
