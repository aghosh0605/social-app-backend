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

    const resData = await postsCollection
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'postID',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'postID',
            as: 'likes',
          },
        },
        {
          $lookup: {
            from: 'circles',
            localField: 'circleID',
            foreignField: '_id',
            as: 'circle',
          },
        },
        {
          $unwind: {
            path: '$circle',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            UID: 1,
            caption: 1,
            category: 1,
            createdOn: 1,
            circleID: 1,
            tags: 1,
            mediaURLs: 1,
            circle: {
              _id: 1,
              circleName: 1,
              UID: 1,
            },
            comments: {
              _id: 1,
              postID: 1,
              UID: 1,
              commentText: 1,
            },
            likes: {
              _id: 1,
              postID: 1,
              UID: 1,
              commentID: 1,
            },
          },
        },
      ])
      .toArray();
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
    const circlesCollection = await (
      await DBInstance.getInstance()
    ).getCollection('circles');

    const posts = await postsCollection.find({
       UID: req.params.id 
    }).toArray();
    const comments = await commentsCollection.find({}).toArray();
    const likes = await likesCollection.find({}).toArray();
    const circles = await circlesCollection.find({}).toArray();

    let resData: postSchema[] = posts.map((post) => {
      let postComments = comments.filter((comment) => {
        return comment.postID === post._id.toString();
      });
      let postLikes = likes.filter((like) => {
        return like.postID === post._id.toString();
      });
      let postCircles = circles.filter((circle) => {
        return postsCollection.find({ 
          UID: req.params.id,
          "post.circleID": new ObjectId(circle._id.toString())
        }).toArray();
      });
      let likeCount = postLikes.length;
      let commentCount = postComments.length;

      return { 
        ...post, 
        comments: postComments, 
        likes: postLikes, 
        likesCount: likeCount,
        commentsCount: commentCount,
        circles: postCircles
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
