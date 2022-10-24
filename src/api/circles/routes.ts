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
  getCirclesByPost,
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

const circlesPrivateRoutes = Router();
const circlesPublicRoutes = Router();

circlesPublicRoutes.get("/all", getCircles);

circlesPublicRoutes.get("/subTopics", getSubTopics);

circlesPublicRoutes.get("/topics", getTopics);

circlesPublicRoutes.get(
  "/specific/:id",
  yupValidator("params", yupObjIdSchema),
  getSpecificCircles
);

circlesPublicRoutes.get(
  "/user/:id",
  yupValidator("params", yupObjIdSchema),
  getCirclesByUser
);

circlesPublicRoutes.get(
  "/category/:type",
  yupValidator("params", yupObjTypeSchema),
  getCirclesByTag
);

circlesPublicRoutes.get(
  "/posts/:id",
  yupValidator("params", yupObjIdSchema),
  getCirclesByPost
);

circlesPrivateRoutes.post(
  "/create",
  yupValidator("body", yupObjCirclesBodySchema),
  createCircles
);

circlesPrivateRoutes.delete(
  "/delete/:id",
  yupValidator("params", yupObjIdSchema),
  deleteCircle
);

circlesPrivateRoutes.put(
  "/update/data/:id",
  yupValidator("body", yupObjCirclesBodySchema),
  updateDataCircle
);

circlesPrivateRoutes.put(
  "/update/images/:id",
  // yupValidator("body", yupObjCirclesBodySchema),
  updateImageCircle
);

export { circlesPrivateRoutes, circlesPublicRoutes };
