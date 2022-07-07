import { NextFunction, Request, Response, Router } from 'express';
import Logger from '../../loaders/logger';
import { responseSchema } from '../../models/responseSchema';
import { postService } from '../../services/chips/post.service';
import { getService } from '../../services/chips/get.service';
import { deleteService } from '../../services/chips/delete.service';
import {
  commentPostService,
  commentDeleteService,
} from '../../services/chips/comments.service';

const chipsRoute = Router();

// http://localhost:3000/api/posts
chipsRoute.get(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resData = await getService();
      res.status(200).json(resData);
      next();
    } catch (error) {
      Logger.error(error);
    }
  }
);

chipsRoute.post(
  '/create',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await postService(req, res);
    if (!result) {
      res.status(500).json({ success: false, message: 'Something is wrong' });
      return;
    }
    res.status(200).json({ success: true, message: 'Posted Successfully' });
    next();
  }
);

chipsRoute.delete(
  '/:id/delete',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resData: responseSchema = await deleteService(req.params);
      res.status(resData.status).json(resData.message);
      next();
    } catch (error) {
      Logger.error(error);
    }
  }
);

chipsRoute.put(
  '/comment/:id/update',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resData = await commentPostService(req);
      res.status(200).json(resData);
      next();
    } catch (error) {
      Logger.error(error);
    }
  }
);

chipsRoute.delete(
  '/comment/:id/delete',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resData = await commentDeleteService(req);
      res.status(200).json(resData);
      next();
    } catch (error) {
      Logger.error(error);
    }
  }
);

export default chipsRoute;
