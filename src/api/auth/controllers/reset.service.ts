import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';
import { ResetSchema } from '../../../models/authSchema';

const updatePassword = (password: string) => {};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { password } = req.body as ResetSchema;
    const resData = await updatePassword(password);
    res.status(200).json({
      success: true,
      message: 'Password Change successful',
      data: resData,
    });
    next();
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred !! ',
      data: err.data,
    });
  }
};
