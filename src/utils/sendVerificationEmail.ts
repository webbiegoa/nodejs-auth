import { sendEmail } from './sendEmail';
import { emailVerificationEmail } from '../email/templates/emailVerification';

export const sendVerificationEmail = async (
  email: string,
  firstname: string,
  token: string
) => {
  const verificationUrl = `${process.env.ORIGIN_URL}/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: 'Your Company - Please verify your email',
    html: emailVerificationEmail(firstname, verificationUrl),
  });
};
