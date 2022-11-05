import { Router } from "express";
import yupValidator from "../../middlewares/yupValidator";
import { yupObjIdSchema } from "../../models/middlewareSchemas";
import { handleFollow } from "./controllers/follow.service";

const followRoutes = Router();

followRoutes.put(
  "/uid/:id",
  yupValidator("params", yupObjIdSchema),
  handleFollow
);

followRoutes.put(
  "/cid/:id",
  yupValidator("params", yupObjIdSchema),
  handleFollow
);

export default followRoutes;
