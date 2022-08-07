import { ObjectID } from "mongodb";

export interface dbSchema {
  profileUrl: Array<object>;
  bannerUrl: Array<object>;
  name: string;
  category: string;
  about: string;
  status: string;
}

export interface dbSchemaID extends dbSchema {
  readonly _id: ObjectID;
}
