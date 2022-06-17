import { ObjectID } from "mongodb";
export interface inpdbSchema {
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
  pictureUrl?: string;
  circle: string;
}

export interface dbSchema extends inpdbSchema {
  readonly _id: ObjectID;
}
