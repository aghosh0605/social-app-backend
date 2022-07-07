import { Db } from 'mongodb';
import db from '../../loaders/database';
import { bodyValidator } from '../../middlewares/chips/bodyValidation';
import { dbSchema } from '../../models/chips/dbSchema';
import { uploadS3 } from '../../middlewares/chips/filesValidate';
import Logger from '../../loaders/logger';

export const postService = async (req, res) => {
  let catchError;
  const picData: Array<Object> = await new Promise((resolve) => {
    uploadS3.array('images', 5)(req, res, (err) => {
      if (err) {
        catchError = err.message;
        Logger.error(err.message);
        resolve(undefined);
        return;
      }
      let data: Array<Object> = [];
      for (let i = 0; i < req.files.length; i++) {
        data[i] = {
          filename: req.files[i].location,
          resType: req.files[i].mimetype,
        };
      }
      resolve(data);
    });
  });
  if (!picData) {
    return {
      status: 404,
      success: false,
      message: `❗ ${catchError}`,
    };
  }
  const finalData: dbSchema = await bodyValidator(req.body, picData);
  const data: Db = await db();
  await data.collection('posts').insertOne(finalData);
  return { status: 200, success: true, message: '✅ Uploaded Successfully' };
};
