import { baseEmailTemplate } from './baseTemplate';

export const forgotPasswordEmail = (name: string, resetLink: string) => {
  return baseEmailTemplate({
    title: `Reset your password, ${name}`,
    body: `
      We received a request to reset your password for your Strength Care Connect account.<br/>
      Click the button below to choose a new password.<br/><br/>
      If you didn’t request this, you can safely ignore this email.
    `,
    buttonText: 'Reset Password',
    buttonLink: resetLink,
  });
};
