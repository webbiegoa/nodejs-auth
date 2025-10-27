import { baseEmailTemplate } from './baseTemplate';

export const emailVerificationEmail = (name: string, verificationLink: string) => {
  return baseEmailTemplate({
    title: `Verify your email, ${name}`,
    body: `
      Thank you for signing up with Strength Care Connect.<br/>
      Please verify your email address by clicking the button below. This helps us keep your account secure.
    `,
    buttonText: 'Verify Email',
    buttonLink: verificationLink,
  });
};