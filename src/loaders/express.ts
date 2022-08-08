import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import config from '../config';
import routes from '../api';

export default ({ app }: { app: express.Application }): void => {
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // Middleware that helps secure app by setting headers
  app.use(helmet());

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Middleware that transforms the raw string of req.body into json
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Load API routes
  app.use(config.api.prefix, routes());

  //when we use next(err) it will go to error handling middleware and it will catch error and send response.
  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
      status: false,
      message: err.message || 'Unknown error occurred',
    });
  });
};
