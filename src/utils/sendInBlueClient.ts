import SibApiV3Sdk from 'sib-api-v3-sdk';
import config from './../config/index';

let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.sendInBlueAPI;

export let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

sendSmtpEmail.subject = 'My {{params.subject}}';
sendSmtpEmail.htmlContent =
  '<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>';
sendSmtpEmail.sender = {
  name: 'Cariogrowth services',
  email: 'developer@cariogrowth.com',
};
sendSmtpEmail.to = [{ email: 'aghosh0605@gmail.com', name: 'Aniruddha Ghosh' }];
// sendSmtpEmail.cc = [{ email: 'example2@example2.com', name: 'Janice Doe' }];
// sendSmtpEmail.bcc = [{ email: 'John Doe', name: 'example@example.com' }];
// sendSmtpEmail.replyTo = { email: 'replyto@domain.com', name: 'John Doe' };
sendSmtpEmail.headers = { 'Some-Custom-Name': 'unique-id-1234' };
sendSmtpEmail.params = {
  parameter: 'for Aniruddha Ghosh',
  subject: 'Email Subject',
};

apiInstance.sendTransacEmail(sendSmtpEmail).then(
  (data) => {
    console.log(
      'API called successfully. Returned data: ' + JSON.stringify(data)
    );
  },
  (error) => {
    console.error(error);
  }
);
