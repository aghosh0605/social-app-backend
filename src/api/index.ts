import { Router } from 'express';
import chipsRoute from './chips/routes';
import healthCheckRoute from './healthcheck';
import authRoutes from './auth/routes';
import validateJWT from '../middlewares/authentication/verify-jwt';
export default (): Router => {
  const app = Router();

  //TODO: add routes here...
  app.use('/auth', authRoutes);
  app.use('/', healthCheckRoute);
  app.use('/posts', validateJWT, chipsRoute);

  return app;
};
