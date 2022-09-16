import { Router } from 'express';
import { createPosts } from './controllers/post.service';
import { getPosts } from './controllers/get.service';
import { deletePost } from './controllers/delete.service';
import { makeComment, deleteComment } from './controllers/comments.service';
import yupValidator from '../../middlewares/yupValidator';
import { yupObjIdSchema } from '../../models/middlewareSchemas';

const postsRoute = Router();

postsRoute.get('/', getPosts);

postsRoute.post('/create', createPosts);

postsRoute.delete(
  '/delete/:id',
  yupValidator('params', yupObjIdSchema),
  deletePost
);

postsRoute.post('/comment/update/:id', makeComment);

postsRoute.delete('/comment/delete/:id', deleteComment);

export default postsRoute;
