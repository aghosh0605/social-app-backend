import { Db } from "mongodb";
import db from "../../loaders/database";
import { newChipsValidation, postSchema } from "../../schema/chips/postSchema";
import { inpdbSchema } from "../../schema/chips/dbSchema";
export const postService = async (chipsData: postSchema): Promise<void> => {
  await newChipsValidation
    .validate(chipsData, { abortEarly: false })
    .then(async (value) => {
      const inpData: inpdbSchema = {
        caption: value.caption,
        comments: {
          commentsCount: 0,
        },
        likes: {
          likesCount: 0,
        },
        tags: value.tags.split(","),

        circle: "Public",
      };
      const data: Db = await db();
      await data.collection("posts").insertOne(inpData);
    });
};
