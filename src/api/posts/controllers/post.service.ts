import { UploadedFile } from 'express-fileupload';
import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { postSchema, mediaURLSchema } from '../../../models/postSchema';
import { s3Upload } from '../../../utils/s3Client';
import config from '../../../config';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';

const postService = async (req, res): Promise<ObjectId> => {
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
  const inData: postSchema = {
    UID: req.user,
    circleID: req.body.circleID,
    caption: req.body.caption,
    tags: req.body.tags.split(','),
    mediaURLs: picURL as mediaURLSchema,
    category: req.body.category,
    createdOn: new Date(),
  };

  return (await postsCollection.insertOne(inData)).insertedId;
};

export const createPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postID = await postService(req, res);
    res.status(200).json({ success: true, message: postID });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};
