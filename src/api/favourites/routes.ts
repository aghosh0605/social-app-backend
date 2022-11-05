import { Router } from 'express';
import yupValidator from '../../middlewares/yupValidator';
import { yupObjIdSchema } from '../../models/middlewareSchemas';
import { getCurrentUserFav } from './controllers/get.service';
import { handleFavourite } from './controllers/post.service';

const favouritesRoute = Router();

// Favourite a Post
favouritesRoute.get(
  '/add/:type',
  yupValidator('query', yupObjIdSchema),
  handleFavourite
);

// Get Favourites of Logged In Users
favouritesRoute.get('/get/all/current', getCurrentUserFav);

export default favouritesRoute;
