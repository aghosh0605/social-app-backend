import { generateNanoID } from '../../utils/nanoidGenerate';
import { join } from 'path';
import config from '..';
import { renderFile } from 'ejs';
import { Collection } from 'mongodb';
import { DBInstance } from '../../loaders/database';
import { sendMail } from '../../utils/sendInBlueClient';
import { transporter } from '../../models/transporterInterface';

export const forgotEmailSender = async (userData) => {
  const emailConfig: transporter = await transportConfig(userData);
  await sendMail(emailConfig);

  const usersCollection: Collection<any> = await (
    await DBInstance.getInstance()
  ).getCollection('users');
  await usersCollection.updateOne(
    { _id: userData._id },
    { $set: { emailVerifyHash: userData.emailToken } }
  );
  // console.log(userData);
};

const transportConfig = async (userData) => {
  const token = generateNanoID('0-9a-fA-F', 24);
  userData.emailToken = token;
  const uid = '' + userData['_id'];
  userData.link = `${config.baseurl}/api/auth/verifymail/${uid}/${token}?type=forgot`;
  const templatePath = join(
    __dirname,
    '..',
    '..',
    '..',
    'templates',
    'forgot_password',
    `forgot-password.ejs`
  );
  return {
    sender_name: 'Piechips',
    from: 'noreply@piechips.com',
    receiver_name: userData.full_name,
    to: userData.email,
    reply_name: 'Cario Growth Services',
    reply_email: 'support@cariogrowth.com',
    subject: 'Forgot your password',
    html: await renderFile(templatePath, userData, { async: true }),
  };
};
