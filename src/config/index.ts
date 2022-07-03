require('dotenv').config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  /**
   * Port the app should run on
   */
  port: parseInt(process.env.PORT) || 5050,

  /**
   * Database the app should connect to
   */
  databaseURL: process.env.MONGODB_URI,

  /**
   * The secret sauce to validate JWT
   */
  jwtSecret: process.env.JWT_SECRET,

  /**
   * AWS S3 Bucket Credentials
   */
  awsBucketName: process.env.AWS_BUCKET_NAME_PIECHIPS,
  awsBucketRegion: process.env.AWS_BUCKET_REGION_PIECHIPS,
  awsAccessKey: process.env.AWS_ACCESS_KEY_PIECHIPS,
  awsSecretKey: process.env.AWS_SECRET_KEY_PIECHIPS,

  /**
   * Used by Winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },
};
