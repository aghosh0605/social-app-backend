import { UploadedFile } from 'express-fileupload';
import { Db } from 'mongodb';
import db from '../../../loaders/database';
import { dbSchema } from '../../../models/chips/dbSchema';
import { yupChipsValidation } from '../../../models/chips/postSchema';
import { s3Upload } from '../../../utils/s3Client';

export const postService = async (req, res): Promise<void> => {
  const files = Object.assign({}, req.files);
  if (Object.keys(files).length > 0) {
    if (files.images > 1) {
      files.images.forEach((element: UploadedFile) => {
        element.name = 'postsIamges/' + element.name;
        s3Upload(element);
      });
    } else {
      files.images.name = 'postsIamges/' + files.images.name;
      s3Upload(files.images);
    }
  }
  const validatedBody = await yupChipsValidation.validate(req.body, {
    abortEarly: false,
  });
  const data: Db = await db();
  await data.collection('posts').insertOne(validatedBody);
};
