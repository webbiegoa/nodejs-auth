import { baseEmailTemplate } from './baseTemplate';

export const welcomeEmail = (name: string) => {
  return baseEmailTemplate({
    title: `Welcome to Your Company, ${name}!`,
    body: `
      We're excited to have you on board. Your Company is here to support you through every phase of your health journey.
      <br/><br/>
      Explore resources, connect with experts, and take charge of your wellness today.
    `,
    buttonText: 'Login to Dashboard',
    buttonLink: 'https://portal.yourcompany.com',
  });
};