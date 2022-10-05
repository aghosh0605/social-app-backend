import { UploadedFile } from "express-fileupload";
import config from "../config";
import { mediaURLSchema } from "../models/circleSchema";
import { s3Upload } from "./s3Client";

export const uploadPhotos = async (req, res) => {
  const files = Object.assign({}, req.files);
  const picURL: Array<mediaURLSchema> = [];
  const images = [files.profileImage, files.bannerImage];

  if (Object.keys(files).length > 0) {
    if (images.length > 1) {
      images.forEach(async (element: UploadedFile) => {
        element.name = "circleImages/" + element.name;
        <mediaURLSchema>picURL.push({
          URL: config.awsBucketBaseURL + element.name,
          mimeType: element.mimetype,
          thumbnailURL: "",
        });
        await s3Upload(element as UploadedFile);
      });
    } else {
      files.images.name = "circleImages/" + files.images.name;
      <mediaURLSchema>picURL.push({
        URL: config.awsBucketBaseURL + files.images.name,
        mimeType: files.images.mimetype,
        thumbnailURL: "",
      });
      await s3Upload(files.images as UploadedFile);
    }
  }

  return picURL;
};
