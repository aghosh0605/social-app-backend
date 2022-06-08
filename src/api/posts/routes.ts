import { NextFunction, Request, Response, Router } from "express";
import Logger from "../../loaders/logger";
const postsRoute = Router();

//http://localhost:3000/api/posts
postsRoute.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: "Posts Route" });
    next();
  } catch (error) {
    Logger.error(error);
  }
});

export default postsRoute;
