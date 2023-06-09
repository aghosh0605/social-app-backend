import { NextFunction, Request, Response, Router } from 'express';
import os from 'os';
import { validateJWT } from '../middlewares/verify-jwt';

const healthCheckRoute = Router();
const timeElapsed = Date.now();
const today = new Date(timeElapsed);

const formatTime = (seconds) => {
  function pad(s) {
    return (s < 10 ? '0' : '') + s;
  }
  let hours = Math.floor(seconds / (60 * 60));
  let minutes = Math.floor((seconds % (60 * 60)) / 60);
  let secs = Math.floor(seconds % 60);

  return pad(hours) + ':' + pad(minutes) + ':' + pad(secs);
};

healthCheckRoute.get(
  '/secured',
  validateJWT,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const healthcheckData = {
        message: '🛠️ API v1 working!',
        serverUptime: formatTime(process.uptime()),
        osUptime: formatTime(os.uptime()),
        timestamp: today.toUTCString(),
        cpus: os.cpus(),
        architecture: os.arch(),
        networkInterfaces: os.networkInterfaces(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        platform: os.platform(),
        osType: os.type(),
        osRelease: os.release(),
        osVersion: os.version(),
        hostname: os.hostname(),
        userInfo: os.userInfo(),
        reqIP: req.ip, //reqIP==your public ip states that trust-proxy is correct in express server
      };
      res.status(200).json({ success: true, message: healthcheckData });
      next();
    } catch (e) {
      res
        .status(503)
        .json({ success: false, message: '🚫 API Health Check Failed' });
    }
  }
);

healthCheckRoute.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ success: true, message: '🛠️ API v1 working!' });
    next();
  } catch (e) {
    res
      .status(503)
      .json({ success: false, message: '🚫 API Health Check Failed' });
  }
});

export default healthCheckRoute;
