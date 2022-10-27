import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { postSchema } from '../../../models/postSchema';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('posts'); 
    const commentsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('comments');

    const likesCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('likes');

    const posts = await postsCollection.find({}).toArray();
    const comments = await commentsCollection.find({}).toArray();
    const likes = await likesCollection.find({}).toArray();

    let resData: postSchema[] = posts.map((post) => {
      let postComments = comments.filter((comment) => {
        return comment.postID === post._id.toString();
      });
      let postLikes = likes.filter((like) => {
        return like.postID === post._id.toString();
      });
      let likeCount = postLikes.length;
      let commentCount = postComments.length;
      return { 
        ...post, 
        comments: postComments, 
        likes: postLikes, 
        likesCount: likeCount,
        commentsCount: commentCount
      };
    });

    res.status(200).json({ 
      success: true, 
      message: "All Posts",
      data: resData, 
    });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
      data: null,
    });
  }
};

export const getUserPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('posts'); 
    const commentsCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('comments');

    const likesCollection: Collection<any> = await (
      await DBInstance.getInstance()
    ).getCollection('likes');

    const posts = await postsCollection.find({
       UID: req.params.id 
    }).toArray();
    const comments = await commentsCollection.find({}).toArray();
    const likes = await likesCollection.find({}).toArray();
    let resData: postSchema[] = posts.map((post) => {
      let postComments = comments.filter((comment) => {
        return comment.postID === post._id.toString();
      });
      let postLikes = likes.filter((like) => {
        return like.postID === post._id.toString();
      });
      let likeCount = postLikes.length;
      let commentCount = postComments.length;
      return { 
        ...post, 
        comments: postComments, 
        likes: postLikes, 
        likesCount: likeCount,
        commentsCount: commentCount
      };
    });
    res.status(200).json({ 
      success: true, 
      message: "User Posts",
      data: resData, 
    });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
      data: null,
    });
  }
};
