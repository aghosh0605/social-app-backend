import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import os from 'os';
import fileUpload from 'express-fileupload';
import config from '../config';
import routes from '../api';
import rateLimit from 'express-rate-limit';

export default ({ app }: { app: express.Application }): void => {
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.set('trust proxy', 1); //For heroku=1

  // Enable Express Rate Limitter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  app.use(limiter);

  // Middleware that helps secure app by setting headers
  app.use(helmet());

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Middleware that transforms the raw string of req.body into json
  app.use(express.json({ limit: '2mb' }));

  const upOpt = {
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: 'File Size Limit exceeded',
    // debug: true,
    parseNested: true,
    // useTempFiles: true,
    // tempFileDir: os.tmpdir(),
    preserveExtension: 4,
  };

  app.use(fileUpload(upOpt));

  // Load API routes
  app.use(config.api.prefix, routes());

  //when we use next(err) it will go to error handling middleware and it will catch error and send response.
  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred !! ',
    });
  });
};
