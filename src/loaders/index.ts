import { DBInstance } from "./database";
import express from "./express";
import Logger from "./logger";
import Express from "express";

export default async ({
  expressApp,
}: {
  expressApp: Express.Application;
}): Promise<void> => {
  await DBInstance.getDatabase();
  Logger.info(`✌️ Connection to database successful`);

  await express({ app: expressApp });
  Logger.info("✌️ Express loaded");

  Logger.info("✅ All modules loaded!");
};
