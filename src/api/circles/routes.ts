import { Router } from "express";

import yupValidator from "../../middlewares/yupValidator";
import {
  yupObjIdSchema,
  yupObjCirclesBodySchema,
  yupObjTypeSchema,
} from "../../models/middlewareSchemas";
import { deleteCircle } from "./controllers/delete.service";
import {
  getCircles,
  getCirclesByTag,
  getCirclesByUser,
  getSpecificCircles,
  getSubTopics,
  getTopics,
} from "./controllers/get.service";
import { createCircles } from "./controllers/post.service";
import {
  updateDataCircle,
  updateImageCircle,
} from "./controllers/update.service";

const circlesRoute = Router();

circlesRoute.get("/all", getCircles);

circlesRoute.get("/subTopics", getSubTopics);

circlesRoute.get("/topics", getTopics);

circlesRoute.get(
  "/specific/:id",
  yupValidator("params", yupObjIdSchema),
  getSpecificCircles
);

circlesRoute.get(
  "/user/:id",
  yupValidator("params", yupObjIdSchema),
  getCirclesByUser
);

circlesRoute.get(
  "/category/:type",
  yupValidator("params", yupObjTypeSchema),
  getCirclesByTag
);

circlesRoute.post(
  "/create",
  yupValidator("body", yupObjCirclesBodySchema),
  createCircles
);

circlesRoute.delete(
  "/delete/:id",
  yupValidator("params", yupObjIdSchema),
  deleteCircle
);

circlesRoute.put(
  "/update/data/:id",
  yupValidator("body", yupObjCirclesBodySchema),
  updateDataCircle
);

circlesRoute.put(
  "/update/images/:id",
  // yupValidator("body", yupObjCirclesBodySchema),
  updateImageCircle
);

export default circlesRoute;
