import { NextFunction, Request, Response, Router } from "express";

const healthCheckRoute = Router();
healthCheckRoute.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const healthcheckData = {
      uptime: process.uptime(),
      message: "⚙️ API v1 working!",
      timestamp: Date.now(),
    };
    res.status(200).json(healthcheckData);
    next();
  } catch (e) {
    res.status(503).send(e);
  }
});

export default healthCheckRoute;
