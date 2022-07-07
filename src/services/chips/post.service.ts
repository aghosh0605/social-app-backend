import { Db } from 'mongodb';
import db from '../../loaders/database';
import { newChipsValidation } from '../../middlewares/chips/Validation';
import { dbSchema } from '../../models/chips/dbSchema';
import { uploadS3 } from '../../middlewares/chips/imageUpload';

export const postService = async (req, res) => {
  const result = await new Promise((resolve) => {
    try {
      uploadS3.array('images', 5)(req, res, (err) => {
        if (err) {
          console.error(err);
          resolve(undefined);
          return;
        }
        console.log(req.files);
        let data = [];
        for (let i = 0; i < req.files.length; i++) {
          data[i] = {
            filename: req.files[i].location,
            resType: req.files[i].mimetype,
          };
        }
        resolve(data);
      });
    } catch (error) {
      console.log(error);
      resolve(undefined);
    }
  });
  return result;
};
