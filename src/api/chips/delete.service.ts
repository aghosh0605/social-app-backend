import { Db, ObjectID } from "mongodb";
import db from "../../loaders/database";

export const deleteService = async (req) => {
  const data: Db = await db();
  const deletedData = await data.collection("posts").deleteOne({
    _id: new ObjectID(req.params.id),
  });
  return deletedData;
};
