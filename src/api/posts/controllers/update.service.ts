import { Collection, ObjectId } from 'mongodb';
import { UploadedFile } from 'express-fileupload';
import {DBInstance} from '../../../loaders/database';
import { postSchema, mediaURLSchema } from '../../../models/postSchema';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import config from '../../../config';
import { s3Upload } from '../../../utils/s3Client';

const updateService = async (req, res): Promise<ObjectId> => {
  const files = Object.assign({}, req.files);
  const picURL: Array<mediaURLSchema> = [];

  if (Object.keys(files).length > 0) {
    if (files.images.length > 1) {
      files.images.forEach(async (element: UploadedFile) => {
        element.name = 'postsIamges/' + element.name;
        <mediaURLSchema>picURL.push({
          URL: config.awsBucketBaseURL + '/' + element.name,
          mimeType: element.mimetype,
          thumbnailURL: '',
        });
        //console.log(element.name);
        await s3Upload(element as UploadedFile);
      });
    } else {
      files.images.name = 'postsIamges/' + files.images.name;
      <mediaURLSchema>picURL.push({
        URL: config.awsBucketBaseURL + '/' + files.images.name,
        mimeType: files.images.mimetype,
        thumbnailURL: '',
      });
      //console.log(files.images.name);
      await s3Upload(files.images as UploadedFile);
    }
  }

  const postsCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('posts');
  let inData: postSchema = await postsCollection.findOne({
    _id: new ObjectId(req.params.id),
  })
  inData = req.body as postSchema;
  if (req.files.images && inData.mediaURLs !== undefined) {
    inData.mediaURLs.push(...picURL as mediaURLSchema);
  } else {
    inData.mediaURLs = picURL as mediaURLSchema;
  }
  const resData = await postsCollection.updateOne({
    _id: new ObjectId(req.params.id),
  }, {
    $set: inData,
  })
  return resData.upsertedId;
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postID = await updateService(req, res);
    res.status(200).json({ 
      success: true, 
      message: "Post Updated",
      data: postID
    });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
      data: null,
    });
  }
};