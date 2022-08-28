import { UploadedFile } from "express-fileupload";
import { Db } from "mongodb";
import db from "../../../loaders/database";
import { dbSchema } from "../../../models/circles/dbSchema";
import { s3Upload } from "../../../utils/s3Client";
import config from "../../../config";
var randomString = require("randomstring");

export const postService = async (req, res): Promise<void> => {
  const files = Object.assign(
    {},
    {
      images: [
        { data: req.files.profileUrl, imageType: "profileUrl" },
        { data: req.files.bannerUrl, imageType: "bannerUrl" },
      ],
    }
  );

  const picURL: Array<Object> = [];

  if (Object.keys(files).length > 0) {
    files.images.forEach(async (element: any) => {
      const random = randomString.generate({
        length: 32,
        charset: "alphanumeric",
      });
      console.log(element.data);
      const el = element.data.name.split(".");
      const type = element.data.mimetype.split("/");
      const elName = `circlesTestImages/${el[0]}-${random}.${type[1]}`;
      element.data.name = elName;
      picURL.push({
        path: config.awsBucketBaseURL + elName,
        ContentType: element.data.mimetype,
        imageType: element.imageType,
      });
      // await s3Upload(element.data);
    });
  }

  const data: Db = await db();
  const inData: dbSchema = {
    imagesData: picURL,
    name: req.body.name,
    category: req.body.category,
    about: req.body.about,
    private: req.body.private,
    posts: [],
  };

  console.log(inData);

  // await data.collection("circles").insertOne(inData);
};
