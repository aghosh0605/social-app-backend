import { NextFunction, Request, Response, Router } from "express";
import Logger from "../../loaders/logger";
import { responseSchema } from "../../models/responseSchema";
import { getService } from "./controllers/get.service";
import { postService } from "./controllers/post.service";
import { deleteService } from "./controllers/delete.service";
import yupValidator from "../../middlewares/yupValidator";
import { yupPostSchema } from "../../models/chips/postSchema";

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

const createCircle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await postService(req, res);
    res.status(500).json({ success: "working", message: "working" });
  } catch (error) {
    res
      .status(500)
      .send("Error Could not upload the new circle! please try again later.");
    Logger.error(error);
  }
};

const deleteCircle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resData: responseSchema = await deleteService(req.params);
    res.status(resData.status).json(resData.message);
    next();
  } catch (error) {
    res.status(500).json(error);
    Logger.error(error);
  }
};

circleRoute.get("/", getCircles);
circleRoute.post("/new", createCircle);
circleRoute.delete("/:id/delete", deleteCircle);
export default circleRoute;
