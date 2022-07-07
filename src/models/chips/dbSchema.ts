import { ObjectID } from 'mongodb';

export interface dbSchema {
  caption: string;
  comments: {
    [key: string]:
      | string
      | {
          [key: string]: string;
        };
  };
  likes: Array<Object>;
  tags: Array<string>;
  pictureUrl: Array<object>;
  circle: Array<string>;
}

export interface dbSchemaID extends dbSchema {
  readonly _id: ObjectID;
}
