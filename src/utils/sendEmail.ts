import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: { 
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    }
});

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const info = await transporter.sendMail({
    from: '"StrengthCare Connect" <info@strengthcareconnect.com>',
    to,
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  return info;
};
