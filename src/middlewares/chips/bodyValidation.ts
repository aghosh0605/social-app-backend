import { yupChipsValidation, postSchema } from '../../models/chips/postSchema';
import { dbSchema } from '../../models/chips/dbSchema';
import { s3delete } from '../../utils/awsS3Delete';
import Logger from '../../loaders/logger';

export const bodyValidator = async (
  chipsData: postSchema,
  picsUrls: Array<Object>,
  files: Express.Multer.File
): Promise<dbSchema> => {
  const valid = await yupChipsValidation.isValid(chipsData);
  //console.log(files);
  let objects = [];
  for (let k in files) {
    objects.push({ Key: files[k].key });
  }
  if (!valid) {
    await s3delete(objects);
    Logger.info(`🫙 Deleted ${picsUrls} `);
  }
  const value = await yupChipsValidation.validate(chipsData, {
    abortEarly: false,
  });
  //console.log(value);
  const inpData: dbSchema = {
    caption: value.caption,
    comments: {},
    likes: [],
    tags: value.tags.split(','),
    pictureUrl: picsUrls,
    circle: value.circle.split(','),
  };
  return inpData;
};
