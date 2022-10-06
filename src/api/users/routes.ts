import { Router } from 'express';

import { getUser } from './controllers/get.service';
import { updateUser } from './controllers/update.service';
import { yupObjIdSchema } from '../../models/middlewareSchemas';
import yupValidator from '../../middlewares/yupValidator';

const usersRoute = Router();

//Get a user by id
usersRoute.get('/fetch/:id', yupValidator('params', yupObjIdSchema), getUser);

//Update a user by id
usersRoute.patch(
  '/update/:id',
  yupValidator('params', yupObjIdSchema),
  updateUser
);

export default usersRoute;
