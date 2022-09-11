import { UploadedFile } from 'express-fileupload';
import { Collection } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { postSchema } from '../../../models/postSchema';
import { s3Upload } from '../../../utils/s3Client';
import config from '../../../config';
import { NextFunction, Request, Response, Router } from 'express';
import Logger from '../../../loaders/logger';

const postService = async (req, res): Promise<void> => {
  const files = Object.assign({}, req.files);
  const picURL: Array<Object> = [];

  if (Object.keys(files).length > 0) {
    if (files.images.length > 1) {
      files.images.forEach(async (element: UploadedFile) => {
        element.name = 'postsIamges/' + element.name;
        picURL.push({
          path: config.awsBucketBaseURL + element.name,
          ContentType: element.mimetype,
        });
        await s3Upload(element as UploadedFile);
      });
    } else {
      files.images.name = 'postsIamges/' + files.images.name;
      picURL.push({
        path: config.awsBucketBaseURL + files.images.name,
        ContentType: files.images.mimetype,
      });
      await s3Upload(files.images as UploadedFile);
    }
  }

  const postsCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('posts');
  // const inData: postSchema = {
  //   caption: req.body.caption,
  //   tags: req.body.tags.split(','),
  //   mediaURLs: picURL,
  //   circle: req.body.circle.split(','),
  // };

  // await postsCollection.insertOne(inData);
};

export const createPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await postService(req, res);
    res
      .status(200)
      .json({ success: true, message: '✅ Uploaded Successfully' });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};
