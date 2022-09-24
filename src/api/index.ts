import circleRoute from './circles/routes';
import { Router } from 'express';
import postsRoute from './posts/routes';
import healthCheckRoute from './healthcheck';
import authRoutes from './auth/routes';
import usersRoute from './users/routes';
import { validateJWT } from '../middlewares/verify-jwt';
export default (): Router => {
  const app = Router();

  //TODO: add routes here...
  app.use('/auth', authRoutes);
  app.use('/', healthCheckRoute);
  app.use('/posts', validateJWT, postsRoute);
  app.use('/circles', validateJWT, circleRoute);
  app.use('/users', validateJWT, usersRoute);
  return app;
};

//Main routes file
