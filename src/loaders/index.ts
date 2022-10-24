import { DBInstance } from './database';
import express from './express';
import Logger from './logger';
import Express from 'express';

export default async ({
  expressApp,
}: {
  expressApp: Express.Application;
}): Promise<void> => {
  await DBInstance.getInstance();
  Logger.warn(`📌 Connection to database successful`);

  await express({ app: expressApp });
  Logger.debug('🏹 Express loaded');

  Logger.debug('✅ All modules loaded!');
};
