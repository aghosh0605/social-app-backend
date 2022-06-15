import { NextFunction, Request, Response, Router } from "express";
import Logger from "../../loaders/logger";
import { postService } from "./post.service";
import { getService } from "./get.service";
import { deleteService } from "./delete.service";
const chipsRoute = Router();

//http://localhost:3000/api/posts
chipsRoute.get(
  "/",
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
  "/create",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resData = await postService(req.body);
      res.status(200).json(resData);
      next();
    } catch (error) {
      Logger.error(error);
    }
  }
);

chipsRoute.delete(
  "/:id/delete",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resData = await deleteService(req);
      res.status(200).json(resData);
      next();
    } catch (error) {
      Logger.error(error);
    }
  }
);

export default chipsRoute;
