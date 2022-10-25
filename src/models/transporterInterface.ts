export interface transporter {
  sender_name: String;
  from: String;
  receiver_name: String;
  to: String;
  reply_name: String;
  reply_email: String;
  subject: String;
  html: String;
}
