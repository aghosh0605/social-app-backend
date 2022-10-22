import { Collection, ObjectId } from 'mongodb';
import * as url from 'url';
import * as path from 'path';

import { DBInstance } from '../../../loaders/database';
import { mediaURLSchema } from '../../../models/postSchema';
import { s3Delete } from '../../../utils/s3Client';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { paramsKey } from '../../../utils/s3Client';

const folderName = 'postsIamges';
let deleteParams: paramsKey;
let parsedURL: url.Url;
let pathName: string;
let fileName: string;

const deleteImagesService = async (req, res): Promise<ObjectId> => {  
    const postsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('posts');
    const post = await postsCollection.findOne(
      {_id: new ObjectId(req.params.id)
    });
    if (post.mediaURLs.length > 0) {
      post.mediaURLs.forEach((mediaURL: mediaURLSchema) => {
        parsedURL = url.parse(mediaURL.URL);
        pathName = parsedURL.pathname;
        fileName = path.basename(pathName);
        deleteParams = [
          {
            Key: `${folderName}/${fileName}`,
          },
        ];
      })
      await s3Delete(deleteParams);
      post.mediaURLs = [];
    }
    return post._id;
  };

export const deleteImages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const imageID = await deleteImagesService(req, res);
    res.status(200).json({ 
      success: true, 
      message: "Deleted Image Successfully",
      data: imageID, 
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
