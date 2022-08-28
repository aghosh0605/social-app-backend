import { NextFunction, Request, Response, Router } from 'express';
import Logger from '../../loaders/logger';
import { responseSchema } from '../../models/responseSchema';
import { postService } from './controllers/post.service';
import { getService } from './controllers/get.service';
import { deleteService } from './controllers/delete.service';
import {
  commentPostService,
  commentDeleteService,
} from './controllers/comments.service';
import { dbSchemaID } from '../../models/chips/dbSchema';
import yupValidator from '../../middlewares/yupValidator';
import { yupPostSchema } from '../../models/chips/postSchema';

const chipsRoute = Router();

const getChips = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resData: dbSchemaID[] = await getService();
    res.status(200).json({ status: true, message: resData });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};

const createChips = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await postService(req, res);
    res
      .status(200)
      .json({ success: true, message: '✅ Uploaded Successfully' });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};

const deleteChips = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resData: responseSchema = await deleteService(req.params);
    res.status(resData.status).json(resData.message);
    next();
  } catch (error) {
    res.status(500).json(error);
    Logger.error(error);
  }
};

const makeComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resData = await commentPostService(req);
    res.status(200).json(resData);
    next();
  } catch (error) {
    res.status(500).json(error);
    Logger.error(error);
  }
};

const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resData = await commentDeleteService(req);
    res.status(200).json(resData);
    next();
  } catch (error) {
    res.status(500).json(error);
    Logger.error(error);
  }
};

chipsRoute.get('/', getChips);

chipsRoute.post('/create', createChips);

chipsRoute.delete(
  '/:id/delete',
  yupValidator('body', yupPostSchema),
  deleteChips
);

chipsRoute.put('/comment/:id/update', makeComment);

chipsRoute.delete('/comment/:id/delete', deleteComment);

export default chipsRoute;
