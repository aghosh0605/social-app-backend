import { Router } from 'express';

import yupValidator from '../../middlewares/yupValidator';
import {
  yupCircleSearchData,
  yupCircleSearchType,
} from '../../models/circleSchema';
import {
  yupObjIdSchema,
  yupObjCirclesBodySchema,
} from '../../models/middlewareSchemas';
import { deleteCircle } from './controllers/delete.service';
import {
  getCircle,
  getAllCircles,
  getSubTopics,
  getTopics,
} from './controllers/get.service';
import { createCircles } from './controllers/post.service';
import { createSubTopics } from './controllers/subtopics.service';
import {
  updateDataCircle,
  updateImageCircle,
} from './controllers/update.service';

const circlesPrivateRoutes = Router();
const circlesPublicRoutes = Router();

circlesPublicRoutes.get('/all', getAllCircles);

circlesPublicRoutes.get('/subTopics', getSubTopics);

circlesPublicRoutes.get('/topics', getTopics);

circlesPublicRoutes.get(
  '/fetch/:type',
  yupValidator('params', yupCircleSearchType),
  yupValidator('query', yupCircleSearchData),
  getCircle
);

circlesPrivateRoutes.post(
  '/create',
  yupValidator('body', yupObjCirclesBodySchema),
  createCircles
);

circlesPrivateRoutes.delete(
  '/delete/:id',
  yupValidator('params', yupObjIdSchema),
  deleteCircle
);

circlesPrivateRoutes.put(
  '/update/data/:id',
  yupValidator('body', yupObjCirclesBodySchema),
  updateDataCircle
);

circlesPrivateRoutes.put(
  '/update/images/:id',
  // yupValidator("body", yupObjCirclesBodySchema),
  updateImageCircle
);

circlesPrivateRoutes.post('/create/sub-topic/new', createSubTopics);

export { circlesPrivateRoutes, circlesPublicRoutes };
