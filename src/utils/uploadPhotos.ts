import { UploadedFile } from "express-fileupload";
import config from "../config";
import { mediaURLSchema } from "../models/circleSchema";
import { generateNanoID } from "./nanoidGenerate";
import { s3Upload } from "./s3Client";

export const uploadPhotos = async (req, res, baseUrl) => {
  const files = Object.assign({}, req.files);
  const picURL: any = {};
  const images = [];
  const keys = Object.keys(req.files);
  //! nano id use

  const id = generateNanoID("0-9a-fA-F", 30);
  keys.map((el) => {
    images.push(files[el]);
  });

  if (Object.keys(files).length > 0) {
    if (images.length > 1) {
      images.forEach(async (element: UploadedFile, i) => {
        element.name = baseUrl + id + "-" + element.name;
        picURL[keys[i]] = {
          URL: config.awsBucketBaseURL + element.name,
          mimeType: element.mimetype,
          thumbnailURL: "",
        };
        await s3Upload(element as UploadedFile);
      });
    } else {
      images[0].name = baseUrl + id + "-" + images[0].name;
      picURL[keys[0]] = {
        URL: config.awsBucketBaseURL + images[0].name,
        mimeType: images[0].mimetype,
        thumbnailURL: "",
      };

      await s3Upload(images[0] as UploadedFile);
    }
  }

  return picURL;
};
