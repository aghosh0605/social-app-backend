import { Router } from "express";
import yupValidator from "../../middlewares/yupValidator";
import { yupObjIdSchema } from "../../models/middlewareSchemas";
import {
  handleCircleFollow,
  handleUserFollow,
} from "./controllers/folow.service";

const followRoutes = Router();

followRoutes.put(
  "/uid/:id",
  yupValidator("params", yupObjIdSchema),
  handleUserFollow
);

followRoutes.put(
  "/cid/:id",
  yupValidator("params", yupObjIdSchema),
  handleCircleFollow
);

export default followRoutes;
