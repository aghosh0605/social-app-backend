import { Router } from "express";
import postsRoute from "./posts/routes";

export default (): Router => {
  const app = Router();

  //TODO: add routes here...
  app.use("/posts", postsRoute);

  return app;
};
