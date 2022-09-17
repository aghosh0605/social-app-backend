import { Router } from "express";

import yupValidator from "../../middlewares/yupValidator";
import { yupObjIdSchema } from "../../models/middlewareSchemas";
import { getCircles, getSpecificCircles } from "./controllers/get.service";
import { createCircles } from "./controllers/post.service";

const circlesRoute = Router();

circlesRoute.get("/all", getCircles);

circlesRoute.get(
  "/:id",
  yupValidator("params", yupObjIdSchema),
  getSpecificCircles
);

circlesRoute.post("/create", createCircles);
export default circlesRoute;
