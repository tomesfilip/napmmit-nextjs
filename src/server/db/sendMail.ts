import { EMAIL_SENDER } from '@/lib/constants';
import { Resend } from 'resend';

const resend = new Resend(process.env.SMTP_PASSWORD);

export type MessageInfo = {
  to: string;
  subject: string;
  body: string;
};

export const sendMail = async (message: MessageInfo) => {
  const { to, subject, body } = message;
  const mailOptions = {
    from: EMAIL_SENDER,
    to,
    subject,
    html: body,
  };
  return resend.emails.send(mailOptions);
};
