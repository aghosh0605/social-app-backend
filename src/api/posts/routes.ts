import { Router } from 'express';
import { createPosts } from './controllers/post.service';
import { getPosts } from './controllers/get.service';
import { deletePosts } from './controllers/delete.service';
import { makeComment, deleteComment } from './controllers/comments.service';
import yupValidator from '../../middlewares/yupValidator';
import { yupPostSchema } from '../../models/postSchema';

const postsRoute = Router();

postsRoute.get('/', getPosts);

postsRoute.post('/create', createPosts);

postsRoute.delete(
  '/:id/delete',
  yupValidator('body', yupPostSchema),
  deletePosts
);

postsRoute.post('/comment/:id/update', makeComment);

postsRoute.delete('/comment/:id/delete', deleteComment);

export default postsRoute;
