import { ObjectID } from 'mongodb';
export interface dbSchema {
  caption: string;
  comments: {
    commentsCount: number;
    commentedUsers?: {
      [key: string]: string;
    };
  };
  likes: {
    likesCount: number;
    likedUsers?: {
      [key: string]: string;
    };
  };
  tags: Array<string>;
  pictureUrl?: Array<string>;
  circle: string;
}

export interface dbSchemaID extends dbSchema {
  readonly _id: ObjectID;
}
