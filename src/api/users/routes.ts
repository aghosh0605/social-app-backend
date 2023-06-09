import { Router } from "express";
import { validateJWT } from "../../middlewares/verify-jwt";
import { getUser, getLoggedInUser } from "./controllers/get.service";
import { updateUser } from "./controllers/update.service";
import { yupObjIdSchema } from "../../models/middlewareSchemas";
import yupValidator from "../../middlewares/yupValidator";
import { blockUser } from "./controllers/block.service";
import {
  yupUserSchema,
  yupUserSearchData,
  yupUserSearchType,
} from "../../models/userSchema";
import { updateAppearance } from "./controllers/appearance.service";

const usersRoute = Router();

usersRoute.get("/current", validateJWT, getLoggedInUser);

//Get user details
usersRoute.get(
  "/fetch/:type",
  yupValidator("params", yupUserSearchType),
  yupValidator("query", yupUserSearchData),
  getUser
);

usersRoute.patch("/appearance", validateJWT, updateAppearance);

//Update a user by id
usersRoute.patch(
  "/update",
  validateJWT,
  yupValidator("body", yupUserSchema),
  updateUser
);

//Block a specific user with id
usersRoute.patch(
  "/user-block/:id",
  yupValidator("params", yupObjIdSchema),
  blockUser
);

export default usersRoute;
