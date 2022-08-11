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

const chipsRoute = Router();

const getChips = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resData = await getService();
    res.status(200).json(resData);
    next();
  } catch (error) {
    res.status(500).send('Unknown Error');
    Logger.error(error);
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
    if (err.name === 'ValidationError') {
      let message: string = '';
      err.errors?.forEach((e: string) => {
        message += `${e}. `;
      }); // => [ Array of Validation Errors ]
      Logger.error(message);
      res.status(400).json({
        success: false,
        message: message,
      });
    } else {
      Logger.error('Unknown Error Occurred!: \n', err);
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || '❌ Unknown Error Occurred!!',
      });
    }
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

chipsRoute.delete('/:id/delete', deleteChips);

chipsRoute.put('/comment/:id/update', makeComment);

chipsRoute.delete('/comment/:id/delete', deleteComment);

export default chipsRoute;
