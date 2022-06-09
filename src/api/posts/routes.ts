import { NextFunction, Request, Response, Router } from "express";
import Logger from "../../loaders/logger";
import { postsService } from "./posts.service";
const postsRoute = Router();

//http://localhost:3000/api/posts
postsRoute.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resData = await postsService();
      res.status(200).json(resData);
      next();
    } catch (error) {
      Logger.error(error);
    }
  }
);

export default postsRoute;
