const { S3Client } = require('@aws-sdk/client-s3');
import config from '../config/index';

export const s3Initalize = new S3Client({
  region: config.awsBucketRegion,
  credentials: {
    accessKeyId: config.awsAccessKey,
    secretAccessKey: config.awsSecretKey,
  },
});
