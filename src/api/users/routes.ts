import { Router } from 'express';

import { getUser } from './controllers/get.service';
import { updateUser } from './controllers/update.service';
import { yupObjIdSchema } from '../../models/middlewareSchemas';
import yupValidator from '../../middlewares/yupValidator';
import { blockUser } from './controllers/block.service';

const usersRoute = Router();

//Get a user by id
usersRoute.get('/fetch', getUser);

//Update a user by id
usersRoute.patch(
  '/update/:id',
  yupValidator('params', yupObjIdSchema),
  updateUser
);

usersRoute.patch(
  '/user-block/:id',
  yupValidator('params', yupObjIdSchema),
  blockUser
);

export default usersRoute;
