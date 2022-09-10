import {
  S3Client,
  DeleteObjectsCommand,
  DeleteObjectsCommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { UploadedFile } from 'express-fileupload';
import Logger from '../loaders/logger';
import config from '../config/index';

const s3Initalize: S3Client = new S3Client({
  region: config.awsBucketRegion,
  credentials: {
    accessKeyId: config.awsAccessKey,
    secretAccessKey: config.awsSecretKey,
  },
});

type paramsKey = [
  {
    Key: string;
  }
];

/* 
     where value for 'Key' equals 'pathName1/pathName2/.../pathNameN/fileName.ext'
     - full path name to your file without '/' at the beginning
  */

export const s3Delete = async (urls: Array<Object>): Promise<void> => {
  const deleteParams = {
    Bucket: config.awsBucketName,
    Delete: {
      Objects: urls as paramsKey,
    },
  };
  const response: DeleteObjectsCommandOutput = await s3Initalize.send(
    new DeleteObjectsCommand(deleteParams)
  );
  if (response.$metadata.httpStatusCode != 200) {
    throw { statusCode: 404, message: 'Delete Object Failed' };
  }
};

export const s3Upload = async (file: UploadedFile): Promise<void> => {
  const putParams: PutObjectCommandInput = {
    Bucket: config.awsBucketName,
    Key: file.name,
    Body: file.data,
    ACL: 'public-read',
    ContentLength: file.size,
    ContentEncoding: file.encoding,
    ContentType: file.mimetype,
  };
  const response: PutObjectCommandOutput = await s3Initalize.send(
    new PutObjectCommand(putParams)
  );
  if (response.$metadata.httpStatusCode != 200) {
    throw { statusCode: 404, message: 'Insert Object Failed' };
  }
};
