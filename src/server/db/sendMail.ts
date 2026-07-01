import { Resend } from 'resend';
import { EMAIL_SENDER } from '@/lib/constants';

const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

export type MessageInfo = {
  to: string;
  subject: string;
  body: string;
  attachments?: EmailAttachment[];
};

export const sendMail = async (message: MessageInfo) => {
  const { to, subject, body, attachments } = message;
  const mailOptions = {
    from: EMAIL_SENDER,
    to,
    subject,
    html: body,
    attachments: attachments?.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content.toString('base64'),
      contentType: attachment.contentType,
    })),
  };
  return resend.emails.send(mailOptions);
};
