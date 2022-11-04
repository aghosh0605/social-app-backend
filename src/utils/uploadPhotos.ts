import { UploadedFile } from "express-fileupload";
import config from "../config";
import { mediaURLSchema } from "../models/circleSchema";
import { generateNanoID } from "./nanoidGenerate";
import { s3Upload } from "./s3Client";

export const uploadPhotos = async (req, res) => {
  const files = Object.assign({}, req.files);
  const picURL: Array<mediaURLSchema> = [];
  const images = [files.profileImage, files.bannerImage];

  //! nano id use

  const id = generateNanoID("0-9a-fA-F", 30);
  console.log(files);

  if (Object.keys(files).length > 0) {
    if (images.length > 1) {
      images.forEach(async (element: UploadedFile) => {
        element.name = "circleImages/" + id + "-" + element.name;
        <mediaURLSchema>picURL.push({
          URL: config.awsBucketBaseURL + element.name,
          mimeType: element.mimetype,
          thumbnailURL: "",
        });
        await s3Upload(element as UploadedFile);
      });
    } else {
      files.images.name = "circleImages/" + id + "-" + files.images.name;
      <mediaURLSchema>picURL.push({
        URL: config.awsBucketBaseURL + files.images.name,
        mimeType: files.images.mimetype,
        thumbnailURL: "",
      });
      // await s3Upload(files.images as UploadedFile);
    }
  }

  return picURL;
};
