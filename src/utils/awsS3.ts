const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
import path from 'path';
import config from '../config/index';

const s3Initalize = new S3Client({
  region: config.awsBucketRegion,
  credentials: {
    accessKeyId: config.awsAccessKey,
    secretAccessKey: config.awsSecretKey,
  },
});

const multerS3Config = multerS3({
  s3: s3Initalize,
  bucket: config.awsBucketName,
  acl: 'public-read',
  cacheControl: 'max-age=7776000',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: async (req, file, cb) => {
    //console.log(file);
    let newFileName = Date.now() + '-' + file.originalname;
    let fullPath = 'postsImages/' + newFileName;
    cb(null, fullPath);
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};
export const uploadS3 = multer({
  storage: multerS3Config,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // we are allowing only 5 MB files
  },
});
