import { Collection, ObjectId } from "mongodb";
import { DBInstance } from "../../../loaders/database";
import { NextFunction, Request, Response } from "express";
import { getSubTopics } from "../../circles/controllers/get.service";
import { randomSelector } from "../../../utils/slelectRandon";
export const handleExolore = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resData = await getSubTopics();
  const data = await randomSelector(resData, 5);
  console.log(data);
};
