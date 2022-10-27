import { Router } from "express";

import yupValidator from "../../middlewares/yupValidator";
import {
  yupCircleSearchData,
  yupCircleSearchType,
} from "../../models/circleSchema";
import {
  yupObjIdSchema,
  yupObjCirclesBodySchema,
  yupObjTypeSchema,
} from "../../models/middlewareSchemas";
import { deleteCircle } from "./controllers/delete.service";
import {
  getCircle,
  getAllCircles,
  getCirclesByTag,
  getCirclesByUser,
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

circlesPublicRoutes.get("/all", getAllCircles);

circlesPublicRoutes.get("/subTopics", getSubTopics);

circlesPublicRoutes.get("/topics", getTopics);

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
  "/fetch/:type",
  yupValidator("params", yupCircleSearchType),
  yupValidator("query", yupCircleSearchData),
  getCircle
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
