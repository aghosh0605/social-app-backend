import {
  S3Client,
  DeleteObjectsCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectsCommandOutput,
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

export type paramsKey = [
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
  try {
    const result: DeleteObjectsCommandOutput = await s3Initalize.send(
      new DeleteObjectsCommand(deleteParams)
    );
    //console.log(result);
    if (result.Errors) {
      throw result.Errors;
    }
  } catch (err) {
    Logger.error(err);
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
  try {
    await s3Initalize.send(new PutObjectCommand(putParams));
  } catch (err) {
    Logger.error(err);
  }
};
