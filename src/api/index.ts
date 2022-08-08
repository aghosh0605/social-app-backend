import { Router } from "express";
import chipsRoute from "./chips/routes";
import healthCheckRoute from "./healthcheck";
import authRoutes from "./auth/routes";
import validateJWT from "../middlewares/authentication/verify-jwt";
import circleRoute from "./circles/routes";
export default (): Router => {
  const app = Router();

  //TODO: add routes here...
  app.use("/auth", authRoutes);
  app.use("/", healthCheckRoute);
  app.use("/posts", validateJWT, chipsRoute);
  app.use("/circles", circleRoute);
  return app;
};
