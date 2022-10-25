import SibApiV3Sdk from 'sib-api-v3-sdk';
import config from './../config/index';
import { renderFile } from 'ejs';
import { generateNanoID } from './nanoidGenerate';
import Logger from './../loaders/logger';

let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.sendInBlueAPI;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

export const sendMail = async (
  path: string,
  data,
  emailSubject: string,
  sender
) => {
  sendSmtpEmail.subject = '{{params.subject}}';
  sendSmtpEmail.htmlContent = await renderFile(path, data, { async: true });
  sendSmtpEmail.sender = {
    name: sender.name,
    email: sender.email,
  };
  sendSmtpEmail.to = [{ email: data.email, name: data.full_name }];
  // sendSmtpEmail.cc = [{ email: 'example2@example2.com', name: 'Janice Doe' }];
  // sendSmtpEmail.bcc = [{ email: 'John Doe', name: 'example@example.com' }];
  sendSmtpEmail.replyTo = {
    email: 'developer@cariogrowth.com',
    name: 'Cario Growth',
  };
  sendSmtpEmail.headers = {
    'Mail-ID-Piechips': generateNanoID('0-9a-fA-F', 10),
  };
  sendSmtpEmail.params = {
    subject: emailSubject,
    token: data.emailVerifyHash,
    uid: '' + data['_id'],
  };
  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    Logger.info('📨 Sent email ID: ' + JSON.stringify(result));
    //console.log(await renderFile(path, data, { async: true }));
  } catch (err) {
    Logger.error(err);
  }
};
