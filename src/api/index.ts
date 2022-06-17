import { Router } from "express";
import chipsRoute from "./chips/routes";
import healthCheckRoute from "./healthcheck";

export default (): Router => {
  const app = Router();

  //TODO: add routes here...
  app.use("/", healthCheckRoute);
  app.use("/posts", chipsRoute);

  return app;
};
