import { NextFunction, Request, Response, Router } from "express";
import Logger from "../../loaders/logger";
import { responseSchema } from "../../models/responseSchema";
import { getService } from "./controllers/get.service";
import { postService } from "./controllers/post.service";

const circleRoute = Router();

const getCircles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resData = await getService();
    res.status(200).json(resData);
    next();
  } catch (error) {
    res.status(500).send("Error circles not found!");
    Logger.error(error);
  }
};

circleRoute.post(
  "/new",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await postService(req, res);
      res.status(500).json({ success: "working", message: "working" });
    } catch (error) {
      res
        .status(500)
        .send("Error Could not upload the new circle! please try again later.");
      Logger.error(error);
    }
  }
);

circleRoute.get("/", getCircles);

export default circleRoute;
