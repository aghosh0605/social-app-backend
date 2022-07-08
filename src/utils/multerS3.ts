const multerS3 = require('multer-s3');
import { s3Initalize } from './s3Client';
import config from '../config/index';

export const multerS3Config = multerS3({
  s3: s3Initalize,
  bucket: config.awsBucketName,
  acl: 'public-read',
  cacheControl: 'max-age=7776000',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: async (req: Request, file: Express.Multer.File, cb) => {
    //console.log(file);
    let newFileName: string = Date.now() + '-' + file.originalname;
    let fullPath: string = 'postsImages/' + newFileName;
    cb(null, fullPath);
  },
});
