import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { s3Initalize } from './s3Client'; // Helper function that creates an Amazon S3 service client module.
import config from '../config/index';

export const s3delete = async (urls): Promise<void> => {
  try {
    //console.log(urls);
    const bucketParams = {
      Bucket: config.awsBucketName,
      Delete: {
        Objects: urls,
      },
    };
    await s3Initalize.send(new DeleteObjectsCommand(bucketParams));
    //console.log('Success. Object deleted.');
  } catch (err) {
    console.log('Error', err);
  }
};
