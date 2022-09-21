import { Router } from "express";

import yupValidator from "../../middlewares/yupValidator";
import { yupObjIdSchema } from "../../models/middlewareSchemas";
import { deleteCircle } from "./controllers/delete.service";
import { getCircles, getSpecificCircles } from "./controllers/get.service";
import { createCircles } from "./controllers/post.service";
import { updateDataCircle } from "./controllers/update.service";

const circlesRoute = Router();

circlesRoute.get("/all", getCircles);

circlesRoute.get(
  "/specific/:id",
  yupValidator("params", yupObjIdSchema),
  getSpecificCircles
);

circlesRoute.post("/create", createCircles);

circlesRoute.delete(
  "/delete/:id",
  yupValidator("params", yupObjIdSchema),
  deleteCircle
);

circlesRoute.put("/update/data/:id", updateDataCircle);

export default circlesRoute;
