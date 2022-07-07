import { NextFunction, Request, Response, Router } from 'express';

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

healthCheckRoute.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const healthcheckData = {
      serverUptime: formatTime(process.uptime()),
      osUptime: formatTime(require('os').uptime()),
      message: '🛠️ API v1 working!',
      timestamp: today.toUTCString(),
    };
    res.status(200).json(healthcheckData);
    next();
  } catch (e) {
    res
      .status(503)
      .send({ success: false, message: '🚫 API Health Check Failed' });
  }
});

export default healthCheckRoute;
