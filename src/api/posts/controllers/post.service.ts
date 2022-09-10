import { UploadedFile } from 'express-fileupload';
import { Collection } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { dbSchema } from '../../../models/posts/dbSchema';
import { s3Upload } from '../../../utils/s3Client';
import config from '../../../config';

export const postService = async (req, res): Promise<void> => {
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
  const inData: dbSchema = {
    caption: req.body.caption,
    comments: {},
    likes: [],
    tags: req.body.tags.split(','),
    picURL: picURL,
    circle: req.body.circle.split(','),
  };

  await postsCollection.insertOne(inData);
};
