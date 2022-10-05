
import { Collection, ObjectId } from 'mongodb';
import { DBInstance } from '../../../loaders/database';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../../loaders/logger';


export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
        let data=req.body
        const usersCollection: Collection<any> = await (
          await DBInstance.getInstance()
        ).getCollection('users');
        if(data.phone){ 
        let phone=data.phone
        delete data.phone
        if (Object.keys(data).length == 0) {
            res
            .status(400)
            .json({ success: false, message: 'No Details found to update' });
        next(); 
        }else{
            await usersCollection.findOneAndUpdate(
                {
                  phone: phone,
                },
                {
                  $set: {...data},
                },{upsert:true}
              );
              res
                .status(200)
                .json({ success: true, message: 'Profile Edited Successfully' });
            next(); 
        }}else{
            res
            .status(400)
            .json({ success: false, message: 'Phone Required to update profile' });
        next(); 
        }
   
      
  } catch (err) {
    Logger.error(err.errorStack || err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '❌ Unknown Error Occurred!!',
    });
  }
};
