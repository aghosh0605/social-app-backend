import { Router } from 'express';
import { validateJWT } from '../../middlewares/verify-jwt';
import { getUser, getCurrentUser } from './controllers/get.service';
import { updateUser } from './controllers/update.service';
import { yupObjIdSchema } from '../../models/middlewareSchemas';
import yupValidator from '../../middlewares/yupValidator';
import { blockUser } from './controllers/block.service';
import { yupUserSearchData, yupUserSearchType } from '../../models/userSchema';

const usersRoute = Router();

usersRoute.get('/current', validateJWT, getCurrentUser);

//Get user details
usersRoute.get(
  '/fetch/:type',
  yupValidator('params', yupUserSearchType),
  yupValidator('query', yupUserSearchData),
  getUser
);

//Update a user by id
usersRoute.patch(
  '/update/:id',
  yupValidator('params', yupObjIdSchema),
  updateUser
);

//Block a specific user with id
usersRoute.patch(
  '/user-block/:id',
  yupValidator('params', yupObjIdSchema),
  blockUser
);

export default usersRoute;
