import { Router } from "express";
import chipsRoute from "./chips/routes";

export default (): Router => {
  const app = Router();

  //TODO: add routes here...
  app.use("/posts", chipsRoute);

  return app;
};
