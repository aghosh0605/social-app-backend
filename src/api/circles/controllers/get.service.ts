import { Db } from "mongodb";
import db from "../../../loaders/database";

export const getService = async () => {
  const data: Db = await db();
  return await data.collection("circles").find().toArray();
};
