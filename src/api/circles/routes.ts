import { NextFunction, Request, Response, Router } from "express";
import Logger from "../../loaders/logger";
import { responseSchema } from "../../models/responseSchema";
import { getService } from "../../services/circles/get.services";
import { postService } from "../../services/circles/post.service";

const circleRoute = Router();

circleRoute.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resData = await getService();
      res.status(200).json(resData);
      next();
    } catch (error) {
      res.status(500).send("Error circles not found!");
      Logger.error(error);
    }
  }
);

circleRoute.post(
  "/new",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resData: responseSchema = await postService(req, res);
      res
        .status(resData.status)
        .json({ success: resData.success, message: resData.message });
    } catch (error) {
      res
        .status(500)
        .send("Error Could not upload the new circle! please try again later.");
      Logger.error(error);
    }
  }
);
export default circleRoute;
