import { Router } from 'express';
import { createPosts, favouritePost } from './controllers/post.service';
import { getAllPosts, getUserPosts } from './controllers/get.service';
import { deletePost } from './controllers/delete.service';
import {
  getPostComment,
  getChildComment,
  makeComment,
  editComment,
  deleteComment,
} from './controllers/comments.service';

import { yupFavPostSchema } from '../../models/postSchema';
import { deleteImages } from './controllers/image.service';
import {
  getPostLike,
  getCommentLike,
  makeLike,
  editLike,
  deleteLike,
} from './controllers/likes.service';
import { updatePost } from './controllers/update.service';
import yupValidator from '../../middlewares/yupValidator';
import { yupObjIdSchema } from '../../models/middlewareSchemas';
import { yupCommentShema } from '../../models/commentSchema';

const postsRoute = Router();
//==================================Post APIs===================================
//Get all posts
postsRoute.get('/all', getAllPosts);

//Get posts created by an user
postsRoute.get(
  '/user/:id',
  yupValidator('params', yupObjIdSchema),
  getUserPosts
);

//Create a Post
postsRoute.post('/create', createPosts);

//Delete a Post
postsRoute.delete(
  '/delete/:id',
  yupValidator('params', yupObjIdSchema),
  deletePost
);

//Update a Post
postsRoute.patch(
  '/update/:id',
  yupValidator('params', yupObjIdSchema),
  updatePost
);

// Favourite a Post
postsRoute.post(
  '/favourite/:id',
  yupValidator('params', yupObjIdSchema),
  favouritePost
);

//Delete Images
postsRoute.delete(
  '/delete/all/images/:id',
  yupValidator('params', yupObjIdSchema),
  deleteImages
);

//==================================Comment APIs===================================

//Fetch comments of post
postsRoute.get(
  '/comment/fetch/:id',
  yupValidator('params', yupObjIdSchema),
  getPostComment
);

//Fetch Child comments
postsRoute.get(
  '/comment/fetch/child/:id',
  yupValidator('params', yupObjIdSchema),
  getChildComment
);

//Create a comment on a post
//id is post ID
postsRoute.post(
  '/comment/create/:id',
  yupValidator('params', yupObjIdSchema),
  yupValidator('body', yupCommentShema),
  makeComment
);

//Edit a comment on a post
//id is comment ID
postsRoute.patch(
  '/comment/edit/:id',
  yupValidator('params', yupObjIdSchema),
  yupValidator('body', yupCommentShema),
  editComment
);

//Delete a Comment on a post
postsRoute.delete(
  '/comment/delete/:id',
  yupValidator('params', yupObjIdSchema),
  deleteComment
);

//==================================Like APIs===================================

//Fetch likes of post
postsRoute.get(
  '/like/fetch/post/:id',
  yupValidator('params', yupObjIdSchema),
  getPostLike
);

//Fetch likes of comments
postsRoute.get(
  '/like/fetch/comment/:id',
  yupValidator('params', yupObjIdSchema),
  getCommentLike
);

//Like a comment or post
postsRoute.post('/like/:id', yupValidator('params', yupObjIdSchema), makeLike);

//Edit Like of a comment or post
postsRoute.patch(
  '/like/edit/:id',
  yupValidator('params', yupObjIdSchema),
  editLike
);

// Dislike comment or post
postsRoute.delete(
  '/like/delete/:id',
  yupValidator('params', yupObjIdSchema),
  deleteLike
);

export default postsRoute;
