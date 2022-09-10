import { Request } from 'express';
import { Collection } from 'mongodb';
import { DBInstance } from '../../../loaders/database';

export const commentPostService = async (req: Request) => {
  const postsCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('posts');
  const commentData = await postsCollection.updateOne(
    {
      _id: new Object(req.params.id),
    },
    {
      $set: {
        comments: {
          comment: req.body.comment,
        },
      },
    }
  );
  return commentData;
};

export const commentDeleteService = async (req: Request) => {
  const postsCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('posts');
  const commentData = await postsCollection.updateOne(
    {
      _id: new Object(req.params.id),
    },
    {
      $set: {
        comments: {
          comment: '',
        },
      },
    }
  );
  return commentData;
};
