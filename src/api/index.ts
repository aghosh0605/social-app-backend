import { circlesPrivateRoutes, circlesPublicRoutes } from "./circles/routes";
import { Router } from "express";
import postsRoute from "./posts/routes";
import healthCheckRoute from "./healthcheck";
import authRoutes from "./auth/routes";
import { validateJWT } from "../middlewares/verify-jwt";
import usersRoute from "./users/routes";
import FollowRoutes from "./follow/routes";
export default (): Router => {
  const app = Router();

  //TODO: add routes here...
  app.use("/follow", FollowRoutes);
  app.use("/auth", authRoutes);
  app.use("/", healthCheckRoute);
  app.use("/posts", validateJWT, postsRoute);
  app.use("/private-circles", validateJWT, circlesPrivateRoutes);
  app.use("/circles", circlesPublicRoutes);
  app.use("/users", validateJWT, usersRoute);
  return app;
};

//Main routes file
