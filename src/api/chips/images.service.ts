import { FileFilterCallback } from 'multer';
import path from 'path';
const multer = require('multer');
import { multerS3Config } from '../../utils/awsS3';

const checkFileType = (
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const filetypes = /jpeg|jpg|png|gif|mp4|mkv|mov|mpeg|wmv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  const acceptedTypes = file.mimetype.split('/');
  const typeCheck =
    acceptedTypes[0] === 'image' || acceptedTypes[0] === 'video';
  if (mimetype && extname && typeCheck) {
    cb(null, true);
  } else {
    cb(null, false);
    cb(new Error('Only images and videos formats allowed!'));
  }
};
export const uploadS3 = multer({
  storage: multerS3Config,
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // we are allowing only 5 MB files
  },
});
