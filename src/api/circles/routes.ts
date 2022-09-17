import { Router } from "express";

import yupValidator from "../../middlewares/yupValidator";
import { yupObjIdSchema } from "../../models/middlewareSchemas";
import { getCircles } from "./controllers/get.service";
import { createCircles } from "./controllers/post.service";

const circlesRoute = Router();

circlesRoute.get("/all", getCircles);
circlesRoute.post("/create", createCircles);
export default circlesRoute;
