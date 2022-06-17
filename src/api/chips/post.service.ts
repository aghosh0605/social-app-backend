import { Db } from "mongodb";
import db from "../../loaders/database";
import { newChipsValidation, postSchema } from "../../schema/chips/postSchema";

export const postService = async (chipsData: postSchema): Promise<void> => {
  await newChipsValidation
    .validate(chipsData, { abortEarly: false })
    .then(async (value) => {
      const data: Db = await db();
      await data.collection("posts").insertOne({
        caption: value.caption,
        tags: value.tags,
        pictureUrl: value.pictureUrl,
      });
    });
};
