import { ObjectID } from "mongodb";

export interface dbSchema {
  imagesData: Array<object>;
  name: string;
  category: string;
  about: string;
  private: boolean;
  posts: Array<object>;
}

// export interface dbSchemaID extends dbSchema {
//   readonly _id: ObjectID;
// }
