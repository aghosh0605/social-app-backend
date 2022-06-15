import { Db, ObjectID } from "mongodb";
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

export const postCreateService = async (body: postsSchema) => {
  const data: Db = await db();
  var {caption} = body
  const postData = await data
    .collection("posts")
    .insertOne({
      caption: caption,
    })
    return postData
}

export const postDeleteService = async (req) => {
  const data:Db = await db();
  const deletedData = await data
  .collection("posts")
  .deleteOne({
    "_id" : new ObjectID(req.params.id)
  })
  return deletedData
}