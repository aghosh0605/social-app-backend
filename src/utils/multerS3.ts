const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

import config from '../config/index';

const s3Initalize = new S3Client({
  region: config.awsBucketRegion,
  credentials: {
    accessKeyId: config.awsAccessKey,
    secretAccessKey: config.awsSecretKey,
  },
});

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
