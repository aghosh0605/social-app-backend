import { Router } from 'express';
import { createPosts } from './controllers/post.service';
import { getAllPosts, getUserPosts } from './controllers/get.service';
import { deletePost } from './controllers/delete.service';
import { makeComment, deleteComment } from './controllers/comments.service';
import yupValidator from '../../middlewares/yupValidator';
import { yupObjIdSchema } from '../../models/middlewareSchemas';

const postsRoute = Router();

postsRoute.get('/all', getAllPosts);

postsRoute.get(
  '/user/:id',
  yupValidator('params', yupObjIdSchema),
  getUserPosts
);

postsRoute.post('/create', createPosts);

postsRoute.delete(
  '/delete/:id',
  yupValidator('params', yupObjIdSchema),
  deletePost
);

postsRoute.post(
  '/comment/update/:id',
  yupValidator('params', yupObjIdSchema),
  makeComment
);

postsRoute.delete(
  '/comment/delete/:id',
  yupValidator('params', yupObjIdSchema),
  deleteComment
);

export default postsRoute;
