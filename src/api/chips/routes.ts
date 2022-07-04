import { NextFunction, Request, Response, Router } from 'express';
import Logger from '../../loaders/logger';
import { responseSchema } from './../../schema/responseSchema';
import { postService } from './post.service';
import { getService } from './get.service';
import { deleteService } from './delete.service';
import { commentPostService, commentDeleteService } from './comments.service';
import { uploadS3 } from './images.service';

const chipsRoute = Router();

//http://localhost:3000/api/posts
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
    try {
      await postService(req.body);
      res.status(200).json({ success: true, message: 'Created' });
      next();
    } catch (err) {
      Logger.error(err);
      if (err.name === 'ValidationError') {
        let message: string = '';
        err.errors?.forEach((e: string) => {
          message += `${e}. `;
        }); // => [ Array of Validation Errors ]
        res.status(400).json({
          success: false,
          message: message,
        });
      } else {
        Logger.error('Unknown Error Occurred!', err);
        res.status(500).json({
          success: false,
          message: '❌ Unknown Error Occurred!!',
        });
      }
    }
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

const upload = uploadS3.array('images', 5); //Max file Upload is 5 files

chipsRoute.post(
  '/images',
  (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err) => {
      console.log(req.files);
      if (err.message) {
        // An unknown error occurred when uploading.
        Logger.error(err);
        res.status(415).json({
          success: false,
          message: err.message,
        });
      } else {
        // Everything went fine.
        res.status(200).send({
          success: true,
          result: `Images Uploaded`,
        });
        next();
      }
    });
  }
);

export default chipsRoute;
