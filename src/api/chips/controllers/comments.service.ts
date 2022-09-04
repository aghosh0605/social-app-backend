import { Request } from 'express';
import { Db, ObjectID } from 'mongodb';
import db from '../../../loaders/database';

export const commentPostService = async (req: Request) => {
  const data: Db = await db();
  const commentData = await data.collection('posts').updateOne(
    {
      _id: new ObjectID(req.params.id),
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
  const data: Db = await db();
  const commentData = await data.collection('posts').updateOne(
    {
      _id: new ObjectID(req.params.id),
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
