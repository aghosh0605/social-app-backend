import SibApiV3Sdk from 'sib-api-v3-sdk';
import config from './../config/index';
import { generateNanoID } from './nanoidGenerate';
import Logger from './../loaders/logger';
import { transporter } from '../models/transporterInterface';

let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.sendInBlueAPI;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

export const sendMail = async (emailConfig: transporter) => {
  sendSmtpEmail.subject = emailConfig.subject;
  sendSmtpEmail.htmlContent = emailConfig.html;
  sendSmtpEmail.sender = {
    name: emailConfig.sender_name,
    email: emailConfig.from,
  };
  sendSmtpEmail.to = [
    { email: emailConfig.to, name: emailConfig.receiver_name },
  ];
  // sendSmtpEmail.cc = [{ email: 'example2@example2.com', name: 'Janice Doe' }];
  // sendSmtpEmail.bcc = [{ email: 'John Doe', name: 'example@example.com' }];
  sendSmtpEmail.replyTo = {
    email: emailConfig.reply_email,
    name: emailConfig.reply_name,
  };
  sendSmtpEmail.headers = {
    'Mail-UniqueID-Piechips': generateNanoID('0-9a-fA-F', 10),
  };
  // sendSmtpEmail.params = {
  //   subject: emailSubject,
  //   token: data.emailVerifyHash,
  //   uid: '' + data['_id'],
  // };
  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    Logger.info('📨 Sent email ID: ' + JSON.stringify(result));
    //console.log(await renderFile(path, data, { async: true }));
  } catch (err) {
    Logger.error(err);
  }
};
